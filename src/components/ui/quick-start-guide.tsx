/**
 * Quick Start Guide Component
 * Help new users get started with the platform
 */

"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Brain,
  FileText,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  X,
  Lightbulb,
} from "lucide-react";

interface QuickStartGuideProps {
  onDismiss: () => void;
  className?: string;
}

export function QuickStartGuide({
  onDismiss,
  className,
}: QuickStartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Upload Your Notes",
      description:
        "Take a photo or upload an image of your handwritten notes, textbook pages, or diagrams",
      icon: Upload,
      color: "blue",
      action: "Go to Upload",
      href: "/upload",
    },
    {
      title: "AI Enhancement",
      description:
        "Our AI will analyze your content and generate summaries, explanations, and practice questions",
      icon: Brain,
      color: "purple",
      action: "Learn More",
      href: "/docs",
    },
    {
      title: "Study & Review",
      description:
        "Access your enhanced materials in your library and use the generated quizzes to test yourself",
      icon: FileText,
      color: "green",
      action: "View Library",
      href: "/library",
    },
  ];

  return (
    <Card className={`border-blue-200 dark:border-blue-800 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Quick Start Guide</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Get started with EduCapture in 3 simple steps
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${
                  index <= currentStep
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                }
              `}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                  w-12 h-0.5 mx-2
                  ${
                    index < currentStep
                      ? "bg-blue-300 dark:bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }
                `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {(() => {
              const IconComponent = steps[currentStep].icon;
              return (
                <IconComponent
                  className={`h-16 w-16 text-${steps[currentStep].color}-500`}
                />
              );
            })()}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = steps[currentStep].href)}
              >
                {steps[currentStep].action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Features Overview */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">What you&apos;ll get:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>AI-generated summaries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Detailed explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Practice quizzes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Smart organization</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/upload")}
            className="w-full"
          >
            Skip Guide - Start Uploading
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
