/*
  # Create Admin Users Table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text, unique, not null) - Admin email address
      - `full_name` (text) - Admin's full name
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `last_login` (timestamptz) - Last login timestamp

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated admin users to read their own data
    - Add policy for authenticated admin users to update their own profile

  3. Important Notes
    - Admin users must exist in auth.users first
    - Only admins can access admin_users table
    - Passwords are managed by Supabase Auth
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read their own data
CREATE POLICY "Admins can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Admins can update their own profile
CREATE POLICY "Admins can update own profile"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at_trigger ON admin_users;
CREATE TRIGGER update_admin_users_updated_at_trigger
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();
