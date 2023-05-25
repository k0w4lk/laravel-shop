<?php

$ROLES = [
  'super-admin' => 'super-admin',
  'admin' => 'admin',
  'manager' => 'manager',
  'user' => 'user',
];

$PERMISSIONS = [
  'create-category' => 'create-category',
  'delete-category' => 'delete-category',
  'create-product' => 'create-product',
  'delete-product' => 'delete-product',
  'update-product' => 'update-product',
  'create-user' => 'create-user',
  'edit-user-role' => 'edit-user-role'
];

return [
  'NOT_FILTER_VALUES' => ['page', 'sortBy', 'sortOrder', 'searchField', 'searchValue', 'owner'],
  'RANGE_KEY_FROM' => 'from',
  'RANGE_KEY_TO' => 'to',
  'ITEMS_PER_PAGE' => 10,
  'ROLES' => $ROLES,
  'PERMISSIONS' => $PERMISSIONS,
  'ROLES_PERMISSIONS' => [
    $ROLES['super-admin'] => [
      $PERMISSIONS['create-category'],
      $PERMISSIONS['delete-category'],
      $PERMISSIONS['create-product'],
      $PERMISSIONS['delete-product'],
      $PERMISSIONS['update-product'],
      $PERMISSIONS['create-user'],
      $PERMISSIONS['edit-user-role']
    ],
    $ROLES['admin'] => [
      $PERMISSIONS['create-category'],
      $PERMISSIONS['delete-category'],
      $PERMISSIONS['create-product'],
      $PERMISSIONS['delete-product'],
      $PERMISSIONS['update-product']
    ],
    $ROLES['manager'] => [
      $PERMISSIONS['create-product'],
      $PERMISSIONS['delete-product'],
      $PERMISSIONS['update-product']
    ],
    $ROLES['user'] => [],
  ],
];
