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
    public function index(Request $request)
    {
        // Récupérer les paramètres de filtre
        $search = $request->input('search');
        $categorySlug = $request->input('category');
        $tagSlug = $request->input('tag');
        $perPage = 9; // Nombre d'articles par page
    
        // Construire la requête avec les filtres
        $query = Post::with(['user', 'category', 'tags', 'comments'])
            ->when($search, function($query, $search) {
                return $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->when($categorySlug, function($query, $categorySlug) {
                return $query->whereHas('category', function($q) use ($categorySlug) {
                    $q->where('slug', $categorySlug);
                });
            })
            ->when($tagSlug, function($query, $tagSlug) {
                return $query->whereHas('tags', function($q) use ($tagSlug) {
                    $q->where('slug', $tagSlug);
                });
            });
            
    
        // Filtrer les articles non publiés pour les non-administrateurs
        if (!Auth::check() || !Auth::user()->is_admin) {
            $query->where('published', true);
        }
    
        // Récupérer les articles paginés
        $paginatedPosts = $query->latest()->paginate($perPage);
    
        // Récupérer les catégories pour la sidebar
        $categories = Category::withCount(['posts' => function($query) {
            if (!Auth::check() || !Auth::user()->is_admin) {
                $query->where('published', true);
            }
        }])->orderBy('name')->get();
    
        // Renvoyer la vue avec les données explicitement structurées
        return Inertia::render('Posts/Index', [
            'posts' => [
                'data' => $paginatedPosts->items(),
                'meta' => [
                    'current_page' => $paginatedPosts->currentPage(),
                    'last_page' => $paginatedPosts->lastPage(),
                    'per_page' => $paginatedPosts->perPage(),
                    'total' => $paginatedPosts->total(),
                    'links' => $paginatedPosts->linkCollection()->toArray()
                ]
            ],
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $categorySlug,
                'tag' => $tagSlug
            ]
        ]);
    }
    

    /**
     * Afficher le formulaire de création d'un article
     */
    public function create()
    {
        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

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
    public function show(Post $post, Request $request)
    {
        // Chargement des relations
        $post->load(['user', 'category', 'tags', 'comments' => function($query) {
            $query->where('approved', true)->with('user');
        }]);
        
        // Enregistrement de la vue si l'utilisateur n'est pas l'auteur
        if (!Auth::check() || Auth::id() !== $post->user_id) {
            $userId = Auth::id();
            $ipAddress = $request->ip();
            $userAgent = $request->userAgent();
            
            $post->incrementViews($userId, $ipAddress, $userAgent);
        }
        
        // Articles connexes
        $relatedPosts = Post::where('id', '!=', $post->id)
            ->where('published', true)
            ->where(function($query) use ($post) {
                // Même catégorie ou mêmes tags
                if ($post->category_id) {
                    $query->where('category_id', $post->category_id);
                }
                if ($post->tags->count() > 0) {
                    $tagIds = $post->tags->pluck('id');
                    $query->orWhereHas('tags', function($q) use ($tagIds) {
                        $q->whereIn('tags.id', $tagIds);
                    });
                }
            })
            ->with(['user', 'category'])
            ->withCount('views')
            ->inRandomOrder()
            ->limit(3)
            ->get();
            
        return Inertia::render('Posts/Show', [
            'post' => $post,
            'related_posts' => $relatedPosts,
            'comments' => $post->comments,
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
     * Afficher la liste des brouillons de l'utilisateur connecté
     */
    public function drafts()
    {
        $drafts = Post::where('user_id', Auth::id())
            ->where('published', false)
            ->with(['category', 'tags'])
            ->latest()
            ->paginate(9);
        
        return Inertia::render('Posts/Drafts', [
            'posts' => [
                'data' => $drafts->items(),
                'meta' => [
                    'current_page' => $drafts->currentPage(),
                    'last_page' => $drafts->lastPage(),
                    'per_page' => $drafts->perPage(),
                    'total' => $drafts->total(),
                    'links' => $drafts->linkCollection()->toArray()
                ]
            ]
        ]);
    }
}