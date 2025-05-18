<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Afficher la liste des articles
     */
    public function index()
    {
        $posts = Post::with(['user', 'category', 'tags'])
            ->when(request('search'), function($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->when(request('category'), function($query, $category) {
                return $query->whereHas('category', function($q) use ($category) {
                    $q->where('slug', $category);
                });
            })
            ->when(request('tag'), function($query, $tag) {
                return $query->whereHas('tags', function($q) use ($tag) {
                    $q->where('slug', $tag);
                });
            })
            ->when(!Auth::check() || !Auth::user()->is_admin, function($query) {
                return $query->where('published', true);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Afficher le formulaire de création d'un article
     */
    public function create()
    {
        $this->authorize('create', Post::class);

        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('Posts/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Enregistrer un nouvel article
     */
    public function store(Request $request)
    {
        $this->authorize('create', Post::class);

        $validatedData = $request->validate([
            'title' => 'required|min:5|max:255',
            'category_id' => 'required|exists:categories,id',
            'content' => 'required|min:50',
            'featured_image' => 'nullable|string',
            'published' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
        ]);

        $post = new Post();
        $post->title = $validatedData['title'];
        $post->slug = Str::slug($validatedData['title']);
        $post->user_id = Auth::id();
        $post->category_id = $validatedData['category_id'];
        $post->content = $validatedData['content'];
        $post->featured_image = $validatedData['featured_image'] ?? null;
        $post->published = $validatedData['published'] ?? false;
        
        if ($post->published) {
            $post->published_at = now();
        }

        $post->save();

        // Attacher les tags si présents
        if (isset($validatedData['tags'])) {
            $post->tags()->attach($validatedData['tags']);
        }

        return redirect()->route('posts.show', $post->slug)
            ->with('success', 'Article créé avec succès !');
    }

    /**
     * Afficher un article spécifique
     */
    public function show(Post $post)
    {
        // Si l'article n'est pas publié et que l'utilisateur n'est pas l'auteur ou admin
        if (!$post->published && (!Auth::check() || Auth::id() !== $post->user_id && !Auth::user()->is_admin)) {
            abort(404);
        }

        $post->load(['user.profile', 'category', 'tags', 'comments' => function ($query) {
            $query->where('approved', true)->latest();
        }]);

        // Incrémenter le compteur de vues (exemple simple)
        // Dans un cas réel, vous voudriez gérer cela avec une table dédiée pour éviter les doublons

        return Inertia::render('Posts/Show', [
            'post' => $post,
            'relatedPosts' => $this->getRelatedPosts($post),
        ]);
    }

    /**
     * Afficher le formulaire de modification d'un article
     */
    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('Posts/Edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
            'selectedTags' => $post->tags->pluck('id')->toArray(),
        ]);
    }

    /**
     * Mettre à jour un article
     */
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validatedData = $request->validate([
            'title' => 'required|min:5|max:255',
            'category_id' => 'required|exists:categories,id',
            'content' => 'required|min:50',
            'featured_image' => 'nullable|string',
            'published' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
        ]);

        $wasPublished = $post->published;
        
        $post->title = $validatedData['title'];
        // Mettre à jour le slug uniquement si le titre a changé
        if ($post->isDirty('title')) {
            $post->slug = Str::slug($validatedData['title']);
        }
        
        $post->category_id = $validatedData['category_id'];
        $post->content = $validatedData['content'];
        $post->featured_image = $validatedData['featured_image'] ?? $post->featured_image;
        $post->published = $validatedData['published'] ?? false;
        
        // Si l'article est publié pour la première fois, mettre à jour published_at
        if ($post->published && !$wasPublished) {
            $post->published_at = now();
        }

        $post->save();

        // Synchroniser les tags
        if (isset($validatedData['tags'])) {
            $post->tags()->sync($validatedData['tags']);
        } else {
            $post->tags()->detach();
        }

        return redirect()->route('posts.show', $post->slug)
            ->with('success', 'Article mis à jour avec succès !');
    }

    /**
     * Supprimer un article
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Article supprimé avec succès !');
    }

    /**
     * Obtenir les articles connexes basés sur la catégorie et les tags
     */
    private function getRelatedPosts(Post $post)
    {
        return Post::where('id', '!=', $post->id)
            ->where('published', true)
            ->where(function($query) use ($post) {
                $query->where('category_id', $post->category_id)
                    ->orWhereHas('tags', function($q) use ($post) {
                        $q->whereIn('id', $post->tags->pluck('id'));
                    });
            })
            ->with(['user', 'category'])
            ->latest()
            ->take(3)
            ->get();
    }
}