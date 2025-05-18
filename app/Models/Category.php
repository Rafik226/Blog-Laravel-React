<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'featured_image',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
