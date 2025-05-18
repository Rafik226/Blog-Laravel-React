<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Afficher tous les commentaires (admin uniquement)
     */
    public function index()
    {
        $this->authorize('viewAny', Comment::class);

        $comments = Comment::with(['user', 'post'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Comments/Index', [
            'comments' => $comments,
        ]);
    }

    /**
     * Stocker un nouveau commentaire pour un article
     */
    public function store(Request $request, Post $post)
    {
        $this->authorize('create', Comment::class);

        $validatedData = $request->validate([
            'content' => 'required|min:5|max:1000',
        ]);

        $comment = new Comment();
        $comment->post_id = $post->id;
        $comment->user_id = Auth::id();
        $comment->content = $validatedData['content'];
        $comment->approved = Auth::user()->is_admin ? true : false; // Auto-approuver pour les admins
        $comment->save();

        return redirect()->route('posts.show', $post->slug)
            ->with('success', $comment->approved 
                ? 'Votre commentaire a été ajouté !' 
                : 'Votre commentaire a été soumis et est en attente d\'approbation.');
    }

    /**
     * Afficher un formulaire pour modifier un commentaire
     */
    public function edit(Comment $comment)
    {
        $this->authorize('update', $comment);

        return Inertia::render('Comments/Edit', [
            'comment' => $comment,
        ]);
    }

    /**
     * Mettre à jour un commentaire existant
     */
    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $validatedData = $request->validate([
            'content' => 'required|min:5|max:1000',
            'approved' => 'boolean',
        ]);

        $comment->content = $validatedData['content'];
        
        if (Auth::user()->is_admin && isset($validatedData['approved'])) {
            $comment->approved = $validatedData['approved'];
        }
        
        $comment->save();

        return redirect()->route('posts.show', $comment->post->slug)
            ->with('success', 'Commentaire mis à jour avec succès !');
    }

    /**
     * Supprimer un commentaire
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        
        $post = $comment->post;
        $comment->delete();

        return redirect()->route('posts.show', $post->slug)
            ->with('success', 'Commentaire supprimé avec succès !');
    }

    /**
     * Approuver un commentaire
     */
    public function approve(Comment $comment)
    {
        $this->authorize('approve', $comment);

        $comment->approved = true;
        $comment->save();

        return redirect()->back()
            ->with('success', 'Commentaire approuvé avec succès !');
    }

    /**
     * Rejeter un commentaire
     */
    public function reject(Comment $comment)
    {
        $this->authorize('approve', $comment);

        $comment->approved = false;
        $comment->save();

        return redirect()->back()
            ->with('success', 'Commentaire rejeté avec succès !');
    }
}