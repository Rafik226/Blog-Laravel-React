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
    title: 'Dashboard',
    href: '/dashboard',
  },
];

// Types pour les props du dashboard
interface DashboardProps {
  stats: {
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    totalUsers: number;
    categories: { name: string; count: number }[];
    recentPosts: {
      id: number;
      title: string;
      slug: string;
      published_at: string;
      views: number;
      comments_count: number;
    }[];
    activity: {
      date: string;
      posts: number;
      comments: number;
      views: number;
    }[];
  };
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
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
}) => (
  <motion.div 
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 ${color}`}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {increase && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            <span>↑</span> {increase} cette semaine
          </p>
        )}
      </div>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color.replace('border-l-', 'bg-').replace('border-l-', 'text-')}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// Composant ActionCard pour les liens d'action rapide
const ActionCard = ({ title, description, icon, href, color }: { 
  title: string; 
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) => (
  <Link href={href}>
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow ${color}`}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${color.replace('border-l-', 'bg-').replace('border-l-', 'text-')}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </motion.div>
  </Link>
);

// Générateur de données factices pour la démo
const generateDummyData = () => {
  return {
    totalPosts: 124,
    totalViews: 28320,
    totalComments: 842,
    totalUsers: 325,
    categories: [
      { name: 'Technologie', count: 45 },
      { name: 'Voyage', count: 23 },
      { name: 'Cuisine', count: 32 },
      { name: 'Santé', count: 17 },
      { name: 'Développement Web', count: 7 }
    ],
    recentPosts: [
      { id: 1, title: 'Les meilleures pratiques en développement Vue.js', slug: 'meilleures-pratiques-vuejs', published_at: '2023-05-15T10:30:00', views: 1256, comments_count: 32 },
      { id: 2, title: 'Comment optimiser les performances de Laravel', slug: 'optimiser-performances-laravel', published_at: '2023-05-13T08:45:00', views: 943, comments_count: 18 },
      { id: 3, title: 'Guide complet sur React Hooks', slug: 'guide-react-hooks', published_at: '2023-05-10T14:20:00', views: 1823, comments_count: 47 },
      { id: 4, title: 'Débuter avec Tailwind CSS', slug: 'debuter-tailwind-css', published_at: '2023-05-08T09:15:00', views: 756, comments_count: 12 }
    ],
    activity: [
      { date: 'Lun', posts: 5, comments: 15, views: 1200 },
      { date: 'Mar', posts: 3, comments: 10, views: 800 },
      { date: 'Mer', posts: 7, comments: 20, views: 1500 },
      { date: 'Jeu', posts: 4, comments: 12, views: 900 },
      { date: 'Ven', posts: 6, comments: 18, views: 1300 },
      { date: 'Sam', posts: 2, comments: 8, views: 600 },
      { date: 'Dim', posts: 1, comments: 5, views: 400 }
    ]
  };
};

