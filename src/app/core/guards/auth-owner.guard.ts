import { CanMatchFn } from '@angular/router';

export const authOwnerGuard: CanMatchFn = (route, state) => {
  const storedUser = localStorage.getItem('currentUser');
  if (!storedUser) {
    return false;
  }
  try {
    const currentUser = JSON.parse(storedUser);
    return currentUser.role === 'propietario';
  } catch (error) {
    return false; 
  }
};
