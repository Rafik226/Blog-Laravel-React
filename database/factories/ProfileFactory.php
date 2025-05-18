<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Profile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Utiliser une image de placeholder en base64
        $avatarId = $this->faker->numberBetween(1, 5);
        $avatarBase64 = $this->getAvatarBase64($avatarId);
        
        return [
            'user_id' => User::factory(),
            'avatar' => $avatarBase64,
            'bio' => $this->faker->paragraph(),
        ];
    }
    
    private function getAvatarBase64($id): string
    {
        // Images de placeholder en base64 (très courtes pour l'exemple)
        $placeholders = [
            1 => 'data:image/svg+xml;base64,' . base64_encode($this->generateAvatarSvg('A', '#FF5733')),
            2 => 'data:image/svg+xml;base64,' . base64_encode($this->generateAvatarSvg('B', '#33FF57')),
            3 => 'data:image/svg+xml;base64,' . base64_encode($this->generateAvatarSvg('C', '#3357FF')),
            4 => 'data:image/svg+xml;base64,' . base64_encode($this->generateAvatarSvg('D', '#F033FF')),
            5 => 'data:image/svg+xml;base64,' . base64_encode($this->generateAvatarSvg('E', '#FF33A8')),
        ];
        
        return $placeholders[$id] ?? $placeholders[1];
    }
    
    /**
     * Génère un SVG d'avatar avec une lettre et une couleur de fond
     */
    private function generateAvatarSvg($letter, $backgroundColor): string
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">';
        $svg .= '<rect width="100%" height="100%" fill="' . $backgroundColor . '" />';
        $svg .= '<text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">' . $letter . '</text>';
        $svg .= '</svg>';
        
        return $svg;
    }
}