import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit, Trash2, MessageSquare, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Post {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  published_at: string | null;
  views_count: number;
  comments_count: number;
  user: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

interface PostsProps {
  posts: {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function AdminPosts({ posts }: PostsProps) {
  const handleDelete = (postSlug: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      router.delete(route('posts.destroy', postSlug), {
        preserveScroll: true,
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Gestion des articles" />
      
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des articles</h1>
            <p className="text-gray-600 mt-2">
              {posts.total} article{posts.total > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={route('posts.create')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Nouvel article
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des articles</CardTitle>
            <CardDescription>
              Gérez tous les articles du blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.data.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <Badge 
                          variant={post.published ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {post.published ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.user.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDistanceToNow(new Date(post.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                        <span>Catégorie: {post.category.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views_count} vue{post.views_count > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {post.comments_count} commentaire{post.comments_count > 1 ? 's' : ''}
                        </span>
                        {post.published_at && (
                          <span>
                            Publié {formatDistanceToNow(new Date(post.published_at), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={route('posts.show', post.slug)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Link>
                      
                      <Link
                        href={route('posts.edit', post.slug)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Modifier
                      </Link>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.slug)}
                        className="text-xs"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {posts.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {posts.current_page} sur {posts.last_page}
                </div>
                <div className="flex items-center space-x-2">
                  {posts.current_page > 1 && (
                    <Link
                      href={route('admin.posts.index', { page: posts.current_page - 1 })}
                      className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Précédent
                    </Link>
                  )}
                  {posts.current_page < posts.last_page && (
                    <Link
                      href={route('admin.posts.index', { page: posts.current_page + 1 })}
                      className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Suivant
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}