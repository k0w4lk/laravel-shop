import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { TokenInterceptor } from './app/core/interceptors/token.interceptor';
import { TokenService } from './app/core/services/token.service';
import { UserService } from './app/core/services/user.service';
import { setupUser } from './app/core/utils/setup-user.util';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([TokenInterceptor, AuthInterceptor, ErrorInterceptor])
    ),
    provideRouter(APP_ROUTES),
    {
      provide: APP_INITIALIZER,
      useFactory: setupUser,
      deps: [TokenService, UserService],
      multi: true,
    },
  ],
}).catch(err => console.error(err));
