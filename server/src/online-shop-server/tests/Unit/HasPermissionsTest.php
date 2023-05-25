<?php

namespace Tests\Unit;

use App\Models\Permission;
use App\Models\Role;
use App\Permissions\HasPermissions;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use PHPUnit\Framework\TestCase;
use Tests\TestCase as TestsTestCase;

class HasPermissionsTest extends TestsTestCase
{
    use DatabaseTransactions;

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_has_role()
    {
        $class = new class
        {
            public $role;

            public function __construct()
            {
                $this->role = Role::factory()->create(['name' => 'Super Admin', 'slug' => 'super-admin']);
            }

            use HasPermissions;
        };

        $userHasRole = $class->hasRole('super-admin');

        $this->assertTrue($userHasRole);
    }

    public function test_has_permissions_through_role()
    {
        $class = new class
        {
            public $role;
            public $permission;

            public function __construct()
            {
                $this->role = Role::factory()->create(['name' => 'Super Admin', 'slug' => 'super-admin']);
                $this->permission = Permission::factory()->create(['name' => 'Create user', 'slug' => 'create-user']);
                $this->role->permissions()->attach($this->permission);
            }

            use HasPermissions;
        };

        $userHasPermission = $class->hasPermissionThroughRole($class->permission);

        $this->assertTrue($userHasPermission);
    }
}
