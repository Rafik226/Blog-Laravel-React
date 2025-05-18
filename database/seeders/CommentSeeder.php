<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer plusieurs commentaires pour chaque article publié
        Post::where('published', true)->get()->each(function ($post) {
            // Nombre aléatoire de commentaires entre 0 et 5
            $count = rand(0, 5);
            Comment::factory()->count($count)->create([
                'post_id' => $post->id,
            ]);
        });
    }
}