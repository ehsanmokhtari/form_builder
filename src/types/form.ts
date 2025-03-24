export interface FormField {
  id: string;
  type: "text" | "question";
  content: string;
  required?: boolean;
  questionType?: "multiple" | "single" | "descriptive";
  options?: string[];
  width: number; // Accepts values from 1 to 12
  order: number;
  is_multiline?: boolean;
  answerPlacement?: "front" | "below";
  optionLayout?: "row" | "column";
  includeInSummary?: boolean;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  created_at: string;
  updated_at: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  responses: Record<string, string | string[]>;
  created_at: string;
}
