"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedMarkdownRenderer } from "@/components/ui/enhanced-markdown-renderer"
import { useState } from "react"

// Helper function to check if value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

interface StructuredDataDisplayProps {
  data: unknown
  title?: string
  level?: number
  maxLevel?: number
  showCopyButton?: boolean
}

export function StructuredDataDisplay({ 
  data, 
  title = "Data", 
  level = 0, 
  maxLevel = 3,
  showCopyButton = false 
}: StructuredDataDisplayProps) {
  const [isOpen, setIsOpen] = useState(level < 2)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (data === null || data === undefined) {
    return (
      <div className="text-muted-foreground italic">
        {title}: No data available
      </div>
    )
  }

  if (typeof data === 'string') {
    // Check if it's a long text that should be rendered as markdown
    if (data.length > 100 || data.includes('\n') || data.includes('**') || data.includes('*')) {
      return (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {showCopyButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <EnhancedMarkdownRenderer content={data} />
          </CardContent>
        </Card>
      )
    }
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-sm">{title}:</span>
        <span className="text-sm">{data}</span>
        {showCopyButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-1"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    )
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-sm">{title}:</span>
        <Badge variant="secondary" className="text-xs">
          {data.toString()}
        </Badge>
      </div>
    )
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div className="text-muted-foreground italic text-sm mb-2">
          {title}: Empty list
        </div>
      )
    }

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {title} ({data.length} items)
            </CardTitle>
            {showCopyButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="border-l-2 border-muted pl-4">
              <StructuredDataDisplay
                data={item}
                title={`Item ${index + 1}`}
                level={level + 1}
                maxLevel={maxLevel}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data)
    
    if (entries.length === 0) {
      return (
        <div className="text-muted-foreground italic text-sm mb-2">
          {title}: Empty object
        </div>
      )
    }

    // Special handling for common result types
    if (isObject(data) && 'explanation' in data && typeof data.explanation === 'string') {
      return (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {showCopyButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Explanation</h4>
              <EnhancedMarkdownRenderer content={data.explanation} />
            </div>
            
            {isObject(data) && 'concepts_explained' in data && Array.isArray(data.concepts_explained) && data.concepts_explained.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Concepts Explained</h4>
                <div className="flex flex-wrap gap-1">
                  {(data.concepts_explained as string[]).map((concept: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {isObject(data) && 'difficulty_level' in data && typeof data.difficulty_level === 'string' && (
              <div>
                <h4 className="font-medium text-sm mb-2">Difficulty Level</h4>
                <Badge variant="secondary" className="text-xs capitalize">
                  {String(data.difficulty_level)}
                </Badge>
              </div>
            )}
            
            {isObject(data) && 'related_topics' in data && Array.isArray(data.related_topics) && data.related_topics.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Related Topics</h4>
                <div className="flex flex-wrap gap-1">
                  {(data.related_topics as string[]).map((topic: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )
    }

    // Special handling for summary results
    if (isObject(data) && 'summary' in data && typeof data.summary === 'string') {
      return (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {showCopyButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Summary</h4>
              <EnhancedMarkdownRenderer content={data.summary} />
            </div>
            
            {isObject(data) && 'key_points' in data && Array.isArray(data.key_points) && data.key_points.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Key Points</h4>
                <ul className="space-y-1">
                  {(data.key_points as string[]).map((point: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex gap-4 text-xs text-muted-foreground">
              {isObject(data) && 'word_count' in data && (
                <span>Word count: {String(data.word_count)}</span>
              )}
              {isObject(data) && 'reading_time_minutes' in data && (
                <span>Reading time: {String(data.reading_time_minutes)} min</span>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

    // Special handling for quiz results
    if (isObject(data) && 'questions' in data && Array.isArray(data.questions)) {
      return (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {showCopyButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex gap-4 text-xs text-muted-foreground">
              {isObject(data) && 'total_questions' in data && (
                <span>Total questions: {String(data.total_questions)}</span>
              )}
              {isObject(data) && 'estimated_time_minutes' in data && (
                <span>Estimated time: {String(data.estimated_time_minutes)} min</span>
              )}
            </div>
            
            {isObject(data) && 'topics_covered' in data && Array.isArray(data.topics_covered) && data.topics_covered.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Topics Covered</h4>
                <div className="flex flex-wrap gap-1">
                  {(data.topics_covered as string[]).map((topic: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-sm mb-2">Questions</h4>
              <div className="space-y-3">
                {(data.questions as Record<string, unknown>[]).map((question: Record<string, unknown>, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-medium text-sm">
                          {index + 1}. {String(question.question)}
                        </h5>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            {String(question.question_type)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {String(question.difficulty)}
                          </Badge>
                        </div>
                      </div>
                      
                      {Array.isArray(question.options) && question.options.length > 0 && (
                        <div className="ml-4">
                          <div className="text-xs text-muted-foreground mb-1">Options:</div>
                          <ul className="space-y-1">
                            {(question.options as string[]).map((option: string, optionIndex: number) => (
                              <li key={optionIndex} className="text-sm flex items-start gap-2">
                                <span className="text-muted-foreground">
                                  {String.fromCharCode(97 + optionIndex)}.
                                </span>
                                <span>{option}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <span className="font-medium text-green-600">Answer: </span>
                        <span>{String(question.correct_answer)}</span>
                      </div>
                      
                      {typeof question.explanation === 'string' && question.explanation.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Explanation: </span>
                          <span>{String(question.explanation)}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    // General object handling with collapsible sections
    if (level >= maxLevel) {
      return (
        <div className="text-muted-foreground italic text-sm mb-2">
          {title}: [Complex object - max depth reached]
        </div>
      )
    }

    return (
      <Card className="mb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {title} ({entries.length} properties)
                </CardTitle>
                {showCopyButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy()
                    }}
                    className="h-8 px-2"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {entries.map(([key, value]) => (
                <div key={key} className="border-l-2 border-muted pl-4">
                  <StructuredDataDisplay
                    data={value}
                    title={key}
                    level={level + 1}
                    maxLevel={maxLevel}
                  />
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    )
  }

  // Fallback for other types
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="font-medium text-sm">{title}:</span>
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {String(data)}
      </code>
      {showCopyButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-1"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  )
}
