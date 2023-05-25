<?php

namespace App\Services;

use App\Models\Category;
use App\Utils\Filter;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
  /**
   * @param array $queryParams
   * 
   * @return array
   */
  public function getAllCategories(array $queryParams): array | LengthAwarePaginator
  {
    $categories = Category::query();

    Filter::applySearch($categories, $queryParams);

    if (isset($queryParams['page'])) {
      return $categories->paginate(config('constants.ITEMS_PER_PAGE'));
    } else {
      return Category::all()->toArray();
    }
  }

  /**
   * @param array $data
   * 
   * @return void
   */
  public function createCategory(array $data): void
  {
    $category = new Category();

    $category->name = $data['name'];

    $category->save();
  }

  /**
   * @param int $id
   * 
   * @return void
   */
  public function deleteCategory(int $id): void
  {
    Category::destroy($id);
  }
}
