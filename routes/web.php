<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ViewController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



// Routes protégées par authentification
Route::middleware(['auth'])->group(function () {
    // Tableau de bord utilisateur
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Routes pour les commentaires
    Route::post('/posts/{post:slug}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::get('/comments/{comment}/edit', [CommentController::class, 'edit'])->name('comments.edit');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // Routes pour la gestion des tags
    Route::resource('tags', TagController::class);
    
       // Routes pour la création d'articles et les brouillons
    Route::get('/posts/create', [PostController::class, 'create'])
        ->middleware('can:create,App\Models\Post')
        ->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])
        ->middleware('can:create,App\Models\Post')
        ->name('posts.store');
        Route::get('/posts/drafts', [PostController::class, 'drafts'])
        ->name('posts.drafts');

    // Routes pour l'édition d'articles (auteurs)
    Route::middleware(['can:update,post'])->group(function () {
        Route::get('/posts/{post:slug}/edit', [PostController::class, 'edit'])->name('posts.edit');
        Route::put('/posts/{post:slug}', [PostController::class, 'update'])->name('posts.update');
        Route::delete('/posts/{post:slug}', [PostController::class, 'destroy'])->name('posts.destroy');
    });
});

// Routes d'administration
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/admindash', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users.index');
    Route::get('/posts', [AdminController::class, 'posts'])->name('admin.posts.index');
    Route::get('/comments', [AdminController::class, 'comments'])->name('admin.comments.index');
    Route::get('/categories', [AdminController::class, 'categories'])->name('admin.categories.index');
    Route::get('/tags', [AdminController::class, 'tags'])->name('admin.tags.index');
    
    // Route pour les statistiques de vues 
    Route::get('/stats/views', [AdminController::class, 'viewStats'])->name('admin.stats.views');
    
    // Actions sur les utilisateurs
    Route::put('/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('admin.users.toggle-status');
    Route::put('/users/{user}/toggle-admin', [AdminController::class, 'toggleUserAdmin'])->name('admin.users.toggle-admin');
    
    // Actions sur les commentaires
    Route::put('/comments/{comment}/approve', [CommentController::class, 'approve'])->name('admin.comments.approve');
    Route::put('/comments/{comment}/reject', [CommentController::class, 'reject'])->name('admin.comments.reject');
    
    // Gestion des catégories
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('admin.categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');
    
    // Gestion des tags
    Route::get('/tags/create', [TagController::class, 'create'])->name('admin.tags.create');
    Route::post('/tags', [TagController::class, 'store'])->name('admin.tags.store');
    Route::get('/tags/{tag}/edit', [TagController::class, 'edit'])->name('admin.tags.edit');
    Route::put('/tags/{tag}', [TagController::class, 'update'])->name('admin.tags.update');
    Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('admin.tags.destroy');
});

// Routes publiques
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::post('/contact', [HomeController::class, 'submitContact'])->name('contact.submit');
Route::get('/search', [HomeController::class, 'search'])->name('search');

// Routes des articles (publiques)
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');

// Routes des catégories (publiques)
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

// Routes des tags (publiques)
Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
Route::get('/tags/{tag:slug}', [TagController::class, 'show'])->name('tags.show');

// Routes des profils (publiques)
Route::get('/authors/{user:id}', [ProfileController::class, 'show'])->name('profiles.show');
// Route pour enregistrer une vue manuellement (si nécessaire)
Route::post('/posts/{post}/view', [ViewController::class, 'record'])->name('posts.view');

// Inclure les routes d'authentification et de paramètres
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';