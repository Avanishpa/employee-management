import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_KEY = 'currentUser';

  // Temporary demo users
  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      email: 'employee@gmail.com',
      password: 'employee123',
      role: 'employee'
    }
  ];

  constructor(
    private router: Router
  ) {}


  // ==========================================
  // LOGIN
  // ==========================================

  login(
    email: string,
    password: string
  ): boolean {

    const user = this.users.find(
      user =>
        user.email === email &&
        user.password === password
    );

    if (user) {

      // Do not store password in current user session
      const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      localStorage.setItem(
        this.USER_KEY,
        JSON.stringify(currentUser)
      );

      return true;
    }

    return false;
  }


  // ==========================================
  // GET CURRENT USER
  // ==========================================

  getCurrentUser(): any {

    // Important for Angular SSR/Vite
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const user =
      localStorage.getItem(this.USER_KEY);

    return user
      ? JSON.parse(user)
      : null;
  }


  // ==========================================
  // CHECK LOGIN
  // ==========================================

  isLoggedIn(): boolean {

    return !!this.getCurrentUser();

  }


  // ==========================================
  // GET USER ROLE
  // ==========================================

  getUserRole(): string | null {

    const user =
      this.getCurrentUser();

    return user
      ? user.role
      : null;

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    if (typeof localStorage !== 'undefined') {

      localStorage.removeItem(
        this.USER_KEY
      );

    }

    this.router.navigate(
      ['/login']
    );

  }

}