import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (answer: string) => void;
  onGotoQuestion?: (i: number) => void;
}

const QuestionCard: React.FC<Props> = ({ question, index, total, onAnswer, onGotoQuestion }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setSelected(null);
    setAttempt(1);
    setShowModal(false);
    setShowCorrect(false);
    setShowRetry(false);
    setIsAnswered(false);
  }, [question]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelected(answer);
    setIsAnswered(true);
    const isCorrect =
      typeof answer === 'string' &&
      typeof question.correctAnswer === 'string' &&
      answer === question.correctAnswer;
    if (isCorrect) {
      setShowCorrect(true);
    } else {
      if (attempt === 1) {
        setShowRetry(true);
        setAttempt(2);
        setIsAnswered(false);
      } else {
        setShowModal(true);
      }
    }
  };

  const handleCloseCorrect = () => {
    setShowCorrect(false);
    setSelected(null);
    setAttempt(1);
    setIsAnswered(false);
    setShowInfo(true);
  };

  const handleCloseRetry = () => {
    setShowRetry(false);
    setSelected(null);
    setIsAnswered(false);
  };

  const handleCloseWrong = () => {
    setShowModal(false);
    setSelected(null);
    setAttempt(1);
    setIsAnswered(false);
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    if (showCorrect) {
      onAnswer(question.correctAnswer);
    } else {
      onAnswer('');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-2xl mx-auto w-full">
      {/* Progress bar */}
      <div className="flex justify-center mb-6 gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`h-6 w-6 rounded-full transition-all duration-200 flex items-center justify-center p-0 border-none focus:outline-none
              ${i === index ? 'bg-pink-500 scale-125 shadow-lg' : 'bg-pink-200 hover:bg-pink-300'}
            `}
            style={{ minWidth: 24, minHeight: 24 }}
            aria-label={`Vai alla domanda ${i + 1}`}
            onClick={() => onGotoQuestion && onGotoQuestion(i)}
            disabled={i === index}
          >
            {/* Empty for visual dot */}
          </button>
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
            disabled={showCorrect || showModal || showRetry}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium 
              ${selected === option
                ? 'bg-pink-400 text-white border-pink-500'
                : 'bg-pink-100 text-gray-700 border-pink-100 hover:border-pink-300 hover:bg-pink-200'}
              ${selected && selected !== option ? 'opacity-60' : ''} focus:ring-0 focus:border-transparent`}
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
            <ExclamationCircleIcon className="h-16 w-16 text-pink-500 mb-4" />
            <Dialog.Title className="text-2xl font-bold text-pink-600 mb-2">Riprova!</Dialog.Title>
            <p className="mb-4 text-gray-700">Hai ancora un tentativo per rispondere correttamente.</p>
            <button
              onClick={handleCloseRetry}
              className="mt-2 w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-lg"
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

      {/* Popup informativo esercizio */}
      <Dialog open={showInfo} onClose={handleCloseInfo} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-xl rounded-2xl bg-pink-50 p-8 shadow-2xl flex flex-col items-center max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-pink-50">
            <Dialog.Title className="text-2xl font-bold text-pink-600 mb-4 text-center">
              {extractExerciseName(question.exercise_description) || "Informazioni sull'esercizio"}
            </Dialog.Title>
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line mb-6 w-full text-left">
              {renderExerciseDescription(question.exercise_description)}
            </div>
            <button
              onClick={handleCloseInfo}
              className="mt-2 w-full bg-gradient-to-r from-pink-400 to-pink-300 text-white font-semibold py-3 rounded-xl hover:from-pink-500 hover:to-pink-400 transition-all duration-200 shadow-lg"
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

function extractExerciseName(desc?: string) {
  if (!desc) return '';
  const match = desc.match(/'([^']+)'/);
  return match ? match[1] : '';
}

function renderExerciseDescription(desc?: string) {
  if (!desc) return null;
  // Split in frasi su punto e a capo
  const lines = desc.split(/\.(\s+|$)/).map(l => l.trim()).filter(Boolean);
  const bullets: { title: string; text: string }[] = [];
  let i = 0;
  // Se la prima frase è introduttiva (es: L'esercizio ...), la mostro come intro
  let intro = '';
  if (lines[0] && lines[0].toLowerCase().startsWith("l'esercizio")) {
    intro = lines[0] + '.';
    i = 1;
  }
  while (i < lines.length) {
    const title = lines[i];
    const text = lines[i + 1] || '';
    // Se la riga successiva non è un titolo, accorpa
    if (text && !/^([A-Z]|Cue|Gli|I |Si |L'|Le )/.test(text)) {
      bullets.push({ title, text });
      i += 2;
    } else {
      // Altrimenti solo titolo
      bullets.push({ title, text: '' });
      i += 1;
    }
  }
  return (
    <div>
      {intro && <div className="mb-2 text-gray-800">{intro}</div>}
      <ul className="list-disc pl-6 space-y-2">
        {bullets.map((b, idx) => (
          <li key={idx}>
            {b.title}{b.text && ':'} <span className="font-bold">{b.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 