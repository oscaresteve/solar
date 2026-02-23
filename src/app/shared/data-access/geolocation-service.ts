import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no compatible con este dispositivo.');
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}
