import { CanActivateFn } from '@angular/router';

export const authUserGuard: CanActivateFn = (route, state) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return (currentUser.role === 'usuario')?true:false;
};
