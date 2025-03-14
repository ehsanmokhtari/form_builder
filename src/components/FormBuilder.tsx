import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormStore } from '../store/formStore';
import FormField from './FormField';
import { Plus, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const FormBuilder = () => {
  const { fields, addField, reorderFields } = useFormStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      setError('Please enter a form title');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Ensure fields array is properly formatted
      const formattedFields = fields.map(field => ({
        ...field,
        options: field.options || [],
        required: field.required || false,
        width: field.width || '12',
        is_multiline: field.is_multiline || false
      }));

      const { error: supabaseError } = await supabase
        .from('forms')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          fields: formattedFields
        });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      navigate('/settings');
    } catch (err) {
      console.error('Error saving form:', err);
      setError(err instanceof Error ? err.message : 'Failed to save form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Form Builder</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Form Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter form title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter form description"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => addField({ type: 'text', content: '', width: 12 })}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Text
        </button>
        <button
          onClick={() =>
            addField({
              type: 'question',
              content: '',
              required: false,
              questionType: 'descriptive',
              width: 12,
            })
          }
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 grid grid-cols-12 gap-2">
            {fields.map((field) => (
              <FormField key={field.id} field={field} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No fields added yet. Start by adding a text or question field.</p>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;