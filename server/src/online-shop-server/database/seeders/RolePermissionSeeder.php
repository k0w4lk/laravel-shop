<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $roles = config('constants.ROLES_PERMISSIONS');

        foreach ($roles as $role => $permissions) {
            $newRole = Role::firstOrCreate(['slug' => $role], ['name' => $this->createNameBySlug($role)]);
            foreach ($permissions as $permission) {
                $newPermission = Permission::firstOrCreate(['slug' => $permission], ['name' => $this->createNameBySlug($permission)]);
                $newRole->permissions()->attach($newPermission);
            }
        }
    }

    private function createNameBySlug(string $slug): string
    {
        return str_replace('-', ' ', ucwords($slug, '-'));
    }
}
