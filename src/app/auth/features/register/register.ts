import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../data-access/auth-service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Icon } from '../../../shared/ui/icon/icon';

interface SignUpForm {
  firstName: FormControl<null | string>;
  lastName: FormControl<null | string>;
  email: FormControl<null | string>;
  password: FormControl<null | string>;
  confirmPassword: FormControl<null | string>;
}

const passwordsMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) return null;

  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, Icon],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  loading = this._authService.loading;

  form = this._formBuilder.group<SignUpForm>(
    {
      firstName: this._formBuilder.control(null, [Validators.required]),
      lastName: this._formBuilder.control(null, [Validators.required]),
      email: this._formBuilder.control(null, [Validators.required, Validators.email]),
      password: this._formBuilder.control(null, [Validators.required]),
      confirmPassword: this._formBuilder.control(null, [Validators.required]),
    },
    { validators: [passwordsMatchValidator] },
  );

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.invalid || this.loading()) return;

    try {
      const authResponse = await this._authService.signUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
        options: {
          data: {
            first_name: this.form.value.firstName ?? '',
            last_name: this.form.value.lastName ?? '',
          },
        },
      });
      if (authResponse.error) throw authResponse.error;
      alert('Revisa tu correo para confirmar tu cuenta.');
    } catch (error) {
      console.error(error);
      alert('No se pudo crear la cuenta. Inténtalo de nuevo.');
    }
  }
}
