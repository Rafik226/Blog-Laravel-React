<?php

namespace App\Observers;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryObserver
{
    /**
     * Handle the Category "created" event.
     */
    public function created(Category $category): void
    {
        // Générer automatiquement un slug à partir du nom
        if (!$category->slug) {
            $category->slug = Str::slug($category->name);
        }
    }

    /**
     * Handle the Category "updated" event.
     */
    public function updated(Category $category): void
    {
        // Mettre à jour le slug si le nom a changé
        if ($category->isDirty('name') && !$category->isDirty('slug')) {
            $category->slug = Str::slug($category->name);
        }
    }
}