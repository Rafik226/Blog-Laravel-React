import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { Tag } from '@/types';
import { PlusIcon, TagIcon } from '@heroicons/react/24/outline';

interface TagsProps {
  tags: Tag[];
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      is_admin?: boolean;
    } | null;
  };
  filters?: {
    search?: string;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function Tags({ tags, auth, filters = {} }: TagsProps) {
  // État pour la barre de recherche
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  
  const isAuthenticated = auth?.user !== null;
  const isAdmin = auth?.user?.is_admin === true;

  // Gérer la soumission de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('tags.index'), { search: searchQuery }, {
      preserveState: true,
      preserveScroll: true,
      only: ['tags']
    });
  };

  // Générer une couleur semi-aléatoire mais cohérente pour chaque tag
  const getTagColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    ];
    
    // Utilisation d'un hachage simple pour obtenir un index cohérent
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash; // Conversion en 32bit integer
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <AppLayout showSidebar={isAuthenticated}>
      <Head title="Tags" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Explorer les tags
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez et parcourez le contenu par thème grâce aux tags.
              {!isAuthenticated && " Connectez-vous pour accéder à tous les détails et fonctionnalités."}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 py-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Filtres et recherche */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400">
                  {tags.length} tag{tags.length !== 1 ? 's' : ''}
                </span>
                {filters.search && (
                  <div className="ml-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded text-xs flex items-center">
                    Recherche: "{filters.search}"
                    <button 
                      onClick={() => router.get(route('tags.index'))} 
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Barre de recherche */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <form onSubmit={handleSearch} className="relative flex-grow sm:w-64">
                  <input
                    type="text"
                    placeholder="Rechercher un tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-8 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                  />
                  <button 
                    type="submit" 
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </form>
                
                {/* Bouton pour créer un tag (admin uniquement) */}
                {isAdmin && (
                  <Link
                    href={route('tags.create')}
                    className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    <span>Nouveau</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Liste des tags */}
            {tags && tags.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {tags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    variants={itemVariants}
                  >
                    <Link
                      href={route('tags.show', tag.slug)}
                      className={`${getTagColor(tag.name)} flex items-center justify-between px-4 py-3 rounded-lg hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center">
                        <TagIcon className="w-4 h-4 mr-2 opacity-70" />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                      <span className="bg-white/30 dark:bg-black/20 text-xs rounded-full px-2 py-1">
                        {tag.posts_count || 0}
                      </span>
                    </Link>
                    
                    {/* Actions pour admin (modifier/supprimer) */}
                    {isAdmin && (
                      <div className="mt-1 flex justify-end space-x-2 text-xs">
                        <Link 
                          href={route('tags.edit', tag.slug)} 
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Modifier
                        </Link>
                        <button 
                          onClick={() => {
                            if (confirm(`Voulez-vous vraiment supprimer le tag "${tag.name}" ?`)) {
                              router.delete(route('tags.destroy', tag.slug));
                            }
                          }} 
                          className="text-red-500 hover:text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-20 text-center">
                <TagIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {filters.search 
                    ? `Aucun tag ne correspond à votre recherche "${filters.search}".` 
                    : "Aucun tag disponible pour le moment."}
                </p>
                {filters.search && (
                  <button 
                    onClick={() => router.get(route('tags.index'))}
                    className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Réinitialiser la recherche
                  </button>
                )}
                
                {isAdmin && !filters.search && (
                  <Link
                    href={route('tags.create')}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Créer le premier tag
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}