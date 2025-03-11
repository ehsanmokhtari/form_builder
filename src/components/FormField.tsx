import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, LayoutGrid } from "lucide-react";
import { FormField as FormFieldType } from "../types/form";
import { useFormStore } from "../store/formStore";

interface FormFieldProps {
  field: FormFieldType;
}

const FormField: React.FC<FormFieldProps> = ({ field }) => {
  const { updateField, removeField } = useFormStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow p-4 border border-gray-200"
    >
      <div className="flex items-start gap-4">
        <button
          className="mt-2 text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1">
          {field.type === "text" ? (
            <textarea
              value={field.content}
              onChange={(e) =>
                updateField(field.id, { content: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter text content..."
            />
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={field.content}
                onChange={(e) =>
                  updateField(field.id, { content: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter question..."
              />

              <div className="flex items-center gap-4">
                <select
                  value={field.questionType}
                  onChange={(e) =>
                    updateField(field.id, {
                      questionType: e.target
                        .value as FormFieldType["questionType"],
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="descriptive">Descriptive</option>
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                </select>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.is_multiline}
                    onChange={(e) =>
                      updateField(field.id, { is_multiline: e.target.checked })
                    }
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  Multi-line
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(field.id, { required: e.target.checked })
                    }
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  Required
                </label>
              </div>

              {(field.questionType === "single" ||
                field.questionType === "multiple") && (
                <div className="space-y-2">
                  {field.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(field.options || [])];
                          newOptions[index] = e.target.value;
                          updateField(field.id, { options: newOptions });
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = field.options?.filter(
                            (_, i) => i !== index
                          );
                          updateField(field.id, { options: newOptions });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(field.options || []), ""];
                      updateField(field.id, { options: newOptions });
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <select
              value={field.width}
              onChange={(e) =>
                updateField(field.id, {
                  width: parseInt(e.target.value),
                })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value={12}>Full Width</option>
              <option value={6}>Half Width</option>
              <option value={4}>Third Width</option>
            </select>

            <button
              onClick={() => removeField(field.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormField;
