import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BarChart3, TrendingUp, Calendar, Eye, Users, MessageSquare, Award, Activity, User, FileText, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { 
  DailyView, 
  TopPost, 
  ViewStats, 
  CategoryStat, 
  AuthorStat, 
  CommentsStats, 
  MonthlyStats, 
  RecentActivity 
} from '@/types';

interface ViewStatsProps {
  dailyViews: DailyView[];
  topPosts: TopPost[];
  stats: ViewStats;
  categoryStats: CategoryStat[];
  recentActivity: RecentActivity[];
  commentsStats: CommentsStats;
  topAuthors: AuthorStat[];
  monthlyStats: MonthlyStats[];
}

export default function ViewStats({ 
  dailyViews, 
  topPosts, 
  stats, 
  categoryStats, 
  recentActivity, 
  commentsStats, 
  topAuthors, 
  monthlyStats 
}: ViewStatsProps) {  // Fonction pour calculer la hauteur maximale des barres
  const getMaxViewHeight = () => {
    if (!dailyViews || dailyViews.length === 0) return 100;
    const maxViews = Math.max(...dailyViews.map(day => day.count));
    return maxViews > 0 ? maxViews : 100;
  };

  // Fonction pour formater les dates de manière responsive
  const formatDate = (dateStr: string, isSmallScreen = false) => {
    const date = new Date(dateStr);
    if (isSmallScreen) {
      return date.toLocaleDateString('fr-FR', { day: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  // Fonction pour formater les nombres
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const maxViewCount = getMaxViewHeight();

  return (
    <AppLayout>
      <Head title="Statistiques de vues" />
      
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header responsive */}
        <div className="mb-4 sm:mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Statistiques complètes</h1>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Derniers 30 jours</span>
          </div>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Vues totales</p>
                  <p className="text-lg sm:text-xl font-bold">{formatNumber(stats.totalViews)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Visiteurs uniques</p>
                  <p className="text-lg sm:text-xl font-bold">{formatNumber(stats.uniqueVisitors)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Articles publiés</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Vues/Article</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.avgViewsPerPost}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-500">Auteurs actifs</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.totalAuthors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Grid responsive - 1 colonne sur mobile, 2 sur desktop */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2 mb-6">
          {/* Graphique des vues quotidiennes */}
          <Card className="col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <BarChart3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Vues quotidiennes
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Nombre de vues par jour sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {dailyViews && dailyViews.length > 0 ? (
                <div className="relative">
                  {/* Conteneur du graphique avec hauteur fixe */}
                  <div className="h-48 sm:h-64 w-full relative bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                    {/* Graphique des barres */}
                    <div className="absolute bottom-6 left-0 right-0 h-40 sm:h-52 flex items-end justify-between px-2">
                      {dailyViews.map((day, index) => {
                        const heightPercentage = maxViewCount > 0 ? (day.count / maxViewCount) * 100 : 0;
                        const minHeight = 4; // Hauteur minimale en pixels
                        const calculatedHeight = Math.max(minHeight, (heightPercentage / 100) * (window.innerWidth < 640 ? 160 : 208)); // 160px pour mobile, 208px pour desktop
                        
                        return (
                          <div key={index} className="flex flex-col items-center flex-1 group cursor-pointer">
                            {/* Tooltip au hover */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {day.count} vues le {formatDate(day.date)}
                            </div>
                            
                            {/* Barre */}
                            <div 
                              className="bg-primary hover:bg-primary/80 transition-all duration-300 rounded-t-sm mx-0.5 sm:mx-1"
                              style={{ 
                                height: `${calculatedHeight}px`,
                                width: `${Math.max(8, 100 / dailyViews.length - 4)}%`,
                                minWidth: '6px',
                                maxWidth: '20px'
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Labels des dates */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                      {dailyViews.map((day, index) => (
                        <div key={index} className="flex-1 text-center">
                          <span className="text-[8px] sm:text-xs text-gray-500 whitespace-nowrap">
                            <span className="hidden sm:inline">{formatDate(day.date)}</span>
                            <span className="sm:hidden">{formatDate(day.date, true)}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Légende pour mobile */}
                  <div className="sm:hidden mt-2 text-xs text-gray-500 text-center">
                    Survolez les barres pour voir les détails
                  </div>
                  
                  {/* Statistiques du graphique */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-primary">
                        {dailyViews.reduce((sum, day) => sum + day.count, 0)}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-primary">
                        {Math.round(dailyViews.reduce((sum, day) => sum + day.count, 0) / dailyViews.length)}
                      </p>
                      <p className="text-xs text-gray-500">Moyenne</p>
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-primary">
                        {Math.max(...dailyViews.map(day => day.count))}
                      </p>
                      <p className="text-xs text-gray-500">Max</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-48 sm:h-64 items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Aucune donnée disponible</p>
                    <p className="text-xs text-gray-400 mt-1">Les statistiques apparaîtront après les premières visites</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques des commentaires */}
          <Card className="col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Engagement des utilisateurs
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Statistiques des commentaires et interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{commentsStats.approved}</p>
                  <p className="text-xs text-green-600">Commentaires approuvés</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{commentsStats.pending}</p>
                  <p className="text-xs text-yellow-600">En attente</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{commentsStats.recent}</p>
                  <p className="text-xs text-blue-600">Cette semaine</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">{commentsStats.total}</p>
                  <p className="text-xs text-purple-600">Total</p>
                </div>
              </div>
              
              {/* Ratio d'engagement */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Taux d'approbation</span>
                  <span className="text-xs font-medium">
                    {commentsStats.total > 0 
                      ? Math.round((commentsStats.approved / commentsStats.total) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${commentsStats.total > 0 
                        ? (commentsStats.approved / commentsStats.total) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nouvelle rangée pour top posts et catégories */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2 mb-6">
          {/* Top articles consultés */}
          <Card className="col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Articles populaires
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Articles avec le plus grand nombre de vues
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {topPosts && topPosts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto">
                  {topPosts.map((post, index) => (
                    <div key={post.id} className="flex items-start justify-between border-b pb-2 sm:pb-3 last:border-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 -mx-2 transition-colors">
                      <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary/10 text-xs sm:text-sm font-medium text-primary flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <a 
                            href={`/posts/${post.slug}`} 
                            className="hover:text-primary font-medium text-xs sm:text-sm line-clamp-2 block transition-colors"
                            title={post.title}
                          >
                            {post.title}
                          </a>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            Par {post.author}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex items-center text-xs sm:text-sm font-medium flex-shrink-0">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-400" />
                        <span className="hidden sm:inline">{post.views} vues</span>
                        <span className="sm:hidden">{post.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 sm:h-64 items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Aucun article populaire</p>
                    <p className="text-xs text-gray-400 mt-1">Les articles apparaîtront après avoir reçu des vues</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance par catégorie */}
          <Card className="col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Award className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Performance par catégorie
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Catégories les plus consultées
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {categoryStats && categoryStats.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {categoryStats.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{category.name}</p>
                        <p className="text-xs text-gray-500">
                          {category.posts_count} articles • {category.avg_views} vues/article
                        </p>
                      </div>
                      <div className="ml-2 text-right">
                        <p className="font-bold text-sm">{formatNumber(category.total_views)}</p>
                        <p className="text-xs text-gray-500">vues</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Aucune donnée disponible</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top auteurs */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Auteurs les plus lus
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Classement des auteurs par nombre de vues
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {topAuthors && topAuthors.length > 0 ? (
                <div className="space-y-3">
                  {topAuthors.map((author, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{author.name}</p>
                          <p className="text-xs text-gray-500">
                            {author.posts_count} articles
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatNumber(author.total_views)}</p>
                        <p className="text-xs text-gray-500">{author.avg_views} moy.</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Aucun auteur trouvé</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card className="col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Activity className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Activité récente
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Vues des 7 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => {
                    const maxRecentViews = Math.max(...recentActivity.map(a => a.views_count));
                    const widthPercentage = maxRecentViews > 0 ? (activity.views_count / maxRecentViews) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-20 text-xs text-gray-500">
                          {formatDate(activity.date)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${widthPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-12 text-right">
                              {activity.views_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Aucune activité récente</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Résumé des statistiques sur mobile */}
        <div className="mt-4 sm:mt-6 xl:hidden">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Résumé
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {dailyViews ? dailyViews.reduce((sum, day) => sum + day.count, 0) : 0}
                  </p>
                  <p className="text-xs text-gray-500">Vues totales</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {topPosts ? topPosts.length : 0}
                  </p>
                  <p className="text-xs text-gray-500">Articles populaires</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}