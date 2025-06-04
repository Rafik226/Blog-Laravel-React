import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, X, Eye, Trash2, User, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Comment {
  id: number;
  content: string;
  approved: boolean;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  post: {
    id: number;
    title: string;
    slug: string;
  };
}

interface CommentsProps {
  comments: {
    data: Comment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function AdminComments({ comments }: CommentsProps) {
  const handleApprove = (commentId: number) => {
    router.put(route('admin.comments.approve', commentId), {}, {
      preserveScroll: true,
    });
  };

  const handleReject = (commentId: number) => {
    router.put(route('admin.comments.reject', commentId), {}, {
      preserveScroll: true,
    });
  };

  const handleDelete = (commentId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      router.delete(route('comments.destroy', commentId), {
        preserveScroll: true,
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Gestion des commentaires" />
      
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des commentaires</h1>
            <p className="text-gray-600 mt-2">
              {comments.total} commentaire{comments.total > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des commentaires</CardTitle>
            <CardDescription>
              Modérez les commentaires et gérez leur approbation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.data.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant={comment.approved ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {comment.approved ? 'Approuvé' : 'En attente'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {comment.user.name}
                        </span>
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Sur: {comment.post.title}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700 text-sm">
                          {comment.content.length > 200 
                            ? `${comment.content.substring(0, 200)}...` 
                            : comment.content
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={route('posts.show', comment.post.slug)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir l'article
                      </Link>
                      
                      {!comment.approved ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(comment.id)}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approuver
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(comment.id)}
                          className="text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Rejeter
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
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
            {comments.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {comments.current_page} sur {comments.last_page}
                </div>
                <div className="flex items-center space-x-2">
                  {comments.current_page > 1 && (
                    <Link
                      href={route('admin.comments.index', { page: comments.current_page - 1 })}
                      className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Précédent
                    </Link>
                  )}
                  {comments.current_page < comments.last_page && (
                    <Link
                      href={route('admin.comments.index', { page: comments.current_page + 1 })}
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