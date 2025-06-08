import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { 
  BookOpenIcon, 
  UsersIcon, 
  MessageSquareIcon, 
  EditIcon,
  PlusCircleIcon,
  TagIcon,
  SettingsIcon,
  LayersIcon,
  EyeIcon
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
  },
];

// Types pour les props du dashboard
interface DashboardProps {
  stats?: {
    myPosts?: number;
    myViews?: number;
    myComments?: number;
    drafts?: number;
    favoriteCategories?: { name: string; count: number }[];
    recentPosts?: {
      id: number;
      title: string;
      slug: string;
      published_at?: string | null;
      views?: number;
      comments_count?: number;
    }[];
    activity?: {
      date: string;
      posts?: number;
      comments?: number;
      views?: number;
    }[];
  };
  auth?: {
    user?: {
      id?: number;
      name?: string;
      email?: string;
      is_admin?: boolean;
    }
  };
}

// Composant StatCard pour afficher les statistiques
const StatCard = ({ title, value, icon, color, increase }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode;
  color: string;
  increase?: string;
}) => {
  // Définir les couleurs pour chaque variante avec support dark mode
  const colorClasses = {
    'border-l-4 border-l-blue-500': {
      border: 'border-l-4 border-l-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    'border-l-4 border-l-green-500': {
      border: 'border-l-4 border-l-green-500',
      iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    },
    'border-l-4 border-l-amber-500': {
      border: 'border-l-4 border-l-amber-500',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
    },
    'border-l-4 border-l-purple-500': {
      border: 'border-l-4 border-l-purple-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    }
  };

  const currentColor = colorClasses[color as keyof typeof colorClasses] || colorClasses['border-l-4 border-l-blue-500'];

  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${currentColor.border}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <h3 className="text-lg sm:text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
          {increase && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 hidden sm:block">
              <span>↑</span> {increase}
            </p>
          )}
        </div>
        <div className={`h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${currentColor.iconBg}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Composant ActionCard pour les liens d'action rapide
const ActionCard = ({ title, description, icon, href, color }: { 
  title: string; 
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) => {
  // Définir les couleurs pour chaque variante avec support dark mode
  const colorClasses = {
    'border-l-4 border-l-blue-500': {
      border: 'border-l-4 border-l-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    'border-l-4 border-l-green-500': {
      border: 'border-l-4 border-l-green-500',
      iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    },
    'border-l-4 border-l-amber-500': {
      border: 'border-l-4 border-l-amber-500',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
    },
    'border-l-4 border-l-purple-500': {
      border: 'border-l-4 border-l-purple-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    }
  };

  const currentColor = colorClasses[color as keyof typeof colorClasses] || colorClasses['border-l-4 border-l-blue-500'];

  return (
    <Link href={href}>
      <motion.div 
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${currentColor.border}`}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${currentColor.iconBg}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </motion.div>
    </Link>
  );
};

// Générateur de données factices pour la démo - Version utilisateur normal
const generateDummyData = () => {
  return {
    myPosts: 12,
    myViews: 2840,
    myComments: 58,
    drafts: 3,
    favoriteCategories: [
      { name: 'Technologie', count: 5 },
      { name: 'Développement Web', count: 4 },
      { name: 'Voyage', count: 2 },
      { name: 'Lifestyle', count: 1 }
    ],
    recentPosts: [
      { id: 1, title: 'Mes découvertes avec Vue.js 3', slug: 'decouvertes-vuejs-3', published_at: '2023-05-15T10:30:00', views: 256, comments_count: 12 },
      { id: 2, title: 'Comment j\'ai optimisé mon workflow Laravel', slug: 'optimisation-workflow-laravel', published_at: '2023-05-13T08:45:00', views: 143, comments_count: 8 },
      { id: 3, title: 'Mon premier projet React', slug: 'premier-projet-react', published_at: '2023-05-10T14:20:00', views: 423, comments_count: 18 },
      { id: 4, title: 'Débuter avec Tailwind CSS', slug: 'debuter-tailwind-css', published_at: '', views: 0, comments_count: 0 } // Brouillon
    ],
    activity: [
      { date: 'Lun', posts: 2, comments: 5, views: 120 },
      { date: 'Mar', posts: 1, comments: 3, views: 80 },
      { date: 'Mer', posts: 3, comments: 8, views: 150 },
      { date: 'Jeu', posts: 1, comments: 4, views: 90 },
      { date: 'Ven', posts: 2, comments: 6, views: 130 },
      { date: 'Sam', posts: 1, comments: 2, views: 60 },
      { date: 'Dim', posts: 0, comments: 1, views: 40 }
    ]
  };
};

