<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'price' => $this->faker->randomFloat(2, 0, 999.99),
            'category_id' => Category::select('id')->inRandomOrder()->first(),
            'user_id' => User::select('id')->inRandomOrder()->first(),
        ];
    }
}
