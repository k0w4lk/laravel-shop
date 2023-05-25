import { Routes } from '@angular/router';

export const MANAGING_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/users/users.component').then(
            c => c.UsersComponent
          ),
      },
      {
        path: 'categories',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/categories/categories.component').then(
            c => c.CategoriesComponent
          ),
      },
      {
        path: 'products',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/products/products.component').then(
            c => c.ProductsComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'users',
      },
    ],
  },
];
