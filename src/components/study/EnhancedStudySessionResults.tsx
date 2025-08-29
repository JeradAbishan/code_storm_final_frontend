/**
 * Enhanced Study Session Results Component
 * Improved display for dynamic AI-generated content
 */

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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EnhancedMarkdownRenderer,
  preprocessMathContent,
  detectContentFeatures,
} from "@/components/ui/enhanced-markdown-renderer";
import {
  Brain,
  FileText,
  HelpCircle,
  CheckCircle,
  X,
  Clock,
  Star,
  BookOpen,
  Lightbulb,
  Target,
  AlertTriangle,
  Eye,
  Image as ImageIcon,
  Copy,
} from "lucide-react";
import { StudySessionResult } from "@/lib/study-helper";
import { cn } from "@/lib/utils";
import { StructuredDataDisplay } from "@/components/ui/structured-data-display";

interface EnhancedStudySessionResultsProps {
  session: StudySessionResult;
  onRetry?: () => void;
  className?: string;
}

export function EnhancedStudySessionResults({
  session,
  onRetry,
  className,
}: EnhancedStudySessionResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showQuizAnswers, setShowQuizAnswers] = useState<
    Record<number, boolean>
  >({});
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const toggleQuizAnswer = (index: number) => {
    setShowQuizAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const ProgressBar = ({
    value,
    className = "",
  }: {
    value: number;
    className?: string;
  }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${className}`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );

  const getQualityBadgeColor = (classification: string) => {
    switch (classification) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatProcessingTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
  };

  if (session.status === "failed") {
    return (
      <Card className={cn("border-red-200 dark:border-red-800", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <X className="h-5 w-5" />
            Processing Failed
          </CardTitle>
          <CardDescription>
            {session.result.error_message ||
              "An error occurred while processing your file."}
          </CardDescription>
        </CardHeader>
        {onRetry && (
          <CardContent>
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          </CardContent>
        )}
      </Card>
    );
  }

  const { result } = session;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Success Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            AI Analysis Complete
          </CardTitle>
          <CardDescription>
            Your educational content has been successfully processed and
            enhanced with AI insights
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <strong>Processing Notes:</strong>
              {result.warnings.map((warning, index) => (
                <div key={index} className="text-sm">
                  • {warning}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Extracted Text</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-blue-600">
                  {formatProcessingTime(result.processing_time_seconds)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Processing Time
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <Badge
                  className={getQualityBadgeColor(
                    result.image_quality.classification
                  )}
                >
                  {result.image_quality.classification.toUpperCase()} Quality
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  Score: {(result.image_quality.score * 100).toFixed(0)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-purple-600">
                  {result.text_extraction.text.split(" ").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Words Extracted
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-green-600">
                  {(result.text_extraction.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Extraction Confidence
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                <div className="text-2xl font-bold text-indigo-600">
                  {result.text_extraction.text.length}
                </div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-bold text-amber-600">
                  {result.text_extraction.text.split("\n").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Lines Detected
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-rose-500" />
                <Badge variant="outline">
                  {result.content_type.content_type
                    .replace("_", " ")
                    .toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  Content Type (
                  {(result.content_type.confidence * 100).toFixed(0)}%)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
                <Badge variant="secondary">
                  {result.text_extraction.tool_used.toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  AI Tool Used
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Type Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-500" />
                Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Content Type</h4>
                  <Badge variant="secondary" className="text-sm">
                    {result.content_type.content_type.replace("_", " ")}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    Confidence:{" "}
                    {(result.content_type.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Processing Tool</h4>
                  <Badge variant="outline">
                    {result.text_extraction.tool_used}
                  </Badge>
                </div>
              </div>

              {result.image_quality.issues.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Quality Issues</h4>
                  <div className="space-y-1">
                    {result.image_quality.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="text-sm text-amber-600 dark:text-amber-400"
                      >
                        • {issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.image_quality.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <div className="space-y-1">
                    {result.image_quality.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="text-sm text-green-600 dark:text-green-400"
                      >
                        • {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extracted Text Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Extracted Text Content
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(result.text_extraction.text, "content")
                    }
                  >
                    {copiedSection === "content" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Original text extracted from your image •{" "}
                {result.text_extraction.text.split(" ").length} words •
                {result.text_extraction.tool_used.toUpperCase()} extraction •
                {(result.text_extraction.confidence * 100).toFixed(1)}%
                confidence
                {result.text_extraction.language_detected &&
                  ` • ${result.text_extraction.language_detected.toUpperCase()} detected`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Extraction Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Tool Used
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {result.text_extraction.tool_used.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Confidence
                    </div>
                    <div className="text-lg font-bold text-blue-600 mt-1">
                      {(result.text_extraction.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  {result.text_extraction.language_detected && (
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Language
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {result.text_extraction.language_detected.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  {result.text_extraction.bounding_boxes && (
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Text Regions
                      </div>
                      <div className="text-lg font-bold text-blue-600 mt-1">
                        {result.text_extraction.bounding_boxes.length}
                      </div>
                    </div>
                  )}
                </div>

                {/* Extracted Text */}
                <div className="prose dark:prose-invert max-w-none">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 dark:text-gray-300">
                      {result.text_extraction.text ||
                        "No text was extracted from the image."}
                    </pre>
                  </div>
                </div>

                {/* Text Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {result.text_extraction.text.length}
                    </div>
                    <div className="text-sm text-gray-500">Characters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {
                        result.text_extraction.text
                          .split(" ")
                          .filter((w) => w.length > 0).length
                      }
                    </div>
                    <div className="text-sm text-gray-500">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {
                        result.text_extraction.text
                          .split("\n")
                          .filter((l) => l.trim().length > 0).length
                      }
                    </div>
                    <div className="text-sm text-gray-500">Lines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {
                        result.text_extraction.text
                          .split("\n\n")
                          .filter((p) => p.trim().length > 0).length
                      }
                    </div>
                    <div className="text-sm text-gray-500">Paragraphs</div>
                  </div>
                </div>

                {/* Mathematical Content Analysis */}
                {(() => {
                  const features = detectContentFeatures(
                    result.text_extraction.text
                  );
                  if (
                    features.hasMath ||
                    features.hasSupersub ||
                    features.hasChemical
                  ) {
                    return (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Target className="h-4 w-4" />
                          Mathematical Content Detected
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {features.hasMath && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-blue-600 dark:text-blue-400">
                                Mathematical equations
                              </span>
                            </div>
                          )}
                          {features.hasSupersub && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm text-blue-600 dark:text-blue-400">
                                Superscripts/subscripts
                              </span>
                            </div>
                          )}
                          {features.hasChemical && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm text-blue-600 dark:text-blue-400">
                                Chemical formulas
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                          Content will be rendered with enhanced mathematical
                          formatting
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          {result.summary ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    AI-Generated Summary
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          result.summary?.summary || "",
                          "summary"
                        )
                      }
                    >
                      {copiedSection === "summary" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Intelligent summary • {result.summary.word_count} words • ~
                  {result.summary.reading_time_minutes} min read •
                  {result.summary.key_points.length} key points identified
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const summaryContent =
                    result.summary?.summary || "No summary available.";
                  const processedContent =
                    preprocessMathContent(summaryContent);
                  const features = detectContentFeatures(processedContent);

                  return (
                    <EnhancedMarkdownRenderer
                      content={processedContent}
                      className="mb-4"
                      enableMath={features.hasMath}
                      enableSupersub={features.hasSupersub}
                    />
                  );
                })()}

                {result.summary.key_points.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {result.summary.key_points.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  No summary available for this content.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Explanation Tab */}
        <TabsContent value="explanation" className="space-y-4">
          {result.explanation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-orange-500" />
                    Detailed Explanation
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          result.explanation?.explanation || "",
                          "explanation"
                        )
                      }
                    >
                      {copiedSection === "explanation" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  In-depth analysis at {result.explanation.difficulty_level}{" "}
                  level •{result.explanation.concepts_explained.length} concepts
                  explained •{result.explanation.related_topics.length} related
                  topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const explanationContent =
                    result.explanation?.explanation ||
                    "No explanation available.";
                  const processedContent =
                    preprocessMathContent(explanationContent);
                  const features = detectContentFeatures(processedContent);

                  return (
                    <EnhancedMarkdownRenderer
                      content={processedContent}
                      className="mb-4"
                      enableMath={features.hasMath}
                      enableSupersub={features.hasSupersub}
                    />
                  );
                })()}

                {result.explanation.concepts_explained.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        Concepts Explained
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.explanation.concepts_explained.map(
                          (concept, index) => (
                            <Badge key={index} variant="secondary">
                              {concept}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

                {result.explanation.related_topics.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        Related Topics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.explanation.related_topics.map(
                          (topic, index) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  No detailed explanation available for this content.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-4">
          {result.quiz && result.quiz.questions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-500" />
                  Practice Quiz
                </CardTitle>
                <CardDescription>
                  {result.quiz.questions.length} questions • ~
                  {result.quiz.estimated_time_minutes} minutes •
                  {result.quiz.topics_covered.length > 0 && (
                    <>Topics: {result.quiz.topics_covered.join(", ")} •</>
                  )}
                  {
                    result.quiz.questions.filter((q) => q.difficulty === "easy")
                      .length
                  }{" "}
                  easy,{" "}
                  {
                    result.quiz.questions.filter(
                      (q) => q.difficulty === "medium"
                    ).length
                  }{" "}
                  medium,{" "}
                  {
                    result.quiz.questions.filter((q) => q.difficulty === "hard")
                      .length
                  }{" "}
                  hard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.quiz.questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm text-gray-500">
                        Question {index + 1} • {question.difficulty} •{" "}
                        {question.topic || "General"}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {question.question_type.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <p className="font-medium text-lg">{question.question}</p>

                    {/* Multiple Choice Questions */}
                    {question.question_type === "multiple_choice" &&
                      question.options &&
                      question.options.length > 0 && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                                showQuizAnswers[index] &&
                                  option === question.correct_answer
                                  ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                                  : showQuizAnswers[index]
                                  ? "bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700"
                                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                                    showQuizAnswers[index] &&
                                      option === question.correct_answer
                                      ? "bg-green-600 border-green-600 text-white"
                                      : "border-gray-300 text-gray-600"
                                  )}
                                >
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <span className="flex-1">{option}</span>
                                {showQuizAnswers[index] &&
                                  option === question.correct_answer && (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* True/False Questions */}
                    {question.question_type === "true_false" && (
                      <div className="space-y-2">
                        {["True", "False"].map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                              showQuizAnswers[index] &&
                                option === question.correct_answer
                                ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                                : showQuizAnswers[index]
                                ? "bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                                  showQuizAnswers[index] &&
                                    option === question.correct_answer
                                    ? "bg-green-600 border-green-600 text-white"
                                    : "border-gray-300 text-gray-600"
                                )}
                              >
                                {option === "True" ? "T" : "F"}
                              </div>
                              <span className="flex-1">{option}</span>
                              {showQuizAnswers[index] &&
                                option === question.correct_answer && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fill in the Blank Questions */}
                    {question.question_type === "fill_in_blank" && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            💡 Fill in the blank with the most appropriate word
                            or phrase
                          </p>
                        </div>
                        {showQuizAnswers[index] && (
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="font-medium text-green-800 dark:text-green-200">
                              Correct Answer:{" "}
                              <span className="font-bold">
                                {question.correct_answer}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Short Answer Questions */}
                    {question.question_type === "short_answer" && (
                      <div className="space-y-3">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            📝 Provide a brief answer (2-3 sentences)
                          </p>
                        </div>
                        {showQuizAnswers[index] && (
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="font-medium text-green-800 dark:text-green-200">
                              Sample Answer:
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                              {question.correct_answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleQuizAnswer(index)}
                      >
                        {showQuizAnswers[index] ? "Hide Answer" : "Show Answer"}
                      </Button>
                      {question.question_type === "multiple_choice" ||
                      question.question_type === "true_false" ? (
                        <Badge variant="secondary" className="text-xs">
                          Choose One
                        </Badge>
                      ) : question.question_type === "fill_in_blank" ? (
                        <Badge variant="secondary" className="text-xs">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Written Response
                        </Badge>
                      )}
                    </div>

                    {showQuizAnswers[index] && question.explanation && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                          Explanation:
                        </h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Quiz Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {result.quiz.total_questions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Questions
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {result.quiz.estimated_time_minutes}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Minutes
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {
                          result.quiz.questions.filter(
                            (q) => q.question_type === "multiple_choice"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Multiple Choice
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {
                          result.quiz.questions.filter(
                            (q) => q.question_type === "true_false"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        True/False
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {
                          result.quiz.questions.filter(
                            (q) =>
                              q.question_type === "fill_in_blank" ||
                              q.question_type === "short_answer"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Open Response
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Distribution:
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {
                            result.quiz.questions.filter(
                              (q) => q.difficulty === "easy"
                            ).length
                          }
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-400">
                          Easy
                        </div>
                      </div>
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">
                          {
                            result.quiz.questions.filter(
                              (q) => q.difficulty === "medium"
                            ).length
                          }
                        </div>
                        <div className="text-xs text-yellow-700 dark:text-yellow-400">
                          Medium
                        </div>
                      </div>
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <div className="text-lg font-bold text-red-600">
                          {
                            result.quiz.questions.filter(
                              (q) => q.difficulty === "hard"
                            ).length
                          }
                        </div>
                        <div className="text-xs text-red-700 dark:text-red-400">
                          Hard
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Topics Covered */}
                  {result.quiz.topics_covered.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Topics Covered:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.quiz.topics_covered.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  No quiz questions available for this content.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Technical Details Tab */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Session Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Session ID:
                    </span>
                    <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                      {session.session_id}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      User ID:
                    </span>
                    <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                      {session.user_id}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <Badge
                      className="mt-1"
                      variant={
                        session.status === "completed"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {session.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Created:
                    </span>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {new Date(session.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Processing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Success Status:
                    </span>
                    <Badge
                      className="ml-2"
                      variant={result.success ? "default" : "destructive"}
                    >
                      {result.success ? "SUCCESS" : "FAILED"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Processing Time:
                    </span>
                    <div className="text-lg font-bold text-blue-600 mt-1">
                      {formatProcessingTime(result.processing_time_seconds)}
                    </div>
                  </div>
                  {result.error_message && (
                    <div>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        Error Message:
                      </span>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 rounded mt-1">
                        <code className="text-xs text-red-700 dark:text-red-300">
                          {result.error_message}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Text Extraction Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  Text Extraction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Extraction Tool:
                    </span>
                    <Badge className="ml-2" variant="outline">
                      {result.text_extraction.tool_used.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Confidence Score:
                    </span>
                    <ProgressBar
                      value={result.text_extraction.confidence}
                      className="bg-purple-600"
                    />
                    <span className="text-xs text-gray-500">
                      {(result.text_extraction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  {result.text_extraction.language_detected && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Language Detected:
                      </span>
                      <Badge className="ml-2" variant="secondary">
                        {result.text_extraction.language_detected.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  {result.text_extraction.bounding_boxes &&
                    result.text_extraction.bounding_boxes.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Bounding Boxes:
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {result.text_extraction.bounding_boxes.length} text
                          regions detected
                        </div>
                      </div>
                    )}
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Text Statistics:
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                      <div>
                        Characters:{" "}
                        <span className="font-mono">
                          {result.text_extraction.text.length}
                        </span>
                      </div>
                      <div>
                        Words:{" "}
                        <span className="font-mono">
                          {result.text_extraction.text.split(" ").length}
                        </span>
                      </div>
                      <div>
                        Lines:{" "}
                        <span className="font-mono">
                          {result.text_extraction.text.split("\n").length}
                        </span>
                      </div>
                      <div>
                        Paragraphs:{" "}
                        <span className="font-mono">
                          {result.text_extraction.text.split("\n\n").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Type Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Content Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Content Type:
                    </span>
                    <Badge className="ml-2" variant="secondary">
                      {result.content_type.content_type
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Classification Confidence:
                    </span>
                    <ProgressBar
                      value={result.content_type.confidence}
                      className="bg-orange-600"
                    />
                    <span className="text-xs text-gray-500">
                      {(result.content_type.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  {result.content_type.details &&
                    Object.keys(result.content_type.details).length > 0 && (
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                          Additional Details:
                        </span>
                        <StructuredDataDisplay
                          data={result.content_type.details}
                          title="Processing Details"
                          showCopyButton={true}
                        />
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Image Quality Analysis */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-yellow-500" />
                  Comprehensive Image Quality Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border">
                    <div className="text-3xl font-bold text-yellow-600">
                      {(result.image_quality.score * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Quality Score
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                    <Badge
                      className={getQualityBadgeColor(
                        result.image_quality.classification
                      )}
                    >
                      {result.image_quality.classification.toUpperCase()}
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Classification
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border">
                    <div className="text-3xl font-bold text-green-600">
                      {result.image_quality.issues.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Issues Found
                    </div>
                  </div>
                </div>

                {result.image_quality.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-red-700 dark:text-red-400">
                      Quality Issues Detected:
                    </h4>
                    <div className="space-y-2">
                      {result.image_quality.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                        >
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700 dark:text-red-300">
                            {issue}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.image_quality.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-green-700 dark:text-green-400">
                      Improvement Recommendations:
                    </h4>
                    <div className="space-y-2">
                      {result.image_quality.recommendations.map(
                        (rec, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                          >
                            <Lightbulb className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-700 dark:text-green-300">
                              {rec}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Raw JSON Data */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    Complete Raw Response Data
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(session, null, 2),
                        "rawdata"
                      )
                    }
                  >
                    {copiedSection === "rawdata" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Complete backend response for debugging and development
                  purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StructuredDataDisplay
                  data={session}
                  title="Complete Response Data"
                  showCopyButton={true}
                  maxLevel={4}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
