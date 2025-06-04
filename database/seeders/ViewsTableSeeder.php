<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\View;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Faker\Factory as Faker;

class ViewsTableSeeder extends Seeder
{
    /**
     * Exécuter le seeding.
     */
    public function run(): void
    {
        // Vider la table views pour éviter les doublons
        DB::table('views')->truncate();
        
        // Réinitialiser les compteurs views_count dans la table posts
        DB::table('posts')->update(['views_count' => 0]);
        
        $faker = Faker::create();
        
        // Définir les articles qui ont des vues 
        $postViews = [
            1 =>  2,
            2 => 2,
            3 => 1,
            4 => 3,
            5 => 5,
            6 => 4,
            7 => 3,
            8 => 3,
            9 => 2,
            10 => 1,
            11 => 1,
            12 => 1,
            13 => 1,
            14 => 1,
            15 => 1,
            16 => 1,
        ];
        
        // Générer aléatoirement des adresses IP et user agents pour la diversité
        $ipAddresses = [
            '192.168.1.1',
            '10.0.0.5',
            '172.16.0.10',
            '8.8.8.8',
            '1.1.1.1',
            '127.0.0.1',
            '192.168.0.100',
            '10.0.0.1'
        ];
        
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 11; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59 Safari/537.36'
        ];
        
        $viewsData = [];
        
        // Créer les enregistrements de vues pour chaque article avec des vues
        foreach ($postViews as $postId => $viewCount) {
            // Récupérer la date de création de l'article pour générer des dates de vue cohérentes
            $post = Post::find($postId);
            if (!$post) continue;
            
            $createdAt = Carbon::parse($post->created_at);
            
            // Générer les vues sur une période de temps
            for ($i = 0; $i < $viewCount; $i++) {
                $viewDate = $createdAt->copy()->addHours(rand(1, 30 * 24)); // Entre 1 heure et 30 jours après la création
                
                $viewsData[] = [
                    'post_id' => $postId,
                    'user_id' => rand(0, 1) ? rand(1, 4) : null, // Certaines vues avec utilisateur, d'autres anonymes
                    'ip_address' => $ipAddresses[array_rand($ipAddresses)],
                    'user_agent' => $userAgents[array_rand($userAgents)],
                    'created_at' => $viewDate,
                    'updated_at' => $viewDate
                ];
            }
            
            // Mettre à jour le compteur de vues dans la table posts
            $post->update(['views_count' => $viewCount]);
        }
        
        // Insérer les données de vues en une seule opération
        DB::table('views')->insert($viewsData);
        
        $this->command->info('Table des vues remplie avec succès !');
    }
}