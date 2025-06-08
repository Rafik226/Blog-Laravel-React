<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Category;
use App\Models\Post;
use App\Models\Newsletter;
use App\Events\PostPublished;
use App\Mail\NewsletterMail;
use Illuminate\Support\Facades\Mail;

class TestNewsletterEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'newsletter:test {--type=auto : Type de test (auto|manual)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tester l\'envoi d\'emails de newsletter';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');

        if ($type === 'manual') {
            return $this->testManualSend();
        } else {
            return $this->testAutoSend();
        }
    }

    private function testAutoSend()
    {
        $this->info('🚀 Test de l\'envoi automatique de newsletter...');

        // Vérifier qu'il y a des abonnés
        $subscribersCount = Newsletter::active()->count();
        $this->info("📊 Nombre d'abonnés actifs: {$subscribersCount}");

        if ($subscribersCount === 0) {
            $this->warn('⚠️  Aucun abonné actif trouvé. Création d\'un abonné test...');
            Newsletter::create(['email' => 'test@example.com']);
            $subscribersCount = 1;
        }

        // Créer un article de test
        $user = User::first();
        $category = Category::first();

        $this->info("👤 Utilisateur trouvé: " . ($user ? $user->name . " (ID: {$user->id})" : 'Aucun'));
        $this->info("📂 Catégorie trouvée: " . ($category ? $category->name . " (ID: {$category->id})" : 'Aucune'));

        if (!$user || !$category) {
            $this->error('❌ Erreur: Utilisateur ou catégorie manquant');
            return 1;
        }

        $post = Post::create([
            'title' => 'Test Newsletter Auto - ' . now()->format('Y-m-d H:i:s'),
            'slug' => 'test-newsletter-auto-' . time(),
            'content' => 'Ceci est un test pour vérifier que les emails de newsletter sont envoyés automatiquement lors de la publication d\'un article.',
            'published' => true,
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $this->info("📝 Article créé: {$post->title}");

        // Déclencher l'événement
        $this->info('🔥 Déclenchement de l\'événement PostPublished...');
        event(new PostPublished($post));

        $this->info('✅ Événement déclenché! Vérifiez vos logs ou Mailtrap pour voir les emails.');
        $this->info("📧 {$subscribersCount} email(s) devrait(ent) être envoyé(s).");

        return 0;
    }

    private function testManualSend()
    {
        $this->info('🚀 Test de l\'envoi manuel de newsletter...');

        // Récupérer un article récent
        $post = Post::where('published', true)->latest()->first();
        
        if (!$post) {
            $this->error('❌ Aucun article publié trouvé');
            return 1;
        }

        // Récupérer les abonnés actifs
        $subscribers = Newsletter::active()->get();
        
        if ($subscribers->isEmpty()) {
            $this->warn('⚠️  Aucun abonné actif trouvé. Création d\'un abonné test...');
            $subscriber = Newsletter::create(['email' => 'test@example.com']);
            $subscribers = collect([$subscriber]);
        }

        $this->info("📝 Article sélectionné: {$post->title}");
        $this->info("📊 Nombre d'abonnés: {$subscribers->count()}");

        // Envoyer les emails
        $sentCount = 0;
        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new NewsletterMail($post, $subscriber));
                $sentCount++;
                $this->info("📧 Email envoyé à: {$subscriber->email}");
            } catch (\Exception $e) {
                $this->error("❌ Erreur lors de l'envoi à {$subscriber->email}: {$e->getMessage()}");
            }
        }

        $this->info("✅ Test terminé! {$sentCount}/{$subscribers->count()} emails envoyés.");
        $this->info('📧 Vérifiez vos logs ou Mailtrap pour voir les emails.');

        return 0;
    }
}
