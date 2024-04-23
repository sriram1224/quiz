import React, { useState, useEffect } from 'react';
import '../App.css';

function QuizApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // Initial time
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer); // Now only set the selected answer
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const isCorrect = selectedAnswer === questions[currentQuestion]?.correct_answer;
      setScore(isCorrect ? score + 1 : score); // Update score based on selection
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(5); // Reset timer for next question
    } else {
      setIsGameOver(true); // Game over if all questions answered
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(5);
    } else {
      setIsGameOver(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(5); // Reset timer for new game
  };

  // Timer logic outside handleSelectAnswer
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) { // Only decrement timer if time left and not game over
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId); // Cleanup function to avoid memory leaks
    }
  }, [timeLeft, isGameOver]);

  return (
    <div className="quiz-app">
      {isLoading ? (
        <p>Loading questions...</p>
      ) : isGameOver ? (
        <>
          <h2>Game Over!</h2>
          <p>Your final score is: {score} / {questions.length}</p>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </>
      ) : questions?.length > 0 ? (
        <>
          <h2 className="question-number">Question {currentQuestion + 1} of {questions.length}</h2>
          <p className="question">{questions[currentQuestion]?.question}</p>
          <ul className="options">
            {questions[currentQuestion]?.incorrect_answers.map((answer) => (
              <li key={answer}>
                <label className="option">
                  <input
                    type="radio"
                    name="answer"
                    value={answer}
                    disabled={selectedAnswer}
                    onChange={() => handleSelectAnswer(answer)}
                  />
                  {answer}
                </label>
              </li>
            ))}
            <li key={questions[currentQuestion]?.correct_answer}>
              <label className="option">
                <input
                  type="radio"
                  name="answer"
                  value={questions[currentQuestion]?.correct_answer}
                  disabled={selectedAnswer}
                  onChange={() => handleSelectAnswer(questions[currentQuestion]?.correct_answer)}
                />
                {questions[currentQuestion]?.correct_answer}
              </label>
            </li>
          </ul>
          <div className="timer">
            {timeLeft > 0 ? `${timeLeft} seconds remaining` : 'Time\'s up!'}
          </div>
          <div className="actions">
            <button className="skip-button" onClick={handleSkipQuestion} disabled={selectedAnswer}>
              Skip Question
            </button>
            <button className="next-button" onClick={handleNextQuestion} disabled={!selectedAnswer}>
              Next Question
            </button>
          </div>
        </>
      ) : (
        <p>An error occurred while fetching questions.</p>
      )}
    </div>
  );
}

export default QuizApp;
