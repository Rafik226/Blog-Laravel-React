import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MessageSquare, Hash, TrendingUp, Calendar } from 'lucide-react';

interface DashboardProps {
  stats: {
    users: number;
    posts: number;
    published_posts: number;
    comments: number;
    pending_comments: number;
    categories: number;
    tags: number;
  };
  recentPosts: Array<{
    id: number;
    title: string;
    slug: string;
    created_at: string;
    user: {
      id: number;
      name: string;
    };
    category: {
      id: number;
      name: string;
    };
  }>;
  recentComments: Array<{
    id: number;
    content: string;
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
  }>;
  monthlyPosts: Array<{
    year: number;
    month: number;
    count: number;
  }>;
}

export default function AdminDashboard({ stats, recentPosts, recentComments, monthlyPosts }: DashboardProps) {
  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.users,
      icon: Users,
      description: 'Total des utilisateurs',
      color: 'text-blue-600',
    },
    {
      title: 'Articles',
      value: stats.published_posts,
      icon: FileText,
      description: `${stats.posts} au total`,
      color: 'text-green-600',
    },
    {
      title: 'Commentaires',
      value: stats.comments,
      icon: MessageSquare,
      description: `${stats.pending_comments} en attente`,
      color: 'text-orange-600',
    },
    {
      title: 'Catégories',
      value: stats.categories,
      icon: Hash,
      description: 'Catégories actives',
      color: 'text-purple-600',
    },
  ];

  return (
    <AppLayout>
      <Head title="Tableau de bord administrateur" />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de votre blog</p>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Articles récents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Articles récents
              </CardTitle>
              <CardDescription>Les 5 derniers articles publiés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Par {post.user.name} • {post.category.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commentaires récents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Commentaires récents
              </CardTitle>
              <CardDescription>Les 5 derniers commentaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {comment.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        Par {comment.user.name} sur "{comment.post.title}"
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques mensuelles */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Articles par mois
              </CardTitle>
              <CardDescription>Évolution des publications sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between space-x-2 h-40">
                {monthlyPosts.map((month, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-primary w-8 rounded-t transition-all duration-300"
                      style={{ 
                        height: `${Math.max(8, (month.count / Math.max(...monthlyPosts.map(m => m.count))) * 100)}%`
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {month.month}/{month.year}
                    </span>
                    <span className="text-xs font-medium">{month.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
