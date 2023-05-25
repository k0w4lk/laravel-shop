<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GetProductsTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_get_products()
    {
        $response = $this->getJson('/api/products?page=1');

        $response->assertStatus(200)->assertJsonCount(2);
    }
}
