import React, { useEffect, useState } from 'react';
import type { Question } from '../types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, ChartTitle);

interface Props {
  questions: Question[];
  answers: { [key: number]: string };
  onRestart: () => void;
  onBack?: () => void;
}

const Summary: React.FC<Props> = ({ questions, answers, onRestart, onBack }) => {
  const correctAnswers = questions.filter((q, idx) =>
    typeof answers[idx] === 'string' &&
    typeof q.correctAnswer === 'string' &&
    answers[idx] === q.correctAnswer
  ).length;
  const wrongAnswers = questions.length - correctAnswers;
  const wrongList = questions
    .map((q, idx) => ({
      ...q,
      userAnswer: answers[idx],
      index: idx
    }))
    .filter(q => q.userAnswer?.toLowerCase().trim() !== q.correctAnswer.toLowerCase().trim());

  // Persist test history in localStorage
  const [history, setHistory] = useState<{ correct: number; wrong: number; date: string }[]>([]);

  useEffect(() => {
    // Load history
    const prev = localStorage.getItem('quizHistory');
    let hist = prev ? JSON.parse(prev) : [];
    // Add current test if not already present (avoid double add on rerender)
    if (!hist.length || hist[hist.length - 1]?.date !== new Date().toLocaleString()) {
      hist = [
        ...hist,
        { correct: correctAnswers, wrong: wrongAnswers, date: new Date().toLocaleString() }
      ];
      localStorage.setItem('quizHistory', JSON.stringify(hist));
    }
    setHistory(hist);
  }, []);

  // Doughnut chart data
  const doughnutData = {
    labels: ['Corrette', 'Sbagliate'],
    datasets: [
      {
        data: [correctAnswers, wrongAnswers],
        backgroundColor: ['#ec4899', '#f87171'],
        borderWidth: 2,
      },
    ],
  };

  // Line chart data (trend)
  const lineData = {
    labels: history.map((h, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: 'Corrette',
        data: history.map(h => h.correct),
        borderColor: '#ec4899',
        backgroundColor: '#fbcfe8',
        tension: 0.3,
      },
      {
        label: 'Sbagliate',
        data: history.map(h => h.wrong),
        borderColor: '#f87171',
        backgroundColor: '#fee2e2',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 py-8">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-16 flex flex-col items-center relative">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-2 top-2 sm:left-6 sm:top-6 bg-pink-100 hover:bg-pink-200 text-pink-500 font-bold px-2 py-1 sm:px-4 sm:py-2 rounded-xl shadow focus:outline-none focus:ring-0 text-sm sm:text-base"
          >
            &#8592; Back
          </button>
        )}
        <h2 className="text-3xl font-extrabold mb-8 text-pink-500 text-center drop-shadow-lg">Risultato Finale</h2>
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
        {/* Grafici */}
        <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center mb-10">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-pink-500 mb-2">Distribuzione risposte</h4>
            <Doughnut data={doughnutData} />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-pink-500 mb-2">Andamento dei test</h4>
            <Line data={lineData} />
          </div>
        </div>
        <div className="mb-10 w-full">
          <p className="text-2xl font-bold text-pink-600 text-center mb-2">Brava Rebi continua a studiare così!</p>
        </div>
        {/* Accordion for wrong questions */}
        {wrongList.length > 0 && (
          <details className="w-full mb-8 bg-red-50 rounded-xl shadow-sm">
            <summary className="cursor-pointer px-4 py-3 text-red-600 font-semibold text-lg select-none rounded-xl hover:bg-red-100 transition">Domande sbagliate ({wrongList.length})</summary>
            <ul className="grid gap-6 md:grid-cols-2 p-4">
              {wrongList.map((q, i) => (
                <li key={i} className="bg-red-100 border-l-4 border-red-400 p-4 rounded-xl shadow-sm flex flex-col gap-2">
                  <div className="font-semibold text-gray-800">{q.index + 1}. {q.question}</div>
                  <div className="text-sm text-gray-700">Tua risposta: <span className="text-red-600">{q.userAnswer}</span></div>
                  <div className="text-sm text-green-700">Risposta corretta: <span className="font-semibold">{q.correctAnswer}</span></div>
                  <div className="text-xs text-gray-500">Spiegazione: {q.explanation}</div>
                </li>
              ))}
            </ul>
          </details>
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