import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../data-access/auth-service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

interface SignUpForm {
  firstName: FormControl<null | string>;
  lastName: FormControl<null | string>;
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group<SignUpForm>({
    firstName: this._formBuilder.control(null, [Validators.required]),
    lastName: this._formBuilder.control(null, [Validators.required]),
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async submit() {
    if (this.form.invalid) return;

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
      alert('Porfavor revisa tu correo');
    } catch (error) {
      console.error(error);
    }
  }
}
