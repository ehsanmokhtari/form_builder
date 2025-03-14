import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Form, FormField } from '../types/form';

const FormResponsePage = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadForms();
  }, []);

  const handleFormSelect = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    setSelectedForm(form || null);
    setResponses({});
  };

  const handleResponseChange = (fieldId: string, value: string | string[]) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedForm) return;

    // Check for required fields
    const missingFields = selectedForm.fields
      .filter(field => field.required && (
        !responses[field.id] || 
        (Array.isArray(responses[field.id]) && responses[field.id].length === 0)
      ))
      .map(field => field.content);

    if (missingFields.length > 0) {
      alert(`Please fill out the required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('form_responses')
        .insert({
          form_id: selectedForm.id,
          responses,
        });

      if (error) throw error;
      alert('Response submitted successfully!');
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Respond to a Form
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Select a form and share your responses
          </p>
        </div>

        <div className="mb-8">
          <select 
            onChange={(e) => handleFormSelect(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="">Select a form</option>
            {forms.map(form => (
              <option key={form.id} value={form.id}>
                {form.title}
              </option>
            ))}
          </select>
        </div>

        {selectedForm && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{selectedForm.title}</h3>
              <div className="grid grid-cols-12 gap-6">
                {selectedForm.fields
                  .sort((a, b) => a.order - b.order)
                  .map((field: FormField) => {
                    const widthClass = `col-span-${field.width || 12}`;
                    return (
                      <div key={field.id} className={`${widthClass}`}>
                        {field.type === 'question' && (
                          <div className={`space-y-3 ${field.answerPlacement === 'front' ? 'flex items-center gap-4' : ''}`}>
                            <label className="block text-sm font-medium text-gray-700 text-nowrap">
                              {field.content} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {field.questionType === 'descriptive' ? (
                              field.is_multiline ? (
                                <textarea
                                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                                  rows={4}
                                  onChange={(e) => handleResponseChange(field.id, e.target.value)}
                                  placeholder="Enter your response..."
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                                  onChange={(e) => handleResponseChange(field.id, e.target.value)}
                                  placeholder="Enter your response..."
                                />
                              )
                            ) : (
                              <div className={`gap-4 ${field.optionLayout === 'column' ? 'flex flex-col' : 'flex flex-row'}`}>
                                {field.options?.map((option, index) => (
                                  <div key={index} className="flex items-center">
                                    <input
                                      type={field.questionType === 'single' ? 'radio' : 'checkbox'}
                                      name={field.id}
                                      value={option}
                                      className={`h-4 w-4 ${
                                        field.questionType === 'single' 
                                          ? 'text-purple-600 focus:ring-purple-500' 
                                          : 'rounded text-purple-600 focus:ring-purple-500'
                                      }`}
                                      onChange={(e) => {
                                        if (field.questionType === 'single') {
                                          handleResponseChange(field.id, e.target.value);
                                        } else {
                                          const currentResponses = responses[field.id] as string[] || [];
                                          const newResponses = e.target.checked
                                            ? [...currentResponses, option]
                                            : currentResponses.filter(res => res !== option);
                                          handleResponseChange(field.id, newResponses);
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
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponsePage;