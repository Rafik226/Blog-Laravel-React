<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer ou mettre à jour l'utilisateur admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@blog.com'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@blog.com',
                'password' => Hash::make('admin123'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Admin user created/updated: {$admin->email}");
        $this->command->info("Password: admin123");
        $this->command->info("is_admin: " . ($admin->is_admin ? 'true' : 'false'));
    }
}
