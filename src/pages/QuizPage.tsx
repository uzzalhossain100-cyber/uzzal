"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Trophy, Clock, CheckCircle, XCircle, BookOpen, Globe, Calculator, History, Laptop, Languages, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question, SubjectQuestions } from '@/data/quizQuestions'; // Keep Question and SubjectQuestions interfaces
import { getQuizQuestions } from '@/lib/quizService'; // Import the new service
import { useTranslation } from '@/lib/translations'; // Import useTranslation
import { showError } from '@/utils/toast'; // Import showError

const MAX_QUESTIONS = 10;
const QUESTION_SCORE = 10;

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation(); // Initialize useTranslation and get currentLanguage

  const [showScreen, setShowScreen] = useState<'ageSelection' | 'subjectSelection' | 'quiz' | 'result'>('ageSelection');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null); // Changed type to string
  const [selectedSubject, setSelectedSubject] = useState<keyof SubjectQuestions | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false); // New loading state for questions

  const timerIntervalRef = useRef<number | null>(null);
  const gameStartedTimeRef = useRef<number>(0);

  // Define age groups and subjects directly or fetch from a config if needed
  const ageGroups = ['5-10', '11-25', '26+']; // Hardcoded for now, can be fetched from DB if dynamic
  const subjects: { id: keyof SubjectQuestions; name: string; icon: React.ElementType }[] = [
    { id: 'generalKnowledge', name: t("common.quiz_general_knowledge"), icon: Globe },
    { id: 'islamicKnowledge', name: t("common.quiz_islamic_knowledge"), icon: BookOpen },
    { id: 'mathematicalKnowledge', name: t("common.quiz_mathematical_knowledge"), icon: Calculator },
    { id: 'history', name: t("common.quiz_history"), icon: History },
    { id: 'technology', name: t("common.quiz_technology"), icon: Laptop },
    { id: 'english', name: t("common.quiz_english"), icon: Languages },
  ];

  const getSubjectName = (id: keyof SubjectQuestions) => {
    return subjects.find(s => s.id === id)?.name || '';
  };

  const handleBack = () => {
    if (showScreen === 'result' || showScreen === 'quiz') {
      setShowScreen('subjectSelection');
      resetQuizState();
    } else if (showScreen === 'subjectSelection') {
      setShowScreen('ageSelection');
      setSelectedAgeGroup(null);
      setSelectedSubject(null); // Reset subject when going back to age selection
    } else {
      navigate(-1); // Go back to previous page (Index)
    }
  };

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setTimeElapsed(0);
    setSelectedOption(null);
    setCorrectAnswer(null);
    setIsQuizActive(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const fetchAndSelectQuestions = async (ageGroup: string, subject: keyof SubjectQuestions) => {
    setLoadingQuestions(true);
    const fetchedQuestions = await getQuizQuestions(ageGroup, subject);
    if (fetchedQuestions && fetchedQuestions.length > 0) {
      const totalQuestions = fetchedQuestions.length;
      const qCount = Math.min(MAX_QUESTIONS, totalQuestions);
      const shuffled = [...fetchedQuestions].sort(() => 0.5 - Math.random());
      setSelectedQuestions(shuffled.slice(0, qCount));
    } else {
      showError(t("common.no_questions_found_for_selection"));
      setSelectedQuestions([]);
      setShowScreen('subjectSelection'); // Go back to subject selection if no questions
    }
    setLoadingQuestions(false);
  };

  const shuffleOptions = (question: Question) => {
    const allOptions = [question.a, ...question.o];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  const loadQuestion = () => {
    if (currentQuestionIndex >= MAX_QUESTIONS || currentQuestionIndex >= selectedQuestions.length) {
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

  const startGame = async (ageGroup: string, subjectId: keyof SubjectQuestions) => {
    setSelectedAgeGroup(ageGroup);
    setSelectedSubject(subjectId);
    resetQuizState();
    await fetchAndSelectQuestions(ageGroup, subjectId); // Fetch questions from Supabase
    setShowScreen('quiz');
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
    if (showScreen === 'quiz' && selectedQuestions.length > 0 && !loadingQuestions) {
      loadQuestion();
    }
  }, [currentQuestionIndex, selectedQuestions, showScreen, currentLanguage, loadingQuestions]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  let pageTitle = t("common.quiz_page_title");
  if (showScreen === 'subjectSelection' && selectedAgeGroup) {
    pageTitle = `${t("common.select_subject")} (${selectedAgeGroup} ${t("common.quiz_years")})`;
  } else if ((showScreen === 'quiz' || showScreen === 'result') && selectedSubject && selectedAgeGroup) {
    pageTitle = `${getSubjectName(selectedSubject)} ${t("common.quiz_page_title")} (${selectedAgeGroup} ${t("common.quiz_years")})`;
  }

  if (loadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground font-bold">{t("common.quiz_loading_questions")}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
      <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="text-center pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center justify-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80 absolute left-4 top-4">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Brain className="h-7 w-7 mr-2" /> {pageTitle}
          </CardTitle>
          <CardDescription className="text-muted-foreground">{t("common.quiz_page_desc")}</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {showScreen === 'ageSelection' && (
            <div id="age-selection-screen" className="text-center">
              <p className="text-lg text-foreground mb-6 font-bold">{t("common.select_age_group")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ageGroups.map((ageGroup) => (
                  <Button
                    key={ageGroup}
                    onClick={() => {
                      setSelectedAgeGroup(ageGroup);
                      setShowScreen('subjectSelection');
                    }}
                    className="h-24 flex flex-col items-center justify-center text-center p-2 rounded-lg shadow-md transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg"
                  >
                    {ageGroup} {t("common.quiz_years")}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {showScreen === 'subjectSelection' && selectedAgeGroup && (
            <div id="subject-selection-screen" className="text-center">
              <p className="text-lg text-foreground mb-6 font-bold">{t("common.select_subject")} ({selectedAgeGroup} {t("common.quiz_years")}):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <Button
                    key={subject.id}
                    onClick={() => {
                      startGame(selectedAgeGroup, subject.id); // Pass ageGroup and subject.id directly
                    }}
                    className="h-24 flex flex-col items-center justify-center text-center p-2 rounded-lg shadow-md transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg"
                  >
                    <subject.icon className="h-8 w-8 mb-2" />
                    {subject.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {showScreen === 'quiz' && currentQuestion && (
            <div id="quiz-area">
              <div className="flex justify-between mb-6 text-lg text-foreground font-semibold">
                <p>{t("common.quiz_question_no_short")} <span className="font-bold text-primary">{currentQuestionIndex + 1}</span> / {MAX_QUESTIONS}</p>
                <p>{t("common.quiz_time_short")} <span className="font-bold text-destructive">{timeElapsed}s</span></p>
                <p>{t("common.quiz_score_short")} <span className="font-bold text-green-600">{score}</span></p>
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
                <Trophy className="h-8 w-8 mr-2" /> {t("common.quiz_ended_title")}
              </h2>
              <p className="text-lg text-foreground mb-2">{t("common.quiz_total_score_label")} <span id="final-score" className="text-green-600 font-extrabold text-2xl">{score}</span></p>
              <p className="text-base text-foreground flex items-center justify-center mb-1">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> {t("common.quiz_correct_answers_label")} <span id="correct-count" className="font-bold ml-1">{correctAnswersCount}</span>
              </p>
              <p className="text-base text-foreground flex items-center justify-center mb-4">
                <XCircle className="h-5 w-5 text-red-500 mr-2" /> {t("common.quiz_wrong_answers_label")} <span id="wrong-count" className="font-bold ml-1">{wrongAnswersCount}</span>
              </p>
              <p className="text-base text-foreground mb-6">{t("common.quiz_total_time_label")} <span id="time-taken" className="text-orange-600 font-bold">{timeElapsed} {t("common.quiz_seconds")}</span></p>
              <Button
                onClick={() => setShowScreen('ageSelection')} // Go back to age selection to restart
                className="start-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-4 rounded-lg transition-colors"
              >
                {t("common.quiz_restart_button")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;