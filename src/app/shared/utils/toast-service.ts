import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  show(message: string, type: ToastType = 'info', duration = 10000): void {
    const id = ++this.counter;
    this.toasts.update((t) => [...t, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
