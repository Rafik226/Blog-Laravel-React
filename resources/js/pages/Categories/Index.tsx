import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';
import { LockClosedIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CategoriesIndexProps {
  categories: Category[];
  popularPosts?: {
    id: number;
    title: string;
    slug: string;
    views_count: number;
    published_at: string;
  }[];
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
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function CategoriesIndex({ categories, popularPosts = [], auth, filters = {} }: CategoriesIndexProps) {
  // État pour la barre de recherche
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(filters.search || '');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);

    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  // Filtrer les catégories localement
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return categories;
    }
    
    const term = debouncedSearchQuery.toLowerCase();
    return categories.filter(category => 
      category.name.toLowerCase().includes(term) ||
      (category.description && category.description.toLowerCase().includes(term))
    );
  }, [categories, debouncedSearchQuery]);

  // Fonction pour effacer la recherche
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearching(false);
  }, []);
  
  const isAuthenticated = auth?.user !== null;
  const isAdmin = auth?.user?.is_admin === true;

  // Gérer la soumission de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('categories.index'), { search: searchQuery }, {
      preserveState: true,
      preserveScroll: true,
      only: ['categories']
    });
  };

  // Fonction qui génère une carte de catégorie éventuellement modifiée pour les utilisateurs non-connectés
  const renderCategoryCard = (category: Category) => {
    const card = (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow h-full flex flex-col"
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
        variants={itemVariants}
      >
        <Link href={route('categories.show', category.slug)} className="block flex-grow">
          {category.featured_image ? (
            <div className="h-40 mb-4 rounded-md overflow-hidden">
              <img 
                src={category.featured_image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ) : (
            <div className="h-40 mb-4 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <span className="text-4xl text-gray-500 dark:text-gray-400 font-light">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
            {category.name}
          </h2>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {category.description || `Articles dans la catégorie ${category.name}`}
          </p>
        </Link>
          
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
            {category.posts_count || 0} article{(category.posts_count !== 1) && 's'}
          </span>
          
          {isAdmin && (
            <div className="flex space-x-2">
              <Link 
                href={route('admin.categories.edit', category.slug)} 
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Modifier
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    );

    if (!isAuthenticated) {
      return (
        <div className="relative group">
          <div className="filter blur-[1px] group-hover:blur-none transition-all">
            {card}
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <LockClosedIcon className="w-8 h-8 text-white mb-2" />
            <p className="text-white text-sm font-medium px-4 text-center">
              Connectez-vous pour voir les détails
            </p>
            <Link 
              href={route('login')} 
              className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      );
    }

    return card;
  };

  return (
    <AppLayout showSidebar={isAuthenticated}>
      <Head title="Catégories" />
      
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
              Parcourir toutes les catégories
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explorez nos différentes catégories d'articles classés par thèmes.
              {!isAuthenticated && " Connectez-vous pour accéder à tous les détails et fonctionnalités."}
            </p>
          </motion.div>

          {!isAuthenticated && (
            <motion.div 
              className="max-w-md mx-auto mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-blue-700 dark:text-blue-300 mb-3">
                <span className="font-medium">Mode visiteur</span> : Vous pouvez parcourir les catégories, mais l'accès aux détails est limité.
              </p>
              <div className="flex justify-center space-x-3">
                <Link 
                  href={route('login')} 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Se connecter
                </Link>
                <Link 
                  href={route('register')} 
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  S'inscrire
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 py-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Main Content */}
            <motion.div 
              className={`${isAuthenticated ? 'lg:w-3/4' : 'w-full'}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Filtres et recherche */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
                  </span>
                  {filters.search && (
                    <div className="ml-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded text-xs flex items-center">
                      Recherche: "{filters.search}"
                      <button 
                        onClick={() => router.get(route('categories.index'))} 
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>                {/* Barre de recherche */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-grow sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une catégorie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                    {isSearching && (
                      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bouton pour créer une catégorie (admin uniquement) */}
                  {isAdmin && (
                    <Link
                      href={route('admin.categories.create')}
                      className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      <span>Nouvelle</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Affichage des résultats de recherche */}
              {debouncedSearchQuery && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {filteredCategories.length} catégorie{filteredCategories.length > 1 ? 's' : ''} trouvée{filteredCategories.length > 1 ? 's' : ''} pour "{debouncedSearchQuery}"
                    </p>
                    {filteredCategories.length === 0 && (
                      <button
                        onClick={clearSearch}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Effacer la recherche
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Grille des catégories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories && filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <motion.div 
                      key={category.id} 
                      className="h-full"
                      variants={itemVariants}
                    >
                      {renderCategoryCard(category)}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 py-20 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {debouncedSearchQuery 
                        ? `Aucune catégorie ne correspond à votre recherche "${debouncedSearchQuery}".` 
                        : "Aucune catégorie disponible pour le moment."}
                    </p>
                    {debouncedSearchQuery && (
                      <button 
                        onClick={clearSearch}
                        className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Réinitialiser la recherche
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Sidebar - uniquement pour les utilisateurs authentifiés */}
            {isAuthenticated && (
              <motion.div 
                className="lg:w-1/4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Articles populaires
                  </h2>
                  
                  {popularPosts && popularPosts.length > 0 ? (
                    <ul className="space-y-4">
                      {popularPosts.map((post) => (
                        <li key={post.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <Link 
                            href={route('posts.show', post.slug)}
                            className="hover:text-primary transition-colors"
                          >
                            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">
                              {post.title}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                              {post.views_count || 0} vues
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aucun article populaire pour le moment.
                    </p>
                  )}

                  {/* Information statistique */}
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      À propos des catégories
                    </h2>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        Les catégories permettent d'organiser le contenu du blog par thèmes et sujets apparentés.
                      </p>
                      <p>
                        Chaque article appartient à une catégorie principale qui facilite la navigation.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}