import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { MAIN_ROUTES } from './pages/main/main.routes';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: MAIN_ROUTES,
  },
];
