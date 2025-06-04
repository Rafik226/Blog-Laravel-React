<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class View extends Model
{
    use HasFactory;

    /**
     * Les attributs assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'post_id',
        'user_id',
        'ip_address',
        'user_agent',
    ];

    /**
     * Récupère le post associé à cette vue.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Récupère l'utilisateur associé à cette vue.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Vérifier si une vue existe déjà pour cet IP/utilisateur/post.
     *
     * @param int $postId
     * @param string|null $ipAddress
     * @param int|null $userId
     * @return bool
     */
    public static function existsForVisitor($postId, $ipAddress = null, $userId = null)
    {
        $query = self::where('post_id', $postId);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($ipAddress) {
            $query->where('ip_address', $ipAddress);
        } else {
            return false;
        }

        return $query->whereDate('created_at', now()->toDateString())->exists();
    }
}