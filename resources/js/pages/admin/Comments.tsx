import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Check, X, Eye, Trash2, User, FileText, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300);

    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Filtrer les commentaires en fonction du terme de recherche
  const filteredComments = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return comments.data;
    }
    
    const term = debouncedSearchTerm.toLowerCase();
    return comments.data.filter(comment => 
      comment.content.toLowerCase().includes(term) ||
      comment.user.name.toLowerCase().includes(term) ||
      comment.post.title.toLowerCase().includes(term)
    );
  }, [comments.data, debouncedSearchTerm]);

  // Fonction pour effacer la recherche
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  }, []);

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
      
      <div className="p-6">        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion des commentaires</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {comments.total} commentaire{comments.total > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des commentaires</CardTitle>
            <CardDescription>
              Modérez les commentaires et gérez leur approbation
            </CardDescription>
          </CardHeader>          <CardContent>
            <div className="space-y-4">              {/* Barre de recherche */}
              <div className="mb-4">                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher par contenu, auteur ou titre d'article..." 
                    className="pl-10 pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {isSearching && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 dark:border-orange-400"></div>
                    </div>
                  )}
                </div>                {debouncedSearchTerm && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">
                      {filteredComments.length} résultat{filteredComments.length > 1 ? 's' : ''} trouvé{filteredComments.length > 1 ? 's' : ''} pour "{debouncedSearchTerm}"
                    </p>
                    {filteredComments.length === 0 && (
                      <button
                        onClick={clearSearch}
                        className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
                      >
                        Effacer la recherche
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Liste des commentaires */}              {filteredComments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {debouncedSearchTerm ? 'Aucun commentaire trouvé.' : 'Aucun commentaire disponible.'}
                  </p>
                </div>
              ) : (
                filteredComments.map((comment) => (
                <div key={comment.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant={comment.approved ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {comment.approved ? 'Approuvé' : 'En attente'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {comment.user.name}
                        </span>
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Sur: {comment.post.title}
                        </span>
                      </div>
                        <div className="bg-muted p-3 rounded-md">
                        <p className="text-foreground text-sm">
                          {comment.content.length > 200 
                            ? `${comment.content.substring(0, 200)}...` 
                            : comment.content
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">                      <Link
                        href={route('posts.show', comment.post.slug)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir l'article
                      </Link>
                      
                      {!comment.approved ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(comment.id)}
                          className="text-xs bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
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
                    </div>                  </div>
                </div>
                ))
              )}
            </div>
            
            {/* Pagination */}            {comments.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {comments.current_page} sur {comments.last_page}
                </div>
                <div className="flex items-center space-x-2">
                  {comments.current_page > 1 && (
                    <Link
                      href={route('admin.comments.index', { page: comments.current_page - 1 })}
                      className="px-3 py-1 text-sm text-muted-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Précédent
                    </Link>
                  )}
                  {comments.current_page < comments.last_page && (
                    <Link
                      href={route('admin.comments.index', { page: comments.current_page + 1 })}
                      className="px-3 py-1 text-sm text-muted-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
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