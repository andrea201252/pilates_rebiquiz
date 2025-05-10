import { useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import Summary from './components/Summary';
import { useQuizStore } from './store/quizStore';

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
    setShowWelcome
  } = useQuizStore();

  useEffect(() => {
    if (!showWelcome) {
      fetch('/questions.json')
        .then(res => res.json())
        .then(data => {
          const shuffled = data.questions
            .sort(() => 0.5 - Math.random())
            .slice(0, 20);
          setQuestions(shuffled);
        })
        .catch(error => {
          console.error('Error loading questions:', error);
        });
    }
  }, [showWelcome]);

  const handleAnswer = (answer: string) => {
    setAnswer(currentQuestionIndex, answer);
    
    // Avanza solo se la risposta è corretta
    if (questions[currentQuestionIndex].correctAnswer === answer) {
      useQuizStore.getState().nextQuestion();
    } else {
      // Se sbagliato, la modale viene gestita da QuestionCard
      // e la domanda avanza solo quando si chiude la modale
    }
  };

  const handleRestart = () => {
    resetQuiz();
    const shuffled = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, 20);
    setQuestions(shuffled);
    setShowWelcome(true);
  };

  if (showWelcome) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[url('/pilates-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
        <div className="relative z-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl px-4 sm:px-12 py-10 sm:py-16 flex flex-col items-center max-w-2xl w-full mx-auto">
          <h1 className="text-4xl font-extrabold mb-6 text-red-600 text-center drop-shadow-lg">
            Benvenuta Rebecca!<br/>
            <span className="text-xl font-semibold text-rose-500">Questa è la tua app per studiare Pilates</span>
          </h1>
          <p className="mb-10 text-center text-gray-600 text-sm">
            Designed by gonne
          </p>
          <button
            className="bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white font-bold px-10 py-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 text-xl"
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
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100">
        <Summary questions={questions} answers={answers} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 py-8">
      {questions.length > 0 && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          index={currentQuestionIndex}
          total={questions.length}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}

export default App;
