import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import PostCard from '@/components/blog/PostCard';
import { Category, Post } from '@/types';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface CategoryShowProps {
  category: Category;
  posts: {
    data: Post[];
    meta: {
      current_page: number;
      last_page: number;
      total: number;
      links?: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
  };
  other_categories: Category[];
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
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

export default function CategoryShow({ category, posts, other_categories = [], auth }: CategoryShowProps) {
  // S'assurer que les données sont définies avec des valeurs par défaut
  const postsData = posts?.data || [];
  const postsMeta = posts?.meta || { total: 0, last_page: 0, links: [] };
  const isAuthenticated = auth?.user !== null;
  
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
      <Head title={category.name} />
      
      <div className="bg-white dark:bg-gray-900 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            {/* Breadcrumb */}
            <nav className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href={route('home')} className="hover:text-gray-700 dark:hover:text-gray-300">
                Accueil
              </Link>
              <span className="mx-2">›</span>
              <Link href={route('categories.index')} className="hover:text-gray-700 dark:hover:text-gray-300">
                Catégories
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900 dark:text-white">{category.name}</span>
            </nav>
            
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {category.name}
              </h1>
              
              {category.description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {category.description}
                </p>
              )}
            </motion.div>

            {!isAuthenticated && (
              <motion.div 
                className="max-w-md mx-auto mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  <span className="font-medium">Mode visiteur</span> : Vous parcourez les articles de la catégorie <strong>{category.name}</strong> avec un accès limité.
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
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content - Posts list */}
            <motion.div 
              className={`${isAuthenticated ? 'lg:w-3/4' : 'w-full'}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Nombre d'articles */}
              <div className="mb-6">
                <span className="text-gray-500 dark:text-gray-400">
                  {postsMeta.total ? `${postsMeta.total} article${postsMeta.total !== 1 ? 's' : ''}` : '0 article'} dans cette catégorie
                </span>
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
                      Aucun article disponible dans cette catégorie pour le moment.
                    </p>
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
            {isAuthenticated && other_categories && other_categories.length > 0 && (
              <motion.div 
                className="lg:w-1/4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Autres catégories
                  </h2>
                  <ul className="space-y-2">
                    {other_categories.map((cat) => (
                      <li key={cat.id}>
                        <Link 
                          href={route('categories.show', cat.slug)}
                          className="flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-1"
                        >
                          <span>{cat.name}</span>
                          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                            {cat.posts_count || 0}
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