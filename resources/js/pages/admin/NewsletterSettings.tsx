import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Mail, Bell, ArrowLeft, Save } from 'lucide-react';

interface NewsletterSettingsProps {
  settings: {
    auto_send_enabled: boolean;
    send_on_publish: boolean;
    admin_email: string;
  };
}

export default function NewsletterSettings({ settings }: NewsletterSettingsProps) {
  const [formData, setFormData] = useState({
    auto_send_enabled: settings.auto_send_enabled || false,
    send_on_publish: settings.send_on_publish || false,
    admin_email: settings.admin_email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post(route('admin.newsletters.settings.update'), formData, {
      onFinish: () => setIsSubmitting(false)
    });
  };

  const handleInputChange = (field: string, value: boolean | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout>
      <Head title="Paramètres Newsletter" />
        <div className="p-3 sm:p-4 lg:p-6">
        {/* En-tête */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.get(route('admin.newsletters.index'))}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Paramètres Newsletter
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              Configurez les options d'envoi de votre newsletter
            </p>
          </div>
        </div>        <div className="max-w-2xl">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Settings className="w-5 h-5" />
                Configuration
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Gérez les paramètres d'envoi automatique de votre newsletter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Envoi automatique activé */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="auto_send_enabled"
                      checked={formData.auto_send_enabled}
                      onChange={(e) => handleInputChange('auto_send_enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-400"
                    />
                    <label htmlFor="auto_send_enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Activer l'envoi automatique de newsletters
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                    Active ou désactive complètement l'envoi automatique de newsletters
                  </p>
                </div>

                {/* Envoi lors de la publication */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="send_on_publish"
                      checked={formData.send_on_publish}
                      onChange={(e) => handleInputChange('send_on_publish', e.target.checked)}
                      disabled={!formData.auto_send_enabled}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-400 disabled:opacity-50"
                    />
                    <label 
                      htmlFor="send_on_publish" 
                      className={`text-sm font-medium ${formData.auto_send_enabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      Envoyer automatiquement lors de la publication d'un article
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                    Envoie automatiquement une newsletter à tous les abonnés actifs quand un nouvel article est publié
                  </p>
                </div>

                {/* Email administrateur */}
                <div className="space-y-2">
                  <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email administrateur
                  </label>
                  <input
                    type="email"
                    id="admin_email"
                    value={formData.admin_email}
                    onChange={(e) => handleInputChange('admin_email', e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email qui recevra les notifications d'erreurs d'envoi de newsletter
                  </p>
                </div>                {/* Informations supplémentaires */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                  <div className="flex items-start">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Fonctionnement de l'envoi automatique
                      </h4>
                      <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <p>• Les newsletters sont envoyées en arrière-plan via une file d'attente</p>
                        <p>• Seuls les abonnés actifs reçoivent les emails</p>
                        <p>• Chaque email contient un lien de désabonnement unique</p>
                        <p>• Les erreurs d'envoi sont journalisées automatiquement</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques d'envoi */}
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Statut du service email
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>Configuration SMTP : <span className="font-medium text-green-600 dark:text-green-400">Active</span></p>
                    <p>File d'attente : <span className="font-medium text-green-600 dark:text-green-400">Opérationnelle</span></p>
                  </div>
                </div>

                {/* Bouton de sauvegarde */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
