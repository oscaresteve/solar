import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  effect,
  input,
  OnDestroy,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PlantaLog } from '../../../plantas/interfaces/planta-log';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  logs = input.required<PlantaLog[]>();

  private chart!: Chart;

  constructor() {
    effect(() => {
      const logs = this.logs();
      if (this.chart) this.updateChart(logs);
    });
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private toChartData(logs: PlantaLog[], key: 'production' | 'consumption') {
    return logs.map((log) => ({
      x: new Date(log.created_at).getTime(),
      y: log[key],
    }));
  }

  private createGradient(ctx: CanvasRenderingContext2D, color: string): CanvasGradient {
    const match = color.match(/[\d.]+/g);
    const [r, g, b] = match ? match.map(Number) : [99, 102, 241];

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    return gradient;
  }

  private createChart() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;

    const productionColor = 'rgb(30, 200, 10)';
    const consumptionColor = 'rgb(99, 102, 241)';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Producción',
            data: this.toChartData(this.logs(), 'production'),
            borderColor: productionColor,
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: true,
            backgroundColor: this.createGradient(ctx, productionColor),
          },
          {
            label: 'Consumo',
            data: this.toChartData(this.logs(), 'consumption'),
            borderColor: consumptionColor,
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: true,
            backgroundColor: this.createGradient(ctx, consumptionColor),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgb(15, 23, 42)',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: { hour: 'HH:mm', day: 'dd MMM', month: 'MMM yyyy' },
            },
            adapters: { date: { locale: es } },
            grid: { display: false },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.08)' },
            border: { display: false },
          },
        },
      },
    });
  }

  private updateChart(logs: PlantaLog[]) {
    this.chart.data.datasets[0].data = this.toChartData(logs, 'production');
    this.chart.data.datasets[1].data = this.toChartData(logs, 'consumption');
    this.chart.update();
  }
}
