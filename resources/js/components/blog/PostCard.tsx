import React from 'react';
import { Link } from '@inertiajs/react';
import { Post } from '@/types';
import { EyeIcon, MessageSquareIcon, ClockIcon } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

// Fonction utilitaire pour formater les dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export default function PostCard({ post }: PostCardProps) {
  // Vérifier que les propriétés nécessaires existent
  const title = post?.title || 'Sans titre';
  const content = post?.content || '';
  const slug = post?.slug || '';
  
  // Nettoyer le contenu HTML pour l'extrait
  const plainTextContent = content.replace(/<[^>]*>?/gm, '');
  const excerpt = plainTextContent.length > 120 ? 
    `${plainTextContent.substring(0, 120)}...` : 
    plainTextContent;

  // Plusieurs façons possibles de récupérer le nombre de commentaires
  const commentCount = post.comments_count || 
                     (Array.isArray(post.comments) ? post.comments.length : 0) || 
                     post.comment_count || 
                     0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image de couverture */}
      {post.featured_image ? (
        <Link href={route('posts.show', slug)} className="block h-48 overflow-hidden">
          <img 
            src={post.featured_image} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      ) : (
        <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-3xl font-light">
            {title.charAt(0)}
          </span>
        </div>
      )}
      
      {/* Contenu */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Catégorie */}
        {post.category && (
          <Link 
            href={route('categories.show', post.category.slug)}
            className="inline-block text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md mb-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {post.category.name}
          </Link>
        )}
        
        {/* Titre */}
        <Link href={route('posts.show', slug)}>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        {/* Extrait du contenu */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>
        
        {/* Pied de carte */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* Infos auteur */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {post.user?.profile?.avatar ? (
                <img 
                  src={post.user.profile.avatar} 
                  alt={post.user.name || 'Utilisateur'} 
                  className="w-8 h-8 rounded-full mr-2 border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                  {(post.user?.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {post.user?.name || 'Auteur inconnu'}
              </span>
            </div>
          </div>
          
          {/* Métadonnées */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <EyeIcon size={14} className="mr-1" />
                <span>{post.views_count || post.views || 0}</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquareIcon size={14} className="mr-1" />
                <span>{commentCount}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <ClockIcon size={14} className="mr-1" />
              <span>{post.created_at ? formatDate(post.created_at) : 'Date inconnue'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}