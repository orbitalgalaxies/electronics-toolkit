import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calculator, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  decodeInductorColorCode, 
  getAvailableColors, 
  getToleranceColors,
  isValidColorForPosition,
  type ColorBand, 
  type InductorValue 
} from '@/lib/inductor-decoder';

// Color mapping for visual representation
const COLOR_STYLES: Record<string, string> = {
  Black: 'bg-slate-900 border-slate-700',
  Brown: 'bg-amber-800 border-amber-600',
  Red: 'bg-red-600 border-red-500',
  Orange: 'bg-orange-500 border-orange-400',
  Yellow: 'bg-yellow-400 border-yellow-300',
  Green: 'bg-green-600 border-green-500',
  Blue: 'bg-blue-600 border-blue-500',
  Violet: 'bg-purple-600 border-purple-500',
  Gray: 'bg-gray-500 border-gray-400',
  Grey: 'bg-gray-500 border-gray-400',
  White: 'bg-white border-gray-300',
  Gold: 'bg-yellow-300 border-yellow-200',
  Silver: 'bg-gray-300 border-gray-200',
  Pink: 'bg-pink-400 border-pink-300',
};

const InductorDecoder: React.FC = () => {
  const [bands, setBands] = useState<ColorBand[]>(['Red', 'Violet', 'Orange', 'Gold']);
  const [result, setResult] = useState<InductorValue | null>(null);
  const [error, setError] = useState<string>('');

  const handleBandChange = useCallback((position: number, color: ColorBand) => {
    const newBands = [...bands];
    newBands[position] = color;
    setBands(newBands);
    setError('');
    setResult(null);
  }, [bands]);

  const addToleranceBand = useCallback(() => {
    if (bands.length === 3) {
      setBands([...bands, 'Gold']);
    }
  }, [bands]);

  const removeToleranceBand = useCallback(() => {
    if (bands.length === 4) {
      setBands(bands.slice(0, 3));
      setError('');
      setResult(null);
    }
  }, [bands]);

  const calculateValue = useCallback(() => {
    try {
      const decoded = decodeInductorColorCode(bands);
      setResult(decoded);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setResult(null);
    }
  }, [bands]);

  const getValidColorsForPosition = (position: number): ColorBand[] => {
    const allColors = getAvailableColors();
    
    if (position === 0 || position === 1) {
      // First two positions: digit colors only
      return allColors.filter(color => isValidColorForPosition(color, 'digit'));
    } else if (position === 2) {
      // Third position: multiplier colors
      return allColors.filter(color => isValidColorForPosition(color, 'multiplier'));
    } else {
      // Fourth position: tolerance colors
      return getToleranceColors();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-electronics-blue" />
            <CardTitle className="bg-gradient-electronics bg-clip-text text-transparent">
              Inductor Color Code Decoder
            </CardTitle>
          </div>
          <CardDescription>
            Decode 3-band and 4-band inductor color codes with comprehensive tolerance support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inductor Visualization */}
          <div className="flex items-center justify-center p-6 bg-component-bg rounded-lg border border-component-border">
            <div className="relative">
              {/* Inductor body */}
              <div className="w-64 h-16 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg border-2 border-amber-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                {/* Color bands */}
                <div className="flex gap-2 z-10">
                  {bands.map((color, index) => (
                    <div
                      key={index}
                      className={`w-8 h-12 rounded-sm border-2 ${COLOR_STYLES[color] || 'bg-gray-400'} shadow-sm`}
                      title={`Band ${index + 1}: ${color}`}
                    />
                  ))}
                </div>
                
                {/* Wire leads */}
                <div className="absolute -left-4 top-1/2 w-4 h-1 bg-gray-400 rounded-l"></div>
                <div className="absolute -right-4 top-1/2 w-4 h-1 bg-gray-400 rounded-r"></div>
              </div>
            </div>
          </div>

          {/* Band Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bands.map((band, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">
                  {index === 0 && '1st Digit'}
                  {index === 1 && '2nd Digit'} 
                  {index === 2 && 'Multiplier'}
                  {index === 3 && 'Tolerance'}
                </label>
                <Select value={band} onValueChange={(value: ColorBand) => handleBandChange(index, value)}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border ${COLOR_STYLES[band] || 'bg-gray-400'}`} />
                        {band}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {getValidColorsForPosition(index).map(color => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border ${COLOR_STYLES[color] || 'bg-gray-400'}`} />
                          {color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Band Controls */}
          <div className="flex gap-2">
            {bands.length === 3 && (
              <Button variant="outline" onClick={addToleranceBand}>
                Add Tolerance Band
              </Button>
            )}
            {bands.length === 4 && (
              <Button variant="outline" onClick={removeToleranceBand}>
                Remove Tolerance Band
              </Button>
            )}
            <Button onClick={calculateValue} className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculate Value
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {result && (
            <Card className="bg-component-bg border-electronics-blue/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-electronics-blue mb-2">
                      {result.formatted}
                    </div>
                    <div className="flex justify-center gap-2">
                      <Badge variant="secondary">
                        {result.value} {result.unit}
                      </Badge>
                      <Badge variant="outline">
                        {result.tolerance}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Raw Value:</span> {result.rawValue} µH
                    </div>
                    <div>
                      <span className="font-medium">Auto-scaled:</span> {result.unit}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Quick Test Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Test Cases</CardTitle>
          <CardDescription>Try these common inductor values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { bands: ['Red', 'Violet', 'Orange', 'Gold'] as ColorBand[], description: '27 mH ±5%' },
              { bands: ['Brown', 'Black', 'Red', 'Silver'] as ColorBand[], description: '1 mH ±10%' },
              { bands: ['Green', 'Blue', 'Yellow'] as ColorBand[], description: '560 mH ±20%' },
            ].map((testCase, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => setBands(testCase.bands)}
              >
                <div className="flex gap-1">
                  {testCase.bands.map((color, i) => (
                    <div
                      key={i}
                      className={`w-3 h-6 rounded-sm border ${COLOR_STYLES[color] || 'bg-gray-400'}`}
                    />
                  ))}
                </div>
                <span className="text-xs">{testCase.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InductorDecoder;