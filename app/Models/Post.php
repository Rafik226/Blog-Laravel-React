<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

class Post extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'content',
        'featured_image',
        'published',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'published' => 'boolean',
        'published_at' => 'datetime',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function getRouteKeyName()
    {
        return 'slug';
    }

    
    /**
     * Récupère les vues associées à ce post.
     */
    public function views()
    {
        return $this->hasMany(View::class);
    }
    
    /**
     * Incrémente le compteur de vues de cet article.
     *
     * @param int|null $userId
     * @param string|null $ipAddress
     * @return bool
     */
    public function incrementViews($userId = null, $ipAddress = null, $userAgent = null)
    {
        // Vérifier si cette vue a déjà été comptabilisée aujourd'hui
        if (View::existsForVisitor($this->id, $ipAddress, $userId)) {
            return false;
        }
    
        // Créer une nouvelle vue
        $this->views()->create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent
        ]);
    
        // Incrémenter le compteur de vues dans le post
        $this->increment('views_count');
    
        return true;
    }
}
