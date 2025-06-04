<?php

namespace App\Observers;

use App\Models\View;
use Illuminate\Support\Facades\Log;

class ViewObserver
{
    /**
     * Gère l'événement après la création d'une vue.
     */
    public function created(View $view): void
    {
        Log::info('Nouvelle vue sur l\'article #' . $view->post_id);
    }
}