import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const as = inject(AuthService);
  const router = inject(Router);
  if(as.isLoggedIn()){
    return true;
  }else {
    router.navigateByUrl('/login');
    return false;
  }
};
