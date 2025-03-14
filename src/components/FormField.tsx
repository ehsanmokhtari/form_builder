import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LucideMove, Trash2, BarChart3 } from "lucide-react";
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

  // State for dynamic width
  const [inputWidth, setInputWidth] = useState(100); // default width
  const [optionWidths, setOptionWidths] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to calculate text width
  const calculateTextWidth = (text: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = "16px Arial";
      return context.measureText(text).width + 25;
    }
    return 100;
  };

  useEffect(() => {
    if (inputRef.current) {
      const newWidth = calculateTextWidth(field.content);
      setInputWidth(newWidth);
    }
  }, [field.content]);

  useEffect(() => {
    const newWidths =
      field.options?.map((option) => calculateTextWidth(option)) || [];
    setOptionWidths(newWidths);
  }, [field.options]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow p-4 border border-gray-200 col-span-${field.width}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <button
              className="text-gray-400 hover:text-gray-600"
              {...attributes}
              {...listeners}
            >
              <LucideMove className="w-5 h-5" />
            </button>
            <button
              onClick={() => removeField(field.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
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

            {field.type === "question" && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.includeInSummary ?? true}
                  onChange={(e) =>
                    updateField(field.id, {
                      includeInSummary: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <BarChart3 className="w-4 h-4 text-gray-500" />
                Include in Summary
              </label>
            )}
          </div>
        </div>

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
              <div className="flex items-center gap-4 flex-wrap">
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
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Required
                </label>
              </div>

              <div className="flex items-center flex-wrap gap-4 mt-2">
                <label className="flex items-center gap-2">
                  Answer Placement:
                  <select
                    value={field.answerPlacement}
                    onChange={(e) =>
                      updateField(field.id, {
                        answerPlacement: e.target.value as "front" | "below",
                      })
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="front">In Front</option>
                    <option value="below">Below</option>
                  </select>
                </label>

                {(field.questionType === "single" ||
                  field.questionType === "multiple") && (
                  <label className="flex items-center gap-2">
                    Option Layout:
                    <select
                      value={field.optionLayout}
                      onChange={(e) =>
                        updateField(field.id, {
                          optionLayout: e.target.value as "row" | "column",
                        })
                      }
                      className="p-2 border border-gray-300 rounded-md"
                    >
                      <option value="row">Row</option>
                      <option value="column">Column</option>
                    </select>
                  </label>
                )}
              </div>

              <div
                className={`flex gap-2 ${
                  field.answerPlacement === "below" ? "flex-col" : "flex-row"
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={field.content}
                  onChange={(e) =>
                    updateField(field.id, { content: e.target.value })
                  }
                  style={{ width: `${inputWidth || 100}px` }}
                  className="p-2 border border-gray-300 rounded-md h-fit min-w-[50px]"
                  placeholder="Enter question..."
                />

                {(field.questionType === "single" ||
                  field.questionType === "multiple") && (
                  <div
                    className={`flex flex-wrap gap-2 ${
                      field.optionLayout === "column" ? "flex-col" : "flex-row"
                    }`}
                  >
                    {field.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 ${
                          field.optionLayout === "column"
                            ? "flex-row"
                            : "flex-col"
                        }`}
                      >
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[index] = e.target.value;
                            updateField(field.id, { options: newOptions });

                            const newWidths = [...optionWidths];
                            newWidths[index] = calculateTextWidth(
                              e.target.value
                            );
                            setOptionWidths(newWidths);
                          }}
                          style={{ width: `${optionWidths[index] || 100}px` }}
                          className="flex p-2 border border-gray-300 rounded-md min-w-[80px]"
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
                  </div>
                )}
              </div>
              {(field.questionType === "single" ||
                field.questionType === "multiple") && (
                <button
                  onClick={() => {
                    const newOptions = [...(field.options || []), ""];
                    updateField(field.id, { options: newOptions });
                    setOptionWidths([...optionWidths, 100]);
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  + Add Option
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormField;
