export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizAnswer {
  questionIndex: number;
  isCorrect: boolean;
  userAnswer: string;
} 