import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth-service';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

interface LogInForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Icon],
  templateUrl: './login.html',
})
export class Login {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  loading = this._authService.loading;

  form = this._formBuilder.group<LogInForm>({
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.invalid || this.loading()) return;

    try {
      const { error } = await this._authService.logIn({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      if (error) throw error;

      this._router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error(error);
      alert('No se pudo iniciar sesión. Verifica tu correo y contraseña.');
    }
  }
}
