<?php

namespace App\Observers;

use App\Models\Tag;
use Illuminate\Support\Str;

class TagObserver
{
    /**
     * Handle the Tag "created" event.
     */
    public function created(Tag $tag): void
    {
        // Générer automatiquement un slug à partir du nom
        if (!$tag->slug) {
            $tag->slug = Str::slug($tag->name);
        }
    }

    /**
     * Handle the Tag "updated" event.
     */
    public function updated(Tag $tag): void
    {
        // Mettre à jour le slug si le nom a changé
        if ($tag->isDirty('name') && !$tag->isDirty('slug')) {
            $tag->slug = Str::slug($tag->name);
        }
    }
}