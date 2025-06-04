import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import PostCard from '@/components/blog/PostCard';
import { Post } from '@/types';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface PostsIndexProps {
  posts: {
    data: Post[];
    meta: {
      current_page: number;
      last_page: number;
      total: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
  };
  categories?: {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
  }[];
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
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

export default function PostsIndex({ posts, categories = [], auth, filters = {} }: PostsIndexProps) {
  // État pour la barre de recherche
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  // S'assurer que posts est défini avec des valeurs par défaut
  const postsData = posts?.data || [];
  const postsMeta = posts?.meta || { total: 0, last_page: 0, links: [] };
  const isAuthenticated = auth?.user !== null;
  
  // Gérer la soumission de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('posts.index'), { search: searchQuery }, {
      preserveState: true,
      preserveScroll: true,
      only: ['posts']
    });
  };
  
  // Fonction qui génère un post-card modifié pour les utilisateurs non-connectés
  const renderPostCard = (post: Post) => {
    if (isAuthenticated) {
      return <PostCard post={post} />;
    }
    
    return (
      <div className="relative group">
        <div className={`${!isAuthenticated ? 'filter blur-[1px] group-hover:blur-none transition-all' : ''}`}>
          <PostCard post={post} />
        </div>
        
        {!isAuthenticated && (
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
        )}
      </div>
    );
  };

  return (
    <AppLayout showSidebar={isAuthenticated}>
      <Head title="Articles" />
      
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
              Tous les articles
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez notre collection d'articles sur différents sujets.
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
                <span className="font-medium">Mode visiteur</span> : Vous pouvez parcourir les articles, mais l'accès aux détails est limité.
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
                    {postsMeta.total} article{postsMeta.total !== 1 ? 's' : ''}
                  </span>
                  {filters.search && (
                    <div className="ml-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded text-xs flex items-center">
                      Recherche: "{filters.search}"
                      <button 
                        onClick={() => router.get(route('posts.index'))} 
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Barre de recherche accessible à tous */}
                <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Rechercher..."
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
              </div>

              {/* Liste des articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsData && postsData.length > 0 ? (
                  postsData.map((post) => (
                    <motion.div 
                      key={post.id}
                      variants={itemVariants}
                      className="h-full"
                    >
                      {renderPostCard(post)}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 py-20 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {filters.search 
                        ? `Aucun article ne correspond à votre recherche "${filters.search}".` 
                        : "Aucun article disponible pour le moment."}
                    </p>
                    {filters.search && (
                      <button 
                        onClick={() => router.get(route('posts.index'))}
                        className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Réinitialiser la recherche
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {postsMeta.last_page > 1 && postsMeta.links && (
                <div className="mt-10 flex justify-center">
                  <nav className="flex items-center space-x-1">
                    {postsMeta.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-3 py-1 rounded-md text-sm ${
                          link.active 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        preserveScroll
                        preserveState
                        only={['posts']}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
              )}
            </motion.div>
            
            {/* Sidebar - uniquement pour les utilisateurs authentifiés */}
            {isAuthenticated && categories && categories.length > 0 && (
              <motion.div 
                className="lg:w-1/4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Catégories
                  </h2>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link 
                          href={route('categories.show', category.slug)}
                          className="flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-1"
                        >
                          <span>{category.name}</span>
                          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                            {category.posts_count || 0}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}