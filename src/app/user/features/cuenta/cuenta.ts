import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Navbar } from '../../../shared/features/navbar/navbar';
import { UserService } from '../../data-access/user-service';
import { AuthService } from '../../../auth/data-access/auth-service';
import { form, FormField, required } from '@angular/forms/signals';

interface CuentaFormData {
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-cuenta',
  imports: [Navbar, FormField],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.scss',
})
export class Cuenta implements OnInit, OnDestroy {
  _userService = inject(UserService);
  _authService = inject(AuthService);

  first_name = this._userService.first_name;
  last_name = this._userService.last_name;
  photo_url = this._userService.photo_url;
  email = this._authService.email;
  uid = this._authService.uid;
  loading = this._userService.loading;
  error = this._userService.error;

  private selectedPhoto = signal<File | null>(null);
  private previewObjectUrl = signal<string | null>(null);

  private cuentaFormModel = signal<CuentaFormData>({
    first_name: '',
    last_name: '',
  });

  previewURL = computed(() => {
    const objectUrl = this.previewObjectUrl();
    if (objectUrl) return objectUrl;

    return this.photo_url();
  });

  cuentaForm = form(this.cuentaFormModel, (schemaPath) => {
    required(schemaPath.first_name, { message: 'first_name is required' });
    required(schemaPath.last_name, { message: 'last_name is required' });
  });

  constructor() {
    effect(() => {
      this.cuentaForm.first_name().value.set(this.first_name() ?? '');
      this.cuentaForm.last_name().value.set(this.last_name() ?? '');
    });
  }

  ngOnInit(): void {
    this._userService.readProfile();
    this._authService.readUser();
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    const formValue = this.cuentaFormModel();
    await this._userService.updateProfile(
      {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
      },
      this.selectedPhoto(),
    );
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedPhoto.set(file);

    this.revokePreviewObjectUrl();
    if (file) {
      this.previewObjectUrl.set(URL.createObjectURL(file));
    }
  }

  private revokePreviewObjectUrl() {
    const currentObjectUrl = this.previewObjectUrl();
    if (!currentObjectUrl) return;

    URL.revokeObjectURL(currentObjectUrl);
    this.previewObjectUrl.set(null);
  }

  ngOnDestroy(): void {
    this.revokePreviewObjectUrl();
  }
}
