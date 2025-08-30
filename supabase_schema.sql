-- Create the visits table
CREATE TABLE public.visits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NULL,
  guest_id text NULL,
  username text NULL,
  email text NULL,
  ip_address inet NULL,
  visited_at timestamp with time zone DEFAULT now() NOT NULL,
  is_guest_visit boolean DEFAULT false NOT NULL,
  CONSTRAINT visits_pkey PRIMARY KEY (id),
  CONSTRAINT visits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- RLS Policy for SELECT: Admins can view all visits
CREATE POLICY "Admins can view all visits" ON public.visits
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND email = 'Uzzal')
);

-- RLS Policy for INSERT: All can insert visits
CREATE POLICY "All can insert visits" ON public.visits
FOR INSERT WITH CHECK (true);

-- Optional: Index for faster queries
CREATE INDEX visits_visited_at_idx ON public.visits (visited_at);
CREATE INDEX visits_user_id_idx ON public.visits (user_id);
CREATE INDEX visits_guest_id_idx ON public.visits (guest_id);

-- Existing tables (profiles, chat_messages, chat_comments) are not modified here.
-- This file will be used to update your Supabase schema.