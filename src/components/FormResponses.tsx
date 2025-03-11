import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Form, FormResponse } from '../types/form';
import { FileText, Calendar, ChevronDown } from 'lucide-react';

const FormResponses = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      loadResponses(selectedForm);
    }
  }, [selectedForm]);

  const loadForms = async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async (formId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('form_responses')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-3xl font-extrabold text-gray-900">Form Responses</h2>
        <div className="relative">
          <select
            value={selectedForm || ''}
            onChange={(e) => setSelectedForm(e.target.value || null)}
            className="appearance-none bg-white pl-4 pr-10 py-3 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
          >
            <option value="">Select a form</option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {selectedForm ? (
        responses.length > 0 ? (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-purple-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Response ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Responses
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response) => (
                    <tr key={response.id} className="hover:bg-purple-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="flex-shrink-0 h-5 w-5 text-purple-500" />
                          <span className="ml-2 text-sm text-gray-900">{response.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                          {new Date(response.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-purple-50 rounded-lg p-4 font-mono">
                          {JSON.stringify(response.responses, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-purple-100">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
            <p className="mt-1 text-sm text-gray-500">Share your form to start collecting responses.</p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-purple-100">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Select a form</h3>
          <p className="mt-1 text-sm text-gray-500">Choose a form to view its responses.</p>
        </div>
      )}
    </div>
  );
};

export default FormResponses;