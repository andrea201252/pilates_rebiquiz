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
      // Load questions from localStorage or fetch from JSON file
      const savedQuestions = localStorage.getItem('questions');
      if (savedQuestions) {
        const parsedQuestions = JSON.parse(savedQuestions);
        const shuffled = parsedQuestions
          .sort(() => 0.5 - Math.random())
          .slice(0, 20);
        setQuestions(shuffled);
      } else {
        fetch('/questions.json')
          .then(res => res.json())
          .then(data => {
            const shuffled = data.questions
              .sort(() => 0.5 - Math.random())
              .slice(0, 20);
            setQuestions(shuffled);
            localStorage.setItem('questions', JSON.stringify(data.questions));
          })
          .catch(error => {
            console.error('Error loading questions:', error);
          });
      }
    }
  }, [showWelcome]);

  const handleAnswer = (answer: string) => {
    setAnswer(currentQuestionIndex, answer);
    
    if (currentQuestionIndex + 1 < questions.length) {
      // Passa alla prossima domanda
    } else {
      setShowSummary(true);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100">
        <div className="bg-white/80 shadow-2xl rounded-3xl px-10 py-12 flex flex-col items-center max-w-lg">
          <h1 className="text-3xl font-extrabold mb-6 text-red-600 animate-bounce text-center drop-shadow-lg">
            Benvenuta Rebecca!<br/>
            <span className="text-lg font-semibold text-rose-500">Questa è la tua app per studiare Pilates.</span>
          </h1>
          <p className="mb-8 text-center text-gray-700 text-lg font-medium">
            <span className="italic">Designed by <span className="text-fuchsia-600 font-bold">gonne</span> 👗</span>
          </p>
          <button
            className="bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform text-xl"
            onClick={() => setShowWelcome(false)}
          >
            Inizia il test!
          </button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return <Summary questions={questions} answers={answers} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 py-8">
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
