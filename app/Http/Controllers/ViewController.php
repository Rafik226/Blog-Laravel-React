<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class ViewController extends Controller
{
    /**
     * Enregistre une vue pour un article spécifique
     *
     * @param Post $post
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function record(Post $post, Request $request)
    {
        $userId = Auth::id();
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();
        
        $post->incrementViews($userId, $ipAddress, $userAgent);
        
        return response()->json(['success' => true, 'views' => $post->views_count]);
    }
    
    /**
     * Affiche les statistiques de vues pour les administrateurs
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function stats(Request $request)
    {
        $this->authorize('viewStats', View::class);
        
        // Statistiques des vues des 30 derniers jours
        $dailyViews = View::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [Carbon::now()->subDays(30), Carbon::now()])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count
                ];
            });
            
        // Articles les plus vus
        $topPosts = Post::with('user')
            ->orderBy('views_count', 'desc')
            ->take(10)
            ->get()
            ->map(function($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'author' => $post->user->name,
                    'views' => $post->views_count
                ];
            });
        
        return Inertia::render('Admin/ViewStats', [
            'dailyViews' => $dailyViews,
            'topPosts' => $topPosts
        ]);
    }
}