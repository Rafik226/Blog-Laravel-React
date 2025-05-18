<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence();
        $isPublished = $this->faker->boolean(70); // 70% de chances d'être publié
        $hasImage = $this->faker->boolean(80); // 80% de chances d'avoir une image

        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->generateContent(),
            'featured_image' => $hasImage ? $this->getPostImageBase64() : null,
            'published' => $isPublished,
            'published_at' => $isPublished ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
        ];
    }

    /**
     * Generate realistic content for blog posts
     */
    private function generateContent(): string
    {
        $paragraphs = $this->faker->paragraphs(rand(3, 7));
        $content = '<p>' . implode('</p><p>', $paragraphs) . '</p>';
        
        // Ajouter un sous-titre après le premier paragraphe
        $position = strpos($content, '</p>') + 4;
        $subheading = '<h2>' . $this->faker->sentence() . '</h2>';
        $content = substr_replace($content, $subheading, $position, 0);
        
        // Ajouter une citation
        if (rand(0, 1)) {
            $quote = '<blockquote>' . $this->faker->sentence() . '</blockquote>';
            $position = strpos($content, '</p>', $position) + 4;
            $content = substr_replace($content, $quote, $position, 0);
        }

        return $content;
    }
    
    /**
     * Génère une image base64 pour les articles
     */
    private function getPostImageBase64(): string
    {
        // Création d'une image simple 100x100 pixels avec du texte
        // En production, vous utiliseriez probablement de vraies images
        $colors = [
            [255, 0, 0],    // Rouge
            [0, 0, 255],    // Bleu
            [0, 128, 0],    // Vert
            [128, 0, 128],  // Violet
            [255, 165, 0],  // Orange
        ];
        
        $randomColor = $this->faker->randomElement($colors);
        
        // Générer un simple SVG en base64
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">';
        $svg .= '<rect width="100%" height="100%" fill="rgb(' . implode(',', $randomColor) . ')" />';
        $svg .= '<text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Article Image</text>';
        $svg .= '</svg>';
        
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
}