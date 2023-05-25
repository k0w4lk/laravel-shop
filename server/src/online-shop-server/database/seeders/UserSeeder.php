<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $superAdmin = new User();
        $superAdmin->name = 'Super Admin';
        $superAdmin->email = 'sa@mail.com';
        $superAdmin->password = Hash::make('superadmin');

        $superAdminRoleId = Role::where('slug', config('constants.ROLES.super-admin'))->first()->id;
        $superAdmin->role_id = $superAdminRoleId;

        $superAdmin->save();
    }
}
