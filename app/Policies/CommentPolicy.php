<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        // Tout utilisateur authentifié peut créer un commentaire
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Comment $comment)
    {
        // L'utilisateur peut modifier son propre commentaire ou s'il est admin
        return $user->id === $comment->user_id || $user->is_admin;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Comment $comment)
    {
        // L'utilisateur peut supprimer son propre commentaire, ou s'il est admin, ou s'il est l'auteur du post
        return $user->id === $comment->user_id 
               || $user->is_admin 
               || $user->id === $comment->post->user_id;
    }

    /**
     * Determine whether the user can approve comments.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function approve(User $user, Comment $comment)
    {
        // Seuls les admins ou l'auteur du post peuvent approuver/rejeter les commentaires
        return $user->is_admin || $user->id === $comment->post->user_id;
    }
}
