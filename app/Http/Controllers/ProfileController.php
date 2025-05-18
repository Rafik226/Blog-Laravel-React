<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

/**
 * @method static render(string $string, array $array)
 */
class ProfileController extends Controller
{
    /**
     * Afficher le profil d'un utilisateur
     */
    public function show(User $user)
    {
        // La méthode load() est disponible sur les modèles Eloquent
        // @phpstan-ignore-next-line
        $user->load('profile');

        $posts = $user->posts()
            ->with(['category', 'tags'])
            ->where('published', true)
            ->latest()
            ->paginate(10);

        return Inertia::render('Profiles/Show', [
            'user' => $user,
            'posts' => $posts,
        ]);
    }

    /**
     * Afficher le formulaire de modification du profil
     */
    public function edit()
    {
        $user = Auth::user();
        // @phpstan-ignore-next-line
        $user->load('profile');

        // Si l'utilisateur n'a pas encore de profil, en créer un
        if (!$user->profile) {
            $profile = new Profile();
            $profile->user_id = $user->id;
            $profile->save();
            // @phpstan-ignore-next-line
            $user->refresh();
        }

        return Inertia::render('Profiles/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Mettre à jour le profil
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string|max:1000',
            'current_password' => 'nullable|required_with:new_password',
            'new_password' => 'nullable|min:8|confirmed',
        ]);

        // Mettre à jour l'utilisateur
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        
        // Mettre à jour le mot de passe si fourni
        if (isset($validatedData['new_password'])) {
            // Vérifier l'ancien mot de passe
            if (!Hash::check($validatedData['current_password'], $user->password)) {
                return redirect()->back()
                    ->withErrors(['current_password' => 'Le mot de passe actuel est incorrect.']);
            }
            
            $user->password = Hash::make($validatedData['new_password']);
        }
        
        $user->save();

        // Mettre à jour le profil
        $profile = $user->profile;
        if (isset($validatedData['avatar'])) {
            $profile->avatar = $validatedData['avatar'];
        }
        
        if (isset($validatedData['bio'])) {
            $profile->bio = $validatedData['bio'];
        }
        
        $profile->save();

        return redirect()->route('profile.edit')
            ->with('success', 'Profil mis à jour avec succès !');
    }
}