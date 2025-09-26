"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allQuizQuestions, Question } from '@/data/quizQuestions';

const MAX_QUESTIONS = 10;
const QUESTION_SCORE = 10;

const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [showScreen, setShowScreen] = useState<'start' | 'quiz' | 'result'>('start');
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  const timerIntervalRef = useRef<number | null>(null);
  const gameStartedTimeRef = useRef<number>(0);

  const handleBack = () => {
    navigate(-1);
  };

  const selectRandomQuestions = () => {
    const totalQuestions = allQuizQuestions.length;
    const qCount = Math.min(MAX_QUESTIONS, totalQuestions);
    const shuffled = [...allQuizQuestions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, qCount));
  };

  const shuffleOptions = (question: Question) => {
    const allOptions = [question.a, ...question.o];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  const loadQuestion = () => {
    if (currentQuestionIndex >= MAX_QUESTIONS) {
      endQuiz();
      return;
    }

    const q = selectedQuestions[currentQuestionIndex];
    setShuffledOptions(shuffleOptions(q));
    setCorrectAnswer(q.a);
    setSelectedOption(null); // Reset selected option for new question
    setIsQuizActive(true); // Re-activate quiz for new question
  };

  const checkAnswer = (option: string) => {
    if (!isQuizActive) return;

    setIsQuizActive(false); // Disable further clicks for this question
    setSelectedOption(option);

    if (option === correctAnswer) {
      setScore(prev => prev + QUESTION_SCORE);
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      setWrongAnswersCount(prev => prev + 1);
    }

    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
    }, 1500);
  };

  const startTimer = () => {
    gameStartedTimeRef.current = Date.now();
    timerIntervalRef.current = window.setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - gameStartedTimeRef.current) / 1000));
    }, 1000);
  };

  const startGame = () => {
    setShowScreen('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setTimeElapsed(0);
    setSelectedOption(null);
    setCorrectAnswer(null);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    selectRandomQuestions();
    startTimer();
  };

  const endQuiz = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsQuizActive(false);
    setShowScreen('result');
  };

  useEffect(() => {
    if (showScreen === 'quiz' && selectedQuestions.length > 0) {
      loadQuestion();
    }
  }, [currentQuestionIndex, selectedQuestions, showScreen]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
      <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="text-center pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center justify-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80 absolute left-4 top-4">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Brain className="h-7 w-7 mr-2" /> সাধারণ জ্ঞান পরীক্ষা
          </CardTitle>
          <CardDescription className="text-muted-foreground">আপনার জ্ঞান পরীক্ষা করুন!</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {showScreen === 'start' && (
            <div id="start-screen" className="text-center">
              <p className="text-lg text-foreground mb-6">আপনি মোট <span className="font-bold text-primary">{MAX_QUESTIONS}টি</span> প্রশ্নের উত্তর দেবেন। প্রতি সঠিক উত্তরে <span className="font-bold text-green-600">{QUESTION_SCORE} নম্বর</span> পাবেন।</p>
              <Button
                onClick={startGame}
                className="start-button bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors"
              >
                কুইজ শুরু করুন
              </Button>
            </div>
          )}

          {showScreen === 'quiz' && currentQuestion && (
            <div id="quiz-area">
              <div className="flex justify-between mb-6 text-lg text-foreground font-semibold">
                <p>প্রশ্ন নং: <span className="font-bold text-primary">{currentQuestionIndex + 1}</span> / {MAX_QUESTIONS}</p>
                <p>সময়: <span className="font-bold text-destructive">{timeElapsed}s</span></p>
                <p>স্কোর: <span className="font-bold text-green-600">{score}</span></p>
              </div>

              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg shadow-sm">
                <p id="question-text" className="text-xl font-bold text-green-800 dark:text-green-200">
                  {currentQuestionIndex + 1}. {currentQuestion.q}
                </p>
              </div>

              <div id="options-container" className="grid gap-4">
                {shuffledOptions.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => checkAnswer(option)}
                    disabled={!isQuizActive}
                    className={cn(
                      "w-full py-3 px-4 text-base font-semibold rounded-md transition-all duration-200",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      selectedOption === option && option === correctAnswer && "bg-green-500 hover:bg-green-600",
                      selectedOption === option && option !== correctAnswer && "bg-red-500 hover:bg-red-600",
                      selectedOption !== null && option === correctAnswer && "border-2 border-green-500 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
                      !isQuizActive && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {showScreen === 'result' && (
            <div id="result-screen" className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 rounded-lg shadow-md">
              <h2 className="text-3xl font-extrabold text-orange-700 dark:text-orange-200 mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8 mr-2" /> 🎉 কুইজ শেষ! 🎉
              </h2>
              <p className="text-lg text-foreground mb-2">মোট নম্বর (১০০ এর মধ্যে): <span id="final-score" className="text-green-600 font-extrabold text-2xl">{score}</span></p>
              <p className="text-base text-foreground flex items-center justify-center mb-1">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> সঠিক উত্তর: <span id="correct-count" className="font-bold ml-1">{correctAnswersCount}</span>
              </p>
              <p className="text-base text-foreground flex items-center justify-center mb-4">
                <XCircle className="h-5 w-5 text-red-500 mr-2" /> ভুল উত্তর: <span id="wrong-count" className="font-bold ml-1">{wrongAnswersCount}</span>
              </p>
              <p className="text-base text-foreground mb-6">মোট সময়: <span id="time-taken" className="text-orange-600 font-bold">{timeElapsed} সেকেন্ড</span></p>
              <Button
                onClick={() => startGame()} // Restart the game
                className="start-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-4 rounded-lg transition-colors"
              >
                আবার শুরু করুন
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;