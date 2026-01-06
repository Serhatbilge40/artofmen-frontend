-- Supabase SQL Schema for Art Of Men Product Story Platform
-- Run this in the Supabase SQL Editor

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  story TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Uncategorized',
  tags TEXT[] DEFAULT '{}',
  qr_code_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  template TEXT DEFAULT 'modern' CHECK (template IN ('classic', 'modern', 'minimal')),
  color_scheme TEXT DEFAULT 'dark' CHECK (color_scheme IN ('dark', 'light', 'warm')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table (for future admin auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read access for published products
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (published = true);

-- Authenticated users can do everything with products
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Only authenticated users can view/manage users
CREATE POLICY "Authenticated users can view users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Demo product for testing
INSERT INTO products (slug, name, description, story, images, category, published) 
VALUES (
  'der-klassische-anzug',
  'Der Klassische Anzug',
  'Ein zeitloser Zweiteiler in tiefem Schwarz, gefertigt aus feinstem italienischen Schurwollstoff.',
  '<p>Dieser Anzug verkörpert die Essenz zeitloser Eleganz. Jeder Stich, jede Naht wurde mit höchster Präzision gesetzt.</p><p>Die Geschichte dieses Anzugs beginnt in den Webereien der Lombardei, wo der exklusive Stoff nach traditionellen Methoden hergestellt wird.</p>',
  ARRAY['https://www.artofmen.de/wp-content/uploads/2025/08/JACQUA1-1366x2048.jpe'],
  'Anzüge',
  true
) ON CONFLICT (slug) DO NOTHING;
