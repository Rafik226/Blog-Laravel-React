import { ElementType } from 'react';
import type { Config } from 'ziggy-js';

// Interfaces existantes
export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: ElementType;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}



// Interface User mise à jour pour inclure les relations
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    is_admin: boolean;
    is_active: boolean;
    profile?: Profile;
    posts?: Post[];
    comments?: Comment[];
    [key: string]: unknown;
}


export interface Profile {
    id: number;
    user_id: number;
    avatar?: string;
    bio?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    [key: string]: unknown;
}

export interface Post {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    slug: string;
    content: string;
    featured_image?: string;
    published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    category?: Category;
    tags?: Tag[];
    comments?: Comment[];
    views?: number;
    [key: string]: unknown;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    featured_image?: string;
    created_at: string;
    updated_at: string;
    posts?: Post[];
    posts_count?: number;
    [key: string]: unknown;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  posts_count?: number;
  [key: string]: unknown;
}

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    approved: boolean;
    created_at: string;
    updated_at: string;
    post?: Post;
    user?: User;
    [key: string]: unknown;
}

// Interface pour la pagination
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

// Alias utiles pour les données paginées de chaque type de modèle
export type PaginatedPosts = PaginatedData<Post>;
export type PaginatedCategories = PaginatedData<Category>;
export type PaginatedTags = PaginatedData<Tag>;
export type PaginatedComments = PaginatedData<Comment>;
export type PaginatedUsers = PaginatedData<User>;