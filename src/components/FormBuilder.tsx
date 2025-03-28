import { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormStore } from "../store/formStore";
import FormField from "./FormField";
import { Plus, Save, Eye, EyeOff, Copy, SquareX } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import FormPreview from "./FormPreview";
import CustomDialog from "./CustomDialog";
import { useLanguage } from "../contexts/LanguageContext";

const FormBuilder = () => {
  const {
    fields,
    title,
    description,
    formId,
    setTitle,
    setDescription,
    setFormId,
    setFields,
    updateFields,
    clearForm,
    addField,
  } = useFormStore();
  const { t } = useLanguage();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're editing an existing form
    const state = location.state as {
      form?: { id: string; title: string; description: string; fields: any[] };
    };
    if (state?.form) {
      setFormId(state.form.id);
      setTitle(state.form.title);
      setDescription(state.form.description || "");
      setFields(state.form.fields);
    }
  }, [location, setFormId, setTitle, setDescription, setFields]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      updateFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError(t("pleaseEnterTitle"));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Ensure fields array is properly formatted
      const formattedFields = fields.map((field) => ({
        ...field,
        options: field.options || [],
        required: field.required || false,
        width: field.width || "12",
        is_multiline: field.is_multiline || false,
      }));

      const formData = {
        title: title.trim(),
        description: description.trim() || null,
        fields: formattedFields,
      };

      let error;

      if (formId && !saveAsNew) {
        // Update existing form
        const { error: updateError } = await supabase
          .from("forms")
          .update(formData)
          .eq("id", formId);
        error = updateError;
      } else {
        // Create new form
        const { error: insertError } = await supabase
          .from("forms")
          .insert(formData);
        error = insertError;
      }

      if (error) throw error;
      navigate("/settings");
    } catch (err) {
      console.error("Error saving form:", err);
      setError(err instanceof Error ? err.message : t("failedToSave"));
    } finally {
      setSaving(false);
      clearForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {formId ? t("editForm") : t("createForm")}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                {t("hidePreview")}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                {t("showPreview")}
              </>
            )}
          </button>
          {formId && (
            <>
              <button
                onClick={() => {
                  setSaveAsNew(true);
                  setDialogOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Copy className="w-4 h-4 mr-2" />
                {t("saveAsNew")}
              </button>
              <button
                onClick={() => {
                  clearForm();
                  navigate("/settings");
                }}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                <SquareX className="w-4 h-4 mr-2" />
                {t("cancelUpdate")}
              </button>
            </>
          )}
          <button
            onClick={() => {
              setSaveAsNew(false);
              setDialogOpen(true);
            }}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? t("saving") : formId ? t("updateForm") : t("saveForm")}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                {t("formTitle")}
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder={t("enterFormTitle")}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                {t("descriptionOptional")}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder={t("enterFormDescription")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() =>
                addField({
                  type: "text",
                  content: "",
                  width: 12,
                })
              }
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("addText")}
            </button>
            <button
              onClick={() =>
                addField({
                  type: "question",
                  content: "",
                  required: false,
                  questionType: "descriptive",
                  width: 12,
                  answerPlacement: "front",
                })
              }
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("addQuestion")}
            </button>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 sm:grid grid-cols-12 gap-2">
                {fields.map((field) => (
                  <FormField key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {fields.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t("noFieldsAdded")}</p>
            </div>
          )}
        </div>

        {showPreview && (
          <div className="border-l pl-6">
            <div className="sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t("formPreview")}
              </h3>
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <FormPreview
                  title={title}
                  description={description}
                  fields={fields}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <CustomDialog
        isOpen={dialogOpen}
        title={
          saveAsNew
            ? t("saveAsNewForm")
            : formId
            ? t("updateForm")
            : t("saveForm")
        }
        message={
          saveAsNew
            ? t("doSaveAsNew")
            : formId
            ? t("doUpdateForm")
            : t("doSaveForm")
        }
        onConfirm={() => {
          handleSave();
          setDialogOpen(false);
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default FormBuilder;
