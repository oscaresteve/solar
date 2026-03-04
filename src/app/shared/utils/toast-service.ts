import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(message: string, type: ToastType = 'info') {
    this.toasts.update((t) => [...t, { message, type }]);
    setTimeout(() => this.toasts.update((t) => t.slice(1)), 5000);
  }
}
