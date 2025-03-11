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
    - Add policies for:
      - Forms: authenticated users can perform all operations
      - Form responses: authenticated users can read and create responses
*/

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  fields jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create form_responses table
CREATE TABLE IF NOT EXISTS form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms(id) ON DELETE CASCADE,
  responses jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for forms
CREATE POLICY "Enable read access for authenticated users" ON forms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON forms
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON forms
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON forms
  FOR DELETE TO authenticated USING (true);

-- Create policies for form_responses
CREATE POLICY "Enable read access for authenticated users" ON form_responses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON form_responses
  FOR INSERT TO authenticated WITH CHECK (true);

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