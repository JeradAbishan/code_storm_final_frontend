/**
 * Enhanced Study Helper API Service
 * Extended API calls with chunked processing and mathematical content support
 */

import {
  createTextChunks,
  processDocumentChunks,
  mergeChunkResults,
  DocumentChunk,
  ChunkResult,
  ProcessingOptions,
  ChunkedProcessingResult,
  estimateProcessingTime,
  preprocessDocumentText,
} from "./document-processor";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const API_V1_STR = "/api/v1";

export interface EnhancedStudySessionRequest {
  file: File;
  generate_summary?: boolean;
  generate_explanation?: boolean;
  generate_quiz?: boolean;
  quiz_question_count?: number;
  quiz_difficulty?: "easy" | "medium" | "hard";
  explanation_level?: "beginner" | "intermediate" | "advanced";
  enable_chunking?: boolean;
  chunk_size?: number;
  max_concurrency?: number;
  preserve_equations?: boolean;
  preprocessing?: boolean;
}

export interface EnhancedStudySessionResult {
  session_id: string;
  user_id: string;
  result: {
    success: boolean;
    processing_time_seconds: number;
    is_chunked: boolean;
    chunk_count?: number;
    total_characters: number;
    summary?: {
      summary: string;
      key_points: string[];
      word_count: number;
      reading_time_minutes: number;
    };
    explanation?: {
      explanation: string;
      concepts_explained: string[];
      difficulty_level: "beginner" | "intermediate" | "advanced";
      related_topics: string[];
    };
    quiz?: {
      questions: QuizQuestion[];
      total_questions: number;
      estimated_time_minutes: number;
      topics_covered: string[];
    };
    image_quality: {
      score: number;
      classification: "high" | "medium" | "low";
      issues: string[];
      recommendations: string[];
    };
    content_type: {
      content_type: "handwritten_text" | "printed_text" | "diagram" | "mixed";
      confidence: number;
      details: Record<string, unknown>; // API response
    };
    text_extraction: {
      text: string;
      confidence: number;
      tool_used:
        | "trocr"
        | "paddleocr"
        | "google_vision"
        | "gemini_vision"
        | "none";
      bounding_boxes?: Array<Record<string, unknown>>; // API response
      language_detected?: string;
      has_equations?: boolean;
      has_chemical?: boolean;
      has_supersub?: boolean;
    };
    math_content?: {
      detected: boolean;
      equations_count: number;
      chemical_formulas: string[];
      superscript_subscript_usage: string[];
    };
    error_message?: string;
    warnings: string[];
  };
  created_at: string;
  status: "completed" | "failed" | "processing";
}

// Re-export from base study-helper
export type { QuizQuestion } from "./study-helper";
import { QuizQuestion } from "./study-helper";

/**
 * Enhanced study session upload with chunked processing
 */
