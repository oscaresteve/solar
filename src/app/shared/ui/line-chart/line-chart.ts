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
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

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

  private createGradient(chart: Chart, color: string): CanvasGradient | string {
    const { ctx, chartArea } = chart;
    if (!chartArea) return color;

    const [r, g, b] = this.cssColorToRGB(color);
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.18)`);
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
            titleColor: () => this.cssVar('--color-base-content'),
            backgroundColor: () => this.cssVar('--color-base-100'),
            borderColor: () => this.cssVar('--color-base-200'),
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
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
              color: () => this.cssVar('--color-base-content'),
              maxRotation: 0,
            },
          },
          y: {
            grid: {
              color: () => this.cssVar('--color-base-300'),
            },
            border: { display: false },
            ticks: {
              color: () => this.cssVar('--color-base-content'),
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
