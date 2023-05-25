<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginUserTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_login_user()
    {
        $user = User::factory()->create(['password' => Hash::make('password')]);

        $response = $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'password']);

        $response->assertStatus(200);
    }

    public function test_login_user_with_wrong_password()
    {
        $user = User::factory()->create(['password' => Hash::make('password')]);

        $response = $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'wrong_password']);

        $response->assertStatus(401);
    }

    public function test_login_user_with_wrong_email()
    {
        User::factory()->create(['password' => Hash::make('password')]);

        $response = $this->postJson('/api/auth/login', ['email' => 'email@wrong.com', 'password' => 'password']);

        $response->assertStatus(401);
    }
}
