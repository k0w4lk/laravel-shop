<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\CreateRequest;
use App\Http\Resources\CategoryCollection;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends ApiController
{
  public $service;

  public function __construct(CategoryService $service)
  {
    $this->service = $service;
  }

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    try {
      $queryParams = $request->query();

      $categories = $this->service->getAllCategories($queryParams);

      if (isset($queryParams['page'])) {
        $categories = (new CategoryCollection($categories))->resolve();

        return  $this->successResponse($categories);
      }

      return  $this->successResponse(['data' => $categories]);
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(CreateRequest $request)
  {
    try {
      if ($request->user()->can('create-category')) {
        $body = $request->all();

        $this->service->createCategory($body);

        return $this->successResponse();
      } else {
        return $this->clientErrorResponse(message: 'You have no permissions to do this', code: 403);
      }
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }

  /**
   * destroy
   *
   * @param  mixed $request
   * @param  mixed $id
   * @return void
   */
  public function destroy(Request $request, int $id)
  {
    try {
      if ($request->user()->can('delete-category')) {
        $this->service->deleteCategory($id);

        return $this->successResponse();
      } else {
        return $this->clientErrorResponse(403, 'You have no permissions to this');
      }
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }
}
