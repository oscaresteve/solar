import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../data-access/auth-service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group<SignUpForm>({
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const authResponse = await this._authService.signUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      if (authResponse.error) throw authResponse.error;
      alert('Porfavor revisa tu correo');
    } catch (error) {
      console.error(error);
    }
  }
}
