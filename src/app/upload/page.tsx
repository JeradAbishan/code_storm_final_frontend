/**
 * Upload Page
 * Main page for uploading and processing study materials
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
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
import { FileUpload } from "@/components/ui/file-upload";
import { EnhancedStudySessionResults } from "@/components/study/EnhancedStudySessionResults";
import {
  studyHelperService,
  StudySessionRequest,
  StudySessionResult,
} from "@/lib/study-helper";
import {
  Upload,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Brain,
  FileText,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingOptions {
  generate_summary: boolean;
  generate_explanation: boolean;
  generate_quiz: boolean;
  quiz_question_count: number;
  quiz_difficulty: "easy" | "medium" | "hard";
  explanation_level: "beginner" | "intermediate" | "advanced";
}

const DEFAULT_OPTIONS: ProcessingOptions = {
  generate_summary: true,
  generate_explanation: true,
  generate_quiz: true,
  quiz_question_count: 10,
  quiz_difficulty: "medium",
  explanation_level: "intermediate",
};

function UploadContent() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingOptions, setProcessingOptions] =
    useState<ProcessingOptions>(DEFAULT_OPTIONS);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] =
    useState<StudySessionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setProcessingResult(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setError(null);
    setProcessingResult(null);
  };

  const handleOptionChange = (key: keyof ProcessingOptions, value: boolean | string | number) => {
    setProcessingOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const request: StudySessionRequest = {
        file: selectedFile,
        ...processingOptions,
      };

      const result = await studyHelperService.uploadStudyImage(request);
      setProcessingResult(result);
    } catch (error) {
      console.error("Processing failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Processing failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setProcessingResult(null);
    setError(null);
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setProcessingResult(null);
    setError(null);
    setProcessingOptions(DEFAULT_OPTIONS);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Upload Study Material
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Transform your notes with AI-powered enhancement
            </p>
          </div>

          {processingResult && (
            <Button variant="outline" onClick={handleStartOver}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>

        {!processingResult ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Select Your File
                </CardTitle>
                <CardDescription>
                  Upload images of your handwritten notes, textbook pages,
                  diagrams, or PDFs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={selectedFile}
                  disabled={isProcessing}
                />
              </CardContent>
            </Card>

            {/* Processing Options */}
            {selectedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Processing Options
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowAdvancedOptions(!showAdvancedOptions)
                      }
                    >
                      {showAdvancedOptions ? "Basic" : "Advanced"}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Choose what type of AI enhancement you&apos;d like to generate.
                    Get comprehensive analysis with summaries, detailed
                    explanations, and custom quiz questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        processingOptions.generate_summary
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() =>
                        handleOptionChange(
                          "generate_summary",
                          !processingOptions.generate_summary
                        )
                      }
                    >
                      <CardContent className="p-4 text-center">
                        <FileText
                          className={cn(
                            "h-8 w-8 mx-auto mb-2",
                            processingOptions.generate_summary
                              ? "text-blue-500"
                              : "text-gray-400"
                          )}
                        />
                        <h3 className="font-medium">AI Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive key points, concepts, and intelligent
                          overview
                        </p>
                        {processingOptions.generate_summary && (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-2" />
                        )}
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        processingOptions.generate_explanation
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() =>
                        handleOptionChange(
                          "generate_explanation",
                          !processingOptions.generate_explanation
                        )
                      }
                    >
                      <CardContent className="p-4 text-center">
                        <Brain
                          className={cn(
                            "h-8 w-8 mx-auto mb-2",
                            processingOptions.generate_explanation
                              ? "text-orange-500"
                              : "text-gray-400"
                          )}
                        />
                        <h3 className="font-medium">Detailed Explanation</h3>
                        <p className="text-sm text-muted-foreground">
                          In-depth analysis with examples and concept breakdown
                        </p>
                        {processingOptions.generate_explanation && (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-2" />
                        )}
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        processingOptions.generate_quiz
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() =>
                        handleOptionChange(
                          "generate_quiz",
                          !processingOptions.generate_quiz
                        )
                      }
                    >
                      <CardContent className="p-4 text-center">
                        <HelpCircle
                          className={cn(
                            "h-8 w-8 mx-auto mb-2",
                            processingOptions.generate_quiz
                              ? "text-green-500"
                              : "text-gray-400"
                          )}
                        />
                        <h3 className="font-medium">Interactive Quiz</h3>
                        <p className="text-sm text-muted-foreground">
                          Multiple question types with explanations and
                          difficulty levels
                        </p>
                        {processingOptions.generate_quiz && (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-2" />
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Advanced Options */}
                  {showAdvancedOptions && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {processingOptions.generate_quiz && (
                          <div className="space-y-3">
                            <label className="text-sm font-medium">
                              Quiz Questions
                            </label>
                            <select
                              value={processingOptions.quiz_question_count}
                              onChange={(e) =>
                                handleOptionChange(
                                  "quiz_question_count",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md bg-background"
                              aria-label="Number of quiz questions"
                            >
                              {[3, 5, 8, 10, 15, 20, 25, 30].map((num) => (
                                <option key={num} value={num}>
                                  {num} questions
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {processingOptions.generate_quiz && (
                          <div className="space-y-3">
                            <label className="text-sm font-medium">
                              Quiz Difficulty
                            </label>
                            <select
                              value={processingOptions.quiz_difficulty}
                              onChange={(e) =>
                                handleOptionChange(
                                  "quiz_difficulty",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md bg-background"
                              aria-label="Quiz difficulty level"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                        )}

                        {processingOptions.generate_explanation && (
                          <div className="space-y-3">
                            <label className="text-sm font-medium">
                              Explanation Level
                            </label>
                            <select
                              value={processingOptions.explanation_level}
                              onChange={(e) =>
                                handleOptionChange(
                                  "explanation_level",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md bg-background"
                              aria-label="Explanation difficulty level"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Process Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleProcessFile}
                      disabled={isProcessing || !selectedFile}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing... This may take a few moments
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5 mr-2" />
                          Process with AI
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 dark:border-red-800">
                <CardContent className="flex items-center gap-3 p-4">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      Processing Failed
                    </p>
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {error}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <EnhancedStudySessionResults
            session={processingResult}
            onRetry={handleRetry}
            className="max-w-6xl mx-auto"
          />
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <AuthGuard requireAuth={true} requireVerification={true}>
      <UploadContent />
    </AuthGuard>
  );
}
