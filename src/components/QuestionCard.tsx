import React, { useState } from 'react';
import type { Question } from '../types';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<Props> = ({ question, index, total, onAnswer }) => {
  const [showModal, setShowModal] = useState(false);

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === question.correctAnswer;
    
    if (!isCorrect) {
      setShowModal(true);
    } else {
      onAnswer(answer);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <span className="text-sm text-gray-500">Domanda {index + 1} di {total}</span>
        <h2 className="text-xl font-semibold mt-2">{question.question}</h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>

      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false);
          onAnswer(question.correctAnswer);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <div className="flex justify-between items-start">
              <Dialog.Title className="text-lg font-medium">
                Risposta non corretta
              </Dialog.Title>
              <button
                onClick={() => {
                  setShowModal(false);
                  onAnswer(question.correctAnswer);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Risposta corretta:</p>
              <p className="mt-1 font-medium">{question.correctAnswer}</p>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                onAnswer(question.correctAnswer);
              }}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
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