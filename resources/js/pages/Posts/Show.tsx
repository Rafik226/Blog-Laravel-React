import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { Post, Comment } from '@/types';
import { formatDate } from '@/utils/formatDate';
import CommentForm from '@/components/blog/CommentForm';

interface PostShowProps {
  post: Post;
  related_posts: Post[];
  comments: Comment[];
  auth: {
    user: {
      id: number;
      name: string;
      is_admin?: boolean;
    } | null;
  };
}

export default function PostShow({ post, related_posts, comments, auth }: PostShowProps) {
  // Fonction pour vérifier si l'utilisateur est admin ou auteur de l'article
  const canModerate = () => {
    return auth.user && (auth.user.is_admin || auth.user.id === post.user_id);
  };

  // Fonction pour vérifier si l'utilisateur peut supprimer un commentaire
  const canDeleteComment = (commentUserId: number) => {
    return auth.user && (auth.user.is_admin || auth.user.id === commentUserId || auth.user.id === post.user_id);
  };

  return (
    <AppLayout showSidebar={true}>
      <Head title={post.title} />
      
      <div className="bg-white dark:bg-gray-900 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href={route('home')} className="hover:text-gray-700 dark:hover:text-gray-300">
                Accueil
              </Link>
              <span className="mx-2">›</span>
              <Link href={route('posts.index')} className="hover:text-gray-700 dark:hover:text-gray-300">
                Articles
              </Link>
              {post.category && (
                <>
                  <span className="mx-2">›</span>
                  <Link 
                    href={route('categories.show', post.category.slug)} 
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {post.category.name}
                  </Link>
                </>
              )}
              <span className="mx-2">›</span>
              <span className="text-gray-900 dark:text-white">{post.title}</span>
            </nav>
            
            {/* Article title */}
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {post.title}
            </motion.h1>
            
            {/* Article meta */}
            <div className="flex items-center mb-8 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center">
                {post.user?.profile?.avatar ? (
                  <img 
                    src={post.user.profile.avatar} 
                    alt={post.user.name} 
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary flex items-center justify-center mr-2">
                    {post.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>Par {post.user?.name}</span>
              </div>
              
              <span className="mx-3">•</span>
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              
              {post.category && (
                <>
                  <span className="mx-3">•</span>
                  <Link 
                    href={route('categories.show', post.category.slug)}
                    className="text-primary hover:text-primary/80"
                  >
                    {post.category.name}
                  </Link>
                </>
              )}

              {/* Afficher le lien d'édition si l'utilisateur est l'auteur ou admin */}
              {auth.user && (auth.user.id === post.user_id || auth.user.is_admin) && (
                <>
                  <span className="mx-3">•</span>
                  <Link 
                    href={route('posts.edit', post.slug)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Éditer
                  </Link>
                </>
              )}
            </div>
            
            {/* Featured image */}
            {post.featured_image && (
              <motion.div 
                className="mb-8 rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-auto"
                />
              </motion.div>
            )}
            
            {/* Article content */}
            <motion.div 
              className="prose dark:prose-invert max-w-none mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link 
                      key={tag.id} 
                      href={route('tags.show', tag.slug)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Related posts (optional) */}
            {related_posts && related_posts.length > 0 && (
              <div className="mb-16">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Articles similaires
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related_posts.map(relatedPost => (
                    <Link 
                      key={relatedPost.id} 
                      href={route('posts.show', relatedPost.slug)}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {relatedPost.featured_image && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={relatedPost.featured_image} 
                            alt={relatedPost.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(relatedPost.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Comments section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
                Commentaires ({comments.filter(c => c.approved || canModerate()).length})
              </h3>
              
              {comments.filter(c => c.approved || canModerate()).length > 0 ? (
                <div className="space-y-8">
                  {comments.filter(c => c.approved || canModerate()).map(comment => (
                    <div key={comment.id} className={`${
                      !comment.approved ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700' : 'bg-gray-50 dark:bg-gray-800'
                    } p-6 rounded-lg`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary flex items-center justify-center mr-3">
                            {comment.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {comment.user?.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(comment.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions pour les commentaires */}
                        <div className="flex gap-2">
                          {/* Boutons d'approbation (admin seulement) */}
                          {!comment.approved && canModerate() && (
                            <Link
                              href={route('comments.approve', comment.id)}
                              method="put"
                              as="button"
                              className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800/50"
                            >
                              Approuver
                            </Link>
                          )}
                          
                          {/* Bouton de suppression */}
                          {canDeleteComment(comment.user_id) && (
                            <Link
                              href={route('comments.destroy', comment.id)}
                              method="delete"
                              as="button"
                              className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800/50"
                              onClick={(e) => {
                                if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              Supprimer
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </div>
                      
                      {/* Badge "En attente" pour les commentaires non approuvés */}
                      {!comment.approved && (
                        <div className="mt-3">
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded">
                            En attente d'approbation
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Soyez le premier à commenter cet article.
                </p>
              )}
              
              {/* Formulaire d'ajout de commentaire */}
              {auth.user ? (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Ajouter un commentaire
                  </h4>
                  <CommentForm postSlug={post.slug} />
                </div>
              ) : (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Connectez-vous pour laisser un commentaire.
                  </p>
                  <Link
                    href={route('login')}
                    className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Se connecter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}