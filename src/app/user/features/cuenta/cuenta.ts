import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { UserService } from '../../data-access/user-service';
import { AuthService } from '../../../auth/data-access/auth-service';
import { form, FormField, required } from '@angular/forms/signals';
import { Icon } from '../../../shared/ui/icon/icon';
import { ToastService } from '../../../shared/utils/toast-service';

interface CuentaFormData {
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-cuenta',
  imports: [FormField, Icon],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.scss',
})
export class Cuenta implements OnInit, OnDestroy {
  _userService = inject(UserService);
  _authService = inject(AuthService);
  _toastService = inject(ToastService);

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
    required(schemaPath.first_name, { message: 'El nombre es obligatorio.' });
    required(schemaPath.last_name, { message: 'Los apellidos son obligatorios.' });
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
    const updated = await this._userService.updateProfile(
      {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
      },
      this.selectedPhoto(),
    );

    if (updated) {
      this._toastService.show('Perfil actualizado correctamente.', 'success');
      return;
    }

    this._toastService.show('No se pudo actualizar el perfil. Intentalo de nuevo.', 'error');
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
