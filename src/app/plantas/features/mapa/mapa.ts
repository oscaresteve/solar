import {
  AfterViewInit,
  Component,
  ElementRef,
  effect,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { PlantaService } from '../../data-access/planta-service';
import { ToastService } from '../../../shared/utils/toast-service';
import { Icon } from '../../../shared/ui/icon/icon';

interface LeafletLike {
  map: (element: HTMLElement, options?: unknown) => any;
  tileLayer: (url: string, options?: unknown) => { addTo: (map: any) => unknown };
  layerGroup: () => any;
  marker: (coords: [number, number], options?: unknown) => any;
  divIcon: (options: unknown) => any;
  latLngBounds: (coords: [number, number][]) => any;
}

declare global {
  interface Window {
    L?: LeafletLike;
  }
}

@Component({
  selector: 'app-mapa',
  imports: [Icon],
  templateUrl: './mapa.html',
  styleUrl: './mapa.scss',
})
export class Mapa implements OnInit, AfterViewInit, OnDestroy {
  private _plantaService = inject(PlantaService);
  private _router = inject(Router);
  private _ngZone = inject(NgZone);
  private _toastService = inject(ToastService);

  private mapContainer = viewChild<ElementRef<HTMLDivElement>>('mapContainer');
  private map: any | null = null;
  private markersLayer: any | null = null;

  plantas = this._plantaService.plantas;
  loading = this._plantaService.loading;
  error = this._plantaService.error;

  constructor() {
    effect(() => {
      this.plantas();
      this.renderMarkers();
    });
  }

  async ngOnInit(): Promise<void> {
    await this._plantaService.ensurePlantasLoaded(null);
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      const leaflet = await this.loadLeaflet();
      this.initializeMap(leaflet);
      this.renderMarkers();
    } catch (error) {
      console.error(error);
      this._toastService.show('No se pudo cargar el mapa.', 'error');
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  onRetryLoad() {
    this._plantaService.readAllPlantas();
  }

  private initializeMap(leaflet: LeafletLike): void {
    const container = this.mapContainer()?.nativeElement;
    if (!container || this.map) return;

    this.map = leaflet.map(container, { zoomControl: true });
    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      })
      .addTo(this.map);

    this.markersLayer = leaflet.layerGroup().addTo(this.map);
    this.map.setView([40.4168, -3.7038], 6);

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private renderMarkers(): void {
    const leaflet = window.L;
    if (!leaflet || !this.map || !this.markersLayer) return;

    this.markersLayer.clearLayers();

    const validPlantas = this.plantas().filter(
      (planta) => Number.isFinite(planta.latitude) && Number.isFinite(planta.longitude),
    );

    if (validPlantas.length === 0) return;

    const coords: [number, number][] = [];

    for (const planta of validPlantas) {
      const lat = Number(planta.latitude);
      const lng = Number(planta.longitude);
      coords.push([lat, lng]);

      const marker = leaflet.marker([lat, lng], {
        icon: leaflet.divIcon({
          className: '',
          html: `
      <span class="
        block size-3 rounded-full
        border-2 border-base-100
        shadow-md
        transition-transform duration-100
        ${planta.active ? 'bg-success' : 'bg-error'}
      "></span>
    `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      });

      marker
        .bindPopup(
          `
    <div class="flex flex-col gap-2 min-w-44">

      <div class="flex items-center gap-1.5">
        <span class="badge badge-xs badge-soft ${planta.active ? 'badge-success' : 'badge-error'}">
          ${planta.active ? 'Activa' : 'Inactiva'}
        </span>
        <span class="text-xs text-base-content/40 font-mono">${planta.id}</span>
      </div>

      <div>
        <p class="text-sm font-medium text-base-content leading-snug">
          ${this.escapeHtml(planta.name)}
        </p>
        ${
          planta.description
            ? `<p class="text-xs text-base-content/50 mt-0.5 line-clamp-2">${this.escapeHtml(planta.description)}</p>`
            : ''
        }
      </div>

      <div class="border-t border-base-300 pt-2 mt-0.5">
        <p class="text-xs text-base-content/40 font-mono">
          ${planta.latitude}, ${planta.longitude}
        </p>
      </div>

    </div>
    `,
          {
            className: 'mapa-popup',
            maxWidth: 240,
            offset: [0, -4],
          },
        )
        .on('mouseover', function () {
          marker.openPopup();
        })
        .on('mouseout', function () {
          marker.closePopup();
        })
        .on('click', () => {
          this._ngZone.run(() => this._router.navigate(['/plantas', planta.id]));
        })
        .addTo(this.markersLayer);
    }

    if (coords.length === 1) {
      this.map.setView(coords[0], 12);
      return;
    }

    this.map.fitBounds(leaflet.latLngBounds(coords), { padding: [48, 48] });
  }

  private async loadLeaflet(): Promise<LeafletLike> {
    if (window.L) return window.L;

    await this.ensureLeafletStylesheet();
    await this.ensureLeafletScript();

    if (!window.L) throw new Error('Leaflet no disponible tras cargar el script.');

    return window.L;
  }

  private ensureLeafletStylesheet(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLLinkElement>('link[data-leaflet-css]');
      if (existing) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.setAttribute('data-leaflet-css', 'true');
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';

      link.onload = () => resolve();
      link.onerror = () => reject(new Error('No se pudo cargar el CSS de Leaflet.'));

      document.head.appendChild(link);
    });
  }

  private ensureLeafletScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-leaflet-js]');
      if (existing) {
        if (window.L) resolve();
        else existing.addEventListener('load', () => resolve(), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.defer = true;
      script.setAttribute('data-leaflet-js', 'true');
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar el script de Leaflet.'));

      document.body.appendChild(script);
    });
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
