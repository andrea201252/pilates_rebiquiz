import { create } from 'zustand';
import { Question } from '../types';

interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, boolean>;
  showSummary: boolean;
  setQuestions: (questions: Question[]) => void;
  setCurrentIndex: (index: number) => void;
  addAnswer: (index: number, correct: boolean) => void;
  setShowSummary: (show: boolean) => void;
  resetQuiz: () => void;
}

const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentIndex: 0,
  answers: {},
  showSummary: false,
  setQuestions: (questions) => set({ questions }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  addAnswer: (index, correct) => set((state) => ({
    answers: { ...state.answers, [index]: correct }
  })),
  setShowSummary: (show) => set({ showSummary: show }),
  resetQuiz: () => set({
    currentIndex: 0,
    answers: {},
    showSummary: false
  })
}));

export default useQuizStore; 