import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LucideMove, Trash2, BarChart3, Copy } from "lucide-react";
import { FormField as FormFieldType } from "../types/form";
import { useFormStore } from "../store/formStore";
import CustomDialog from "./CustomDialog";
import { useLanguage } from "../contexts/LanguageContext";

interface FormFieldProps {
  field: FormFieldType;
}

const FormField: React.FC<FormFieldProps> = ({ field }) => {
  const { updateField, removeField, addField } = useFormStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useLanguage();
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
            <button
              onClick={() => {
                addField(field);
                setDialogOpen(true);
              }}
              className="text-blue-500 hover:text-red-700"
            >
              <Copy className="w-5 h-5" />
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
              <option value={12}>{t("fullWidth")}</option>
              <option value={6}>{t("halfWidth")}</option>
              <option value={4}>{t("thirdWidth")}</option>
            </select>
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
              placeholder={t("enterTextContent")}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2">
                  {t("questionType")}
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
                    <option value="descriptive">{t("descriptive")}</option>
                    <option value="single">{t("singleChoice")}</option>
                    <option value="multiple">{t("multipleChoice")}</option>
                  </select>
                </label>

                {field.questionType === "descriptive" && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.is_multiline}
                      onChange={(e) =>
                        updateField(field.id, {
                          is_multiline: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    {t("multiLine")}
                  </label>
                )}

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(field.id, { required: e.target.checked })
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  {t("required")}
                </label>
              </div>

              <div className="flex items-center flex-wrap gap-4 mt-2">
                <label className="flex items-center gap-2">
                  {t("answerPlacement")}
                  <select
                    value={field.answerPlacement}
                    onChange={(e) =>
                      updateField(field.id, {
                        answerPlacement: e.target.value as "front" | "below",
                      })
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="front">{t("front")}</option>
                    <option value="below">{t("below")}</option>
                  </select>
                </label>

                {(field.questionType === "single" ||
                  field.questionType === "multiple") && (
                  <label className="flex items-center gap-2">
                    {t("optionLayout")}
                    <select
                      value={field.optionLayout}
                      onChange={(e) =>
                        updateField(field.id, {
                          optionLayout: e.target.value as "row" | "column",
                        })
                      }
                      className="p-2 border border-gray-300 rounded-md"
                    >
                      <option value="row">{t("row")}</option>
                      <option value="column">{t("column")}</option>
                    </select>
                  </label>
                )}
              </div>

              <div
                className={`flex flex-wrap gap-2 ${
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
                  style={{
                    width: `${(inputWidth >= 370 ? 370 : inputWidth) || 100}px`,
                  }}
                  className="p-2 border border-gray-300 rounded-md h-fit min-w-[140px]"
                  placeholder={t("enterQuestionText")}
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
                          className="flex p-2 border border-gray-300 rounded-md min-w-[100px]"
                          placeholder={t("enterOptionText")}
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
                  {t("addOption")}
                </button>
              )}
            </div>
          )}
        </div>
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
            {t("showInSummary")}
          </label>
        )}
      </div>
      <CustomDialog
        isOpen={dialogOpen}
        title="Copy of field"
        message="A copy of the field was added to the bottom of the form"
        autoCloseDuration={3000}
        type="toast"
        position="bottom-left"
        onCancel={() => {
          setDialogOpen(false);
        }}
      />
    </div>
  );
};

export default FormField;
