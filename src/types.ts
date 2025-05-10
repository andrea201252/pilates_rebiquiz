export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizAnswer {
  questionIndex: number;
  isCorrect: boolean;
  userAnswer: string;
} 