<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
class TagController extends Controller
{
    /**
     * Afficher la liste des tags
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $query = Tag::withCount('posts');
        
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        
        $tags = $query->orderBy('name')->get();
        
        return Inertia::render('Tags/Index', [
            'tags' => $tags,
            'filters' => ['search' => $search]
        ]);
    }
    

    /**
     * Afficher le formulaire de création d'un tag
     */
    public function create()
    {
        $this->authorize('create', Tag::class);

        return Inertia::render('Tags/Create');
    }

    /**
     * Enregistrer un nouveau tag
     */
    public function store(Request $request)
    {
        $this->authorize('create', Tag::class);

        $validatedData = $request->validate([
            'name' => 'required|unique:tags|max:255',
        ]);

        $tag = new Tag();
        $tag->name = $validatedData['name'];
        $tag->slug = Str::slug($validatedData['name']);
        $tag->save();

        return redirect()->route('tags.index')
            ->with('success', 'Tag créé avec succès !');
    }

    /**
     * Afficher un tag spécifique et ses articles
     */
    public function show(Tag $tag)
    {
        $paginatedPosts = $tag->posts()
            ->with(['user', 'category', 'tags', 'comments' => function ($query) {
                $query->where('approved', true);
            }])
            ->where('published', true)
            ->latest()
            ->paginate(9); // Nombre d'articles par page
    
        // Structure simplifiée et explicite
        return Inertia::render('Tags/Show', [
            'tag' => $tag,
            'posts' => [
                'data' => $paginatedPosts->items(),
                'pagination' => [
                    'current_page' => $paginatedPosts->currentPage(),
                    'last_page' => $paginatedPosts->lastPage(),
                    'per_page' => $paginatedPosts->perPage(),
                    'total' => $paginatedPosts->total(),
                    'links' => $paginatedPosts->linkCollection()->toArray()
                ]
            ]
        ]);
    }

    /**
     * Afficher le formulaire de modification d'un tag
     */
    public function edit(Tag $tag)
    {
        $this->authorize('update', $tag);

        return Inertia::render('Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    /**
     * Mettre à jour un tag
     */
    public function update(Request $request, Tag $tag)
    {
        $this->authorize('update', $tag);

        $validatedData = $request->validate([
            'name' => 'required|max:255|unique:tags,name,' . $tag->id,
        ]);

        $tag->name = $validatedData['name'];
        // Mettre à jour le slug uniquement si le nom a changé
        if ($tag->isDirty('name')) {
            $tag->slug = Str::slug($validatedData['name']);
        }
        $tag->save();

        return redirect()->route('tags.index')
            ->with('success', 'Tag mis à jour avec succès !');
    }

    /**
     * Supprimer un tag
     */
    public function destroy(Tag $tag)
    {
        $this->authorize('delete', $tag);

        // Détacher le tag de tous les articles avant de le supprimer
        $tag->posts()->detach();
        $tag->delete();

        return redirect()->route('tags.index')
            ->with('success', 'Tag supprimé avec succès !');
    }
}