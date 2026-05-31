-- Messaging System Migration
-- 1. Create chats table (safe for production - uses IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, buyer_id)
);

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Policies for chats
-- Users can see their own chats
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
CREATE POLICY "Users can view their own chats"
  ON public.chats FOR SELECT
  USING ( auth.uid() = buyer_id OR auth.uid() = seller_id );

-- Users can insert a chat if they are the buyer
DROP POLICY IF EXISTS "Users can create chats as buyers" ON public.chats;
CREATE POLICY "Users can create chats as buyers"
  ON public.chats FOR INSERT
  WITH CHECK ( auth.uid() = buyer_id );

-- 5. Policies for messages
-- Users can see messages in their chats
DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.messages;
CREATE POLICY "Users can view messages in their chats"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chats c
      WHERE c.id = chat_id AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Users can send messages in their chats
DROP POLICY IF EXISTS "Users can insert messages in their chats" ON public.messages;
CREATE POLICY "Users can insert messages in their chats"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chats c
      WHERE c.id = chat_id AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Users can update messages (to mark as read)
DROP POLICY IF EXISTS "Users can update messages in their chats" ON public.messages;
CREATE POLICY "Users can update messages in their chats"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.chats c
      WHERE c.id = chat_id AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- 6. Trigger to update chat updated_at on new message
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chats SET updated_at = NOW() WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_message();

-- Enable Realtime for messages and chats
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chats;
  EXCEPTION WHEN duplicate_object THEN
    -- Ignore error if it's already there
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  EXCEPTION WHEN duplicate_object THEN
    -- Ignore error if it's already there
  END;
END;
$$;
