<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un article mis en avant
        $featuredPost = Post::factory()->create([
            'title' => 'Bienvenue sur notre nouveau blog Laravel avec Inertia et React',
            'slug' => 'bienvenue-sur-notre-nouveau-blog',
            'content' => $this->getFeaturedPostContent(),
            'published' => true,
            'published_at' => now(),
            'featured_image' => $this->getFeaturedImageBase64(),
        ]);

        // Associer quelques tags à l'article mis en avant
        $featuredPost->tags()->attach(Tag::inRandomOrder()->limit(3)->get());

        // Créer d'autres articles
        Post::factory(15)->create()->each(function ($post) {
            // Associer de 1 à 4 tags aléatoires à chaque article
            $tags = Tag::inRandomOrder()->limit(rand(1, 4))->get();
            $post->tags()->attach($tags);
        });
    }

    /**
     * Get content for the featured post
     */
    private function getFeaturedPostContent(): string
    {
        return '<p>Bienvenue sur notre tout nouveau blog, construit avec les technologies les plus modernes : Laravel 12, Inertia.js et React !</p>
        
        <h2>Une expérience utilisateur fluide</h2>
        
        <p>Grâce à Inertia.js, nous combinons le meilleur des deux mondes : la puissance du backend Laravel et l\'interactivité des interfaces React, sans avoir à créer une API distincte.</p>
        
        <p>Notre blog vous offrira des articles de qualité sur divers sujets techniques et pratiques.</p>
        
        <blockquote>La fusion de Laravel et React via Inertia.js représente l\'avenir du développement web moderne.</blockquote>
        
        <h2>Fonctionnalités principales</h2>
        
        <p>Explorez notre blog et découvrez toutes ses fonctionnalités :</p>
        <ul>
            <li>Design responsive et moderne</li>
            <li>Navigation fluide sans rechargement de page</li>
            <li>Recherche avancée d\'articles</li>
            <li>Système de commentaires interactif</li>
            <li>Catégories et tags pour faciliter la découverte</li>
        </ul>
        
        <p>N\'hésitez pas à vous inscrire pour recevoir nos derniers articles et participer à la communauté !</p>';
    }
    
    /**
     * Génère une image base64 pour l'article mis en avant
     */
    private function getFeaturedImageBase64(): string
    {
        // Créer un SVG spécial pour l'article de bienvenue
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">';
        $svg .= '<defs>';
        $svg .= '<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">';
        $svg .= '<stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />';
        $svg .= '<stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />';
        $svg .= '</linearGradient>';
        $svg .= '</defs>';
        $svg .= '<rect width="100%" height="100%" fill="url(#grad)" />';
        $svg .= '<text x="50%" y="50%" font-family="Arial" font-size="32" fill="white" text-anchor="middle">Bienvenue sur notre Blog</text>';
        $svg .= '<text x="50%" y="60%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Laravel + Inertia + React</text>';
        $svg .= '</svg>';
        
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
}