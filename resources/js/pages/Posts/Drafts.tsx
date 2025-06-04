import React from 'react';
import { Head } from '@inertiajs/react';
import { Post } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PostCard from '@/components/blog/PostCard';
import EmptyState from '@/components/EmptyState';

interface DraftsProps {
  posts: {
    data: Post[];
    meta?: {
      current_page: number;
      last_page: number;
      total: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
    // Pour supporter le format direct de Laravel
    current_page?: number;
    last_page?: number;
    total?: number;
    links?: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Drafts({ posts }: DraftsProps) {
  // Support pour les deux formats de pagination (direct ou structuré)
  const postsData = Array.isArray(posts.data) ? posts.data : 
                    Array.isArray(posts) ? posts : [];
  
  const hasDrafts = postsData.length > 0;
  
  // Récupération des informations de pagination, quel que soit le format
  const meta = posts.meta || {
    current_page: posts.current_page || 1,
    last_page: posts.last_page || 1,
    total: posts.total || postsData.length,
    links: posts.links || []
  };

  return (
    <AppLayout>
      <Head title="Mes brouillons" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Mes brouillons
          </h1>
          
          <a
            href={route('posts.create')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Nouvel article
          </a>
        </div>
        
        {hasDrafts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsData.map((post) => (
              <div key={post.id} className="h-full">
                <PostCard post={post} />
                
                <div className="mt-2 flex justify-end space-x-2">
                  <a
                    href={route('posts.edit', post.slug)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                  >
                    Modifier
                  </a>
                  <a
                    href={route('posts.show', post.slug)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Prévisualiser
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun brouillon"
            description="Vous n'avez aucun article en cours d'écriture. Commencez à rédiger dès maintenant !"
            action={{
              label: "Créer un article",
              href: route('posts.create')
            }}
          />
        )}
        
        {/* Pagination si nécessaire, avec vérification sécurisée */}
        {meta && meta.last_page > 1 && (
          <div className="mt-8 flex justify-center">
            {/* Composant de pagination ici */}
          </div>
        )}
      </div>
    </AppLayout>
  );
}