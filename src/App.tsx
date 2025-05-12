import { useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import Summary from './components/Summary';
import { useQuizStore } from './store/quizStore';
import type { Question } from './types';

function App() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    showSummary,
    setQuestions,
    setAnswer,
    setShowSummary,
    resetQuiz,
    showWelcome,
    setShowWelcome,
    prevQuestion
  } = useQuizStore();

  useEffect(() => {
    if (!showWelcome) {
      fetch('/questions.json')
        .then(res => res.json())
        .then(data => {
          const questionsArray = Array.isArray(data) ? data : data.questions;
          // Rimuovi domande duplicate per testo
          const uniqueQuestions = Array.from(
            new Map((questionsArray as Question[]).map((q: Question) => [q.question, q])).values()
          ) as Question[];
          // Fisher-Yates shuffle per unicità
          const shuffled = [...uniqueQuestions];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          setQuestions(shuffled.slice(0, 20));
        })
        .catch(error => {
          console.error('Error loading questions:', error);
        });
    }
  }, [showWelcome]);

  const handleAnswer = (answer: string) => {
    setAnswer(currentQuestionIndex, answer);
    if (currentQuestionIndex + 1 < questions.length) {
      useQuizStore.getState().nextQuestion();
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    resetQuiz();
    // Rimuovi domande duplicate per testo anche qui
    const uniqueQuestions = Array.from(
      new Map((questions as Question[]).map((q: Question) => [q.question, q])).values()
    ) as Question[];
    const shuffled = uniqueQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 20);
    setQuestions(shuffled);
    setShowWelcome(true);
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-300">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl flex flex-col items-center w-full max-w-[900px] sm:w-[900px] py-12 px-8 relative">
          {/* Back button (welcome) */}
          <button
            className="absolute left-2 top-2 sm:left-6 sm:top-6 bg-pink-100 text-pink-300 font-bold px-2 py-1 sm:px-4 sm:py-2 rounded-xl shadow cursor-not-allowed opacity-50 text-sm sm:text-base"
            disabled
          >
            &#8592; Back
          </button>
          <h1 className="text-4xl font-extrabold mb-6 text-pink-500 text-center drop-shadow-lg">
            Benvenuta Rebecca!<br/>
            <span className="text-xl font-semibold text-pink-500">Questa è la tua app per studiare Pilates</span>
          </h1>
          <p className="mb-10 text-center text-gray-600 text-sm">
            Designed by Bonzo Enterprise
          </p>
          <button
            className="bg-pink-300 hover:bg-pink-400 text-white font-bold px-10 py-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 text-xl focus:ring-0 focus:border-transparent"
            onClick={() => setShowWelcome(false)}
          >
            Inizia il test!
          </button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-pink-200 to-80%">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl flex flex-col items-center w-full max-w-[900px] sm:w-[900px] py-12 px-8">
          <Summary questions={questions} answers={answers} onRestart={handleRestart} onBack={() => setShowWelcome(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-white py-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl flex flex-col items-center w-full max-w-[900px] sm:w-[900px] py-12 px-8 relative">
        {/* Back button (quiz) */}
        <button
          className="absolute left-2 top-2 sm:left-6 sm:top-6 bg-pink-100 hover:bg-pink-200 text-pink-500 font-bold px-2 py-1 sm:px-4 sm:py-2 rounded-xl shadow focus:outline-none focus:ring-0 text-sm sm:text-base"
          onClick={() => prevQuestion()}
          disabled={currentQuestionIndex === 0}
        >
          &#8592; Back
        </button>
        {questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            total={questions.length}
            onAnswer={handleAnswer}
            onGotoQuestion={(i: number) => useQuizStore.setState({ currentQuestionIndex: i })}
          />
        )}
      </div>
    </div>
  );
}

export default App;
