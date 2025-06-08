import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { Tag } from '@/types';
import { PlusIcon, TagIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TagsIndexProps {
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

export default function TagsIndex({ tags, auth, filters = {} }: TagsIndexProps) {
  // États pour la barre de recherche dynamique
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(filters.search || '');
  const [isSearching, setIsSearching] = useState(false);
  
  const isAuthenticated = auth?.user !== null;
  const isAdmin = auth?.user?.is_admin === true;

  // Debouncing pour la recherche (300ms de délai)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300);

    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Filtrage local des tags
  const filteredTags = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return tags;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchLower)
    );
  }, [tags, debouncedSearchTerm]);

  // Fonction pour effacer la recherche
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  }, []);

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
          <div className="max-w-4xl mx-auto">            {/* Filtres et recherche */}            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''}
                  {debouncedSearchTerm && (
                    <span className="ml-2 text-primary">
                      (sur {tags.length} total{tags.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </span>
                {debouncedSearchTerm && (
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center w-fit">
                    <MagnifyingGlassIcon className="w-4 h-4 mr-1" />
                    <span className="truncate max-w-[150px] sm:max-w-none">Recherche: "{debouncedSearchTerm}"</span>
                    <button 
                      onClick={clearSearch}
                      className="ml-2 text-primary hover:text-primary/70"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Barre de recherche dynamique */}
              <div className="flex items-center space-x-2 w-full lg:w-auto">
                <div className="relative flex-grow lg:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white transition-colors"
                  />
                  {(searchTerm || isSearching) && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {isSearching ? (
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      ) : searchTerm ? (
                        <button
                          onClick={clearSearch}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
                  {/* Bouton pour créer un tag (admin uniquement) */}
                {isAdmin && (
                  <Link
                    href={route('admin.tags.create')}
                    className="inline-flex items-center justify-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap min-w-[100px] sm:min-w-auto"
                  >
                    <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Nouveau</span>
                    <span className="sm:hidden">+</span>
                  </Link>
                )}
              </div>
            </div>            {/* Liste des tags */}
            {filteredTags && filteredTags.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredTags.map((tag) => (
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
                          href={route('admin.tags.edit', tag.slug)} 
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
                <div className="mx-auto mb-4">
                  {isSearching ? (
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  ) : (
                    <TagIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" />
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {isSearching ? "Recherche en cours..." :
                    debouncedSearchTerm 
                      ? `Aucun tag ne correspond à votre recherche "${debouncedSearchTerm}".` 
                      : "Aucun tag disponible pour le moment."
                  }
                </p>
                {debouncedSearchTerm && !isSearching && (
                  <button 
                    onClick={clearSearch}
                    className="mb-4 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                  >
                    Effacer la recherche
                  </button>
                )}
                  {isAdmin && !debouncedSearchTerm && !isSearching && (
                  <Link
                    href={route('tags.create')}
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors min-w-[180px] sm:min-w-auto"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    <span className="whitespace-nowrap">Créer le premier tag</span>
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