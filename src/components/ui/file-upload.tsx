/**
 * File Upload Component
 * Drag & drop file upload with preview and validation
 */

"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  File,
  X,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "application/pdf",
];

const DEFAULT_MAX_SIZE = 20; // MB

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxSizeInMB = DEFAULT_MAX_SIZE,
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        return `File type not supported. Please upload: ${acceptedTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`;
      }

      // Check file size
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSizeInMB) {
        return `File too large. Maximum size is ${maxSizeInMB}MB`;
      }

      return null;
    },
    [acceptedTypes, maxSizeInMB]
  );

  const handleFileSelection = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelection(files[0]);
      }
    },
    [disabled, handleFileSelection]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelection(files[0]);
      }
    },
    [handleFileSelection]
  );

  const handleUploadClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleRemoveFile = useCallback(() => {
    setError(null);
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onFileRemove]);

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload study material file"
      />

      {!selectedFile ? (
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            {
              "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/20":
                isDragOver && !disabled,
              "border-gray-300 hover:border-gray-400": !isDragOver && !disabled,
              "border-gray-200 bg-gray-50 cursor-not-allowed": disabled,
            }
          )}
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <Upload
              className={cn(
                "h-12 w-12 mb-4",
                disabled ? "text-gray-400" : "text-gray-500"
              )}
            />

            <div className="space-y-2">
              <p
                className={cn(
                  "text-lg font-medium",
                  disabled
                    ? "text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                )}
              >
                {isDragOver
                  ? "Drop your file here"
                  : "Upload your study material"}
              </p>

              <p
                className={cn(
                  "text-sm",
                  disabled ? "text-gray-400" : "text-gray-500"
                )}
              >
                Drag & drop or click to browse
              </p>

              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {acceptedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.split("/")[1].toUpperCase()}
                  </Badge>
                ))}
              </div>

              <p
                className={cn(
                  "text-xs",
                  disabled ? "text-gray-400" : "text-gray-400"
                )}
              >
                Maximum file size: {maxSizeInMB}MB
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedFile)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
