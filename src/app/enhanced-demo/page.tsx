"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EnhancedMarkdownRenderer } from "@/components/ui/enhanced-markdown-renderer";
import { EnhancedStudyUpload } from "@/components/study/EnhancedStudyUpload";
import { EnhancedStudySessionResults } from "@/components/study/EnhancedStudySessionResults";
import { Container, Section, Heading, Text, Flex } from "@radix-ui/themes";
import {
  Zap,
  Brain,
  FileText,
  Calculator,
  Atom,
  Superscript,
  Subscript,
  Upload,
  Settings,
  Clock,
  Target,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { EnhancedStudySessionResult } from "@/lib/enhanced-study-helper";

const DEMO_MATHEMATICAL_CONTENT = `
# Mathematical Concepts Demo

## Basic Equations
The quadratic formula is: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

For a parabola $y = ax^2 + bx + c$, the vertex is at $x = -\\frac{b}{2a}$.

## Chemical Formulas
- Water: H2O
- Carbon dioxide: CO2
- Sodium chloride: NaCl
- Methane: CH4
- Sulfuric acid: H2SO4

## Physics Examples
The energy-mass relation is $E = mc^2$ where:
- E is energy
- m is mass  
- c is the speed of light

Kinetic energy: $KE = \\frac{1}{2}mv^2$

## Superscripts and Subscripts
- Area: m² (square meters)
- Volume: cm³ (cubic centimeters)
- Velocity: v₀ (initial velocity)
- Acceleration: a = v²/r

## Complex Expression
$$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
`;

const DEMO_FEATURES = [
  {
    icon: Calculator,
    title: "Mathematical Equations",
    description:
      "LaTeX rendering for complex mathematical expressions, formulas, and equations",
    example: "$E = mc^2$, $\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$",
  },
  {
    icon: Atom,
    title: "Chemical Formulas",
    description:
      "Proper rendering of chemical compounds and molecular structures",
    example: "H₂O, CO₂, C₆H₁₂O₆, Ca(OH)₂",
  },
  {
    icon: Superscript,
    title: "Superscripts",
    description: "Mathematical powers, exponents, and scientific notation",
    example: "x², 10³, m/s², E = mc²",
  },
  {
    icon: Subscript,
    title: "Subscripts",
    description:
      "Chemical indices, variable notation, and mathematical subscripts",
    example: "H₂O, v₀, aᵢ, log₂(x)",
  },
  {
    icon: FileText,
    title: "Chunked Processing",
    description:
      "Handle large documents by processing them in optimized chunks",
    example: "4000+ character documents split intelligently",
  },
  {
    icon: Zap,
    title: "Parallel Processing",
    description: "Multiple chunks processed simultaneously for faster results",
    example: "3x faster processing with rate limiting",
  },
];

export default function EnhancedDemoPage() {
  const [activeDemo, setActiveDemo] = useState<string>("features");
  const [uploadResult, setUploadResult] =
    useState<EnhancedStudySessionResult | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadComplete = (result: EnhancedStudySessionResult) => {
    setUploadResult(result);
    setActiveDemo("results");
  };

  const resetDemo = () => {
    setUploadResult(null);
    setShowUpload(false);
    setActiveDemo("features");
  };

  return (
    <Container size="4" className="py-8">
      <Section>
        {/* Header */}
        <Flex
          direction="column"
          gap="4"
          align="center"
          className="text-center mb-8"
        >
          <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Enhanced Features Demo
          </Badge>
          <Heading
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Mathematical Content & Chunked Processing
          </Heading>
          <Text size="5" color="gray" className="max-w-3xl">
            Experience advanced document processing with mathematical equations,
            chemical formulas, and intelligent chunking for large documents
          </Text>
        </Flex>

        {/* Demo Navigation */}
        <Tabs
          value={activeDemo}
          onValueChange={setActiveDemo}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Demo Content
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Try It Out
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center gap-2"
              disabled={!uploadResult}
            >
              <Target className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Features Overview */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMO_FEATURES.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg font-mono text-sm">
                      {feature.example}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Benefits */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <CheckCircle className="h-5 w-5" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-purple-700 dark:text-purple-300">
                        Enhanced AI Processing
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Better understanding of mathematical and scientific
                        content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-300">
                        Faster Processing
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Parallel chunk processing reduces overall processing
                        time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-orange-700 dark:text-orange-300">
                        Better Accuracy
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Chunking prevents context loss in large documents
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Content */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-500" />
                  Mathematical Content Rendering Demo
                </CardTitle>
                <CardDescription>
                  See how mathematical equations, chemical formulas, and
                  scientific notation are rendered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedMarkdownRenderer
                  content={DEMO_MATHEMATICAL_CONTENT}
                  enableMath={true}
                  enableSupersub={true}
                  className="border rounded-lg p-4"
                />
              </CardContent>
            </Card>

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Try it yourself!</strong> Upload an image with
                mathematical content, chemical formulas, or a large document to
                see the enhanced processing in action.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Upload Interface */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-500" />
                  Enhanced Document Upload
                </CardTitle>
                <CardDescription>
                  Upload your educational content to experience the enhanced
                  processing features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedStudyUpload
                  onUploadComplete={handleUploadComplete}
                  onUploadStart={() => console.log("Upload started")}
                />
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Processing Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>For best results:</strong>
                </div>
                <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1 ml-4">
                  <li>
                    • Enable chunked processing for documents over 4000
                    characters
                  </li>
                  <li>
                    • Use mathematical content preservation for equations and
                    formulas
                  </li>
                  <li>• Enable preprocessing for better OCR text quality</li>
                  <li>
                    • Allow extra time for large documents (complexity
                    estimation provided)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Display */}
          <TabsContent value="results" className="space-y-6">
            {uploadResult ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Processing Results
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your document has been processed with enhanced features
                    </p>
                  </div>
                  <Button onClick={resetDemo} variant="outline">
                    Try Another File
                  </Button>
                </div>

                <EnhancedStudySessionResults
                  session={uploadResult}
                  onRetry={resetDemo}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Upload a document to see the results here
                  </p>
                  <Button
                    onClick={() => setActiveDemo("upload")}
                    className="mt-4"
                  >
                    Go to Upload
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </Container>
  );
}
