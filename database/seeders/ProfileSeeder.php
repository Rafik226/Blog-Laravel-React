<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des profils pour les utilisateurs qui n'en ont pas encore
        $usersWithoutProfile = User::doesntHave('profile')->get();
        foreach ($usersWithoutProfile as $user) {
            Profile::factory()->create([
                'user_id' => $user->id,
                'avatar' => $this->generateAvatarBase64ForUser($user),
            ]);
        }
    }
    
    /**
     * Génère un avatar base64 personnalisé pour un utilisateur spécifique
     */
    private function generateAvatarBase64ForUser(User $user): string
    {
        // Utilisez la première lettre du nom de l'utilisateur
        $letter = strtoupper(substr($user->name, 0, 1));
        
        // Générer une couleur basée sur l'ID de l'utilisateur pour assurer la cohérence
        $hue = ($user->id * 137) % 360; // Formule simple pour distribuer les couleurs
        $color = $this->hslToHex($hue, 70, 50);
        
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">';
        $svg .= '<rect width="100%" height="100%" fill="' . $color . '" />';
        $svg .= '<text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">' . $letter . '</text>';
        $svg .= '</svg>';
        
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
    
    /**
     * Convertit HSL en HEX
     */
    private function hslToHex($h, $s, $l): string
    {
        $h /= 360;
        $s /= 100;
        $l /= 100;
        
        $r = $g = $b = $l;
        
        if ($s != 0) {
            $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
            $p = 2 * $l - $q;
            $r = $this->hue2rgb($p, $q, $h + 1/3);
            $g = $this->hue2rgb($p, $q, $h);
            $b = $this->hue2rgb($p, $q, $h - 1/3);
        }
        
        return '#' . 
            str_pad(dechex(round($r * 255)), 2, '0', STR_PAD_LEFT) .
            str_pad(dechex(round($g * 255)), 2, '0', STR_PAD_LEFT) .
            str_pad(dechex(round($b * 255)), 2, '0', STR_PAD_LEFT);
    }
    
    private function hue2rgb($p, $q, $t) {
        if ($t < 0) $t += 1;
        if ($t > 1) $t -= 1;
        if ($t < 1/6) return $p + ($q - $p) * 6 * $t;
        if ($t < 1/2) return $q;
        if ($t < 2/3) return $p + ($q - $p) * (2/3 - $t) * 6;
        return $p;
    }
}