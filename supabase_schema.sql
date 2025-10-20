-- Create the quiz_questions table
CREATE TABLE public.quiz_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    age_group TEXT NOT NULL,
    subject TEXT NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS) for quiz_questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read questions
CREATE POLICY "Allow authenticated users to read quiz questions"
ON public.quiz_questions FOR SELECT
TO authenticated
USING (true);

-- Policy for admin to perform all operations (CRUD)
CREATE POLICY "Allow admin to manage quiz questions"
ON public.quiz_questions FOR ALL
TO authenticated
USING (auth.email() = 'uzzal@admin.com')
WITH CHECK (auth.email() = 'uzzal@admin.com');

-- Optional: Add an index for faster lookups by age_group and subject
CREATE INDEX idx_quiz_questions_age_subject ON public.quiz_questions (age_group, subject);