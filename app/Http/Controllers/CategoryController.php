<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Afficher la liste des catégories
     */
    public function index()
    {
        $categories = Category::withCount('posts')->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Afficher le formulaire de création d'une catégorie
     */
    public function create()
    {
        $this->authorize('create', Category::class);

        return Inertia::render('Categories/Create');
    }

    /**
     * Enregistrer une nouvelle catégorie
     */
    public function store(Request $request)
    {
        $this->authorize('create', Category::class);

        $validatedData = $request->validate([
            'name' => 'required|unique:categories|max:255',
            'description' => 'nullable|max:1000',
            'featured_image' => 'nullable|string',
        ]);

        $category = new Category();
        $category->name = $validatedData['name'];
        $category->slug = Str::slug($validatedData['name']);
        $category->description = $validatedData['description'] ?? null;
        $category->featured_image = $validatedData['featured_image'] ?? null;
        $category->save();

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie créée avec succès !');
    }

    /**
     * Afficher une catégorie spécifique et ses articles
     */
    public function show(Category $category)
    {
        $posts = $category->posts()
            ->with(['user', 'tags'])
            ->withCount(['comments' => function ($query) {
                $query->where('approved', true);
            }])
            ->where('published', true)
            ->latest()
            ->paginate(10);
    
        // Récupérer les autres catégories pour la sidebar
        $other_categories = Category::where('id', '!=', $category->id)
            ->withCount('posts')
            ->get();
    
        return Inertia::render('Categories/Show', [
            'category' => $category,
            'posts' => $posts,
            'other_categories' => $other_categories,
        ]);
    }

    /**
     * Afficher le formulaire de modification d'une catégorie
     */
    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Mettre à jour une catégorie
     */
    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validatedData = $request->validate([
            'name' => 'required|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|max:1000',
            'featured_image' => 'nullable|string',
        ]);

        $category->name = $validatedData['name'];
        // Mettre à jour le slug uniquement si le nom a changé
        if ($category->isDirty('name')) {
            $category->slug = Str::slug($validatedData['name']);
        }
        $category->description = $validatedData['description'] ?? $category->description;
        $category->featured_image = $validatedData['featured_image'] ?? $category->featured_image;
        $category->save();

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie mise à jour avec succès !');
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        // Vérifier si la catégorie a des articles associés
        if ($category->posts()->count() > 0) {
            return redirect()->route('categories.index')
                ->with('error', 'Impossible de supprimer une catégorie qui contient des articles.');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie supprimée avec succès !');
    }
}