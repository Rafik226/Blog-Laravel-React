<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Post $post): bool
    {
        return false;
    }

   
    
    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Post $post): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return false;
    }

     
    public function create(User $user)
    {
        // Seuls les utilisateurs actifs peuvent créer des articles
        return $user->is_active === true;
    }
    
    public function update(User $user, Post $post)
    {
        // Un utilisateur peut modifier ses propres articles ou s'il est admin
        return $user->id === $post->user_id || $user->is_admin === true;
    }
    
    public function delete(User $user, Post $post)
    {
        // Un utilisateur peut supprimer ses propres articles ou s'il est admin
        return $user->id === $post->user_id || $user->is_admin === true;
    }
}
