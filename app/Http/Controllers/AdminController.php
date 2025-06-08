<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Category;
use App\Models\Tag;
use App\Models\View as ViewModel;

class AdminController extends Controller
{
    /**
     * Vérifier les permissions d'administration
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Afficher le tableau de bord de l'administration
     */
    public function dashboard()
    {
        // Statistiques générales
        $stats = [
            'users' => User::count(),
            'posts' => Post::count(),
            'published_posts' => Post::where('published', true)->count(),
            'comments' => Comment::count(),
            'pending_comments' => Comment::where('approved', false)->count(),
            'categories' => Category::count(),
            'tags' => Tag::count(),
        ];

        // Articles récents
        $recentPosts = Post::with(['user', 'category'])
            ->latest()
            ->take(5)
            ->get();

        // Commentaires récents
        $recentComments = Comment::with(['user', 'post'])
            ->latest()
            ->take(5)
            ->get();

        // Statistiques mensuelles des articles
        $monthlyPosts = Post::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get();

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'recentComments' => $recentComments,
            'monthlyPosts' => $monthlyPosts,
        ]);
    }

    /**
     * Gérer les utilisateurs
     */
    public function users()
    {
        $users = User::withCount(['posts', 'comments'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Gérer les articles
     */
    public function posts()
    {
        $posts = Post::with(['user', 'category'])
            ->withCount(['comments'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/Posts', [
            'posts' => $posts,
        ]);
    }

    /**
     * Gérer les commentaires
     */
    public function comments()
    {
        $comments = Comment::with(['user', 'post'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/Comments', [
            'comments' => $comments,
        ]);
    }

    /**
     * Gérer les catégories
     */
    public function categories()
    {
        $categories = Category::withCount('posts')
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Gérer les tags
     */
    public function tags()
    {
        $tags = Tag::withCount('posts')
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/Tags', [
            'tags' => $tags,
        ]);
    }

    /**
     * Afficher les statistiques de vues
     */
    public function viewStats()
    {
        // Récupérer les vues quotidiennes pour les 30 derniers jours
        $dailyViews = ViewModel::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at) DESC')
            ->limit(30)
            ->get()
            ->reverse()
            ->values();
    
        // Récupérer les articles les plus consultés avec gestion des utilisateurs supprimés
        $topPosts = Post::select('id', 'title', 'slug', 'views_count', 'user_id')
            ->with('user:id,name')
            ->where('views_count', '>', 0) // Seulement les posts avec des vues
            ->orderBy('views_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'author' => $post->user ? $post->user->name : 'Utilisateur supprimé',
                    'views' => $post->views_count ?? 0,
                ];
            });

        // Statistiques générales
        $totalViews = ViewModel::count();
        $uniqueVisitors = ViewModel::distinct('ip_address')->count('ip_address');
        $avgViewsPerPost = Post::where('views_count', '>', 0)->avg('views_count');
        
        // Statistiques par catégorie
        $categoryStats = Category::select('categories.id', 'categories.name')
            ->withCount(['posts as published_posts_count' => function ($query) {
                $query->where('published', true);
            }])
            ->withSum(['posts as total_views' => function ($query) {
                $query->where('published', true);
            }], 'views_count')
            ->having('published_posts_count', '>', 0)
            ->orderBy('total_views', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'posts_count' => $category->published_posts_count,
                    'total_views' => $category->total_views ?? 0,
                    'avg_views' => $category->published_posts_count > 0 
                        ? round(($category->total_views ?? 0) / $category->published_posts_count, 1) 
                        : 0,
                ];
            });

        // Activité récente (derniers 7 jours)
        $recentActivity = ViewModel::selectRaw('DATE(created_at) as date, COUNT(*) as views_count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date', 'desc')
            ->get();

        // Statistiques des commentaires
        $commentsStats = [
            'total' => Comment::count(),
            'approved' => Comment::where('approved', true)->count(),
            'pending' => Comment::where('approved', false)->count(),
            'recent' => Comment::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        // Top auteurs par vues
        $topAuthors = User::select('users.id', 'users.name')
            ->join('posts', 'users.id', '=', 'posts.user_id')
            ->where('posts.published', true)
            ->where('posts.views_count', '>', 0)
            ->groupBy('users.id', 'users.name')
            ->selectRaw('users.id, users.name, COUNT(posts.id) as posts_count, SUM(posts.views_count) as total_views')
            ->orderBy('total_views', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($author) {
                return [
                    'name' => $author->name,
                    'posts_count' => $author->posts_count,
                    'total_views' => $author->total_views,
                    'avg_views' => round($author->total_views / $author->posts_count, 1),
                ];
            });

        // Données de performance mensuelle
        $monthlyStats = ViewModel::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as views_count')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($stat) {
                return [
                    'period' => sprintf('%04d-%02d', $stat->year, $stat->month),
                    'views' => $stat->views_count,
                ];
            });
    
        return Inertia::render('admin/ViewStats', [
            'dailyViews' => $dailyViews,
            'topPosts' => $topPosts,
            'stats' => [
                'totalViews' => $totalViews,
                'uniqueVisitors' => $uniqueVisitors,
                'avgViewsPerPost' => round($avgViewsPerPost ?? 0, 1),
                'totalPosts' => Post::where('published', true)->count(),
                'totalAuthors' => User::whereHas('posts', function ($query) {
                    $query->where('published', true);
                })->count(),
            ],
            'categoryStats' => $categoryStats,
            'recentActivity' => $recentActivity,
            'commentsStats' => $commentsStats,
            'topAuthors' => $topAuthors,
            'monthlyStats' => $monthlyStats,
        ]);
    }

    /**
     * Activer/désactiver un utilisateur
     */
    public function toggleUserStatus(User $user)
    {
        // Empêcher la désactivation de son propre compte
        if ($user->id === Auth::user()->id) {        
            return redirect()->route('admin.users.index')
                ->with('error', 'Vous ne pouvez pas désactiver votre propre compte.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return redirect()->route('admin.users.index')
            ->with('success', 'Statut de l\'utilisateur mis à jour avec succès !');
    }

    /**
     * Promouvoir/rétrograder un utilisateur (admin/non-admin)
     */
    public function toggleUserAdmin(User $user)
    {
        // Empêcher la rétrogradation de son propre compte
        if ($user->id === Auth::user()->id) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Vous ne pouvez pas modifier votre propre statut d\'administrateur.');
        }

        $user->is_admin = !$user->is_admin;
        $user->save();

        return redirect()->route('admin.users.index')
            ->with('success', 'Statut d\'administrateur mis à jour avec succès !');
    }
}