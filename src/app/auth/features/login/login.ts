import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  async login() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      alert('Credenciales incorrectas');
    }
  }
}
