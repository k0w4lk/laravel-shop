<?php

namespace App\Http\Controllers;

use App\Services\RoleService;
use Illuminate\Http\Request;

class RoleController extends ApiController
{
  private $service;

  public function __construct(RoleService $service)
  {
    $this->service = $service;
  }

  public function index(Request $request)
  {
    try {
      $user = $request->user();

      $roles = $this->service->getAllRoles($user);

      return $this->successResponse($roles);
    } catch (\Throwable $err) {
      return $this->serverErrorResponse(message: $err->getMessage());
    }
  }
}
