import React, { useState, useEffect } from 'react';

function QuizApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
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

  const handleSkipQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(5);
    } else {
      setIsGameOver(true);
    }
  };

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
    setTimeLeft(0); // Stop the timer after answer selection
  };

  useEffect(() => {
    if (timeLeft === 0) {
      const isCorrect = selectedAnswer === questions[currentQuestion]?.correct_answer;
      setScore(isCorrect ? score + 1 : score);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setIsGameOver(true);
      }
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft > 0 ? timeLeft - 1 : 0), 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentQuestion, selectedAnswer, questions, score]);

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(5);
  };

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
          <h2>Question {currentQuestion + 1} of {questions.length}</h2>
          <p>{questions[currentQuestion]?.question}</p>
          <ul>
            {questions[currentQuestion]?.incorrect_answers.map((answer) => (
              <li key={answer}>
                <button
                  disabled={selectedAnswer}
                  onClick={() => handleSelectAnswer(answer)}
                >
                  {answer}
                </button>
              </li>
            ))}
            <li key={questions[currentQuestion]?.correct_answer}>
              <button
                disabled={selectedAnswer}
                onClick={() => handleSelectAnswer(questions[currentQuestion]?.correct_answer)}
              >
                {questions[currentQuestion]?.correct_answer}
              </button>
            </li>
          </ul>
          <div className="timer">
            {timeLeft > 0 ? `${timeLeft} seconds remaining` : 'Time\'s up!'}
          </div>
          <button onClick={handleSkipQuestion} disabled={selectedAnswer}>
            Skip Question
          </button>
        </>
      ) : (
        <p>An error occurred while fetching questions.</p>
      )}
    </div>
  );
}

export default QuizApp;