export default function Dashboard({ stats = generateDummyData(), auth }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('apercu');  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState(stats.recentPosts);
  const isAdmin = auth?.user?.is_admin || false;
  
  // Formater un nombre avec des séparateurs de milliers
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Formater une date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Fonction pour filtrer les articles
  const filterPosts = () => {
    return stats.recentPosts.filter(post => {
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
      <Head title="Dashboard" />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* En-tête du Dashboard */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bienvenue, {auth?.user?.name || 'Utilisateur'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link 
              href={route('posts.create')} 
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
            >
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Nouvel article
            </Link>
          </div>
        </motion.div>
        
        {/* Onglets */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('apercu')}
                className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                  activeTab === 'apercu'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
                }`}
              >
                <LayersIcon className="w-4 h-4 mr-2" />
                Aperçu
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('articles')}
                className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                  activeTab === 'articles'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
                }`}
              >
                <BookOpenIcon className="w-4 h-4 mr-2" />
                Mes articles
              </button>
            </li>
            {isAdmin && (
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                    activeTab === 'admin'
                      ? 'border-primary text-primary'
                      : 'border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Administration
                </button>
              </li>
            )}
          </ul>
        </div>
        
        {activeTab === 'apercu' && (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total des articles" 
                value={formatNumber(stats.totalPosts)} 
                icon={<BookOpenIcon className="h-6 w-6" />} 
                color="border-l-4 border-l-blue-500" 
                increase="12%"
              />
              <StatCard 
                title="Vues totales" 
                value={formatNumber(stats.totalViews)} 
                icon={<EyeIcon className="h-6 w-6" />} 
                color="border-l-4 border-l-green-500"
                increase="8%"
              />
              <StatCard 
                title="Commentaires" 
                value={formatNumber(stats.totalComments)} 
                icon={<MessageSquareIcon className="h-6 w-6" />} 
                color="border-l-4 border-l-amber-500"
                increase="5%"
              />
              <StatCard 
                title="Utilisateurs" 
                value={formatNumber(stats.totalUsers)} 
                icon={<UsersIcon className="h-6 w-6" />} 
                color="border-l-4 border-l-purple-500"
                increase="3%"
              />
            </div>
            
            {/* Deux colonnes principales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Colonne de gauche - Graphique d'activité */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Activité de la semaine
                </h2>
                
                {/* Graphique simple - à remplacer par votre librairie de graphiques préférée */}
                <div className="h-[300px] relative">
                  <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-between gap-2">
                    {stats.activity.map((day, index) => (
                      <div key={index} className="flex flex-col items-center w-full">
                        <div className="w-full flex items-end justify-center gap-1 h-56">
                          <motion.div 
                            className="w-2 bg-blue-500 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.posts / 10) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                          <motion.div 
                            className="w-2 bg-amber-500 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.comments / 50) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                          />
                          <motion.div 
                            className="w-2 bg-green-500 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.views / 2000) * 100}%` }}
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
              
              {/* Colonne de droite - Catégories populaires */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Catégories populaires
                </h2>
                
                <div className="space-y-4">
                  {stats.categories.map((category, index) => (
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
                            animate={{ width: `${(category.count / stats.totalPosts) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Articles récents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Articles récents
              </h2>
              
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
                    {stats.recentPosts.map((post, index) => (
                      <motion.tr 
                        key={post.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link 
                            href={route('posts.show', post.slug)}
                            className="font-medium text-gray-900 dark:text-white hover:text-primary"
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
                            className="text-blue-600 dark:text-blue-400 hover:underline mr-3"
                          >
                            Éditer
                          </Link>
                          <Link 
                            href={route('posts.show', post.slug)}
                            className="text-gray-600 dark:text-gray-400 hover:underline"
                          >
                            Voir
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-right">
                <Link 
                  href={route('posts.index')} 
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Voir tous les articles →
                </Link>
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Actions rapides
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <ActionCard 
                  title="Nouvel article" 
                  description="Créer et publier un nouvel article" 
                  icon={<EditIcon className="h-5 w-5" />} 
                  href={route('posts.create')}
                  color="border-l-4 border-l-blue-500"
                />
                <ActionCard 
                  title="Gérer les catégories" 
                  description="Ajouter ou modifier les catégories" 
                  icon={<LayersIcon className="h-5 w-5" />} 
                  href={route('categories.index')}
                  color="border-l-4 border-l-green-500"
                />
                <ActionCard 
                  title="Gérer les tags" 
                  description="Ajouter ou modifier les tags" 
                  icon={<TagIcon className="h-5 w-5" />} 
                  href={route('tags.index')}
                  color="border-l-4 border-l-amber-500"
                />
                <ActionCard 
                  title="Paramètres" 
                  description="Configurer votre profil" 
                  icon={<SettingsIcon className="h-5 w-5" />} 
                  href={route('profile.edit')}
                  color="border-l-4 border-l-purple-500"
                />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'articles' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Mes articles
              </h2>
              
              <div className="mt-3 md:mt-0 flex items-center space-x-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary text-sm dark:bg-gray-700 dark:text-white"
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
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  Créer
                </Link>
              </div>
            </div>
            
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
                      className="hover:bg-gray-50 dark:hover:bg-gray-750"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Link 
                          href={route('posts.show', post.slug)}
                          className="font-medium text-gray-900 dark:text-white hover:text-primary"
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
        
        {activeTab === 'admin' && isAdmin && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Administration
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cette section contient les outils d'administration du blog.
            </p>
            {/* Contenu d'administration ici */}
          </div>
        )}
      </div>
    </AppLayout>
  );
}