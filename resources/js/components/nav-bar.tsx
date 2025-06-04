import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const { auth } = usePage<SharedData>().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo et liens de navigation (desktop) */}
          <div className="flex items-center">
            <Link href={route('home')} className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">
                MonBlog
              </span>
            </Link>
            
            {/* Navigation desktop */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                href={route('home')}
                className={`border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${route().current('home') ? 'border-primary text-primary' : ''}`}
              >
                Accueil
              </Link>
              <Link
                href={route('posts.index')}
                className={`border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${route().current('posts.*') ? 'border-primary text-primary' : ''}`}
              >
                Articles
              </Link>
              <Link
                href={route('categories.index')}
                className={`border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${route().current('categories.*') ? 'border-primary text-primary' : ''}`}
              >
                Catégories
              </Link>
              <Link
                href={route('about')}
                className={`border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${route().current('about') ? 'border-primary text-primary' : ''}`}
              >
                À propos
              </Link>
              <Link
                href={route('contact')}
                className={`border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${route().current('contact') ? 'border-primary text-primary' : ''}`}
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* Partie droite de la navbar */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Auth links desktop */}
            <div className="hidden sm:flex sm:items-center">
              {auth.user ? (
                <div className="relative ml-3 flex items-center space-x-4">
                  <Link
                    href={route('dashboard')}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    Tableau de bord
                  </Link>
                  <button
                    onClick={() => (document.getElementById('logout-form') as HTMLFormElement)?.submit()}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    Déconnexion
                  </button>
                  <form id="logout-form" method="POST" action="/logout" className="hidden">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                  </form>
                </div>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    Connexion
                  </Link>
                  <Link
                    href={route('register')}
                    className="ml-4 px-4 py-2 bg-primary text-white dark:bg-primary/80 dark:text-white text-sm rounded-md hover:bg-primary/90 dark:hover:bg-primary"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
            
            {/* Bouton hamburger pour mobile */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Ouvrir le menu</span>
                {/* Icône hamburger */}
                {!mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu mobile */}
        <div
          className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
          id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href={route('home')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                route().current('home')
                  ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Accueil
            </Link>
            <Link
              href={route('posts.index')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                route().current('posts.*')
                  ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Articles
            </Link>
            <Link
              href={route('categories.index')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                route().current('categories.*')
                  ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Catégories
            </Link>
            <Link
              href={route('about')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                route().current('about')
                  ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              À propos
            </Link>
            <Link
              href={route('contact')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                route().current('contact')
                  ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Contact
            </Link>
          </div>
          
          {/* Menu mobile authentification */}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {auth.user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">
                      {auth.user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {auth.user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href={route('dashboard')}
                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Tableau de bord
                  </Link>
                  <button
                    onClick={() => (document.getElementById('logout-form') as HTMLFormElement)?.submit()}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1">
                <Link
                  href={route('login')}
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Connexion
                </Link>
                <Link
                  href={route('register')}
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}