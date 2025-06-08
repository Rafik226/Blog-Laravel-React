<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Models\Post;
use App\Observers\PostObserver;
use App\Models\Category;
use App\Observers\CategoryObserver;
use App\Models\Tag;
use App\Observers\TagObserver;
use App\Models\View;
use App\Observers\ViewObserver;
use App\Events\PostPublished;
use App\Listeners\SendNewsletterOnNewPost;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Post::Observe(PostObserver::class);
        Category::Observe(CategoryObserver::class);
        Tag::Observe(TagObserver::class);
        View::Observe(ViewObserver::class);
        
        // Enregistrer l'événement et listener pour la newsletter
        Event::listen(
            PostPublished::class,
            SendNewsletterOnNewPost::class
        );
    }
}