export default function Dashboard({ stats, auth }: DashboardProps) {
  // Valeurs par défaut sécurisées
  const safeStats = stats || generateDummyData();
  const safeAuth = auth || { user: { name: 'Utilisateur' } };
  
  const [activeTab, setActiveTab] = useState('apercu');  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState(safeStats.recentPosts || []);
  
  // Formater un nombre avec des séparateurs de milliers
  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) {
      return "0";
    }
    const validNum = Number(num);
    return validNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Formater une date
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return "—";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "—";
    }
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Fonction pour filtrer les articles
  const filterPosts = () => {
    return (safeStats.recentPosts || []).filter(post => {
      // Filtre par terme de recherche
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par statut
      let matchesStatus = true;
      if (statusFilter === 'published') {
        matchesStatus = !!post.published_at;
      } else if (statusFilter === 'draft') {
        matchesStatus = !post.published_at;
      }
      
      return matchesSearch && matchesStatus;
    });
  };

  useEffect(() => {
    setFilteredPosts(filterPosts());
  }, [searchTerm, statusFilter]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tableau de bord" />
       <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* En-tête du Dashboard */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 sm:mb-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Tableau de bord
            </h1>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Bienvenue, {safeAuth?.user?.name || 'Utilisateur'}
            </p>
          </div>
          
          <div className="w-full sm:w-auto">
            <Link 
              href={route('posts.create')} 
              className="inline-flex items-center justify-center w-full sm:w-auto px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-xs sm:text-sm font-medium"
            >
              <PlusCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Nouvel article</span>
              <span className="sm:hidden">Nouveau</span>
            </Link>
          </div>
        </motion.div>
        
        {/* Onglets */}
        <div className="mb-3 sm:mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-xs sm:text-base">
            <li className="mr-1 sm:mr-2">
              <button
                onClick={() => setActiveTab('apercu')}
                className={`inline-flex items-center px-2 sm:px-4 py-1.5 sm:py-2 border-b-2 rounded-t-lg text-xs sm:text-sm ${
                  activeTab === 'apercu'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <LayersIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Aperçu</span>
                <span className="sm:hidden">Accueil</span>
              </button>
            </li>
            <li className="mr-1 sm:mr-2">
              <button
                onClick={() => setActiveTab('articles')}
                className={`inline-flex items-center px-2 sm:px-4 py-1.5 sm:py-2 border-b-2 rounded-t-lg text-xs sm:text-sm ${
                  activeTab === 'articles'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <BookOpenIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Mes articles</span>
                <span className="sm:hidden">Articles</span>
              </button>
            </li>
          </ul>
        </div>
        
        {activeTab === 'apercu' && (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <StatCard 
                title="Mes articles" 
                value={formatNumber(safeStats.myPosts)} 
                icon={<BookOpenIcon className="h-5 w-5 sm:h-6 sm:w-6" />} 
                color="border-l-4 border-l-blue-500" 
                increase="2 cette semaine"
              />
              <StatCard 
                title="Mes vues totales" 
                value={formatNumber(safeStats.myViews)} 
                icon={<EyeIcon className="h-5 w-5 sm:h-6 sm:w-6" />} 
                color="border-l-4 border-l-green-500"
                increase="245 cette semaine"
              />
              <StatCard 
                title="Mes commentaires" 
                value={formatNumber(safeStats.myComments)} 
                icon={<MessageSquareIcon className="h-5 w-5 sm:h-6 sm:w-6" />} 
                color="border-l-4 border-l-amber-500"
                increase="8 cette semaine"
              />
              <StatCard 
                title="Brouillons" 
                value={formatNumber(safeStats.drafts)} 
                icon={<EditIcon className="h-5 w-5 sm:h-6 sm:w-6" />} 
                color="border-l-4 border-l-purple-500"
                increase="1 cette semaine"
              />
            </div>
            
            {/* Deux colonnes principales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Colonne de gauche - Graphique d'activité */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Mon activité de la semaine
                </h2>
                
                {/* Graphique simple - à remplacer par votre librairie de graphiques préférée */}
                <div className="h-[300px] relative">
                  <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-between gap-2">
                    {(safeStats.activity || []).map((day, index) => (
                      <div key={index} className="flex flex-col items-center w-full">
                        <div className="w-full flex items-end justify-center gap-1 h-56">
                          <motion.div 
                            className="w-2 bg-blue-500 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${((day.posts || 0) / 3) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                          <motion.div 
                            className="w-2 bg-amber-500 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${((day.comments || 0) / 8) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                          />
                          <motion.div 
                            className="w-2 bg-green-500 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${((day.views || 0) / 150) * 100}%` }}
                            transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{day.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-2 gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Articles</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Commentaires</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Vues</span>
                  </div>
                </div>
              </div>
              
              {/* Colonne de droite - Mes catégories */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Mes catégories
                </h2>
                
                <div className="space-y-4">
                  {(safeStats.favoriteCategories || []).map((category, index) => (
                    <motion.div 
                      key={index}
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{category.count}</span>
                        <div className="ml-3 w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(category.count / (safeStats.myPosts || 1)) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Mes articles récents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-700 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
                  Mes articles récents
                </h2>
                <Link 
                  href={route('posts.index')} 
                  className="text-primary hover:text-primary/80 dark:hover:text-primary/90 hover:underline text-sm font-medium whitespace-nowrap"
                >
                  Voir tous →
                </Link>
              </div>
              
              {/* Version desktop - Tableau */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Titre</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Publication</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Vues</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Commentaires</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {(safeStats.recentPosts || []).map((post, index) => (
                        <motion.tr 
                          key={post.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <td className="px-4 py-3">
                            <Link 
                              href={route('posts.show', post.slug)}
                              className="font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary block max-w-xs truncate"
                              title={post.title}
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(post.published_at)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(post.views)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {post.comments_count}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            <Link 
                              href={route('posts.edit', post.slug)}
                              className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                            >
                              Éditer
                            </Link>
                            <Link 
                              href={route('posts.show', post.slug)}
                              className="text-gray-600 dark:text-gray-400 hover:underline hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              Voir
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Version mobile et tablette - Cards */}
              <div className="lg:hidden space-y-3">
                {(safeStats.recentPosts || []).map((post, index) => (
                  <motion.div 
                    key={post.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col space-y-3">
                      {/* Titre et actions en haut */}
                      <div className="flex justify-between items-start">
                        <Link 
                          href={route('posts.show', post.slug)}
                          className="font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary flex-1 pr-2 block"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {post.title}
                        </Link>
                        <div className="flex space-x-2 ml-2 flex-shrink-0">
                          <Link 
                            href={route('posts.edit', post.slug)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            Éditer
                          </Link>
                          <Link 
                            href={route('posts.show', post.slug)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium"
                          >
                            Voir
                          </Link>
                        </div>
                      </div>
                      
                      {/* Métadonnées en bas */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="whitespace-nowrap">{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{formatNumber(post.views)} vues</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments_count} commentaires</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Actions rapides
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <ActionCard 
                  title="Nouvel article" 
                  description="Créer et publier un nouvel article" 
                  icon={<EditIcon className="h-5 w-5" />} 
                  href={route('posts.create')}
                  color="border-l-4 border-l-blue-500"
                />
                <ActionCard 
                  title="Parcourir les articles" 
                  description="Découvrir les derniers articles du blog" 
                  icon={<BookOpenIcon className="h-5 w-5" />} 
                  href={route('posts.index')}
                  color="border-l-4 border-l-green-500"
                />
                <ActionCard 
                  title="Explorer les catégories" 
                  description="Parcourir les catégories disponibles" 
                  icon={<LayersIcon className="h-5 w-5" />} 
                  href={route('categories.index')}
                  color="border-l-4 border-l-amber-500"
                />
                <ActionCard 
                  title="Mon profil" 
                  description="Gérer mon profil et mes paramètres" 
                  icon={<SettingsIcon className="h-5 w-5" />} 
                  href={route('profile.edit')}
                  color="border-l-4 border-l-purple-500"
                />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'articles' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-0">
                Mes articles
              </h2>
              
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary text-sm dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 focus:ring-primary focus:border-primary text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tous</option>
                  <option value="published">Publiés</option>
                  <option value="draft">Brouillons</option>
                </select>
                
                <Link 
                  href={route('posts.create')} 
                  className="inline-flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium whitespace-nowrap"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Créer</span>
                  <span className="sm:hidden">Nouveau</span>
                </Link>
              </div>
            </div>
            
            {/* Version desktop - Tableau */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Titre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Vues</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Commentaires</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPosts.map((post, index) => (
                      <motion.tr 
                        key={post.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="px-4 py-4">
                          <Link 
                            href={route('posts.show', post.slug)}
                            className="font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary block max-w-xs truncate"
                            title={post.title}
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {post.published_at ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Publié
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              Brouillon
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {post.published_at ? formatDate(post.published_at) : '—'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(post.views)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {post.comments_count}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <Link 
                              href={route('posts.edit', post.slug)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              <EditIcon className="w-5 h-5" />
                              <span className="sr-only">Éditer</span>
                            </Link>
                            <Link 
                              href={route('posts.show', post.slug)}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                            >
                              <EyeIcon className="w-5 h-5" />
                              <span className="sr-only">Voir</span>
                            </Link>
                            <button 
                              onClick={() => {
                                // Gérer la suppression d'un article
                                if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${post.title}" ?`)) {
                                  // Appel à l'API de suppression
                                }
                              }}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="sr-only">Supprimer</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Version mobile et tablette - Cards */}
            <div className="lg:hidden space-y-3 mt-4">
              {filteredPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex flex-col space-y-3">
                    {/* En-tête avec titre et statut */}
                    <div className="flex justify-between items-start">
                      <Link 
                        href={route('posts.show', post.slug)}
                        className="font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary flex-1 pr-2 block text-sm"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {post.title}
                      </Link>
                      <div className="flex-shrink-0 ml-2">
                        {post.published_at ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Publié
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Brouillon
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="whitespace-nowrap">{post.published_at ? formatDate(post.published_at) : 'Brouillon'}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{formatNumber(post.views)} vues</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{post.comments_count} commentaires</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <Link 
                        href={route('posts.edit', post.slug)}
                        className="inline-flex items-center px-2 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium"
                      >
                        <EditIcon className="w-3 h-3 mr-1" />
                        Éditer
                      </Link>
                      <Link 
                        href={route('posts.show', post.slug)}
                        className="inline-flex items-center px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-medium"
                      >
                        <EyeIcon className="w-3 h-3 mr-1" />
                        Voir
                      </Link>
                      <button 
                        onClick={() => {
                          // Gérer la suppression d'un article
                          if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${post.title}" ?`)) {
                            // Appel à l'API de suppression
                          }
                        }}
                        className="inline-flex items-center px-2 py-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <BookOpenIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white text-lg font-medium">Aucun article</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Aucun article ne correspond à vos critères de recherche."
                    : "Vous n'avez pas encore créé d'articles."}
                </p>
                <Link 
                  href={route('posts.create')} 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium mt-4"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  Créer mon premier article
                </Link>
              </div>
            ) : filteredPosts.length > 10 && (
              <div className="mt-4 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span className="sr-only">Précédent</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">1</a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-primary text-sm font-medium text-white">2</a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">3</a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span className="sr-only">Suivant</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}