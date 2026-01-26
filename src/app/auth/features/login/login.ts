import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth-service';
import { Router } from '@angular/router';

interface LogInForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group<LogInForm>({
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const { error } = await this._authService.logIn({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      if (error) throw error;

      this._router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      alert('Credenciales incorrectas');
    }
  }
}
