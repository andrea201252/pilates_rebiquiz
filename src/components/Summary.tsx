import React from 'react';
import type { Question } from '../types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Props {
  questions: Question[];
  answers: { [key: number]: string };
  onRestart: () => void;
}

const Summary: React.FC<Props> = ({ questions, answers, onRestart }) => {
  const correctAnswers = questions.filter((q, idx) => answers[idx]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()).length;
  const wrongAnswers = questions.length - correctAnswers;
  const wrongList = questions
    .map((q, idx) => ({
      ...q,
      userAnswer: answers[idx],
      index: idx
    }))
    .filter(q => q.userAnswer?.toLowerCase().trim() !== q.correctAnswer.toLowerCase().trim());

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 py-8">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-16 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-8 text-red-600 text-center drop-shadow-lg">Risultato Finale</h2>
        <div className="flex flex-col sm:flex-row gap-8 w-full justify-center mb-10">
          <div className="flex-1 bg-green-50 rounded-2xl p-6 flex flex-col items-center shadow">
            <CheckCircleIcon className="h-10 w-10 text-green-500 mb-2" />
            <div className="text-2xl font-bold text-green-700">{correctAnswers}</div>
            <div className="text-gray-700 font-medium">Risposte corrette</div>
          </div>
          <div className="flex-1 bg-red-50 rounded-2xl p-6 flex flex-col items-center shadow">
            <XCircleIcon className="h-10 w-10 text-red-400 mb-2" />
            <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
            <div className="text-gray-700 font-medium">Risposte sbagliate</div>
          </div>
        </div>
        <div className="mb-10 w-full">
          <p className="text-2xl font-bold text-pink-600 text-center mb-2">Brava Rebi continua a studiare così!</p>
        </div>
        {wrongList.length > 0 && (
          <div className="w-full mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Domande sbagliate</h3>
            <ul className="grid gap-6 md:grid-cols-2">
              {wrongList.map((q, i) => (
                <li key={i} className="bg-red-100 border-l-4 border-red-400 p-4 rounded-xl shadow-sm flex flex-col gap-2">
                  <div className="font-semibold text-gray-800">{q.index + 1}. {q.question}</div>
                  <div className="text-sm text-gray-700">Tua risposta: <span className="text-red-600">{q.userAnswer}</span></div>
                  <div className="text-sm text-green-700">Risposta corretta: <span className="font-semibold">{q.correctAnswer}</span></div>
                  <div className="text-xs text-gray-500">Spiegazione: {q.explanation}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:from-pink-600 hover:to-red-600 transition-all mb-8 mt-4"
        >
          Rifai il test
        </button>
        <div className="mt-4 text-gray-500 text-base italic text-center">shichi korobi ya oki</div>
      </div>
    </div>
  );
};

export default Summary; 