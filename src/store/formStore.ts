import { create } from "zustand";
import { FormField } from "../types/form";

interface FormState {
  fields: FormField[];
  addField: (field: Omit<FormField, "id" | "order">) => void;
  updateField: (id: string, field: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fields: FormField[]) => void;
  setFields: (fields: FormField[]) => void;
}

export const useFormStore = create<FormState>((set) => ({
  fields: [],
  addField: (field) =>
    set((state) => ({
      fields: [
        ...state.fields,
        {
          ...field,
          id: crypto.randomUUID(),
          order: state.fields.length,
          width: field.width || 12,
          is_multiline: field.is_multiline || false,
          options: field.options || [],
          required: field.required || false,
          questionType: field.questionType || "descriptive",
          includeInSummary: field.includeInSummary ?? true,
          answerPlacement: field.answerPlacement || "below",
          optionLayout: field.optionLayout || "column",
        },
      ],
    })),
  updateField: (id, field) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...field } : f)),
    })),
  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
    })),
  reorderFields: (fields) => set({ fields }),
  setFields: (fields) => set({ fields }),
}));
