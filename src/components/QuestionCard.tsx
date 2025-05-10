import React, { useState } from 'react';
import type { Question } from '../types';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

const QuestionCard: React.FC<Props> = ({ question, index, total, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [openAnswer, setOpenAnswer] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const userAnswer = question.options ? selectedOption : openAnswer;
    const correct = userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();
    
    setIsCorrect(correct);
    if (!correct) {
      setShowModal(true);
    } else {
      onAnswer(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <span className="text-sm text-gray-500">Domanda {index + 1} di {total}</span>
        <h2 className="text-xl font-semibold mt-2">{question.question}</h2>
      </div>

      {question.options ? (
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Scrivi la tua risposta..."
        />
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Conferma risposta
      </button>

      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false);
          onAnswer(false);
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
                  onAnswer(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Risposta corretta:</p>
              <p className="mt-1 font-medium">{question.answer}</p>
              
              <p className="mt-4 text-sm text-gray-500">Spiegazione:</p>
              <p className="mt-1">{question.explanation}</p>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                onAnswer(false);
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