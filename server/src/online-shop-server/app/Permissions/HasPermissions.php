<?php

namespace App\Permissions;

use App\Models\Permission;
use App\Models\Role;

trait HasPermissions
{
  public function changeRole($roleSlug)
  {
    $roleId = Role::where('slug', $roleSlug)->first()->id;
    $this->role_id = $roleId;
    $this->save();

    return $this;
  }

  public function hasPermissionThroughRole($permission): bool
  {
    foreach ($permission->roles as $role) {
      if ($this->role->id === $role->id) {
        return true;
      }
    }
    return false;
  }

  public function hasRole(...$roles)
  {
    foreach ($roles as $role) {
      if ($this->role->slug === $role) {
        return true;
      }
    }
    return false;
  }
}
