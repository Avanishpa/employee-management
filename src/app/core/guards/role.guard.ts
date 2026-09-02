import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';


export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Get current user role
  const userRole = authService.getUserRole();

  // Get allowed roles from route
  const allowedRoles =
    route.data['roles'] as string[];


  // Check user role
  if (
    userRole &&
    allowedRoles.includes(userRole)
  ) {
    return true;
  }


  // If employee tries to access admin page
  if (userRole === 'employee') {

    router.navigate(['/employee-dashboard']);

  } else {

    router.navigate(['/login']);

  }


  return false;

};