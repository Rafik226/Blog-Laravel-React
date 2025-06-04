import React from 'react';
import { useForm } from '@inertiajs/react';

interface CommentFormProps {
  postSlug: string;
}

export default function CommentForm({ postSlug }: CommentFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('comments.store', postSlug), {
      onSuccess: () => {
        reset('content');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={data.content}
          onChange={e => setData('content', e.target.value)}
          placeholder="Partagez votre avis sur cet article..."
          className={`w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white ${
            errors.content ? 'border-red-500' : ''
          }`}
          rows={4}
        ></textarea>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={processing}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75"
        >
          {processing ? 'Envoi...' : 'Publier le commentaire'}
        </button>
      </div>
    </form>
  );
}