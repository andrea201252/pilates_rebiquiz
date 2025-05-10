import React from 'react';
import type { Question } from '../types';

interface Props {
  questions: Question[];
  answers: Record<number, boolean>;
  onRestart: () => void;
}

const Summary: React.FC<Props> = ({ questions, answers, onRestart }) => {
  const correctAnswers = Object.values(answers).filter(Boolean).length;
  const percentage = Math.round((correctAnswers / questions.length) * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6">Risultato Finale</h2>
      
      <div className="space-y-4">
        <p className="text-lg">
          Hai risposto correttamente a <span className="font-semibold text-blue-600">{correctAnswers}</span> su{' '}
          <span className="font-semibold">{questions.length}</span> domande
        </p>
        
        <div className="text-4xl font-bold text-blue-600">
          {percentage}%
        </div>

        <div className="mt-8">
          <button
            onClick={onRestart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Rifai il test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary; 