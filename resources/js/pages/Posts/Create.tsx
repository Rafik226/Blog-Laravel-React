import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ImageUpload from '@/components/editor/ImageUpload';
import TagSelector from '@/components/editor/TagSelector';
import { Category, Tag } from '@/types';
import { PencilLine, EyeIcon, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import '../../../css/Preview.css';


interface CreatePostProps {
  categories: Category[];
  tags: Tag[];
}

// Interface pour les données du formulaire
interface PostFormData {
  title: string;
  category_id: string;
  content: string;
  featured_image: string;
  published: boolean;
  tags: number[];
  [key: string]: any; // Index signature pour Inertia
}

export default function CreatePost({ categories, tags }: CreatePostProps) {
  // État local pour l'aperçu
  const [isPreview, setIsPreview] = useState<boolean>(false);

  // Formulaire Inertia avec typage explicite
  const { data, setData, post, processing, errors } = useForm<PostFormData>({
    title: '',
    category_id: '',
    content: '',
    featured_image: '',
    published: false,
    tags: [],
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('posts.store'));
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
          {/* Titre */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {data.title || 'Sans titre'}
          </h1>
          
          {/* Catégorie et tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {data.category_id && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {categories.find(c => c.id === parseInt(data.category_id))?.name}
              </span>
            )}
            
            {data.tags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <span 
                  key={tag.id} 
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
                >
                  {tag.name}
                </span>
              ) : null;
            })}
          </div>
          
          {/* Contenu */}
          <div className="prose dark:prose-invert max-w-none">
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
      <Head title="Créer un nouvel article" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <a 
              href={route('posts.index')} 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Retour</span>
            </a>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <PencilLine className="w-6 h-6 mr-2" />
              Créer un nouvel article
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
        
        {isPreview ? (
          renderPreview()
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Titre de l'article */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre de l'article <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    placeholder="Entrez le titre de votre article"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                    minLength={5}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                
                {/* Éditeur de texte riche */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contenu de l'article <span className="text-red-500">*</span>
                  </label>                  <RichTextEditor 
                    content={data.content}
                    onChange={(html: string) => setData('content', html)}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                  )}
                </div>
              </div>
              
              {/* Barre latérale */}
              <div className="space-y-6">
                {/* Publication */}
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Publication
                  </h3>
                  
                  <div className="flex items-center mb-4">                    <input
                      id="published"
                      type="checkbox"
                      checked={data.published}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('published', e.target.checked)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Publier immédiatement
                    </label>
                  </div>
                  
                  <div className="flex justify-between">                    <button
                      type="submit"
                      disabled={processing}
                      className={`px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                        data.published 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span>Traitement...</span>
                        </>
                      ) : data.published ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-1" />
                          <span>Publier</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-1" />
                          <span>Enregistrer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Catégorie */}
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Catégorie <span className="text-red-500">*</span>
                  </h3>
                    <select
                    value={data.category_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('category_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
                  )}
                </div>
                
                {/* Tags */}
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Tags
                  </h3>
                    <TagSelector 
                    availableTags={tags}
                    selectedTags={data.tags}
                    onChange={(selectedTags: number[]) => setData('tags', selectedTags)}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
                  )}
                </div>
                
                {/* Image mise en avant */}
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Image mise en avant
                  </h3>
                    <ImageUpload
                    onImageSelected={(imageUrl: string) => setData('featured_image', imageUrl)}
                    defaultImage={data.featured_image}
                  />
                  {errors.featured_image && (
                    <p className="text-red-500 text-xs mt-1">{errors.featured_image}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}