export async function uploadEnhancedStudyImage(
  request: EnhancedStudySessionRequest,
  onProgress?: (progress: number, stage: string) => void
): Promise<EnhancedStudySessionResult> {
  const formData = new FormData();
  formData.append("file", request.file);
  formData.append("generate_summary", String(request.generate_summary ?? true));
  formData.append(
    "generate_explanation",
    String(request.generate_explanation ?? true)
  );
  formData.append("generate_quiz", String(request.generate_quiz ?? true));
  formData.append(
    "quiz_question_count",
    String(request.quiz_question_count ?? 5)
  );

  if (request.quiz_difficulty) {
    formData.append("quiz_difficulty", request.quiz_difficulty);
  }
  if (request.explanation_level) {
    formData.append("explanation_level", request.explanation_level);
  }

  try {
    onProgress?.(10, "Uploading file...");

    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/study/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    onProgress?.(50, "Processing document...");

    const result = (await response.json()) as EnhancedStudySessionResult;

    // Check if chunked processing is needed
    if (request.enable_chunking && result.result.text_extraction?.text) {
      onProgress?.(60, "Analyzing document size...");

      const extractedText = result.result.text_extraction.text;
      const shouldChunk = extractedText.length > (request.chunk_size || 4000);

      if (shouldChunk) {
        onProgress?.(70, "Processing in chunks...");

        const chunkingOptions: ProcessingOptions = {
          chunkSize: request.chunk_size || 4000,
          maxConcurrency: request.max_concurrency || 3,
          preserveEquations: request.preserve_equations ?? true,
          enableMathDetection: true,
        };

        const processedText = request.preprocessing
          ? preprocessDocumentText(extractedText)
          : extractedText;

        const chunks = createTextChunks(processedText, chunkingOptions);

        onProgress?.(80, `Processing ${chunks.length} chunks...`);

        // Process chunks for enhanced content
        const chunkResults = await processDocumentChunks(
          chunks,
          async (chunk: DocumentChunk) => {
            // This would call backend API for each chunk
            // For now, we'll simulate enhanced processing
            return await processChunkContent(chunk, request);
          },
          chunkingOptions
        );

        onProgress?.(90, "Merging results...");

        const mergedResult = mergeChunkResults(chunks, chunkResults);

        // Enhance the original result with chunked data
        result.result.is_chunked = true;
        result.result.chunk_count = chunks.length;
        result.result.total_characters = mergedResult.totalCharacters;

        if (mergedResult.summary) {
          result.result.summary = {
            summary: mergedResult.summary,
            key_points: extractKeyPoints(mergedResult.summary),
            word_count: mergedResult.summary.split(/\s+/).length,
            reading_time_minutes: Math.ceil(
              mergedResult.summary.split(/\s+/).length / 200
            ),
          };
        }

        if (mergedResult.explanation) {
          result.result.explanation = {
            explanation: mergedResult.explanation,
            concepts_explained: extractConcepts(mergedResult.explanation),
            difficulty_level: request.explanation_level || "intermediate",
            related_topics: extractTopics(mergedResult.explanation),
          };
        }

        if (mergedResult.quiz && mergedResult.quiz.length > 0) {
          result.result.quiz = {
            questions: mergedResult.quiz,
            total_questions: mergedResult.quiz.length,
            estimated_time_minutes: Math.ceil(mergedResult.quiz.length * 1.5),
            topics_covered: [
              ...new Set(mergedResult.quiz.map((q) => q.topic).filter((topic): topic is string => Boolean(topic))),
            ],
          };
        }

        // Add mathematical content analysis
        const mathContent = analyzeMathematicalContent(extractedText);
        result.result.math_content = mathContent;
        result.result.text_extraction.has_equations =
          mathContent.equations_count > 0;
        result.result.text_extraction.has_chemical =
          mathContent.chemical_formulas.length > 0;
        result.result.text_extraction.has_supersub =
          mathContent.superscript_subscript_usage.length > 0;
      }
    }

    onProgress?.(100, "Complete!");

    return result;
  } catch (error) {
    console.error("Enhanced study session upload failed:", error);
    throw error;
  }
}

/**
 * Process individual chunk content (simulated for now)
 */
async function processChunkContent(
  chunk: DocumentChunk,
  request: EnhancedStudySessionRequest
): Promise<ChunkResult['result']> {
  // This would call the backend API for chunk-specific processing
  // For now, we'll return a mock response based on chunk content

  return new Promise((resolve) => {
    setTimeout(() => {
      const words = chunk.content.split(/\s+/);
      const sentences = chunk.content.split(/[.!?]+/).filter((s) => s.trim());

      resolve({
        summary: `Summary for chunk ${chunk.id}: ${
          sentences[0]?.trim() || "Content summary"
        }...`,
        explanation: `Detailed explanation of concepts in chunk ${chunk.id}...`,
        quiz: generateMockQuizFromChunk(chunk),
      });
    }, 1000); // Simulate processing time
  });
}

/**
 * Generate mock quiz questions from chunk content
 */
function generateMockQuizFromChunk(chunk: DocumentChunk): QuizQuestion[] {
  const sentences = chunk.content.split(/[.!?]+/).filter((s) => s.trim());
  const words = chunk.content.split(/\s+/).filter((w) => w.length > 3);

  const questions: QuizQuestion[] = [];

  // Generate 1-2 questions per chunk
  for (let i = 0; i < Math.min(2, sentences.length); i++) {
    const sentence = sentences[i]?.trim();
    if (!sentence) continue;

    const sentenceWords = sentence.split(/\s+/).filter((w) => w.length > 3);
    if (sentenceWords.length < 3) continue;

    const keyWord = sentenceWords[Math.floor(sentenceWords.length / 2)];
    const questionText = sentence.replace(keyWord, "______");

    questions.push({
      question: `Fill in the blank: ${questionText}`,
      question_type: "fill_in_blank",
      options: [keyWord, "option1", "option2", "option3"],
      correct_answer: keyWord,
      explanation: `The correct answer is "${keyWord}" based on the context.`,
      difficulty: "medium",
      topic: `Content from ${chunk.id}`,
    });
  }

  return questions;
}

