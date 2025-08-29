/**
 * Document Processing Utilities
 * Handles large document extraction with chunking and parallel processing
 */

export interface DocumentChunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  wordCount: number;
  hasEquations?: boolean;
  hasChemical?: boolean;
  hasSupersub?: boolean;
}

export interface QuizQuestion {
  question: string;
  question_type:
    | "multiple_choice"
    | "short_answer"
    | "true_false"
    | "fill_in_blank";
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  topic?: string;
}

export interface ChunkResult {
  chunkIndex: number;
  result: {
    summary?: string;
    explanation?: string;
    quiz?: QuizQuestion[];
    extractedText?: string;
  };
  success: boolean;
  error?: string;
}

export interface ProcessingOptions {
  chunkSize?: number;
  overlapSize?: number;
  maxConcurrency?: number;
  preserveEquations?: boolean;
  enableMathDetection?: boolean;
}

export interface ChunkedProcessingResult {
  chunks: DocumentChunk[];
  totalChunks: number;
  totalCharacters: number;
  processingTime: number;
  summary?: string;
  explanation?: string;
  quiz?: QuizQuestion[];
  extractedText: string;
}

const DEFAULT_OPTIONS: Required<ProcessingOptions> = {
  chunkSize: 4000, // Characters per chunk
  overlapSize: 200, // Character overlap between chunks
  maxConcurrency: 3, // Maximum parallel requests
  preserveEquations: true,
  enableMathDetection: true,
};

/**
 * Split large text into manageable chunks while preserving context
 */
export function createTextChunks(
  text: string,
  options: ProcessingOptions = {}
): DocumentChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const chunks: DocumentChunk[] = [];

  if (text.length <= opts.chunkSize) {
    return [
      {
        id: "chunk-0",
        content: text,
        startIndex: 0,
        endIndex: text.length,
        wordCount: text.split(/\s+/).length,
        ...detectMathContent(text, opts.enableMathDetection),
      },
    ];
  }

  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + opts.chunkSize, text.length);

    // Find a good breaking point (end of sentence or paragraph)
    let actualEndIndex = endIndex;
    if (endIndex < text.length) {
      const breakPoints = [
        text.lastIndexOf("\n\n", endIndex),
        text.lastIndexOf("\n", endIndex),
        text.lastIndexOf(". ", endIndex),
        text.lastIndexOf("! ", endIndex),
        text.lastIndexOf("? ", endIndex),
      ];

      const bestBreakPoint = breakPoints
        .filter((bp) => bp > startIndex + opts.chunkSize * 0.7)
        .sort((a, b) => b - a)[0];

      if (bestBreakPoint && bestBreakPoint > startIndex) {
        actualEndIndex = bestBreakPoint + 1;
      }
    }

    // Include overlap from previous chunk (except for first chunk)
    const chunkStart = Math.max(
      0,
      startIndex - (chunkIndex > 0 ? opts.overlapSize : 0)
    );
    const chunkContent = text.slice(chunkStart, actualEndIndex);

    chunks.push({
      id: `chunk-${chunkIndex}`,
      content: chunkContent,
      startIndex: chunkStart,
      endIndex: actualEndIndex,
      wordCount: chunkContent.split(/\s+/).length,
      ...detectMathContent(chunkContent, opts.enableMathDetection),
    });

    startIndex = actualEndIndex;
    chunkIndex++;
  }

  return chunks;
}

/**
 * Detect mathematical content in text
 */
function detectMathContent(text: string, enabled: boolean = true) {
  if (!enabled) {
    return { hasEquations: false, hasChemical: false, hasSupersub: false };
  }

  const hasEquations =
    /\$.*\$|\\\w+|\\frac|\\sqrt|\\sum|\\int|=|\+|-|\*|\/|\^|\(|\)|∑|∫|π|α|β|γ|δ|θ|λ|μ|σ|φ|ψ|ω/i.test(
      text
    );
  const hasChemical =
    /[A-Z][a-z]?[0-9]*|H2O|CO2|NaCl|CH4|O2|N2|Ca\(OH\)2|H2SO4|HCl|NaOH/i.test(
      text
    );
  const hasSupersub =
    /\^[a-zA-Z0-9]+|\_{1,2}[a-zA-Z0-9]+|[0-9]+\^[0-9]+|[a-zA-Z]+_[0-9]+|x²|x³|m²|cm³|kg\/m³/i.test(
      text
    );

  return { hasEquations, hasChemical, hasSupersub };
}

/**
 * Process document chunks in parallel with rate limiting
 */
