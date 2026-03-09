-- GM World - Supabase Schema
-- Supabase Dashboard > SQL Editor > New Query'e yapıştır ve Run'a tıkla

-- Tablo
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON messages;
CREATE POLICY "Allow public read" ON messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON messages;
CREATE POLICY "Allow public insert" ON messages
  FOR INSERT WITH CHECK (true);
