import React from 'react';
import { Link } from '@inertiajs/react';
import { Post } from '@/types';
import { formatDate } from '@/utils/formatDate';

interface FeaturedArticleProps {
  post: Post;
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {post.featured_image ? (
        <div className="relative h-48">
          <Link href={route('posts.show', post.slug)}>
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </Link>
          {post.category && (
            <Link 
              href={route('categories.show', post.category.slug)}
              className="absolute top-3 left-3 bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground text-xs font-medium px-2 py-1 rounded-md shadow-sm"
            >
              {post.category.name}
            </Link>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">Pas d'image</span>
        </div>
      )}
      
      <div className="p-5">
        <Link href={route('posts.show', post.slug)}>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary/90 transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
          {post.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            {post.user?.profile?.avatar ? (
              <img 
                src={post.user.profile.avatar} 
                alt={post.user.name} 
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary flex items-center justify-center mr-2">
                {post.user?.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {post.user?.name}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}