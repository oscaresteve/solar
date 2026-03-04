import { Component, inject } from '@angular/core';
import { ToastService } from '../../utils/toast-service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-toast',
  imports: [Icon],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  _toastService = inject(ToastService);

  toasts = this._toastService.toasts;
}
