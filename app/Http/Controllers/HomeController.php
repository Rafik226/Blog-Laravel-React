<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Afficher la page d'accueil
     */
    public function index()
    {
        // Articles récents
        $recentPosts = Post::with(['user', 'category'])
            ->where('published', true)
            ->latest()
            ->take(6)
            ->get();

        // Articles en vedette
        $featuredPosts = Post::with(['user', 'category'])
            ->where('published', true)
            ->whereNotNull('featured_image')
            ->latest()
            ->take(3)
            ->get();

        // Catégories populaires
        $popularCategories = Category::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(5)
            ->get();

        // Tags populaires
        $popularTags = Tag::withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Home', [
            'recentPosts' => $recentPosts,
            'featuredPosts' => $featuredPosts,
            'popularCategories' => $popularCategories,
            'popularTags' => $popularTags,
        ]);
    }
    
    /**
     * Afficher la page "À propos"
     */
    public function about()
    {
        return Inertia::render('about');
    }
    
    /**
     * Afficher la page de contact
     */
    public function contact()
    {
        return Inertia::render('contact');
    }

    /**
     * Traiter le formulaire de contact
     */
    public function submitContact(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        // Ici, vous pourriez envoyer un e-mail, stocker le message, etc.
        // Mail::to('admin@example.com')->send(new ContactFormMail($validatedData));

        return redirect()->back()
            ->with('success', 'Votre message a été envoyé avec succès !');
    }

    /**
     * Afficher les résultats de recherche
     */
    public function search(Request $request)
    {
        $search = $request->input('q');

        $posts = Post::where('published', true)
            ->where(function($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->with(['user', 'category'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Search', [
            'posts' => $posts,
            'search' => $search,
        ]);
    }
}