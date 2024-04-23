import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30); // Timer for each question
  const [quizEnded, setQuizEnded] = useState(false);

  const timerRef = useRef(null); // Ref for the timer timeout

  // Effect for fetching questions when the component mounts
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        const formattedQuestions = response.data.results.map((question) => {
          const incorrectAnswersIndexes = question.incorrect_answers.length;
          const correctAnswerIndex = Math.floor(Math.random() * (incorrectAnswersIndexes + 1));

          question.answers = [...question.incorrect_answers];
          question.answers.splice(correctAnswerIndex, 0, question.correct_answer);

          return question;
        });

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    fetchQuestions();
  }, []);

  // Effect for starting and updating the timer
  useEffect(() => {
    if (currentQuestionIndex < questions.length && timer > 0) {
      timerRef.current = setTimeout(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          handleNextQuestion();
        }
      }, 1000);

      // Clean up the timer when the component unmounts or when the current question changes
      return () => {
        clearTimeout(timerRef.current);
      };
    }
  });

  // Function for handling the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30); // Reset the timer for the next question (30 seconds)
    } else {
      // End of the quiz
      setQuizEnded(true);
      clearTimeout(timerRef.current); // Stop the timer when the quiz ends
    }
  };

  // Function for handling user answer clicks
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  if (!questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (quizEnded) {
    return (
      <div>Your score: {score}</div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div>Time remaining: {timer}</div>
      {currentQuestion.answers.map((answer, index) => (
        <button key={index} onClick={() => handleAnswerClick(answer === currentQuestion.correct_answer)}>
          {answer}
        </button>
      ))}
    </div>
  );
}

export default QuizApp;