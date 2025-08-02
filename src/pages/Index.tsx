import InductorDecoder from '@/components/InductorDecoder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Zap, Calculator, Code } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-electronics py-20">
        <div className="absolute inset-0 bg-zinc-300"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Cpu className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 px-[5px] py-[7px] my-[10px] mx-0">
            Electronics Toolkit
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Professional-grade tools for electronics engineers and hobbyists. 
            Decode component values with precision and confidence.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              O(1) Complexity
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Calculator className="h-4 w-4 mr-2" />
              Enhanced Precision
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Code className="h-4 w-4 mr-2" />
              TypeScript Ready
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[#313121]/[0.24]">
        <div className="container mx-auto px-4">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-electronics-blue/20">
              <CardHeader className="bg-blue-100 rounded-sm">
                <CardTitle className="flex items-center gap-2 text-electronics-blue">
                  <Zap className="h-5 w-5" />
                  Enhanced Coverage
                </CardTitle>
                <CardDescription>
                  Supports all standard colors plus specialized ones like Pink (×0.001)
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-electronics-green/20">
              <CardHeader className="bg-emerald-100 rounded-sm">
                <CardTitle className="flex items-center gap-2 text-electronics-green">
                  <Calculator className="h-5 w-5" />
                  Complete Tolerance
                </CardTitle>
                <CardDescription>
                  Full tolerance range: ±0.05% to ±20% including Brown (±1%) and Red (±2%)
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-electronics-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electronics-orange">
                  <Code className="h-5 w-5" />
                  Integration Ready
                </CardTitle>
                <CardDescription>
                  TypeScript types, structured output, and modular design for larger projects
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Main Component */}
          <InductorDecoder />

          {/* Technical Details */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Time Complexity: O(1)</CardTitle>
                <CardDescription>
                  Constant time operations regardless of input size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The decoding process involves fixed operations: reading color bands 
                  and mapping them to values using predefined lookup tables. Performance 
                  remains consistent whether decoding 3 or 4 bands.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Space Complexity: O(1)</CardTitle>
                <CardDescription>
                  Constant memory usage with static lookup tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uses fixed-size color code and tolerance charts. Memory usage 
                  is independent of input size, making it ideal for embedded 
                  systems and resource-constrained environments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;