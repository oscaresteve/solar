import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  input,
} from '@angular/core';
import { Chart, ChartDataset, registerables, ScriptableContext } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';
import { PlantaLog } from '../../../plantas/interfaces/planta-log';

Chart.register(...registerables);

interface TimePoint {
  x: number;
  y: number | null;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas')
  readonly canvas!: ElementRef<HTMLCanvasElement>;

  readonly logs = input.required<PlantaLog[]>();

  private chart: Chart<'line', TimePoint[]> | null = null;
  private chartReady = false;
  private themeObserver: MutationObserver | null = null;
  private themeMediaQuery: MediaQueryList | null = null;
  private themeMediaHandler: (() => void) | null = null;

  constructor() {
    effect(() => {
      const logs = this.logs();
      if (this.chartReady) {
        this.updateChart(logs);
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.chartReady = true;
    this.updateChart(this.logs());
    this.listenThemeChanges();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;

    this.themeObserver?.disconnect();
    this.themeObserver = null;

    if (this.themeMediaQuery && this.themeMediaHandler) {
      this.themeMediaQuery.removeEventListener('change', this.themeMediaHandler);
    }

    document.removeEventListener('change', this.onThemeControllerChange);
  }

  private listenThemeChanges(): void {
    // 1. Cambios en data-theme="..." del <html> o <body>
    this.themeObserver = new MutationObserver(() => {
      this.chart?.update();
    });

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 2. Cambios en prefers-color-scheme (cuando DaisyUI usa :root sin data-theme)
    this.themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.themeMediaHandler = () => this.chart?.update();
    this.themeMediaQuery.addEventListener('change', this.themeMediaHandler);

    // 3. theme-controller: inputs con esa clase (checkboxes/radios de DaisyUI)
    document.addEventListener('change', this.onThemeControllerChange);
  }

  private onThemeControllerChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    if (target.matches('input.theme-controller')) {
      this.chart?.update();
    }
  };

  private cssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  private cssColorToRGB(color: string): [number, number, number] {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [99, 102, 241];

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  }

  private cssVarToRGBA(varName: string, alpha: number): string {
    const [r, g, b] = this.cssColorToRGB(this.cssVar(varName));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private createGradient(chart: Chart, color: string): CanvasGradient | string {
    const { ctx, chartArea } = chart;
    if (!chartArea) return color;

    const [r, g, b] = this.cssColorToRGB(color);
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    return gradient;
  }

  private toChartData(logs: PlantaLog[], key: 'production' | 'consumption'): TimePoint[] {
    return logs.map((log) => ({
      x: new Date(log.created_at).getTime(),
      y: log[key] ?? null,
    }));
  }

  private buildDatasets(): ChartDataset<'line', TimePoint[]>[] {
    const productionDataset: ChartDataset<'line', TimePoint[]> = {
      label: 'Producción (kWh)',
      data: [],
      borderColor: () => this.cssVar('--color-success'),
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 6,
      fill: true,
      backgroundColor: (ctx: ScriptableContext<'line'>) =>
        this.createGradient(ctx.chart, this.cssVar('--color-success')),
    };

    const consumptionDataset: ChartDataset<'line', TimePoint[]> = {
      label: 'Consumo (kWh)',
      data: [],
      borderColor: () => this.cssVar('--color-error'),
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 6,
      fill: true,
      backgroundColor: (ctx: ScriptableContext<'line'>) =>
        this.createGradient(ctx.chart, this.cssVar('--color-error')),
    };

    return [productionDataset, consumptionDataset];
  }

  private createChart(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chart = new Chart<'line', TimePoint[]>(ctx, {
      type: 'line',
      data: { datasets: this.buildDatasets() },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            bodyColor: () => this.cssVar('--color-base-content'),
            titleColor: () => this.cssVarToRGBA('--color-base-content', 0.6),
            backgroundColor: () => this.cssVar('--color-base-100'),
            borderColor: () => this.cssVar('--color-base-300'),
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            boxPadding: 6,
            callbacks: {
              labelColor: (tooltipItem) => {
                const color =
                  tooltipItem.datasetIndex === 0
                    ? this.cssVar('--color-success')
                    : this.cssVar('--color-error');
                return {
                  borderColor: color,
                  backgroundColor: color,
                  borderWidth: 2,
                  borderRadius: 2,
                };
              },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: {
                hour: 'HH:mm',
                day: 'dd MMM',
                month: 'MMM yyyy',
              },
            },
            adapters: { date: { locale: es } },
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: () => this.cssVarToRGBA('--color-base-content', 0.6),
              maxRotation: 0,
            },
          },
          y: {
            grid: {
              color: () => this.cssVarToRGBA('--color-base-content', 0.1),
            },
            border: { display: false },
            ticks: {
              color: () => this.cssVarToRGBA('--color-base-content', 0.6),
            },
          },
        },
      },
    });
  }

  private updateChart(logs: PlantaLog[]): void {
    if (!this.chart) return;

    this.chart.data.datasets[0].data = this.toChartData(logs, 'production');
    this.chart.data.datasets[1].data = this.toChartData(logs, 'consumption');
    this.chart.update();
  }
}
