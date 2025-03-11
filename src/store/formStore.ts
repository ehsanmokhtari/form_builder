import { create } from 'zustand';
import { FormField } from '../types/form';

interface FormState {
  fields: FormField[];
  addField: (field: Omit<FormField, 'id' | 'order'>) => void;
  updateField: (id: string, field: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fields: FormField[]) => void;
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
        },
      ],
    })),
  updateField: (id, field) =>
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === id ? { ...f, ...field } : f
      ),
    })),
  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
    })),
  reorderFields: (fields) => set({ fields }),
}));