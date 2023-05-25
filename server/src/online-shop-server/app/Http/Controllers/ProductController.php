<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\CreateRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductReviewsCollection;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;

class ProductController extends ApiController
{
  public $service;

  public function __construct(ProductService $service)
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

      $user = $request->user('sanctum');

      if (isset($user)) {
        $userId = $user->id;
        $products = $this->service->getAllProducts($queryParams, $userId);
      } else {
        $products = $this->service->getAllProducts($queryParams);
      }


      return $this->successResponse((new ProductCollection($products))->resolve());
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
      if ($request->user()->can('create-product')) {

        $body = $request->all();

        $productImage = $request->file('image');

        if (isset($productImage)) {
          $body['image_path'] = Storage::disk()->putFile('product-images', $productImage, 'public');
        }

        $body['user_id'] = $request->user()->id;

        $this->service->createProduct($body);

        return $this->successResponse();
      } else {
        return $this->clientErrorResponse(403, 'You have no permissions to this');
      }
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id)
  {
    try {
      $product = $this->service->getProductById($id);
      return $this->successResponse((new ProductResource($product))->resolve());
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }

  public function showReviews($id)
  {
    try {
      $product = $this->service->getProductReviews($id);
      return $this->successResponse((new ProductReviewsCollection($product))->resolve());
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(UpdateRequest $request, $productId)
  {
    try {
      $user = $request->user();

      if ($user->can('update-product')) {

        $body = $request->all();

        $this->service->updateProduct($body, $productId, $user);

        return $this->successResponse();
      } else {
        return $this->clientErrorResponse(403, 'You have no permissions to this');
      }
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(code: $err->getCode(), message: $err->getMessage());
    }
  }

  /**
   * @param Request $request
   * @param int $productId
   * 
   * @return JsonResponse|HttpResponse
   */
  public function destroy(Request $request, int $productId): JsonResponse | HttpResponse
  {
    try {
      $user = $request->user();

      if ($user->can('delete-product')) {
        $this->service->deleteProduct($productId, $user);

        return $this->successResponse();
      } else {
        return $this->clientErrorResponse(403, 'You have no permissions to this');
      }
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }
}
