import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, UserCheck, UserX, Eye, Search, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  posts_count: number;
  comments_count: number;
}

interface UsersProps {
  users: {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function AdminUsers({ users }: UsersProps) {
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

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return users.data;
    }
    
    const term = debouncedSearchTerm.toLowerCase();
    return users.data.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }, [users.data, debouncedSearchTerm]);

  // Fonction pour effacer la recherche
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  }, []);

  const handleToggleStatus = (userId: number) => {
    router.put(route('admin.users.toggle-status', userId), {}, {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <Head title="Gestion des utilisateurs" />
      
      <div className="p-6">        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion des utilisateurs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {users.total} utilisateur{users.total > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              Gérez les utilisateurs, leurs rôles et leurs statuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="mb-4">                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher par nom ou email..." 
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    </div>
                  )}
                </div>                {debouncedSearchTerm && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">
                      {filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''} pour "{debouncedSearchTerm}"
                    </p>
                    {filteredUsers.length === 0 && (
                      <button
                        onClick={clearSearch}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Effacer la recherche
                      </button>
                    )}
                  </div>
                )}</div>
              
              {/* Liste des utilisateurs */}              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {debouncedSearchTerm ? 'Aucun utilisateur trouvé.' : 'Aucun utilisateur disponible.'}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name}
                        </p><div className="flex space-x-1">
                          <Badge 
                            variant={user.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {user.is_active ? (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Actif
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 mr-1" />
                                Inactif
                              </>
                            )}
                          </Badge>
                          {!user.email_verified_at && (
                            <Badge variant="outline" className="text-xs">
                              Non vérifié
                            </Badge>
                          )}
                        </div>
                      </div>                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>{user.posts_count} article{user.posts_count > 1 ? 's' : ''}</span>
                        <span>{user.comments_count} commentaire{user.comments_count > 1 ? 's' : ''}</span>
                        <span>
                          Inscrit {formatDistanceToNow(new Date(user.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">                    <Link
                      href={route('profiles.show', user.id)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Voir
                    </Link>
                      <Button
                      variant={user.is_active ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                      className="text-xs"
                    >
                      {user.is_active ? (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Activer
                        </>
                      )}
                    </Button>                  </div>
                </div>
                ))
              )}
            </div>
            
            {/* Pagination */}            {users.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {users.current_page} sur {users.last_page}
                </div>
                <div className="flex items-center space-x-2">
                  {users.current_page > 1 && (
                    <Link
                      href={route('admin.users.index', { page: users.current_page - 1 })}
                      className="px-3 py-1 text-sm text-muted-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Précédent
                    </Link>
                  )}
                  {users.current_page < users.last_page && (
                    <Link
                      href={route('admin.users.index', { page: users.current_page + 1 })}
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