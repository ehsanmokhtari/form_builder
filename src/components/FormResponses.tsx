import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Form, FormResponse } from "../types/form";
import { FileText, Calendar, ChevronDown, Eye, BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface DetailedResponse {
  question: string;
  answer: string | string[];
  type: string;
}

interface QuestionSummary {
  question: string;
  type: string;
  totalResponses: number;
  options?: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
  responses?: string[];
}

const FormResponses = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<{
    id: string;
    details: DetailedResponse[];
  } | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<QuestionSummary[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      loadResponses(selectedForm);
    }
  }, [selectedForm]);

  useEffect(() => {
    if (selectedForm && responses.length > 0) {
      generateSummary();
    }
  }, [selectedForm, responses]);

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

  const loadResponses = async (formId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("form_responses")
        .select("*")
        .eq("form_id", formId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error("Error loading responses:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = () => {
    const form = forms.find((f) => f.id === selectedForm);
    if (!form) return;

    const questionSummaries: QuestionSummary[] = form.fields
      .filter(
        (field) => field.type === "question" && field.includeInSummary === true
      )
      .map((field) => {
        const summary: QuestionSummary = {
          question: field.content,
          type: field.questionType || "descriptive",
          totalResponses: responses.length,
        };

        if (
          field.questionType === "single" ||
          field.questionType === "multiple"
        ) {
          const options: {
            [key: string]: { count: number; percentage: number };
          } = {};
          field.options?.forEach((option) => {
            options[option] = { count: 0, percentage: 0 };
          });

          responses.forEach((response) => {
            const answer = response.responses[field.id];
            if (Array.isArray(answer)) {
              answer.forEach((choice) => {
                if (options[choice]) {
                  options[choice].count++;
                }
              });
            } else if (answer && options[answer]) {
              options[answer].count++;
            }
          });

          // Calculate percentages
          Object.keys(options).forEach((option) => {
            options[option].percentage =
              (options[option].count / responses.length) * 100;
          });

          summary.options = options;
        } else {
          summary.responses = responses
            .map((response) => response.responses[field.id] as string)
            .filter(Boolean);
        }

        return summary;
      });

    setSummary(questionSummaries);
  };

  const viewResponseDetails = (response: FormResponse) => {
    const form = forms.find((f) => f.id === response.form_id);
    if (!form) return;

    const details: DetailedResponse[] = form.fields
      .filter((field) => field.type === "question")
      .map((field) => ({
        question: field.content,
        answer: response.responses[field.id] || t("noAnswer"),
        type: field.questionType || "descriptive",
      }));

    setSelectedResponse({ id: response.id, details });
    setShowSummary(false);
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
          {t("formResponses")}
        </h2>
        <div className="flex items-center gap-4">
          {selectedForm && responses.length > 0 && (
            <button
              onClick={() => {
                setShowSummary(!showSummary);
                setSelectedResponse(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showSummary ? t("hideSummary") : t("viewSummary")}
            </button>
          )}
          <div className="relative">
            <select
              value={selectedForm || ""}
              onChange={(e) => setSelectedForm(e.target.value || null)}
              className="appearance-none bg-white pl-4 pr-10 py-3 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            >
              <option value="">{t("selectForm")}</option>
              {forms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {selectedForm ? (
        responses.length > 0 ? (
          <div className="space-y-6">
            {showSummary ? (
              <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-purple-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("responseSummary")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("totalResponses")}: {responses.length}
                  </p>
                </div>
                <div className="space-y-8">
                  {summary.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <h4 className="font-medium text-gray-900 mb-4">
                        {item.question}
                      </h4>
                      {item.type === "descriptive" ? (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">
                            {t("latestResponses")}:
                          </p>
                          <ul className="space-y-2">
                            {item.responses?.slice(0, 5).map((response, i) => (
                              <li key={i} className="text-gray-700">
                                {response}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {item.options &&
                            Object.entries(item.options).map(
                              ([option, stats]) => (
                                <div key={option} className="relative">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">
                                      {option}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {stats.count} (
                                      {stats.percentage.toFixed(1)}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-purple-600 h-2.5 rounded-full"
                                      style={{ width: `${stats.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
                          {t("responseId")}
                        </th>
                        <th
                          className={`px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider ${
                            language === "fa" ? "text-right" : "text-left"
                          }`}
                        >
                          {t("submittedAt")}
                        </th>
                        <th
                          className={`px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider ${
                            language === "fa" ? "text-right" : "text-left"
                          }`}
                        >
                          {t("actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responses.map((response) => (
                        <tr
                          key={response.id}
                          className="hover:bg-purple-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="flex-shrink-0 h-5 w-5 text-purple-500" />
                              <span className="ml-2 text-sm text-gray-900">
                                {response.id}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                              {new Date(response.created_at).toLocaleString(
                                language
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => viewResponseDetails(response)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {t("viewDetails")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedResponse && (
              <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-purple-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("responseDetails")}
                  </h3>
                  <button
                    onClick={() => setSelectedResponse(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {t("close")}
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedResponse.details.map((detail, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {detail.question}
                      </h4>
                      <div className="text-gray-600">
                        {Array.isArray(detail.answer) ? (
                          <ul className="list-disc list-inside">
                            {detail.answer.map((ans, i) => (
                              <li key={i}>{ans}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{detail.answer}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-purple-100">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("noResponsesYet")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{t("shareForm")}</p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-purple-100">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t("selectForm")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("selectFormToViewResponses")}
          </p>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
