import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;

  showPassword = false;

  isLoading = false;

  loginError = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      rememberMe: [false]

    });

  }


  // =====================================
  // SHOW / HIDE PASSWORD
  // =====================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // =====================================
  // LOGIN
  // =====================================

  login(): void {

    this.loginError = '';


    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    this.isLoading = true;


    const {
      email,
      password
    } = this.loginForm.value;


    // Temporary loading effect

    setTimeout(() => {

      const loginSuccess =
        this.authService.login(
          email,
          password
        );


      this.isLoading = false;


      if (loginSuccess) {

        const role =
          this.authService.getUserRole();


        // ADMIN DASHBOARD

        if (role === 'admin') {

          this.router.navigate(
            ['/dashboard']
          );

        }


        // EMPLOYEE DASHBOARD

        else if (role === 'employee') {

          this.router.navigate(
            ['/employee-dashboard']
          );

        }

      } else {

        this.loginError =
          'Invalid email or password';

      }

    }, 700);

  }


  // =====================================
  // FORM GETTERS
  // =====================================

  get email() {

    return this.loginForm.get('email');

  }


  get password() {

    return this.loginForm.get('password');

  }

}
