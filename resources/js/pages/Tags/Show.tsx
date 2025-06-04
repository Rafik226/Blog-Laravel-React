import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import PostCard from '@/components/blog/PostCard';
import { Tag, Post } from '@/types';
import { TagIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

interface TagShowProps {
  tag: Tag;
  posts: {
    data: Post[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
  };
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      is_admin?: boolean;
    } | null;
  };
}

export default function TagShow({ tag, posts, auth }: TagShowProps) {
  const isAuthenticated = auth?.user !== null;
  const isAdmin = auth?.user?.is_admin === true;
  const postsData = posts?.data || [];
  const postsPagination = posts?.pagination || { current_page: 0, last_page: 0, per_page: 0, total: 0, links: [] };

  // Générer une couleur cohérente pour le tag
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
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const tagColorClass = getTagColor(tag.name);

  return (
    <AppLayout showSidebar={isAuthenticated}>
      <Head title={`Tag: ${tag.name}`} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link 
              href={route('tags.index')} 
              className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Tous les tags
            </Link>
          </div>
          
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${tagColorClass} mb-4`}>
              <TagIcon className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{tag.name}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Articles avec le tag {tag.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {postsPagination.total} article{postsPagination.total !== 1 ? 's' : ''} disponible{postsPagination.total !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 py-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Grille des articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsData.length > 0 ? (
              postsData.map((post) => (
                <div key={post.id} className="h-full">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun article disponible pour ce tag.
                </p>
                <Link
                  href={route('tags.index')}
                  className="mt-4 inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Retourner aux tags
                </Link>
              </div>
            )}
          </div>
          
          {/* Pagination - vérification que links existe avant de l'utiliser */}
          {postsPagination.last_page > 1 && postsPagination.links && (
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-1">
                {postsPagination.links.map((link, index) => (
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
        </div>
      </div>
    </AppLayout>
  );
}