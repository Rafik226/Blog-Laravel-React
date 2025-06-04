import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, ShieldOff, UserCheck, UserX, Eye } from 'lucide-react';
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
  const handleToggleStatus = (userId: number) => {
    router.put(route('admin.users.toggle-status', userId), {}, {
      preserveScroll: true,
    });
  };

  const handleToggleAdmin = (userId: number) => {
    router.put(route('admin.users.toggle-admin', userId), {}, {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <Head title="Gestion des utilisateurs" />
      
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="text-gray-600 mt-2">
              {users.total} utilisateur{users.total > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
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
              {users.data.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <div className="flex space-x-1">
                          {user.is_admin && (
                            <Badge variant="destructive" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
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
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
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
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={route('profiles.show', user.id)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
                    </Button>
                    
                    <Button
                      variant={user.is_admin ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => handleToggleAdmin(user.id)}
                      className="text-xs"
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="w-3 h-3 mr-1" />
                          Retirer admin
                        </>
                      ) : (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Promouvoir admin
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {users.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {users.current_page} sur {users.last_page}
                </div>
                <div className="flex items-center space-x-2">
                  {users.current_page > 1 && (
                    <Link
                      href={route('admin.users.index', { page: users.current_page - 1 })}
                      className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Précédent
                    </Link>
                  )}
                  {users.current_page < users.last_page && (
                    <Link
                      href={route('admin.users.index', { page: users.current_page + 1 })}
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