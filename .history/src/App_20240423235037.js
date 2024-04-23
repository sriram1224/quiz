import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// Components
const QuizStart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        setQuestions(response.data.results);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Link to="/quiz">Start Quiz</Link>
      )}
    </div>
  );
};

const QuizQuestion = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentIndex].correct_answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentIndex(currentIndex + 1);
    }, 5000);
  };

  const handleSkip = () => {
    setSelectedAnswer(null);
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= questions.length) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your final score: {score} / {questions.length}</p>
        <Link to="/">Restart Quiz</Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answerOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(
    () => Math.random() - 0.5
  );

  return (
    <div>
      <h2>Question {currentIndex + 1}</h2>
      <p>{currentQuestion.question}</p>
      {answerOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => handleAnswerSelect(option)}
          disabled={selectedAnswer !== null}
        >
          {option}
        </button>
      ))}
      <button onClick={handleSkip}>Skip</button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<QuizStart />} />
        <Route path="/quiz" element={<QuizQuestion />} />
      </Routes>
    </Router>
  );
};

export default App;