export type LearningPreference = "Visual" | "Auditory" | "Reading" | "Writing";
export type DegreeType = "School" | "College" | "University";

export interface User {
  uid: string;
  email: string;
  name: string;
  degreeType: DegreeType;
  learningPreferences: LearningPreference[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  type: "MCQ" | "TrueFalse" | "ShortAnswer";
}

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  accuracy: number;
  date: Date;
  weakPoints: string[];
}

export interface ContentInput {
  type: "PDF" | "YouTube" | "Website" | "Text";
  content: string | File;
}

export interface AuthUser {
  uid: string;
  email: string | null;
}
