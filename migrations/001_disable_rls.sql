-- Migration: Disable RLS for Development
-- Run this in Supabase SQL Editor to allow full CRUD access

-- Disable RLS on products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Disable RLS on users table (if needed)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Alternative: Create permissive policies instead of disabling RLS
-- Uncomment these if you prefer to keep RLS enabled but allow all operations

/*
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public can view published products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Create permissive policy for all operations
CREATE POLICY "Allow all operations on products" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For users table
DROP POLICY IF EXISTS "Authenticated users can view users" ON users;

CREATE POLICY "Allow all operations on users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
*/

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('products', 'users');
