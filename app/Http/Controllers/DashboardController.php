<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Comment;
use App\Models\User;
use App\Models\View;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Filtrage par utilisateur si ce n'est pas un admin
        $userFilter = Auth::user()->is_admin ? [] : ['user_id' => Auth::id()];
        
        // Récupérer les statistiques pour le dashboard
        $stats = [
            'totalPosts' => Post::where($userFilter)->count(),
            'totalViews' => Post::where($userFilter)->sum('views_count'),
            'totalComments' => Comment::when(!Auth::user()->is_admin, function($query) {
                return $query->whereHas('post', function($q) {
                    $q->where('user_id', Auth::id());
                });
            })->count(),
            'totalUsers' => Auth::user()->is_admin ? User::count() : 1,
            'categories' => $this->getTopCategories($userFilter),
            'recentPosts' => $this->getRecentPosts($userFilter),
            'activity' => $this->getWeeklyActivity()
        ];
    
        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }
    
    /**
     * Récupérer les catégories les plus utilisées
     */
    private function getTopCategories(array $userFilter)
    {
        return Category::withCount(['posts' => function($query) use ($userFilter) {
                if (!empty($userFilter)) {
                    $query->where($userFilter);
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
            });
    }
    
    /**
     * Récupérer les articles récents avec décompte des commentaires
     */
    private function getRecentPosts(array $userFilter)
    {
        return Post::where($userFilter)
            ->withCount(['comments' => function($query) {
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
            });
    }
    
    /**
     * Récupérer l'activité de la semaine
     */
    private function getWeeklyActivity()
    {
        $days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        $activity = [];
        $userId = Auth::user()->is_admin ? null : Auth::id();
        
        // Créer une entrée pour chaque jour de la semaine
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayIndex = $date->dayOfWeek; // 0 (dimanche) à 6 (samedi)
            
            // Compter les posts créés ce jour
            $postsCount = Post::when($userId, function($query) use($userId) {
                    return $query->where('user_id', $userId);
                })
                ->whereDate('created_at', $date)
                ->count();
                
            // Compter les commentaires créés ce jour
            $commentsCount = Comment::when($userId, function($query) use($userId) {
                    return $query->whereHas('post', function($q) use($userId) {
                        $q->where('user_id', $userId);
                    });
                })
                ->whereDate('created_at', $date)
                ->count();
                
            // Compter les vues enregistrées ce jour
            $viewsCount = View::when($userId, function($query) use($userId) {
                    return $query->whereHas('post', function($q) use($userId) {
                        $q->where('user_id', $userId);
                    });
                })
                ->whereDate('created_at', $date)
                ->count();
                
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
