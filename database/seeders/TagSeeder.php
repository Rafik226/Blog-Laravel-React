<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer quelques tags prédéfinis
        $tags = [
            'Laravel', 'React', 'PHP', 'JavaScript', 'CSS', 'Inertia', 
            'Design', 'UI/UX', 'API', 'Mobile', 'Responsive'
        ];

        foreach ($tags as $name) {
            Tag::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }

        // Créer quelques tags aléatoires supplémentaires
        Tag::factory(5)->create();
    }
}