import React from 'react';
import { Link } from '@inertiajs/react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Liste d'icônes et de couleurs pour les catégories
  const icons = [
    { icon: "💻", bg: "bg-blue-100 dark:bg-blue-900" },
    { icon: "🎨", bg: "bg-purple-100 dark:bg-purple-900" },
    { icon: "📱", bg: "bg-green-100 dark:bg-green-900" },
    { icon: "🔍", bg: "bg-yellow-100 dark:bg-yellow-900" },
    { icon: "📝", bg: "bg-red-100 dark:bg-red-900" }
  ];
  
  // Choisir une icône selon l'ID de la catégorie
  const iconData = icons[category.id % icons.length];
  
  return (
    <Link
      href={route('categories.show', category.slug)}
      className="block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center h-24 flex flex-col justify-center"
    >
      <div className={`w-8 h-8 mx-auto mb-1 ${iconData.bg} rounded-lg flex items-center justify-center text-lg`}>
        {iconData.icon}
      </div>
      <h3 className="font-medium text-sm line-clamp-1 text-gray-900 dark:text-white">{category.name}</h3>
      {category.posts_count !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-300 mt-1 block">
          {category.posts_count} article{category.posts_count !== 1 ? 's' : ''}
        </span>
      )}
    </Link>
  );
}