export interface Question {
  q: string;
  a: string;
  o: string[];
}

export interface SubjectQuestions {
  generalKnowledge: Question[];
  islamicKnowledge: Question[];
  mathematicalKnowledge: Question[];
  history: Question[];
  technology: Question[];
  english: Question[];
}

export interface AgeGroupQuestions {
  '5-10': SubjectQuestions;
  '11-25': SubjectQuestions;
  '26+': SubjectQuestions;
}

// All quiz questions will now be fetched from Supabase.
// The 'allQuizQuestions' export is removed.