/**
 * Extract key points from summary text
 */
function extractKeyPoints(summary: string): string[] {
  const sentences = summary.split(/[.!?]+/).filter((s) => s.trim());
  return sentences.slice(0, 5).map((s) => s.trim());
}

/**
 * Extract concepts from explanation text
 */
function extractConcepts(explanation: string): string[] {
  const concepts: string[] = [];
  const conceptPatterns = [
    /concept of ([^.!?]+)/gi,
    /definition of ([^.!?]+)/gi,
    /theory of ([^.!?]+)/gi,
    /principle of ([^.!?]+)/gi,
  ];

  conceptPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(explanation)) !== null) {
      concepts.push(match[1].trim());
    }
  });

  return concepts.slice(0, 10);
}

/**
 * Extract topics from text
 */
function extractTopics(text: string): string[] {
  const commonTopics = [
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "history",
    "literature",
    "science",
    "economics",
    "psychology",
    "philosophy",
  ];

  const foundTopics = commonTopics.filter((topic) =>
    text.toLowerCase().includes(topic)
  );

  return foundTopics.slice(0, 5);
}

/**
 * Analyze mathematical content in text
 */
function analyzeMathematicalContent(text: string): {
  detected: boolean;
  equations_count: number;
  chemical_formulas: string[];
  superscript_subscript_usage: string[];
} {
  // Count equations (simple heuristic)
  const equationPatterns = [
    /\$[^$]+\$/g, // LaTeX inline math
    /\$\$[^$]+\$\$/g, // LaTeX block math
    /[a-zA-Z0-9\s]*=\s*[a-zA-Z0-9\s+\-*/()^]+/g, // Simple equations
    /\\\w+/g, // LaTeX commands
  ];

  let equations_count = 0;
  equationPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) equations_count += matches.length;
  });

  // Find chemical formulas
  const chemicalFormulas =
    text.match(/[A-Z][a-z]?[0-9]*(?:\([A-Z][a-z]?[0-9]*\))*[0-9]*/g) || [];
  const commonChemicals = [
    "H2O",
    "CO2",
    "NaCl",
    "CH4",
    "O2",
    "N2",
    "Ca(OH)2",
    "H2SO4",
  ];
  const detectedChemicals = chemicalFormulas.filter(
    (formula) =>
      commonChemicals.some((chem) => formula.includes(chem)) ||
      /^[A-Z][a-z]?[0-9]*$/.test(formula)
  );

  // Find superscript/subscript usage
  const supersubPatterns = [
    /\^[a-zA-Z0-9]+/g,
    /_[a-zA-Z0-9]+/g,
    /[0-9]+\^[0-9]+/g,
    /[a-zA-Z]+_[0-9]+/g,
    /x²|x³|m²|cm³|kg\/m³/g,
  ];

  const supersubUsage: string[] = [];
  supersubPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) supersubUsage.push(...matches);
  });

  return {
    detected:
      equations_count > 0 ||
      detectedChemicals.length > 0 ||
      supersubUsage.length > 0,
    equations_count,
    chemical_formulas: [...new Set(detectedChemicals)].slice(0, 10),
    superscript_subscript_usage: [...new Set(supersubUsage)].slice(0, 10),
  };
}

/**
 * Get study session with enhanced details
 */
export async function getEnhancedStudySession(
  sessionId: string
): Promise<EnhancedStudySessionResult> {
  const response = await fetch(
    `${API_BASE_URL}${API_V1_STR}/study/sessions/${sessionId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch study session");
  }

  return response.json();
}

/**
 * Estimate processing requirements for a file
 */
export async function estimateProcessingRequirements(
  file: File,
  options: ProcessingOptions = {}
): Promise<{
  estimatedTime: number;
  chunksRequired: number;
  complexity: "low" | "medium" | "high";
  recommendChunking: boolean;
  fileSize: number;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      const estimate = estimateProcessingTime(text, options);

      resolve({
        estimatedTime: estimate.estimatedTimeSeconds,
        chunksRequired: estimate.chunksRequired,
        complexity: estimate.complexity,
        recommendChunking: text.length > 4000 || estimate.chunksRequired > 1,
        fileSize: file.size,
      });
    };
    reader.readAsText(file);
  });
}
