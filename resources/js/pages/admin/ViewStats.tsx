import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BarChart3, TrendingUp, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ViewStatsProps {
  dailyViews: { date: string; count: number }[];
  topPosts: {
    id: number;
    title: string;
    slug: string;
    author: string;
    views: number;
  }[];
}

export default function ViewStats({ dailyViews, topPosts }: ViewStatsProps) {
  // Fonction pour calculer la hauteur maximale des barres
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

  const maxViewCount = getMaxViewHeight();

  return (
    <AppLayout>
      <Head title="Statistiques de vues" />
      
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header responsive */}
        <div className="mb-4 sm:mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Statistiques de vues</h1>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Derniers 30 jours</span>
          </div>
        </div>
        
        {/* Grid responsive - 1 colonne sur mobile, 2 sur desktop */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
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