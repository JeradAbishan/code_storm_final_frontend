/**
 * Study Session Results Component
 * Display results from AI processing including summary, explanation, and quiz
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StudySessionResult, QuizQuestion } from "@/lib/study-helper";
import { cn } from "@/lib/utils";

interface StudySessionResultsProps {
  session: StudySessionResult;
  onRetry?: () => void;
  className?: string;
}

export function StudySessionResults({
  session,
  onRetry,
  className,
}: StudySessionResultsProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    summary: true,
    explanation: false,
    quiz: false,
    analysis: false,
  });
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuizAnswers, setShowQuizAnswers] = useState<
    Record<number, boolean>
  >({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleQuizAnswer = (index: number) => {
    setShowQuizAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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

  const getContentTypeBadgeColor = (contentType: string) => {
    switch (contentType) {
      case "handwritten_text":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "printed_text":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "diagram":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "mixed":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
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
      {/* Processing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Processing Complete
          </CardTitle>
          <CardDescription>
            Your study material has been successfully analyzed and enhanced
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatProcessingTime(result.processing_time_seconds)}
              </div>
              <div className="text-sm text-muted-foreground">
                Processing Time
              </div>
            </div>

            <div className="text-center">
              <Badge
                className={getQualityBadgeColor(
                  result.image_quality.classification
                )}
              >
                {result.image_quality.classification} Quality
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">
                Score: {(result.image_quality.score * 100).toFixed(0)}%
              </div>
            </div>

            <div className="text-center">
              <Badge
                className={getContentTypeBadgeColor(
                  result.content_type.content_type
                )}
              >
                {result.content_type.content_type.replace("_", " ")}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">
                Confidence: {(result.content_type.confidence * 100).toFixed(0)}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {result.text_extraction.text.split(" ").length}
              </div>
              <div className="text-sm text-muted-foreground">
                Words Extracted
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      {result.summary && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("summary")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Summary & Key Points
              </div>
              {expandedSections.summary ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardTitle>
            <CardDescription>
              AI-generated summary with key insights (
              {result.summary.word_count} words, ~
              {result.summary.reading_time_minutes} min read)
            </CardDescription>
          </CardHeader>

          {expandedSections.summary && (
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.summary.summary}
                </p>
              </div>

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
            </CardContent>
          )}
        </Card>
      )}

      {/* Explanation Section */}
      {result.explanation && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("explanation")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-orange-500" />
                Detailed Explanation
              </div>
              {expandedSections.explanation ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardTitle>
            <CardDescription>
              In-depth explanation at {result.explanation.difficulty_level}{" "}
              level
            </CardDescription>
          </CardHeader>

          {expandedSections.explanation && (
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.explanation.explanation}
                </p>
              </div>

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
                      {result.explanation.related_topics.map((topic, index) => (
                        <Badge key={index} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Quiz Section */}
      {result.quiz && result.quiz.questions.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("quiz")}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-green-500" />
                Practice Quiz
              </div>
              {expandedSections.quiz ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardTitle>
            <CardDescription>
              {result.quiz.questions.length} questions • ~
              {result.quiz.estimated_time_minutes} minutes
            </CardDescription>
          </CardHeader>

          {expandedSections.quiz && (
            <CardContent className="space-y-4">
              {result.quiz.questions.map((question, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-lg">
                          {index + 1}. {question.question}
                        </h4>
                        <Badge
                          variant={
                            question.difficulty === "easy"
                              ? "secondary"
                              : question.difficulty === "medium"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </div>

                      {question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-2"
                            >
                              <div className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm">
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleQuizAnswer(index)}
                        className="mt-3"
                      >
                        {showQuizAnswers[index] ? "Hide Answer" : "Show Answer"}
                      </Button>

                      {showQuizAnswers[index] && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                          <p className="font-medium text-green-800 dark:text-green-200">
                            Answer: {question.correct_answer}
                          </p>
                          {question.explanation && (
                            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {result.quiz.topics_covered.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Topics Covered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.quiz.topics_covered.map((topic, index) => (
                        <Badge key={index} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Analysis Section */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection("analysis")}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Technical Analysis
            </div>
            {expandedSections.analysis ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CardTitle>
          <CardDescription>
            Detailed processing information and quality metrics
          </CardDescription>
        </CardHeader>

        {expandedSections.analysis && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Text Extraction</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Tool Used:</span>{" "}
                    {result.text_extraction.tool_used}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Confidence:</span>{" "}
                    {(result.text_extraction.confidence * 100).toFixed(1)}%
                  </p>
                  {result.text_extraction.language_detected && (
                    <p>
                      <span className="text-muted-foreground">Language:</span>{" "}
                      {result.text_extraction.language_detected}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Quality Assessment</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Score:</span>{" "}
                    {(result.image_quality.score * 100).toFixed(1)}%
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Classification:
                    </span>{" "}
                    {result.image_quality.classification}
                  </p>
                </div>
              </div>
            </div>

            {result.image_quality.issues.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Quality Issues</h4>
                <ul className="space-y-1">
                  {result.image_quality.issues.map((issue, index) => (
                    <li
                      key={index}
                      className="text-sm text-orange-600 dark:text-orange-400"
                    >
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.image_quality.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {result.image_quality.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm text-blue-600 dark:text-blue-400"
                    >
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Warnings</h4>
                <ul className="space-y-1">
                  {result.warnings.map((warning, index) => (
                    <li
                      key={index}
                      className="text-sm text-yellow-600 dark:text-yellow-400"
                    >
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-4 border-t">
              Session ID: {session.session_id} • Created:{" "}
              {new Date(session.created_at).toLocaleString()}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
