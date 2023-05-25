<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use App\Utils\Filter;
use ErrorException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService
{
  /**
   * @param array $queryParams
   * 
   * @return LengthAwarePaginator
   */
  public function getAllProducts(array $queryParams, int $userId = null): LengthAwarePaginator
  {
    $products = Product::select(['products.id', 'products.name', 'products.price', 'products.user_id', 'products.image_path', 'products.category_id', 'categories.name as category_name'])->join('categories', 'categories.id', '=', 'products.category_id');

    if (isset($queryParams['owner'])) {
      $queryParams['user_id'] = $userId;
    }

    if (isset($queryParams['searchField'])) {
      $queryParams['searchField'] = 'products.' . $queryParams['searchField'];
    }

    Filter::applyFilters($products, $queryParams);
    Filter::applyRangeSearch($products, $queryParams);
    Filter::applySearch($products, $queryParams);
    Filter::applySorting($products, $queryParams);

    return $products->paginate(config('constants.ITEMS_PER_PAGE'));
  }

  /**
   * @param array $body
   * 
   * @return void
   */
  public function createProduct(array $body): void
  {
    $product = new Product();

    $product->name = $body['name'];
    $product->price = $body['price'];
    $product->description = $body['description'];
    $product->category_id = $body['category_id'];
    $product->user_id = $body['user_id'];

    if (isset($body['image_path'])) {
      $product->image_path = $body['image_path'];
    }

    $product->save();
  }

  /**
   * @param int $id
   * 
   * @return Product
   */
  public function getProductById(int $id): Product
  {
    $product = Product::find($id);

    return $product;
  }

  /**
   * @param array $body
   * @param int $productId
   * @param User $user
   * 
   * @return void
   */
  public function updateProduct(array $body, int $productId, User $user): void
  {
    $product = Product::find($productId);

    if (!$user->hasRole('super-admin', 'admin') && $product->user_id !== $user->id) {
      throw new ErrorException('This is not your product', 403);
    }

    foreach ($body as $key => $value) {
      $product->$key = $value;
    }

    $product->save();
  }

  /**
   * @param int $productId
   * @param User $user
   * 
   * @return void
   */
  public function deleteProduct(int $productId, User $user): void
  {
    $product = Product::find($productId);

    if (!$user->hasRole(config('constants.ROLES.super-admin'), config('constants.ROLES.admin')) && $product->user_id !== $user->id) {
      throw new ErrorException('This is not your product', 403);
    }

    Product::destroy($productId);
  }

  /**
   * @param int $productId
   * 
   * @return mixed
   */
  public function getProductReviews(int $productId): LengthAwarePaginator
  {
    return Product::find($productId)->rating()->paginate(config('constants.ITEMS_PER_PAGE'));
  }
}
