import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Users, UserCheck, UserX, Search, Download, Calendar, Trash2, Eye, PenLine } from 'lucide-react';

interface Newsletter {
  id: number;
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
  unsubscribe_token: string;
}

interface NewslettersProps {
  newsletters: {
    data: Newsletter[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  filters: {
    search?: string;
    status?: string;
  };
}

export default function AdminNewsletters({ newsletters, stats, filters }: NewslettersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getStatusBadge = (newsletter: Newsletter) => {
    if (newsletter.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
          <UserCheck className="w-3 h-3 mr-1" />
          Actif
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
          <UserX className="w-3 h-3 mr-1" />
          Désabonné
        </span>
      );
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    
    window.location.href = route('admin.newsletters.export') + '?' + params.toString();
  };

  const handleDelete = (newsletter: Newsletter) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'abonnement de ${newsletter.email} ?`)) {
      router.delete(route('admin.newsletters.destroy', newsletter.id), {
        onSuccess: () => {
          // Le message de succès sera affiché automatiquement
        },
        onError: () => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  };

  const handleSearch = () => {
    router.get(route('admin.newsletters.index'), {
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    router.get(route('admin.newsletters.index'), {
      search: searchTerm || undefined,
      status: newStatus !== 'all' ? newStatus : undefined
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

  return (
    <AppLayout>
      <Head title="Gestion de la Newsletter" />
        <div className="p-3 sm:p-4 lg:p-6">
        {/* En-tête */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Gestion de la Newsletter
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Gérez les abonnements à votre newsletter
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total des abonnés</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Tous les abonnements</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Abonnés actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% du total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Désabonnements</CardTitle>
              <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactive}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% du total
              </p>
            </CardContent>
          </Card>
        </div>        {/* Actions et filtres */}
        <Card className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Liste des abonnés</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {newsletters.total} abonnement{newsletters.total !== 1 ? 's' : ''} au total
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link
                  href={route('admin.newsletters.compose')}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  <PenLine className="w-4 h-4 mr-2" />
                  Composer
                </Link>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter CSV
                </button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs uniquement</option>
                  <option value="inactive">Désabonnés</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>            {/* Table des abonnés */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date d'abonnement
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {newsletters.data.map((newsletter) => (
                    <tr key={newsletter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-white truncate">{newsletter.email}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {newsletter.name || '-'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(newsletter)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="hidden sm:inline">{formatDate(newsletter.subscribed_at)}</span>
                          <span className="sm:hidden">{new Date(newsletter.subscribed_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {newsletter.unsubscribed_at && (
                          <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                            Désabonné le <span className="hidden sm:inline">{formatDate(newsletter.unsubscribed_at)}</span>
                            <span className="sm:hidden">{new Date(newsletter.unsubscribed_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(newsletter.unsubscribe_token)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                            title="Copier le token de désabonnement"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(newsletter)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                            title="Supprimer l'abonnement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {newsletters.last_page > 1 && (
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Page {newsletters.current_page} sur {newsletters.last_page} ({newsletters.total} résultat{newsletters.total !== 1 ? 's' : ''})
                </div>
                <div className="flex items-center space-x-2">
                  {newsletters.current_page > 1 && (
                    <Link
                      href={route('admin.newsletters.index', { 
                        page: newsletters.current_page - 1,
                        search: searchTerm || undefined,
                        status: statusFilter !== 'all' ? statusFilter : undefined
                      })}
                      className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Précédent
                    </Link>
                  )}
                  {newsletters.current_page < newsletters.last_page && (
                    <Link
                      href={route('admin.newsletters.index', { 
                        page: newsletters.current_page + 1,
                        search: searchTerm || undefined,
                        status: statusFilter !== 'all' ? statusFilter : undefined
                      })}
                      className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Suivant
                    </Link>
                  )}
                </div>
              </div>
            )}

            {newsletters.data.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Mail className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun abonné</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun abonnement à la newsletter pour le moment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
