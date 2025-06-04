import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function About() {
  return (
    <AppLayout showSidebar={false}>
      <Head title="À propos" />
      
      <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            À propos de nous
          </h1>
          
          <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
            <p>
              Bienvenue sur notre blog dédié au partage de connaissances et d'actualités dans le domaine de la technologie.
            </p>
            
            <h2>Notre mission</h2>
            <p>
              Notre objectif est de rendre l'information technologique accessible à tous, que vous soyez débutant ou expert.
              Nous croyons que le partage des connaissances est essentiel pour faire progresser notre domaine.
            </p>
            
            <h2>Notre équipe</h2>
            <p>
              Notre équipe est composée de passionnés de technologie, d'informatique et de développement web.
              Nous travaillons chaque jour pour vous proposer du contenu de qualité.
            </p>
            
            <h2>Restez connectés</h2>
            <p>
              N'hésitez pas à vous abonner à notre newsletter pour recevoir nos derniers articles directement dans votre boîte mail.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}