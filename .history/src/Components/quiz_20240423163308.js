import React, { useState, useEffect } from 'react';

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      const data = await response.json();
      setQuestions(data.results);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  function handleAnswerSubmit(answer) {
    // Check if the answer is correct and update score
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
    // Move to the next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    // Reset timer for the next question
    setTimer(5);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(interval);
        // Move to the next question when the timer reaches 0
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // Reset timer for the next question
        setTimer(5);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, currentQuestionIndex]);

  // Check if quiz is finished
  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <h1>Quiz Completed!</h1>
        <p>Your score: {score}</p>
        <button onClick={() => setCurrentQuestionIndex(0)}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Question {currentQuestionIndex + 1}</h1>
      <p>Time left: {timer} seconds</p>
      <p>{questions[currentQuestionIndex].question}</p>
      <ul>
        {questions[currentQuestionIndex].incorrect_answers.map((answer, index) => (
          <li key={index}>
            <button onClick={() => handleAnswerSubmit(answer)}>{answer}</button>
          </li>
        ))}
        <li>
          <button onClick={() => handleAnswerSubmit(questions[currentQuestionIndex].correct_answer)}>
            {questions[currentQuestionIndex].correct_answer}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default QuizApp;
