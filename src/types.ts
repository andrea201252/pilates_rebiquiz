export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizAnswer {
  questionIndex: number;
  isCorrect: boolean;
  userAnswer: string;
} 