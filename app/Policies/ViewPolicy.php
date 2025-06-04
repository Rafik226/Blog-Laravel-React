<?php

namespace App\Policies;

use App\Models\User;
use App\Models\View;
use Illuminate\Auth\Access\HandlesAuthorization;

class ViewPolicy
{
    use HandlesAuthorization;
    
    /**
     * Determine whether the user can view statistics.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewStats(User $user)
    {
        return $user->is_admin;
    }
}