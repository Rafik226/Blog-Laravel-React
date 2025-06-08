<?php

namespace App\Listeners;

use App\Events\PostPublished;
use App\Models\Newsletter;
use App\Mail\NewsletterMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendNewsletterOnNewPost implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PostPublished $event): void
    {
        $post = $event->post;
        
        // Générer le contenu de la newsletter
        $subject = "Nouveau article : {$post->title}";
        $content = $this->generateNewsletterContent($post);
        
        // Récupérer tous les abonnés actifs
        $subscribers = Newsletter::active()->get();
        
        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(
                    new NewsletterMail(
                        $subject,
                        $content,
                        $subscriber->unsubscribe_token
                    )
                );
            } catch (\Exception $e) {
                \Log::error("Erreur envoi newsletter automatique à {$subscriber->email}: " . $e->getMessage());
            }
        }
    }

    /**
     * Générer le contenu HTML de la newsletter pour un nouvel article
     */
    private function generateNewsletterContent($post): string
    {
        $excerpt = strip_tags(substr($post->content, 0, 200) . '...');
        $readMoreUrl = route('posts.show', $post->slug);
        $publishedDate = $post->published_at ? $post->published_at->format('d/m/Y') : now()->format('d/m/Y');
        
        return "
            <h1>Nouveau article publié !</h1>
            
            <h2>{$post->title}</h2>
            
            <p><strong>Publié le:</strong> {$publishedDate}</p>
            
            " . ($post->category ? "<p><strong>Catégorie:</strong> {$post->category->name}</p>" : "") . "
            
            <div style='margin: 20px 0;'>
                <p>{$excerpt}</p>
            </div>
            
            <div style='text-align: center; margin: 30px 0;'>
                <a href='{$readMoreUrl}' class='btn' style='background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                    Lire l'article complet
                </a>
            </div>
            
            <hr style='margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;'>
            
            <p style='color: #666; font-size: 14px;'>
                Vous recevez cet email car vous êtes abonné à notre newsletter. 
                Nous vous informons automatiquement des nouveaux articles publiés sur notre blog.
            </p>
        ";
    }
}
