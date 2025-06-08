import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import PostCard from '@/components/blog/PostCard';
import { User, Post } from '@/types';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Edit, 
  FileText, 
  MessageSquare,
  UserCheck,
  UserX,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProfileShowProps {
  user: User;
  posts: {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links?: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function ProfileShow({ user, posts }: ProfileShowProps) {
  const postsData = posts?.data || [];
  const postsMeta = posts || { total: 0, current_page: 1, last_page: 1 };

  return (
    <AppLayout>
      <Head title={`Profil de ${user.name}`} />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation de retour */}
          <div className="mb-6">
            <Link
              href={route('admin.users.index')}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la gestion des utilisateurs
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Profil utilisateur */}
            <motion.div 
              className="lg:col-span-1"
              variants={itemVariants}
            >
              <Card className="sticky top-8">
                <CardHeader className="text-center pb-4">
                  {/* Avatar */}
                  <div className="mx-auto mb-4">
                    {user.profile?.avatar ? (
                      <img
                        src={user.profile.avatar}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </CardDescription>

                  {/* Badges de statut */}
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
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
                        Email non vérifié
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Bio */}
                  {user.profile?.bio && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Biographie
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {user.profile.bio}
                      </p>
                    </div>
                  )}

                  {/* Informations */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-3 text-blue-500" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-3 text-green-500" />
                      <span>
                        Inscrit {formatDistanceToNow(new Date(user.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4 mr-3 text-purple-500" />
                      <span>{postsMeta.total} article{postsMeta.total !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MessageSquare className="w-4 h-4 mr-3 text-orange-500" />
                      <span>{user.comments_count || 0} commentaire{(user.comments_count || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>                  {/* Actions admin */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Actions administrateur
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant={user.is_active ? "outline" : "default"}
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          // Action toggle status
                          window.location.href = route('admin.users.toggle-status', user.id);
                        }}
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="w-3 h-3 mr-2" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 mr-2" />
                            Activer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Articles de l'utilisateur */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Articles publiés
                  </CardTitle>
                  <CardDescription>
                    {postsMeta.total} article{postsMeta.total !== 1 ? 's' : ''} publié{postsMeta.total !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {postsData && postsData.length > 0 ? (
                    <div className="space-y-6">
                      {/* Grille des articles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {postsData.map((post) => (
                          <motion.div 
                            key={post.id}
                            variants={itemVariants}
                            className="h-full"
                          >
                            <PostCard post={post} />
                          </motion.div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {postsMeta.last_page > 1 && postsMeta.links && (
                        <div className="flex justify-center mt-8">
                          <nav className="flex items-center space-x-1">
                            {postsMeta.links.map((link, index) => (
                              <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                  link.active 
                                    ? 'bg-blue-600 text-white' 
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
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Aucun article publié
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Cet utilisateur n'a pas encore publié d'articles.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
