/**
 * Enhanced Inductor Color Code Decoder
 * Supports comprehensive color coding standards for electronics projects
 */

export type ColorBand = 
  | 'Black' | 'Brown' | 'Red' | 'Orange' | 'Yellow' | 'Green' 
  | 'Blue' | 'Violet' | 'Gray' | 'Grey' | 'White' | 'Gold' 
  | 'Silver' | 'Pink' | 'None';

export interface InductorValue {
  value: number;
  unit: 'µH' | 'mH' | 'H';
  tolerance: string;
  formatted: string;
  rawValue: number; // Always in µH for calculations
}

export interface ColorCodeChart {
  [key: string]: number;
}

export interface ToleranceChart {
  [key: string]: string;
}

/**
 * Comprehensive color code chart including specialized colors
 */
export const COLOR_CODE_CHART: ColorCodeChart = {
  Black: 0,
  Brown: 1,
  Red: 2,
  Orange: 3,
  Yellow: 4,
  Green: 5,
  Blue: 6,
  Violet: 7,
  Gray: 8,
  Grey: 8,    // Alternative spelling
  White: 9,
  Gold: -1,   // Multiplier × 0.1
  Silver: -2, // Multiplier × 0.01
  Pink: -3,   // Multiplier × 0.001
};

/**
 * Complete tolerance chart for inductors
 */
export const TOLERANCE_CHART: ToleranceChart = {
  Brown: '±1%',
  Red: '±2%',
  Green: '±0.5%',
  Blue: '±0.25%',
  Violet: '±0.1%',
  Gray: '±0.05%',
  Gold: '±5%',
  Silver: '±10%',
  None: '±20%',  // No tolerance band
};

/**
 * Calculate the appropriate multiplier for decimal values
 */
function calculateMultiplier(multiplierCode: number): number {
  if (multiplierCode >= 0) {
    return Math.pow(10, multiplierCode);
  } else {
    // Handle negative multipliers (Gold, Silver, Pink)
    return Math.pow(10, multiplierCode);
  }
}

/**
 * Auto-scale the unit for better readability
 */
function scaleUnit(valueInMicroH: number): { value: number; unit: 'µH' | 'mH' | 'H' } {
  if (valueInMicroH >= 1000000) {
    return { value: valueInMicroH / 1000000, unit: 'H' };
  } else if (valueInMicroH >= 1000) {
    return { value: valueInMicroH / 1000, unit: 'mH' };
  } else {
    return { value: valueInMicroH, unit: 'µH' };
  }
}

/**
 * Enhanced function to decode inductor color codes
 * @param bands - Array of color bands on the inductor (3 or 4 bands)
 * @returns InductorValue object with comprehensive information
 */
export function decodeInductorColorCode(bands: ColorBand[]): InductorValue {
  // Input validation
  if (!Array.isArray(bands)) {
    throw new Error('Input must be an array of color bands.');
  }
  
  if (bands.length < 3 || bands.length > 4) {
    throw new Error('Invalid number of color bands. Must be 3 or 4 bands.');
  }

  // Normalize color names (handle case variations)
  const normalizedBands = bands.map(band => 
    band.charAt(0).toUpperCase() + band.slice(1).toLowerCase()
  );

  // Decode the first two digits
  const firstDigit = COLOR_CODE_CHART[normalizedBands[0]];
  const secondDigit = COLOR_CODE_CHART[normalizedBands[1]];
  
  if (firstDigit === undefined || firstDigit < 0) {
    throw new Error(`Invalid first digit color band: ${bands[0]}. Must be a standard digit color (Black-White).`);
  }
  
  if (secondDigit === undefined || secondDigit < 0) {
    throw new Error(`Invalid second digit color band: ${bands[1]}. Must be a standard digit color (Black-White).`);
  }

  // Decode the multiplier
  const multiplierCode = COLOR_CODE_CHART[normalizedBands[2]];
  if (multiplierCode === undefined) {
    throw new Error(`Invalid multiplier color band: ${bands[2]}.`);
  }
  
  const multiplier = calculateMultiplier(multiplierCode);

  // Decode the tolerance (if present)
  let tolerance: string;
  if (bands.length === 4 && normalizedBands[3] !== 'None') {
    tolerance = TOLERANCE_CHART[normalizedBands[3]] || '±20%';
  } else {
    tolerance = TOLERANCE_CHART['None'];
  }

  // Calculate inductance value in µH
  const baseValue = firstDigit * 10 + secondDigit;
  const rawValueInMicroH = baseValue * multiplier;

  // Validate the result
  if (rawValueInMicroH < 0 || !isFinite(rawValueInMicroH)) {
    throw new Error('Calculated inductance value is invalid.');
  }

  // Auto-scale the unit
  const { value, unit } = scaleUnit(rawValueInMicroH);

  // Format the final result
  const formatted = `${value}${value % 1 === 0 ? '' : ''} ${unit} ${tolerance}`;

  return {
    value: Math.round(value * 100) / 100, // Round to 2 decimal places
    unit,
    tolerance,
    formatted,
    rawValue: rawValueInMicroH
  };
}

/**
 * Get all available colors for UI components
 */
export function getAvailableColors(): ColorBand[] {
  return Object.keys(COLOR_CODE_CHART) as ColorBand[];
}

/**
 * Get available tolerance colors for UI components
 */
export function getToleranceColors(): ColorBand[] {
  return Object.keys(TOLERANCE_CHART).filter(color => color !== 'None') as ColorBand[];
}

/**
 * Validate if a color can be used in a specific band position
 */
export function isValidColorForPosition(color: ColorBand, position: 'digit' | 'multiplier' | 'tolerance'): boolean {
  switch (position) {
    case 'digit':
      const digitValue = COLOR_CODE_CHART[color];
      return digitValue !== undefined && digitValue >= 0 && digitValue <= 9;
    
    case 'multiplier':
      return COLOR_CODE_CHART[color] !== undefined;
    
    case 'tolerance':
      return TOLERANCE_CHART[color] !== undefined;
    
    default:
      return false;
  }
}