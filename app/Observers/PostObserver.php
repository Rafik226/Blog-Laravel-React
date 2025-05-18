<?php

namespace App\Observers;

use App\Models\Post;
use Illuminate\Support\Str;

class PostObserver
{
    /**
     * Handle the Post "created" event.
     */
    public function created(Post $post): void
    {
        // Générer automatiquement un slug à partir du titre
        if (!$post->slug) {
            $post->slug = Str::slug($post->title);
        }
    }

    /**
     * Handle the Post "updated" event.
     */
    public function updated(Post $post): void
    {
        // Mettre à jour le slug si le titre a changé
        if ($post->isDirty('title') && !$post->isDirty('slug')) {
            $post->slug = Str::slug($post->title);
        }
    }
}