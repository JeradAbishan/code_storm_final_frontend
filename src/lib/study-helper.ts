/**
 * Study Helper API Service
 * API calls for study helper functionality
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const API_V1_STR = "/api/v1";

export interface StudySessionRequest {
  file: File;
  generate_summary?: boolean;
  generate_explanation?: boolean;
  generate_quiz?: boolean;
  quiz_question_count?: number;
  quiz_difficulty?: "easy" | "medium" | "hard";
  explanation_level?: "beginner" | "intermediate" | "advanced";
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

export interface StudySessionResult {
  session_id: string;
  user_id: string;
  result: {
    success: boolean;
    processing_time_seconds: number;
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
      details: Record<string, unknown>; // API response can contain any shape
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
    };
    error_message?: string;
    warnings: string[];
  };
  created_at: string;
  status: "completed" | "failed" | "processing";
}

export interface StudySessionListItem {
  session_id: string;
  created_at: string;
  status: "completed" | "failed" | "processing";
  file_name: string;
  content_preview: string;
}

export interface StudyHelperConfig {
  max_file_size_mb: number;
  allowed_file_types: string[];
  supported_image_formats: string[];
  default_quiz_questions: number;
  max_quiz_questions: number;
  quality_threshold: number;
  min_text_length: number;
  features: {
    summary_generation: boolean;
    explanation_generation: boolean;
    quiz_generation: boolean;
    quality_assessment: boolean;
    content_classification: boolean;
    image_preprocessing: boolean;
  };
}

class StudyHelperApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errorCode?: string
  ) {
    super(message);
    this.name = "StudyHelperApiError";
  }
}

class StudyHelperService {
  private baseUrl = `${API_BASE_URL}${API_V1_STR}`;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      credentials: "include", // Important for cookies
      ...options,
    };

    // Don't set Content-Type for FormData, let browser set it
    if (!(options.body instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new StudyHelperApiError(
          response.status,
          errorData.detail || "An error occurred",
          errorData.error_code
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof StudyHelperApiError) {
        throw error;
      }
      throw new StudyHelperApiError(500, "Network error");
    }
  }

  // Upload and process study image
  async uploadStudyImage(
    data: StudySessionRequest
  ): Promise<StudySessionResult> {
    const formData = new FormData();
    formData.append("file", data.file);

    if (data.generate_summary !== undefined) {
      formData.append("generate_summary", data.generate_summary.toString());
    }
    if (data.generate_explanation !== undefined) {
      formData.append(
        "generate_explanation",
        data.generate_explanation.toString()
      );
    }
    if (data.generate_quiz !== undefined) {
      formData.append("generate_quiz", data.generate_quiz.toString());
    }
    if (data.quiz_question_count !== undefined) {
      formData.append(
        "quiz_question_count",
        data.quiz_question_count.toString()
      );
    }
    if (data.quiz_difficulty) {
      formData.append("quiz_difficulty", data.quiz_difficulty);
    }
    if (data.explanation_level) {
      formData.append("explanation_level", data.explanation_level);
    }

    return this.request<StudySessionResult>("/study/upload", {
      method: "POST",
      body: formData,
    });
  }

  // Get study session by ID
  async getStudySession(sessionId: string): Promise<StudySessionResult> {
    return this.request<StudySessionResult>(`/study/session/${sessionId}`);
  }

  // List user's study sessions
  async listStudySessions(limit: number = 20): Promise<{
    sessions: StudySessionListItem[];
    total: number;
    limit: number;
  }> {
    return this.request<{
      sessions: StudySessionListItem[];
      total: number;
      limit: number;
    }>(`/study/sessions?limit=${limit}`);
  }

  // Delete study session
  async deleteStudySession(sessionId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/study/session/${sessionId}`, {
      method: "DELETE",
    });
  }

  // Get study helper configuration
  async getConfig(): Promise<StudyHelperConfig> {
    return this.request<StudyHelperConfig>("/study/config");
  }

  // Check study helper health
  async checkHealth(): Promise<{
    status: string;
    services: Record<string, unknown>; // API response
    timestamp: string;
  }> {
    return this.request<{
      status: string;
      services: Record<string, unknown>; // API response
      timestamp: string;
    }>("/study/health");
  }
}

export const studyHelperService = new StudyHelperService();
export { StudyHelperApiError };
