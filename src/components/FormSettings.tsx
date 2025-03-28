import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Form } from "../types/form";
import { Trash2, Calendar, Layout, Copy, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomDialog from "./CustomDialog";
import { useLanguage } from "../contexts/LanguageContext";

const FormSettings = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error("Error loading forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId: string) => {
    try {
      const { error } = await supabase.from("forms").delete().eq("id", formId);

      if (error) throw error;
      setForms(forms.filter((form) => form.id !== formId));
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const copyForm = async (form: Form) => {
    try {
      const { data, error } = await supabase
        .from("forms")
        .insert({
          title: `${form.title} (Copy)`,
          description: form.description,
          fields: form.fields,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setForms([data, ...forms]);
      }
    } catch (error) {
      console.error("Error copying form:", error);
    }
  };

  const editForm = (form: Form) => {
    navigate("/", { state: { form } });
  };

  const handleDelete = (formId: string) => {
    setFormToDelete(formId);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (formToDelete) {
      await deleteForm(formToDelete);
      setFormToDelete(null);
    }
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {t("formSettings")}
        </h2>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-purple-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th
                  className={`px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider ${
                    language === "fa" ? "text-right" : "text-left"
                  }`}
                >
                  {t("formTitle")}
                </th>
                <th
                  className={`px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider ${
                    language === "fa" ? "text-right" : "text-left"
                  }`}
                >
                  {t("createdAt")}
                </th>
                <th
                  className={`px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider ${
                    language === "fa" ? "text-right" : "text-left"
                  }`}
                >
                  {t("fieldsCount")}
                </th>
                <th
                  className={`px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider ${
                    language === "fa" ? "text-left" : "text-right"
                  }`}
                >
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-purple-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Layout className="flex-shrink-0 h-5 w-5 text-purple-500" />
                      <div className="ms-3">
                        <div className="text-sm font-medium text-gray-900">
                          {form.title}
                        </div>
                        {form.description && (
                          <div className="text-sm text-gray-500">
                            {form.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 me-2" />
                      {new Date(form.created_at).toLocaleString(language)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {form.fields.length} {t("fields")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyForm(form)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                        title={t("copyForm")}
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => editForm(form)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        title={t("editForm")}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-150"
                        title={t("deleteForm")}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {forms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-purple-100">
          <Layout className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t("noForms")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{t("createNewForm")}</p>
        </div>
      )}

      <CustomDialog
        isOpen={dialogOpen}
        title={t("deleteForm")}
        message={t("confirmDeleteForm")}
        onConfirm={confirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default FormSettings;
