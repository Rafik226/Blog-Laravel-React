import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ImageUpload from '@/components/editor/ImageUpload';
import TagSelector from '@/components/editor/TagSelector';
import { Category, Tag, Post } from '@/types';
import { PencilLine, EyeIcon, ArrowLeft, Save } from 'lucide-react';
import '../../../css/Preview.css';

interface EditPostProps {
  post: Post;
  categories: Category[];
  tags: Tag[];
  selectedTags: number[];
}

export default function EditPost({ post, categories, tags, selectedTags }: EditPostProps) {
  // État local pour l'aperçu
  const [isPreview, setIsPreview] = useState(false);

  // Formulaire Inertia
  const { data, setData, put, processing, errors } = useForm({
    title: post.title,
    category_id: post.category_id,
    content: post.content,
    featured_image: post.featured_image || '',
    published: post.published,
    tags: selectedTags,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('posts.update', post.slug));
  };

  // Fonction pour rendre le HTML en mode aperçu
  const renderPreview = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Image principale */}
        {data.featured_image && (
          <div className="w-full h-72 overflow-hidden">
            <img 
              src={data.featured_image} 
              alt={data.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          {/* Titre et catégorie */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {data.title || 'Titre de l\'article'}
            </h1>
            
            {/* Catégorie */}
            {data.category_id && (
              <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-2 py-1 rounded">
                {categories.find(c => c.id === data.category_id)?.name || 'Catégorie'}
              </span>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {data.tags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <span 
                  key={tag.id}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
                >
                  {tag.name}
                </span>
              ) : null;
            })}
          </div>
          
          {/* Contenu */}
          <div className="prose dark:prose-invert max-w-none custom-preview">
            {data.content ? (
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Aucun contenu pour le moment...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <Head title={`Modifier l'article: ${post.title}`} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <a 
              href={route('posts.show', post.slug)} 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Retour</span>
            </a>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <PencilLine className="w-6 h-6 mr-2" />
              Modifier l'article
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`px-4 py-2 rounded-md flex items-center ${
                isPreview 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <EyeIcon className="w-5 h-5 mr-1" />
              {isPreview ? 'Édition' : 'Aperçu'}
            </button>
          </div>
        </div>
        
        {isPreview ? renderPreview() : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Titre de l'article *
              </label>
              <input
                type="text"
                id="title"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white sm:text-sm ${
                  errors.title ? 'border-red-500' : ''
                }`}
                placeholder="Entrez le titre de votre article"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Catégorie *
              </label>
              <select
                id="category"
                value={data.category_id}
                onChange={e => setData('category_id', Number(e.target.value))}
                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white sm:text-sm ${
                  errors.category_id ? 'border-red-500' : ''
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
              )}
            </div>
            
            {/* Image mise en avant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image mise en avant
              </label>            
            {/* Image mise en avant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image mise en avant
              </label>
              <ImageUpload
                onImageSelected={(imageUrl) => setData('featured_image', imageUrl)}
                defaultImage={data.featured_image}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4"
              />
              {errors.featured_image && (
                <p className="mt-1 text-sm text-red-500">{errors.featured_image}</p>
              )}
            </div>
            </div>
            
            {/* Contenu */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contenu de l'article *
              </label>
              <RichTextEditor 
                content={data.content} 
                onChange={(content) => setData('content', content)}
                placeholder="Commencez à rédiger votre article..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <TagSelector
                availableTags={tags}
                selectedTags={data.tags} 
                onChange={(selected) => setData('tags', selected)}
            />
            </div>
            
            {/* Options de publication */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  checked={data.published}
                  onChange={e => setData('published', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Publier immédiatement
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Si non coché, l'article sera enregistré comme brouillon.
              </p>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3">
              <a
                href={route('posts.show', post.slug)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Annuler
              </a>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center"
              >
                {processing ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-1" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}