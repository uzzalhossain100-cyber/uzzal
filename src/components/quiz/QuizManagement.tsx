"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Loader2, X, Check } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { getAllQuizQuestions, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion } from '@/lib/quizService';
import { showError } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

interface SupabaseQuestion {
  id: string;
  age_group: string;
  subject: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  created_at: string;
}

const QuizManagement: React.FC = () => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<SupabaseQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SupabaseQuestion | null>(null);

  // Form states
  const [ageGroup, setAgeGroup] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '']); // 3 options by default

  const ageGroups = ['5-10', '11-25', '26+'];
  const subjects = [
    { id: 'generalKnowledge', name: t("common.quiz_general_knowledge") },
    { id: 'islamicKnowledge', name: t("common.quiz_islamic_knowledge") },
    { id: 'mathematicalKnowledge', name: t("common.quiz_mathematical_knowledge") },
    { id: 'history', name: t("common.quiz_history") },
    { id: 'technology', name: t("common.quiz_technology") },
    { id: 'english', name: t("common.quiz_english") },
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const fetchedQuestions = await getAllQuizQuestions();
    if (fetchedQuestions) {
      setQuestions(fetchedQuestions);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setAgeGroup('');
    setSubject('');
    setQuestionText('');
    setCorrectAnswer('');
    setOptions(['', '', '']);
    setEditingQuestion(null);
  };

  const handleAddEditClick = (question?: SupabaseQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setAgeGroup(question.age_group);
      setSubject(question.subject);
      setQuestionText(question.question_text);
      setCorrectAnswer(question.correct_answer);
      setOptions(question.options);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSaveQuestion = async () => {
    if (!ageGroup || !subject || !questionText.trim() || !correctAnswer.trim() || options.some(opt => !opt.trim())) {
      showError(t("common.quiz_fill_all_fields"));
      return;
    }

    const questionData = {
      age_group: ageGroup,
      subject: subject,
      question_text: questionText.trim(),
      correct_answer: correctAnswer.trim(),
      options: options.map(opt => opt.trim()),
    };

    let success = false;
    if (editingQuestion) {
      const result = await updateQuizQuestion(editingQuestion.id, questionData);
      success = result.success;
    } else {
      const result = await addQuizQuestion(questionData);
      success = result.success;
    }

    if (success) {
      fetchQuestions();
      setIsDialogOpen(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm(t("common.quiz_confirm_delete_question"))) {
      const result = await deleteQuizQuestion(id);
      if (result.success) {
        fetchQuestions();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground font-bold">{t("common.quiz_loading_questions")}</span>
      </div>
    );
  }

  return (
    <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
          <Brain className="h-7 w-7 mr-2" /> {t("common.quiz_management_title")}
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleAddEditClick()} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              <Plus className="h-4 w-4 mr-2" /> {t("common.quiz_add_question")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-primary">{editingQuestion ? t("common.quiz_edit_question") : t("common.quiz_add_question")}</DialogTitle>
              <DialogDescription>{t("common.quiz_add_edit_question_desc")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ageGroup" className="text-right">{t("common.quiz_age_group")}</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger id="ageGroup" className="col-span-3 border-primary/30 focus-visible:ring-primary">
                    <SelectValue placeholder={t("common.select_age_group")} />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map(group => (
                      <SelectItem key={group} value={group}>{group} {t("common.quiz_years")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">{t("common.quiz_subject")}</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject" className="col-span-3 border-primary/30 focus-visible:ring-primary">
                    <SelectValue placeholder={t("common.select_subject")} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="questionText" className="text-right">{t("common.quiz_question_text")}</Label>
                <Textarea
                  id="questionText"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="col-span-3 border-primary/30 focus-visible:ring-primary"
                  placeholder={t("common.quiz_enter_question_text")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="correctAnswer" className="text-right">{t("common.quiz_correct_answer")}</Label>
                <Input
                  id="correctAnswer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="col-span-3 border-primary/30 focus-visible:ring-primary"
                  placeholder={t("common.quiz_enter_correct_answer")}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-left">{t("common.quiz_options")}</Label>
                {options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="border-primary/30 focus-visible:ring-primary"
                    placeholder={`${t("common.quiz_option")} ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="font-bold">{t("common.cancel")}</Button>
              <Button onClick={handleSaveQuestion} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                {editingQuestion ? t("common.quiz_update_question") : t("common.quiz_add_question")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-130px)] w-full p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">{t("common.quiz_age_group")}</TableHead>
                <TableHead className="font-bold">{t("common.quiz_subject")}</TableHead>
                <TableHead className="font-bold">{t("common.quiz_question_text")}</TableHead>
                <TableHead className="font-bold">{t("common.quiz_correct_answer")}</TableHead>
                <TableHead className="font-bold">{t("common.quiz_options")}</TableHead>
                <TableHead className="text-right font-bold">{t("common.action_col")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground font-bold">{t("common.no_questions_found")}</TableCell>
                </TableRow>
              ) : (
                questions.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.age_group}</TableCell>
                    <TableCell>{subjects.find(s => s.id === q.subject)?.name || q.subject}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{q.question_text}</TableCell>
                    <TableCell>{q.correct_answer}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{q.options.join(', ')}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleAddEditClick(q)} className="font-bold">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(q.id)} className="font-bold">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QuizManagement;