import { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormStore } from "../store/formStore";
import FormField from "./FormField";
import { Plus, Save, Eye, EyeOff, Copy } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import FormPreview from "./FormPreview";
import CustomDialog from "./CustomDialog";

const FormBuilder = () => {
  const { fields, addField, reorderFields, setFields } = useFormStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [formId, setFormId] = useState<string | null>(null);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're editing an existing form
    const state = location.state as { form?: { id: string; title: string; description: string; fields: any[] } };
    if (state?.form) {
      setFormId(state.form.id);
      setTitle(state.form.title);
      setDescription(state.form.description || "");
      setFields(state.form.fields);
    }
  }, [location, setFields]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      reorderFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a form title");
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
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save form. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {formId ? "Edit Form" : "Create Form"}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </button>
          {formId && (
            <button
              onClick={() => {
                setSaveAsNew(true);
                setDialogOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              Save as New
            </button>
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
            {saving ? "Saving..." : formId ? "Update Form" : "Save Form"}
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
                Form Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter form title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter form description"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => addField({ type: "text", content: "", width: 12 })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Text
            </button>
            <button
              onClick={() =>
                addField({
                  type: "question",
                  content: "",
                  required: false,
                  questionType: "descriptive",
                  width: 12,
                })
              }
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
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
              <div className="space-y-4 grid grid-cols-12 gap-2">
                {fields.map((field) => (
                  <FormField key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {fields.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No fields added yet. Start by adding a text or question field.
              </p>
            </div>
          )}
        </div>

        {showPreview && (
          <div className="border-l pl-6">
            <div className="sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Form Preview
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
        title={saveAsNew ? "Save as New Form" : formId ? "Update Form" : "Save Form"}
        message={saveAsNew 
          ? "Do you want to save this as a new form?" 
          : formId 
          ? "Do you want to update the existing form?"
          : "Do you want to save this form?"}
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