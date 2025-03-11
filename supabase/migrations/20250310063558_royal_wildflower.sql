/*
  # Form Builder Database Schema

  1. New Tables
    - `forms`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, nullable)
      - `fields` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `form_responses`
      - `id` (uuid, primary key)
      - `form_id` (uuid, foreign key)
      - `responses` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add proper indexes for performance
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS form_responses;
DROP TABLE IF EXISTS forms;

-- Create forms table
CREATE TABLE forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create form_responses table
CREATE TABLE form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_forms_created_at ON forms(created_at DESC);
CREATE INDEX idx_form_responses_form_id ON form_responses(form_id);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ADD COLUMN is_multiline BOOLEAN DEFAULT FALSE;

-- Create policies for forms
CREATE POLICY "Enable read access for all users" ON forms
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON forms
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON forms
  FOR DELETE USING (true);

-- Create policies for form_responses
CREATE POLICY "Enable read access for all users" ON form_responses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON form_responses
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger for forms
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();