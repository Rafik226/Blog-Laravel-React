<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Category;
use App\Models\Tag;


class AdminController extends Controller
{
    /**
     * Afficher le tableau de bord de l'administration
     */
    public function dashboard()
    {
        Gate::authorize('accessAdmin');
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

        return Inertia::render('Admin/Dashboard', [
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
        Gate::authorize('accessAdmin');
        $users = User::withCount(['posts', 'comments'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Gérer les articles
     */
    public function posts()
    {
        Gate::authorize('accessAdmin');
        $posts = Post::with(['user', 'category'])
            ->withCount(['comments'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Posts', [
            'posts' => $posts,
        ]);
    }

    /**
     * Gérer les commentaires
     */
    public function comments()
    {
        Gate::authorize('accessAdmin');
        $comments = Comment::with(['user', 'post'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Comments', [
            'comments' => $comments,
        ]);
    }

    /**
     * Gérer les catégories
     */
    public function categories()
    {
        Gate::authorize('accessAdmin');
        $categories = Category::withCount('posts')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Gérer les tags
     */
    public function tags()
    {
        Gate::authorize('accessAdmin');
        $tags = Tag::withCount('posts')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Tags', [
            'tags' => $tags,
        ]);
    }

    /**
     * Activer/désactiver un utilisateur
     */
    public function toggleUserStatus(User $user)
    {
        Gate::authorize('accessAdmin');
        // Empêcher la désactivation de son propre compte
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users')
                ->with('error', 'Vous ne pouvez pas désactiver votre propre compte.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return redirect()->route('admin.users')
            ->with('success', 'Statut de l\'utilisateur mis à jour avec succès !');
    }

    /**
     * Promouvoir/rétrograder un utilisateur (admin/non-admin)
     */
    public function toggleUserAdmin(User $user)
    {
        Gate::authorize('accessAdmin');
        // Empêcher la rétrogradation de son propre compte
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users')
                ->with('error', 'Vous ne pouvez pas modifier votre propre statut d\'administrateur.');
        }

        $user->is_admin = !$user->is_admin;
        $user->save();

        return redirect()->route('admin.users')
            ->with('success', 'Statut d\'administrateur mis à jour avec succès !');
    }
}