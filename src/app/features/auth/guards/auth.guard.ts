import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  // Check for the JWT Token
  let token = cookieService.get('Authorization');

  if(token && user) {
    token = token.replace('Bearer ', '');
    const decodedToken: any = jwtDecode(token);

    // Check if the token has expired
    const expirationDate = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();

    if(expirationDate < currentTime) {
      // Logout
      authService.logout();
      // Return to this page if they can actually login as admin
      return router.createUrlTree(['/login'], {queryParams: {returnUrl: state.url}});
    }
    else {
      // Token is still valid, still need to check roles
      if(user.roles.includes('Writer')) {
        return true;
      }
      else {
        alert('UNAUTHORIZED');
        return false;
      }
    }

  }
  else {
    // Logout
    authService.logout();
    // Return to this page if they can actually login as admin
    return router.createUrlTree(['/login'], {queryParams: {returnUrl: state.url}});
  }
};
