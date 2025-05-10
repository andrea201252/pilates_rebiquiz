import React, { useState } from 'react';
import type { Question } from '../types';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<Props> = ({ question, index, total, onAnswer }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(1);

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    const isCorrect = answer === question.correctAnswer;
    if (isCorrect) {
      setShowCorrect(true);
    } else {
      if (attempt === 1) {
        setShowRetry(true);
        setAttempt(2);
      } else {
        setShowModal(true);
      }
    }
  };

  const handleCloseCorrect = () => {
    setShowCorrect(false);
    setSelected(null);
    setAttempt(1);
    onAnswer(question.correctAnswer);
  };

  const handleCloseRetry = () => {
    setShowRetry(false);
    setSelected(null);
  };

  const handleCloseWrong = () => {
    setShowModal(false);
    setSelected(null);
    setAttempt(1);
    onAnswer(question.correctAnswer);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-2xl mx-auto w-full">
      {/* Progress bar */}
      <div className="flex justify-center mb-6 gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-all duration-200 
              ${i === index ? 'bg-red-500 scale-125 shadow-lg' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
      <div className="mb-6">
        <span className="text-sm text-gray-500 font-medium">Domanda {index + 1} di {total}</span>
        <h2 className="text-2xl font-bold mt-2 text-gray-800">{question.question}</h2>
      </div>

      <div className="space-y-4">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            disabled={!!selected}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium 
              ${selected === option
                ? (option === question.correctAnswer
                    ? 'bg-red-400 text-white border-red-500'
                    : 'bg-red-400 text-white border-red-500')
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50'}
              ${selected && selected !== option ? 'opacity-60' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Popup risposta corretta */}
      <Dialog open={showCorrect} onClose={handleCloseCorrect} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-2xl flex flex-col items-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
            <Dialog.Title className="text-2xl font-bold text-green-600 mb-2">Risposta corretta!</Dialog.Title>
            <button
              onClick={handleCloseCorrect}
              className="mt-6 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg"
            >
              Prosegui
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Popup riprova */}
      <Dialog open={showRetry} onClose={handleCloseRetry} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-2xl flex flex-col items-center">
            <ExclamationCircleIcon className="h-16 w-16 text-yellow-500 mb-4" />
            <Dialog.Title className="text-2xl font-bold text-yellow-600 mb-2">Riprova!</Dialog.Title>
            <p className="mb-4 text-gray-700">Hai ancora un tentativo per rispondere correttamente.</p>
            <button
              onClick={handleCloseRetry}
              className="mt-2 w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold py-3 rounded-xl hover:from-yellow-500 hover:to-pink-500 transition-all duration-200 shadow-lg"
            >
              Ok
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Popup risposta sbagliata dopo due tentativi */}
      <Dialog
        open={showModal}
        onClose={handleCloseWrong}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex justify-between items-start">
              <Dialog.Title className="text-xl font-bold text-red-600">
                Risposta non corretta
              </Dialog.Title>
              <button
                onClick={handleCloseWrong}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Risposta corretta:</p>
                <p className="mt-1 text-lg font-semibold text-gray-800">{question.correctAnswer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Spiegazione:</p>
                <p className="mt-1 text-gray-700 leading-relaxed">{question.explanation}</p>
              </div>
            </div>
            <button
              onClick={handleCloseWrong}
              className="mt-8 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg"
            >
              Prosegui
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default QuestionCard; 