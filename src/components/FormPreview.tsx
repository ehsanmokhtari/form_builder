import { useState } from "react";
import type { FormField } from "../types/form";
import { Laptop, Smartphone } from "lucide-react";

interface FormPreviewProps {
  title: string;
  description?: string;
  fields: FormField[];
}

const FormPreview = ({ title, description, fields }: FormPreviewProps) => {
  const layoutWidths = [380, 480, 768, 1028, 1280, 1920];
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );

  const handleResponseChange = (fieldId: string, value: string | string[]) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleLayout = () => {
    setLayoutIndex((prevIndex) => (prevIndex + 1) % layoutWidths.length);
  };

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">
          {title || "Untitled Form"}
        </h2>
      )}
      {description && (
        <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLayout}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <span className="mr-2">
            {layoutWidths[layoutIndex] <= 480 ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Laptop className="w-4 h-4" />
            )}
          </span>
          {layoutWidths[layoutIndex]}px Version
        </button>
      </div>
      <div className="overflow-x-scroll py-5">
        <div
          className={`flex flex-col justify-center w-[${layoutWidths[layoutIndex]}px]`}
        >
          <div className="grid grid-cols-12 gap-2">
            {fields.map((field) => {
              const widthClass = `${
                layoutWidths[layoutIndex] > 480
                  ? "col-span-" + (field.width || 12)
                  : "col-span-12"
              }`;
              return (
                <div
                  key={field.id}
                  className={`bg-purple-50 rounded-lg text-wrap whitespace-break-spaces p-4 h-full flex items-center col-span-12 ${widthClass}`}
                >
                  {field.type === "text" ? (
                    <p className="text-gray-700">{field.content}</p>
                  ) : (
                    <div
                      className={`flex gap-4 w-full ${
                        layoutWidths[layoutIndex] > 480
                          ? "flex-nowrap " +
                            (field.answerPlacement === "front"
                              ? "flex-row"
                              : "flex-col")
                          : "flex-wrap"
                      }`}
                    >
                      <label className="block text-sm font-medium text-gray-700 text-wrap">
                        {field.content}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {field.questionType === "descriptive" ? (
                        field.is_multiline ? (
                          <textarea
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                            rows={4}
                            onChange={(e) =>
                              handleResponseChange(field.id, e.target.value)
                            }
                            placeholder="Enter your response..."
                          />
                        ) : (
                          <input
                            type="text"
                            className="block w-full min-w-20 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                            onChange={(e) =>
                              handleResponseChange(field.id, e.target.value)
                            }
                            placeholder="Enter your response..."
                          />
                        )
                      ) : (
                        <div
                          className={`gap-4 ${
                            field.optionLayout === "column"
                              ? "flex flex-col"
                              : "flex flex-row flex-wrap"
                          }`}
                        >
                          {field.options?.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type={
                                  field.questionType === "single"
                                    ? "radio"
                                    : "checkbox"
                                }
                                name={field.id}
                                value={option}
                                className={`h-4 w-4 ${
                                  field.questionType === "single"
                                    ? "text-purple-600 focus:ring-purple-500"
                                    : "rounded text-purple-600 focus:ring-purple-500"
                                }`}
                                onChange={(e) => {
                                  if (field.questionType === "single") {
                                    handleResponseChange(
                                      field.id,
                                      e.target.value
                                    );
                                  } else {
                                    const currentResponses =
                                      (responses[field.id] as string[]) || [];
                                    const newResponses = e.target.checked
                                      ? [...currentResponses, option]
                                      : currentResponses.filter(
                                          (res) => res !== option
                                        );
                                    handleResponseChange(
                                      field.id,
                                      newResponses
                                    );
                                  }
                                }}
                              />
                              <label className="ml-3 text-sm text-gray-700">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {fields.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setResponses({})}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                Submit Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
