/*
  # Form Builder Database Schema - Merged Migration

  This file combines all migrations into a single, coherent schema.

  1. Tables
    - `forms`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, nullable)
      - `fields` (jsonb)
      - `is_multiline` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)
    
    - `form_responses`
      - `id` (uuid, primary key)
      - `form_id` (uuid, foreign key to forms)
      - `responses` (jsonb)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for form owners to manage their forms
    - Add policies for users to submit responses
    - Add policies for form owners to view responses

  3. Performance
    - Add indexes for common query patterns
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
  is_multiline BOOLEAN DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create form_responses table
CREATE TABLE form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_forms_created_at ON forms(created_at DESC);
CREATE INDEX idx_form_responses_form_id ON form_responses(form_id);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Policies for forms
CREATE POLICY "Users can create forms"
  ON forms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own forms"
  ON forms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
  ON forms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms"
  ON forms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for form_responses
CREATE POLICY "Users can submit responses"
  ON form_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Form owners can view responses"
  ON form_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forms
      WHERE forms.id = form_responses.form_id
      AND forms.user_id = auth.uid()
    )
  );

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