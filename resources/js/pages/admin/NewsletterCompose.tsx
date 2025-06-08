import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Users, ArrowLeft, Mail, Eye } from 'lucide-react';

interface NewsletterComposeProps {
  activeSubscribers: number;
}

export default function NewsletterCompose({ activeSubscribers }: NewsletterComposeProps) {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    send_to: 'active'
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.content) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir envoyer cette newsletter à ${formData.send_to === 'all' ? 'tous' : activeSubscribers} les abonnés ?`)) {
      setIsSubmitting(true);
      
      router.post(route('admin.newsletters.send'), formData, {
        onFinish: () => setIsSubmitting(false),
        onSuccess: () => {
          setFormData({ subject: '', content: '', send_to: 'active' });
        }
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout>
      <Head title="Composer une Newsletter" />
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
              Composer une Newsletter
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              Créez et envoyez une newsletter à vos abonnés
            </p>
          </div>
        </div>        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Formulaire de composition */}
          <div className="xl:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Mail className="w-5 h-5" />
                  Contenu de la Newsletter
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Rédigez le contenu de votre newsletter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Objet */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objet de l'email *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Ex: Nouveaux articles de la semaine"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
                      required
                    />
                  </div>

                  {/* Destinataires */}
                  <div>
                    <label htmlFor="send_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Envoyer à
                    </label>
                    <select
                      id="send_to"
                      value={formData.send_to}
                      onChange={(e) => handleInputChange('send_to', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="active">Abonnés actifs uniquement ({activeSubscribers})</option>
                      <option value="all">Tous les abonnés</option>
                    </select>
                  </div>

                  {/* Contenu */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contenu de la newsletter *
                    </label>
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Rédigez le contenu de votre newsletter..."
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors sm:rows-12"
                      required
                    />
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Vous pouvez utiliser du HTML pour formater votre contenu
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setIsPreview(!isPreview)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {isPreview ? 'Éditer' : 'Aperçu'}
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer la Newsletter'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>          {/* Aperçu et informations */}
          <div className="space-y-4 sm:space-y-6">
            {/* Statistiques */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Users className="w-5 h-5" />
                  Abonnés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Abonnés actifs</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{activeSubscribers}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Votre newsletter sera envoyée aux abonnés sélectionnés
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu */}
            {isPreview && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Aperçu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {formData.subject && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Objet:</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 border-l-4 border-blue-200 dark:border-blue-700 pl-3 mt-1">
                          {formData.subject}
                        </p>
                      </div>
                    )}
                    
                    {formData.content && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Contenu:</h4>
                        <div 
                          className="text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded p-3 mt-1 max-h-48 sm:max-h-64 overflow-y-auto dark:bg-gray-700"
                          dangerouslySetInnerHTML={{ __html: formData.content }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conseils */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Conseils</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Utilisez un objet accrocheur et descriptif</p>
                  <p>• Gardez votre contenu concis et engageant</p>
                  <p>• Testez toujours l'aperçu avant l'envoi</p>
                  <p>• Incluez un lien de désabonnement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
