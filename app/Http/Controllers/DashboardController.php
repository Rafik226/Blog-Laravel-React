<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Comment;
use App\Models\User;
use App\Models\View;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Récupérer les statistiques pour le dashboard
        $stats = [
            'myPosts' => $user->is_admin ? Post::count() : Post::where('user_id', $user->id)->count(),
            'myViews' => $user->is_admin ? Post::sum('views_count') ?? 0 : Post::where('user_id', $user->id)->sum('views_count') ?? 0,
            'myComments' => $user->is_admin ? Comment::count() : Comment::whereHas('post', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->count(),
            'drafts' => $user->is_admin ? Post::where('published', false)->count() : Post::where('user_id', $user->id)->where('published', false)->count(),
            'favoriteCategories' => $this->getTopCategories($user),
            'recentPosts' => $this->getRecentPosts($user),
            'activity' => $this->getWeeklyActivity($user)
        ];
    
        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }
    
    /**
     * Récupérer les catégories les plus utilisées
     */
    private function getTopCategories($user)
    {
        return Category::withCount(['posts' => function($query) use ($user) {
                if (!$user->is_admin) {
                    $query->where('user_id', $user->id);
                }
                $query->where('published', true);
            }])
            ->having('posts_count', '>', 0)
            ->orderByDesc('posts_count')
            ->limit(5)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->posts_count
                ];
            })->toArray();
    }
    
    /**
     * Récupérer les articles récents avec décompte des commentaires
     */
    private function getRecentPosts($user)
    {
        $query = Post::query();
        
        if (!$user->is_admin) {
            $query->where('user_id', $user->id);
        }
        
        return $query->withCount(['comments' => function($query) {
                $query->where('approved', true);
            }])
            ->orderByDesc('created_at')
            ->limit(4)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'published_at' => $post->published ? $post->created_at : null,
                    'views' => $post->views_count ?? 0,
                    'comments_count' => $post->comments_count ?? 0
                ];
            })->toArray();
    }
    
    /**
     * Récupérer l'activité de la semaine
     */
    private function getWeeklyActivity($user)
    {
        $days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        $activity = [];
        
        // Créer une entrée pour chaque jour de la semaine
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayIndex = $date->dayOfWeek; // 0 (dimanche) à 6 (samedi)
            
            // Compter les posts créés ce jour
            $postsQuery = Post::whereDate('created_at', $date);
            if (!$user->is_admin) {
                $postsQuery->where('user_id', $user->id);
            }
            $postsCount = $postsQuery->count();
                
            // Compter les commentaires créés ce jour
            $commentsQuery = Comment::whereDate('created_at', $date);
            if (!$user->is_admin) {
                $commentsQuery->whereHas('post', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            }
            $commentsCount = $commentsQuery->count();
                
            // Compter les vues depuis la colonne views_count des posts
            $viewsQuery = Post::whereDate('updated_at', $date);
            if (!$user->is_admin) {
                $viewsQuery->where('user_id', $user->id);
            }
            $viewsCount = $viewsQuery->sum('views_count') ?? 0;
                
            $activity[] = [
                'date' => $days[$dayIndex],
                'posts' => $postsCount,
                'comments' => $commentsCount,
                'views' => $viewsCount
            ];
        }
        
        return $activity;
    }
}
