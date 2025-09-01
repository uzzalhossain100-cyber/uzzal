-- Create chat_messages table
CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    username text NOT NULL,
    email text NOT NULL,
    message_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_messages_pkey PRIMARY KEY (id)
);

-- Enable Realtime for chat_messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Set up Row Level Security (RLS) for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read chat_messages"
ON public.chat_messages FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to insert chat_messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to delete any chat_message"
ON public.chat_messages FOR DELETE
USING (auth.email() = 'uzzal@admin.com'); -- Assuming 'uzzal@admin.com' is the admin email

-- Create chat_comments table
CREATE TABLE public.chat_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    username text NOT NULL,
    email text NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_comments_pkey PRIMARY KEY (id)
);

-- Enable Realtime for chat_comments
ALTER TABLE public.chat_comments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_comments;

-- Set up Row Level Security (RLS) for chat_comments
ALTER TABLE public.chat_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read chat_comments"
ON public.chat_comments FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to insert chat_comments"
ON public.chat_comments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to delete any chat_comment"
ON public.chat_comments FOR DELETE
USING (auth.email() = 'uzzal@admin.com'); -- Assuming 'uzzal@admin.com' is the admin email

-- Optional: Add a guest_id column to chat_messages and chat_comments if you want to track guest messages separately
-- This would require changes in your application logic to handle guest_id instead of user_id for guests.
-- For now, guests are treated as authenticated for chat purposes if they have a profile.
-- If you want to distinguish, you might need to adjust RLS policies and table structure.