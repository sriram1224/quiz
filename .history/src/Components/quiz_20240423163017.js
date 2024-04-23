import React, { useState, useEffect, useRef } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10); // Timer for each question (in seconds)
  const [quizEnded, setQuizEnded] = useState(false);

  const timerRef = useRef(null); // Ref for the timer timeout

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=5&type=multiple"
        );
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (currentQuestionIndex < questions.length && timer > 0 && !quizEnded) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => {
        clearTimeout(timerRef.current);
      };
    } else {
      handleNextQuestion();
    }
  }, [timer]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(10); // Reset the timer for the next question (10 seconds)
    } else {
      // End of the quiz
      setQuizEnded(true);
      clearTimeout(timerRef.current); // Stop the timer when the quiz ends
    }
  };

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  if (quizEnded) {
    return (
      <div className="quiz-container">
        <h2>Quiz Ended</h2>
        <p>Your score: {score} out of {questions.length}</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h1>Quiz App</h1>
      <div>
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{currentQuestion.question}</p>
        <ul>
          {currentQuestion.incorrect_answers.map((answer, index) => (
            <li key={index}>
              <button onClick={() => handleAnswerClick(false)}>{answer}</button>
            </li>
          ))}
          <li>
            <button onClick={() => handleAnswerClick(true)}>
              {currentQuestion.correct_answer}
            </button>
          </li>
        </ul>
        <p>Time left: {timer} seconds</p>
      </div>
    </div>
  );
}

export default App;
