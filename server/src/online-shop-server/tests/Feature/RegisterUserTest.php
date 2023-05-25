<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RegisterUserTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_register_user_with_correct_credentials()
    {
        $response = $this->postJson('/api/auth/register', ['name' => 'Test', 'email' => 'test@test.by', 'password' => 'testtest']);

        $response->assertStatus(200)->assertJsonStructure([
            'user' => [
                'id',
                'name',
                'email',
                'role' => ['id', 'name', 'slug'],
            ],
            'token'
        ]);
    }

    public function test_register_user_with_incorrect_credentials()
    {
        $response = $this->postJson('/api/auth/register', ['name' => 'Test', 'email' => 'test', 'password' => 'test']);

        $response->assertStatus(422);
    }
}
