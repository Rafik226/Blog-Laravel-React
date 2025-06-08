import React, { ElementType } from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutGrid, 
  BookOpen,
  Settings,
  PenLine, 
  FileText, 
  Layers, 
  Tags, 
  Users, 
  MessageSquare,
  Mail,
  BarChart3,
  Home,
  Eye,
  ThumbsUp,
} from 'lucide-react';
import AppLogo from './app-logo';

// Redéfinir les interfaces localement pour éviter les conflits
interface NavItem {
  title: string;
  href: string;
  icon: ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
    } | null;
  };
}

export function AppSidebar() {
  const { auth } = usePage().props as unknown as NavProps;
  const isAdmin = auth?.user?.is_admin === true;
  const isAuthenticated = auth?.user !== null;

  // Navigation pour les utilisateurs authentifiés
  const mainNavItems: NavGroup[] = [
    {
      title: "Navigation",
      items: [
        {
          title: 'Accueil',
          href: route('home'),
          icon: Home as ElementType,
        },
        {
          title: 'Tableau de bord',
          href: route('dashboard'),
          icon: LayoutGrid as ElementType,
        },
      ]
    },
    {
      title: "Contenu",
      items: [
        {
          title: 'Articles',
          href: route('posts.index'),
          icon: FileText as ElementType,
        },
        {
          title: 'Catégories',
          href: route('categories.index'),
          icon: Layers as ElementType,
        },
        {
          title: 'Tags',
          href: route('tags.index'),
          icon: Tags as ElementType,
        },
      ]
    },
    {
      title: "Écriture",
      items: [
        {
          title: 'Nouvel article',
          href: route('posts.create'),
          icon: PenLine as ElementType,
        },
        {
          title: 'Mes brouillons',
          href: route('posts.drafts'),
          icon: BookOpen as ElementType,
        },
      ]
    },
  ];

  // Éléments de navigation supplémentaires pour les administrateurs
  const adminNavItems: NavGroup[] = isAdmin 
    ? [
        {
          title: "Administration",
          items: [
            {
              title: 'Utilisateurs',
              href: route('admin.users.index'),
              icon: Users as ElementType,
            },
            {
              title: 'Commentaires',
              href: route('admin.comments.index'),
              icon: MessageSquare as ElementType,
            },
            {
              title: 'Statistiques',
              href: route('admin.stats.views'),
              icon: BarChart3 as ElementType,
            },
          ]
        },
        {
          title: "Newsletter",
          items: [
            {
              title: 'Abonnés',
              href: route('admin.newsletters.index'),
              icon: Mail as ElementType,
            },
            {
              title: 'Composer',
              href: route('admin.newsletters.compose'),
              icon: PenLine as ElementType,
            },
            {
              title: 'Paramètres',
              href: route('admin.newsletters.settings'),
              icon: Settings as ElementType,
            },
          ]
        }
      ] 
    : [];

  // Navigation du bas de la sidebar (commune à tous les utilisateurs authentifiés)
  const footerNavItems: NavItem[] = [
    {
      title: 'Paramètres',
      href: route('profile.edit'),
      icon: Settings as ElementType,
    },
  ];

  // Si vous voulez ajouter une classe personnalisée à la sidebar
  const sidebarStyle = {
    "--sidebar-bg": "linear-gradient(to bottom, rgba(30, 41, 59, 1), rgba(15, 23, 42, 1))",
    "--sidebar-border": "rgba(51, 65, 85, 0.5)"
  } as React.CSSProperties;

  return (
    <Sidebar 
      collapsible="icon" 
      variant="inset" 
      className="custom-sidebar border-r-primary"
      style={sidebarStyle}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-center p-3">
          <Link href={route('dashboard')} prefetch className="flex items-center">
            <AppLogo />
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Blog Admin
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isAuthenticated && (
          <>
            {mainNavItems.map((group, groupIndex) => (
              <SidebarGroup key={groupIndex}>
                <SidebarGroupLabel className="text-sidebar-foreground/90 uppercase tracking-wider text-xs font-medium">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item, itemIndex) => (
                      <SidebarMenuItem key={itemIndex}>
                        <SidebarMenuButton
                          asChild
                          isActive={route().current(item.href.toString())}
                        >
                          <Link href={item.href} prefetch>
                            {React.createElement(item.icon, { className: "w-4 h-4 mr-3" })}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            {adminNavItems.map((group, groupIndex) => (
              <SidebarGroup key={`admin-${groupIndex}`}>
                <SidebarGroupLabel className="text-primary uppercase tracking-wider text-xs font-medium">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item, itemIndex) => (
                      <SidebarMenuItem key={itemIndex}>
                        <SidebarMenuButton
                          asChild
                          isActive={route().current(item.href.toString())}
                          variant={item.badge ? "outline" : "default"}
                        >
                          <Link href={item.href} prefetch>
                            {React.createElement(item.icon, { className: "w-4 h-4 mr-3" })}
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </>
        )}
        {!isAuthenticated && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/90 uppercase tracking-wider text-xs font-medium">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[
                  {
                    title: 'Accueil',
                    href: route('home'),
                    icon: Home as ElementType,
                  },
                  {
                    title: 'Articles',
                    href: route('posts.index'),
                    icon: FileText as ElementType,
                  },
                  {
                    title: 'Catégories',
                    href: route('categories.index'),
                    icon: Layers as ElementType,
                  },
                  {
                    title: 'Connexion',
                    href: route('login'),
                    icon: Users as ElementType,
                  },
                  {
                    title: "S'inscrire",
                    href: route('register'),
                    icon: PenLine as ElementType,
                  }
                ].map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton
                      asChild
                      isActive={route().current(item.href.toString())}
                    >
                      <Link href={item.href} prefetch>
                        {React.createElement(item.icon, { className: "w-4 h-4 mr-3" })}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

       
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        {isAuthenticated ? (
          <>
            <NavFooter items={footerNavItems} className="mb-2" />
            <NavUser />
          </>
        ) : (
          <div className="p-3 text-center text-sm text-sidebar-foreground/90">
            <p>Connectez-vous pour accéder à toutes les fonctionnalités</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}