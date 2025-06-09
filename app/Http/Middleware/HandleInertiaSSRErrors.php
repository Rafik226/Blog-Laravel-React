<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaSSRErrors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            return $next($request);
        } catch (\Exception $e) {
            // Si c'est une erreur SSR d'Inertia, désactiver temporairement le SSR
            if (str_contains($e->getMessage(), 'Inertia SSR bundle not found')) {
                // Log l'erreur pour debugging
                logger()->warning('Inertia SSR bundle not found, falling back to client-side rendering', [
                    'error' => $e->getMessage(),
                    'url' => $request->url()
                ]);

                // Désactiver temporairement le SSR pour cette requête
                config(['inertia.ssr.enabled' => false]);
                
                // Retenter la requête sans SSR
                return $next($request);
            }
            
            // Pour toutes les autres erreurs, les laisser passer
            throw $e;
        }
    }
}
