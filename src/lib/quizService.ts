import { supabase } from '@/lib/supabaseClient';
import { Question } from '@/data/quizQuestions';
import { showError, showSuccess } from '@/utils/toast';

interface SupabaseQuestion {
  id: string;
  age_group: string;
  subject: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  created_at: string;
}

export const getQuizQuestions = async (ageGroup: string, subject: string): Promise<Question[] | null> => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('age_group', ageGroup)
    .eq('subject', subject)
    .order('created_at', { ascending: true });

  if (error) {
    showError(`Failed to load quiz questions: ${error.message}`);
    return null;
  }

  return data.map((q: SupabaseQuestion) => ({
    id: q.id, // Include ID for management
    q: q.question_text,
    a: q.correct_answer,
    o: q.options,
  }));
};

export const getAllQuizQuestions = async (): Promise<SupabaseQuestion[] | null> => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    showError(`Failed to load all quiz questions: ${error.message}`);
    return null;
  }
  return data;
};

export const addQuizQuestion = async (question: Omit<SupabaseQuestion, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('quiz_questions')
    .insert(question);

  if (error) {
    showError(`Failed to add quiz question: ${error.message}`);
    return { success: false, error: error.message };
  }
  showSuccess('Quiz question added successfully!');
  return { success: true };
};

export const updateQuizQuestion = async (id: string, question: Omit<SupabaseQuestion, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('quiz_questions')
    .update(question)
    .eq('id', id);

  if (error) {
    showError(`Failed to update quiz question: ${error.message}`);
    return { success: false, error: error.message };
  }
  showSuccess('Quiz question updated successfully!');
  return { success: true };
};

export const deleteQuizQuestion = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('quiz_questions')
    .delete()
    .eq('id', id);

  if (error) {
    showError(`Failed to delete quiz question: ${error.message}`);
    return { success: false, error: error.message };
  }
  showSuccess('Quiz question deleted successfully!');
  return { success: true };
};