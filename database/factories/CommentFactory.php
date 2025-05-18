<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Comment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::inRandomOrder()->first()->id ?? Post::factory(),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'content' => $this->faker->paragraph(),
            'approved' => $this->faker->boolean(80), // 80% de chances d'être approuvé
        ];
    }
}