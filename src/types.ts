export interface Question {
  id?: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  exercise_description?: string;
}

export interface QuizAnswer {
  questionIndex: number;
  isCorrect: boolean;
  userAnswer: string;
} 