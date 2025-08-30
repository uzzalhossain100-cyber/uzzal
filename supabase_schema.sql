-- Create chat_messages table
CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL, -- Stores user_id for both real and guest users
    username text NOT NULL,
    email text NOT NULL,
    message_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_messages_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (including guests with aud: 'authenticated') to insert messages
CREATE POLICY "Authenticated users can insert messages" ON public.chat_messages
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policy for all users (including anon) to select messages
CREATE POLICY "All users can view messages" ON public.chat_messages
FOR SELECT USING (true);

-- Policy for admin to delete any message
CREATE POLICY "Admin can delete any message" ON public.chat_messages
FOR DELETE USING (EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = 'Uzzal'));

-- Create chat_comments table
CREATE TABLE public.chat_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message_id uuid NOT NULL,
    user_id uuid NOT NULL, -- Stores user_id for both real and guest users
    username text NOT NULL,
    email text NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_comments_pkey PRIMARY KEY (id),
    CONSTRAINT chat_comments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.chat_messages(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS) for chat_comments
ALTER TABLE public.chat_comments ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (including guests with aud: 'authenticated') to insert comments
CREATE POLICY "Authenticated users can insert comments" ON public.chat_comments
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policy for all users (including anon) to select comments
CREATE POLICY "All users can view comments" ON public.chat_comments
FOR SELECT USING (true);

-- Policy for admin to delete any comment
CREATE POLICY "Admin can delete any comment" ON public.chat_comments
FOR DELETE USING (EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = 'Uzzal'));