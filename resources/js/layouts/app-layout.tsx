import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import MainLayoutTemplate from '@/layouts/main-layout'; // Créez ce fichier comme indiqué ci-dessus
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    showSidebar?: boolean;
}

export default ({ children, breadcrumbs, showSidebar = true, ...props }: AppLayoutProps) => {
    if (!showSidebar) {
        return (
            <MainLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </MainLayoutTemplate>
        );
    }
    
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};