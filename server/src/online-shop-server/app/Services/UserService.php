<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
  /**
   * @param User $user
   * 
   * @return LengthAwarePaginator
   */
  public function getAllUsers(User $user): LengthAwarePaginator
  {
    $users = User::where('id', '<>', $user->id);

    if ($user->hasRole('admin')) {
      $adminRoleId = Role::where('slug', config('constants.ROLES.admin'))->first()->id;
      $superAdminRoleId = Role::where('slug', config('constants.ROLES.super-admin'))->first()->id;
      $users = $users->where([['role_id', '<>', $adminRoleId], ['role_id', '<>', $superAdminRoleId]]);
    }

    return $users->paginate(config('constants.ITEMS_PER_PAGE'));
  }

  /**
   * @param int $id
   * 
   * @return User
   */
  public function getUserById(int $id): User
  {
    return User::find($id);
  }

  /**
   * @param array $userData
   * 
   * @return void
   */
  public function createUser(array $userData): void
  {
    User::create([
      'name' => $userData['name'],
      'email' => $userData['email'],
      'password' => Hash::make($userData['password']),
      'role_id' => $userData['role_id'],
    ]);
  }

  /**
   * @param array $slug
   * @param int $userId
   * 
   * @return void
   */
  public function changeUserRoleBySlug(string $slug, int $userId): void
  {
    $user = User::find($userId);

    $user->changeRole($slug);
  }
}
