"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Zap,
  Brain,
  FileImage,
  Loader,
  RefreshCw,
} from "lucide-react";
import {
  uploadEnhancedStudyImage,
  estimateProcessingRequirements,
  EnhancedStudySessionRequest,
  EnhancedStudySessionResult,
} from "@/lib/enhanced-study-helper";
import { cn } from "@/lib/utils";

interface EnhancedStudyUploadProps {
  onUploadComplete: (result: EnhancedStudySessionResult) => void;
  onUploadStart?: () => void;
  className?: string;
}

interface ProcessingEstimate {
  estimatedTime: number;
  chunksRequired: number;
  complexity: "low" | "medium" | "high";
  recommendChunking: boolean;
  fileSize: number;
}

export function EnhancedStudyUpload({
  onUploadComplete,
  onUploadStart,
  className,
}: EnhancedStudyUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>("");
  const [processingEstimate, setProcessingEstimate] =
    useState<ProcessingEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Processing options
  const [enableChunking, setEnableChunking] = useState(true);
  const [chunkSize, setChunkSize] = useState([4000]);
  const [maxConcurrency, setMaxConcurrency] = useState([3]);
  const [preserveEquations, setPreserveEquations] = useState(true);
  const [enablePreprocessing, setEnablePreprocessing] = useState(true);
  const [generateSummary, setGenerateSummary] = useState(true);
  const [generateExplanation, setGenerateExplanation] = useState(true);
  const [generateQuiz, setGenerateQuiz] = useState(true);
  const [quizQuestionCount, setQuizQuestionCount] = useState([5]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setError(null);

        // Get processing estimate
        try {
          const estimate = await estimateProcessingRequirements(file, {
            chunkSize: chunkSize[0],
            maxConcurrency: maxConcurrency[0],
          });
          setProcessingEstimate(estimate);

          // Auto-enable chunking for large files
          if (estimate.recommendChunking && !enableChunking) {
            setEnableChunking(true);
          }
        } catch (err) {
          console.error("Failed to estimate processing requirements:", err);
        }
      }
    },
    [chunkSize, maxConcurrency, enableChunking]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".bmp", ".tiff"],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    onUploadStart?.();

    try {
      const request: EnhancedStudySessionRequest = {
        file: selectedFile,
        generate_summary: generateSummary,
        generate_explanation: generateExplanation,
        generate_quiz: generateQuiz,
        quiz_question_count: quizQuestionCount[0],
        enable_chunking: enableChunking,
        chunk_size: chunkSize[0],
        max_concurrency: maxConcurrency[0],
        preserve_equations: preserveEquations,
        preprocessing: enablePreprocessing,
      };

      const result = await uploadEnhancedStudyImage(
        request,
        (progress, stage) => {
          setUploadProgress(progress);
          setUploadStage(stage);
        }
      );

      onUploadComplete(result);
      setSelectedFile(null);
      setProcessingEstimate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage("");
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setProcessingEstimate(null);
    setError(null);
    setUploadProgress(0);
    setUploadStage("");
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* File Upload Area */}
      <Card
        className={cn(
          "border-dashed transition-colors cursor-pointer",
          isDragActive
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700",
          selectedFile && "border-green-400 bg-green-50 dark:bg-green-900/20"
        )}
      >
        <CardContent className="p-8">
          <div {...getRootProps()} className="text-center">
            <input {...getInputProps()} />
            <div className="mx-auto mb-4">
              {selectedFile ? (
                <FileImage className="h-12 w-12 text-green-500 mx-auto" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-green-700 dark:text-green-300">
                  File Selected: {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)} • Click to change file
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive
                    ? "Drop the file here"
                    : "Upload Educational Content"}
                </p>
                <p className="text-sm text-gray-500">
                  Drag & drop an image file here, or click to select
                </p>
                <p className="text-xs text-gray-400">
                  Supports: JPEG, PNG, WEBP, BMP, TIFF (max 20MB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Estimate */}
      {processingEstimate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Processing Estimate
            </CardTitle>
            <CardDescription>
              Analysis of your document and recommended processing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(processingEstimate.estimatedTime)}
                </div>
                <div className="text-sm text-gray-500">Est. Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {processingEstimate.chunksRequired}
                </div>
                <div className="text-sm text-gray-500">Chunks</div>
              </div>
              <div className="text-center">
                <Badge
                  className={getComplexityColor(processingEstimate.complexity)}
                >
                  {processingEstimate.complexity.toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-500 mt-1">Complexity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(processingEstimate.fileSize)}
                </div>
                <div className="text-sm text-gray-500">File Size</div>
              </div>
            </div>

            {processingEstimate.recommendChunking && (
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Chunked processing recommended</strong> for this large
                  document. This will improve processing accuracy and handle
                  mathematical content better.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Processing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Processing Options
          </CardTitle>
          <CardDescription>
            Configure how your document will be processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Generation Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Content Generation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <label htmlFor="summary" className="text-sm font-medium">
                  Generate Summary
                </label>
                <Switch
                  id="summary"
                  checked={generateSummary}
                  onCheckedChange={setGenerateSummary}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="explanation" className="text-sm font-medium">
                  Generate Explanation
                </label>
                <Switch
                  id="explanation"
                  checked={generateExplanation}
                  onCheckedChange={setGenerateExplanation}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="quiz" className="text-sm font-medium">
                  Generate Quiz
                </label>
                <Switch
                  id="quiz"
                  checked={generateQuiz}
                  onCheckedChange={setGenerateQuiz}
                />
              </div>
            </div>

            {generateQuiz && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Quiz Questions: {quizQuestionCount[0]}
                </label>
                <Slider
                  value={quizQuestionCount}
                  onValueChange={setQuizQuestionCount}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Advanced Processing Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Advanced Processing</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="chunking" className="text-sm font-medium">
                    Enable Chunked Processing
                  </label>
                  <p className="text-xs text-gray-500">
                    Process large documents in smaller chunks for better
                    accuracy
                  </p>
                </div>
                <Switch
                  id="chunking"
                  checked={enableChunking}
                  onCheckedChange={setEnableChunking}
                />
              </div>

              {enableChunking && (
                <div className="space-y-4 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Chunk Size: {chunkSize[0]} characters
                    </label>
                    <Slider
                      value={chunkSize}
                      onValueChange={setChunkSize}
                      min={1000}
                      max={8000}
                      step={500}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Max Concurrency: {maxConcurrency[0]} parallel requests
                    </label>
                    <Slider
                      value={maxConcurrency}
                      onValueChange={setMaxConcurrency}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="equations" className="text-sm font-medium">
                    Preserve Mathematical Content
                  </label>
                  <p className="text-xs text-gray-500">
                    Special handling for equations, formulas, and symbols
                  </p>
                </div>
                <Switch
                  id="equations"
                  checked={preserveEquations}
                  onCheckedChange={setPreserveEquations}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="preprocessing"
                    className="text-sm font-medium"
                  >
                    Enable Text Preprocessing
                  </label>
                  <p className="text-xs text-gray-500">
                    Clean and optimize extracted text for better AI processing
                  </p>
                </div>
                <Switch
                  id="preprocessing"
                  checked={enablePreprocessing}
                  onCheckedChange={setEnablePreprocessing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Processing...</span>
                <span className="text-xs text-gray-500">{uploadStage}</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <div className="text-xs text-gray-500 text-center">
                {uploadProgress.toFixed(0)}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Start AI Analysis
            </>
          )}
        </Button>

        {selectedFile && (
          <Button
            onClick={resetUpload}
            variant="outline"
            disabled={isUploading}
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
