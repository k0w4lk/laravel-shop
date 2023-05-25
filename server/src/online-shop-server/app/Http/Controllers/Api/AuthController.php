<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends ApiController
{
    /**
     * Create User
     * @param RegisterRequest $request
     * @return JsonResponse 
     */
    public function createUser(RegisterRequest $request)
    {
        try {
            $userRoleId = Role::where('slug', 'user')->first()->id;

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $userRoleId
            ]);

            $responseData = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                        'slug' => $user->role->slug,
                    ],
                ],
                'token' => $user->createToken("API TOKEN")->plainTextToken,
            ];

            return $this->successResponse($responseData);
        } catch (\Throwable $err) {
            return $this->serverErrorResponse(message: $err->getMessage());
        }
    }

    /**
     * Login The User
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function loginUser(LoginRequest $request)
    {
        try {
            if (!Auth::attempt($request->only(['email', 'password']))) {
                return $this->clientErrorResponse(401, 'Email & Password does not match with our records.');
            }

            $user = User::where('email', $request->email)->first();

            $responseData = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                        'slug' => $user->role->slug,
                    ],
                ],
                'token' => $user->createToken("API TOKEN")->plainTextToken,
            ];

            return $this->successResponse($responseData);
        } catch (\Throwable $err) {
            return $this->serverErrorResponse(message: $err->getMessage());
        }
    }

    /**
     * Log out the user
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            $user->currentAccessToken()->delete();

            return $this->successResponse();
        } catch (\Throwable $err) {
            return $this->serverErrorResponse(message: $err->getMessage());
        }
    }
}