export async function processDocumentChunks(
  chunks: DocumentChunk[],
  processingFunction: (chunk: DocumentChunk) => Promise<ChunkResult['result']>,
  options: ProcessingOptions = {}
): Promise<ChunkResult[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const results: ChunkResult[] = [];

  // Process chunks in batches to avoid overwhelming the API
  for (let i = 0; i < chunks.length; i += opts.maxConcurrency) {
    const batch = chunks.slice(i, i + opts.maxConcurrency);

    const batchPromises = batch.map(async (chunk, index) => {
      try {
        const result = await processingFunction(chunk);
        return { chunkIndex: i + index, result, success: true };
      } catch (error) {
        console.error(`Error processing chunk ${chunk.id}:`, error);
        return { 
          chunkIndex: i + index, 
          result: { extractedText: chunk.content }, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);

    // Add delay between batches to respect rate limits
    if (i + opts.maxConcurrency < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Store results in order
    batchResults.forEach(({ chunkIndex, result, success }) => {
      results[chunkIndex] = { chunkIndex, result, success };
    });
  }

  return results;
}

/**
 * Merge chunk results into a cohesive document
 */
export function mergeChunkResults(
  chunks: DocumentChunk[],
  chunkResults: ChunkResult[]
): ChunkedProcessingResult {
  const startTime = Date.now();

  // Combine extracted text from all chunks
  const extractedText = chunks.map((chunk) => chunk.content).join("\n\n");

  // Merge summaries
  const summaries = chunkResults
    .filter((result) => result?.result?.summary)
    .map((result) => result.result.summary!);

  const summary =
    summaries.length > 0
      ? `## Document Summary\n\n${summaries.join("\n\n")}`
      : undefined;

  // Merge explanations
  const explanations = chunkResults
    .filter((result) => result?.result?.explanation)
    .map((result) => result.result.explanation!);

  const explanation =
    explanations.length > 0
      ? `## Detailed Explanation\n\n${explanations.join("\n\n")}`
      : undefined;

  // Merge quiz questions
  const allQuizzes = chunkResults
    .filter((result) => result?.result?.quiz)
    .flatMap((result) => result.result.quiz!);

  // Remove duplicates and limit total questions
  const uniqueQuizzes = allQuizzes
    .filter(
      (quiz, index, self) =>
        index === self.findIndex((q) => q.question === quiz.question)
    )
    .slice(0, 15); // Limit to 15 questions max

  const processingTime = Date.now() - startTime;

  return {
    chunks,
    totalChunks: chunks.length,
    totalCharacters: extractedText.length,
    processingTime,
    summary,
    explanation,
    quiz: uniqueQuizzes,
    extractedText,
  };
}

/**
 * Smart text preprocessing for better OCR and AI processing
 */
export function preprocessDocumentText(text: string): string {
  let processed = text;

  // Normalize whitespace
  processed = processed.replace(/\s+/g, " ").trim();

  // Fix common OCR errors
  processed = processed
    .replace(/(?:^|\s)(\d+)(?:\s*[oO](?:\s*(?=\d)|\s+(?=\w)))/g, "$1 0 ") // Fix 'o' as zero in numbers
    .replace(/(?:^|\s)([Il])(?=\d)/g, " 1") // Fix 'I' or 'l' as 1 before numbers
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase
    .replace(/(\d)([A-Za-z])/g, "$1 $2") // Add space between numbers and letters
    .replace(/([A-Za-z])(\d)/g, "$1 $2"); // Add space between letters and numbers

  // Preserve mathematical expressions
  processed = processed
    .replace(/(\d)\s*\*\s*(\d)/g, "$1 × $2") // Replace * with ×
    .replace(/(\d)\s*\/\s*(\d)/g, "$1 ÷ $2") // Replace / with ÷
    .replace(/\s*=\s*/g, " = ") // Normalize equals signs
    .replace(/\s*\+\s*/g, " + ") // Normalize plus signs
    .replace(/\s*-\s*/g, " - "); // Normalize minus signs

  // Fix common punctuation issues
  processed = processed
    .replace(/\s*\.\s*/g, ". ") // Normalize periods
    .replace(/\s*,\s*/g, ", ") // Normalize commas
    .replace(/\s*;\s*/g, "; ") // Normalize semicolons
    .replace(/\s*:\s*/g, ": "); // Normalize colons

  return processed;
}

/**
 * Estimate processing time based on document length and complexity
 */
export function estimateProcessingTime(
  text: string,
  options: ProcessingOptions = {}
): {
  estimatedTimeSeconds: number;
  chunksRequired: number;
  complexity: "low" | "medium" | "high";
} {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const chunks = createTextChunks(text, opts);
  const chunksRequired = chunks.length;

  // Base processing time per chunk (seconds)
  const baseTimePerChunk = 3;

  // Complexity factors
  const { hasEquations, hasChemical, hasSupersub } = detectMathContent(text);
  let complexityMultiplier = 1;
  let complexity: "low" | "medium" | "high" = "low";

  if (hasEquations || hasChemical || hasSupersub) {
    complexityMultiplier = 1.5;
    complexity = "medium";
  }

  if (text.length > 10000 || chunksRequired > 5) {
    complexityMultiplier *= 1.3;
    complexity = "high";
  }

  const estimatedTimeSeconds = Math.ceil(
    (chunksRequired * baseTimePerChunk * complexityMultiplier) /
      opts.maxConcurrency
  );

  return {
    estimatedTimeSeconds,
    chunksRequired,
    complexity,
  };
}

/**
 * Progress tracking for chunk processing
 */
export class ChunkProcessor {
  private totalChunks: number;
  private processedChunks: number = 0;
  private onProgress?: (progress: number, chunkIndex: number) => void;

  constructor(
    totalChunks: number,
    onProgress?: (progress: number, chunkIndex: number) => void
  ) {
    this.totalChunks = totalChunks;
    this.onProgress = onProgress;
  }

  reportProgress(chunkIndex: number) {
    this.processedChunks++;
    const progress = (this.processedChunks / this.totalChunks) * 100;
    this.onProgress?.(progress, chunkIndex);
  }

  getProgress(): number {
    return (this.processedChunks / this.totalChunks) * 100;
  }
}
