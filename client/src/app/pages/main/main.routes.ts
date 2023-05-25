import { Routes } from '@angular/router';
import { managersGuard } from '../../core/guards/managers.guard';
import { MANAGING_ROUTES } from '../managing/managing.routes';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('../categories/categories.component').then(
            c => c.CategoriesComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../products/products.component').then(
            c => c.ProductsComponent
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('../product/product.component').then(c => c.ProductComponent),
      },
      {
        path: 'managing',
        loadComponent: () =>
          import('../managing/managing.component').then(
            c => c.ManagingComponent
          ),
        canActivate: [managersGuard],
        children: MANAGING_ROUTES,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
