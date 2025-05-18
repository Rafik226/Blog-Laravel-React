<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'users:create-admin {name?} {email?} {--random-password : Génère un mot de passe aléatoire}';
    protected $description = 'Créer un nouvel utilisateur administrateur';

    public function handle()
    {
        $name = $this->argument('name') ?? $this->ask('Nom de l\'administrateur?');
        $email = $this->argument('email') ?? $this->ask('Email de l\'administrateur?');
        
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        ]);
        
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        // Gestion du mot de passe
        $password = null;
        if ($this->option('random-password')) {
            $password = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10/strlen($x)))), 1, 10);
            $this->info('Mot de passe généré: '.$password);
        } else {
            $password = $this->secret('Mot de passe de l\'administrateur? (min. 8 caractères)');
            
            if (strlen($password) < 8) {
                $this->error('Le mot de passe doit contenir au moins 8 caractères');
                return 1;
            }
            
            $confirmPassword = $this->secret('Confirmez le mot de passe');
            if ($password !== $confirmPassword) {
                $this->error('Les mots de passe ne correspondent pas');
                return 1;
            }
        }

        // Création de l'utilisateur
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'is_admin' => true,
            'is_active' => true,
        ]);

        // Création du profil
        Profile::create([
            'user_id' => $user->id,
            'bio' => 'Administrateur du blog',
        ]);

        $this->info("Administrateur créé avec succès !");
        $this->table(
            ['ID', 'Nom', 'Email', 'Admin'],
            [[$user->id, $user->name, $user->email, $user->is_admin ? 'Oui' : 'Non']]
        );

        return 0;
    }
}