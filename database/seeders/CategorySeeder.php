<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer quelques catégories prédéfinies
        $categories = [
            'Technologie' => 'Articles sur les dernières avancées technologiques, gadgets et applications.',
            'Voyage' => 'Découvrez des destinations fascinantes et des conseils de voyage.',
            'Cuisine' => 'Recettes, astuces culinaires et découvertes gastronomiques.',
            'Santé' => 'Conseils pour rester en forme et vivre sainement.',
            'Développement Web' => 'Tutoriels et actualités sur le développement web.',
        ];

        foreach ($categories as $name => $description) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $description,
                'featured_image' => $this->getCategoryImageBase64($name),
            ]);
        }

        // Créer quelques catégories aléatoires supplémentaires
        Category::factory(3)->create();
    }
    
    /**
     * Génère une image base64 pour une catégorie spécifique
     */
    private function getCategoryImageBase64($name): string
    {
        $colors = [
            'Technologie' => '#007BFF',      // Bleu
            'Voyage' => '#28A745',           // Vert
            'Cuisine' => '#DC3545',          // Rouge
            'Santé' => '#17A2B8',            // Turquoise
            'Développement Web' => '#6610F2', // Violet
        ];
        
        $color = $colors[$name] ?? '#FFC107'; // Jaune par défaut
        
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">';
        $svg .= '<rect width="100%" height="100%" fill="' . $color . '" />';
        $svg .= '<text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">' . $name . '</text>';
        $svg .= '</svg>';
        
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
}