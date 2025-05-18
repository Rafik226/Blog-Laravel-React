<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        

        // Créer quelques auteurs
        User::factory(3)->create()->each(function ($user) {
            Profile::factory()->create([
                'user_id' => $user->id,
            ]);
        });

        // Créer un admin
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        Profile::factory()->create([
            'user_id' => $admin->id,
            'bio' => 'Administrateur du blog et passionné de technologie.',
        ]);
    }
}