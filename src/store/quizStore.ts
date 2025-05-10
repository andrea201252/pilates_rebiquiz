import { create } from 'zustand';
import type { Question } from '../types';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [key: number]: string };
  showSummary: boolean;
  showWelcome: boolean;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionIndex: number, answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  setShowSummary: (show: boolean) => void;
  setShowWelcome: (show: boolean) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  showSummary: false,
  showWelcome: true,
  setQuestions: (questions) => set({ questions }),
  setAnswer: (questionIndex, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionIndex]: answer },
    })),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
      showSummary: state.currentQuestionIndex + 1 >= state.questions.length,
    })),
  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      answers: {},
      showSummary: false,
      showWelcome: true,
    }),
  setShowSummary: (show) => set({ showSummary: show }),
  setShowWelcome: (show) => set({ showWelcome: show }),
})); 