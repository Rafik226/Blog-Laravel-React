import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Tag } from '@/types';
import { TagIcon } from '@heroicons/react/24/outline';

interface EditTagProps {
  tag: Tag;
}

export default function EditTag({ tag }: EditTagProps) {
  const { data, setData, patch, processing, errors } = useForm({
    name: tag.name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('tags.update', tag.slug));
  };

  return (
    <AppLayout>
      <Head title={`Modifier le tag: ${tag.name}`} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <TagIcon className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Modifier le tag: {tag.name}
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Nom du tag
                </label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <a
                  href={route('tags.index')}
                  className="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Annuler
                </a>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-70"
                >
                  {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}