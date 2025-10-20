import { supabase } from '@/lib/supabaseClient';
import { Question } from '@/data/quizQuestions';
import { showError } from '@/utils/toast';

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
    q: q.question_text,
    a: q.correct_answer,
    o: q.options,
  }));
};