<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Post;
use App\Observers\PostObserver;
use App\Models\Category;
use App\Observers\CategoryObserver;
use App\Models\Tag;
use App\Observers\TagObserver;
use App\Models\View;
use App\Observers\ViewObserver;

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
    }
}
