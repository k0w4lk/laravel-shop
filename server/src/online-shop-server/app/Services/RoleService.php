<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;

class RoleService
{
  /**
   * @param User $user
   * 
   * @return array
   */
  public function getAllRoles(User $user): array
  {
    if ($user->hasRole(config('constants.ROLES.super-admin'))) {
      $roles = Role::where('slug', '<>', config('constants.ROLES.super-admin'));
    } else if ($user->hasRole('admin')) {
      $roles = Role::where([['slug', '<>', config('constants.ROLES.super-admin')], ['slug', '<>', config('constants.ROLES.admin')]]);
    }

    return $roles->select('id', 'name', 'slug')->get()->toArray();
  }
}
