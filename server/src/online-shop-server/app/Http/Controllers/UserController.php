<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ChangeRoleRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends ApiController
{
    private $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            if ($request->user()->hasRole('admin', 'super-admin')) {
                $user = $request->user();

                $users = $this->service->getAllUsers($user);

                return $this->successResponse((new UserCollection($users))->resolve());
            }
        } catch (\Throwable $err) {
            return $this->serverErrorResponse();
        }
    }

    public function show(Request $request, int $id = null)
    {
        try {
            if (isset($id)) {
                $userId = $id;
            } else {
                $userId = $request->user()->id;
            }

            $user = $this->service->getUserById($userId);

            return $this->successResponse((new UserResource($user))->resolve());
        } catch (\Throwable $err) {
            return $this->serverErrorResponse(message: $err->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $body = $request->all();

            $this->service->createUser($body);

            return $this->successResponse();
        } catch (\Throwable $err) {
            return $this->serverErrorResponse(message: $err->getMessage());
        }
    }

    public function update(ChangeRoleRequest $request, int $id)
    {
        try {
            if ($request->user()->hasRole(config('constants.ROLES.super-admin'), config('constants.ROLES.admin'))) {

                $roleSlug = $request->input('slug');

                $this->service->changeUserRoleBySlug($roleSlug, $id);

                return $this->successResponse();
            } else {
                return $this->clientErrorResponse(message: 'You have no permission for this');
            }
        } catch (\Throwable $err) {
            return $this->serverErrorResponse(message: $err->getMessage());
        }
    }
}
