export interface Question {
  question: string;
  options: string[] | null;
  answer: string;
  explanation: string;
}

export interface QuizAnswer {
  questionIndex: number;
  isCorrect: boolean;
  userAnswer: string;
} 