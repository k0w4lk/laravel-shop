<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CreateProductTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_create_product_with_admin_role()
    {
        $user = User::factory()->role(2)->create();

        $file = UploadedFile::fake()->image('test.png')->size(100);

        $response = $this->actingAs($user, 'web')->withSession(['banned' => false])->postJson('/api/products', [
            'name' => 'test',
            'price' => 61,
            'description' => 'test description',
            'image' => $file,
            'user_id' => 1,
            'category_id' => 1
        ]);

        $response->assertNoContent();

        Storage::deleteDirectory(env('IMAGE_FOLDER'));
    }

    public function test_create_product_with_user_role()
    {
        $user = User::factory()->role(4)->create();

        $response = $this->actingAs($user, 'web')->withSession(['banned' => false])->postJson('/api/products', [
            'name' => 'test',
            'price' => 61,
            'description' => 'test description',
            'image_path' => 'http://localhost:3000/public/image.jpg',
            'user_id' => 1,
            'category_id' => 1
        ]);

        $response->assertStatus(403);
    }
}
