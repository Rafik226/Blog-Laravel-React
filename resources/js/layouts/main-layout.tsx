import React from 'react';
import { type ReactNode } from 'react';
import { type BreadcrumbItem } from '@/types';
import Navbar from '@/components/nav-bar';
import Footer from '@/components/footer';

interface MainLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    fullWidth?: boolean;
}

export default function MainLayout({ children, breadcrumbs, fullWidth = false }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            {/* Breadcrumbs section if needed */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <div className={`mx-auto ${fullWidth ? 'px-4 sm:px-6 lg:px-8' : 'container px-4'}`}>
                        {/* Votre composant Breadcrumb ici */}
                        <div className="py-2 text-sm">
                            Breadcrumbs
                        </div>
                    </div>
                </div>
            )}
            
            {/* Main content */}
            <main className="flex-grow">
                {children}
            </main>
            
            <Footer />
        </div>
    );
}