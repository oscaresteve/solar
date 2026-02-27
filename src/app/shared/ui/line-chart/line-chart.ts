import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart implements AfterViewInit {
  @ViewChild('chartCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;

    this.chart = new Chart(ctx, {
      type: 'line',

      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [120, 190, 170, 220, 210, 260],

            borderColor: 'rgb(30 200 10)', // color de la linea
            borderWidth: 2,
            tension: 0.2,

            pointRadius: 0,
            pointHoverRadius: 6,

            fill: true,
            backgroundColor: this.createGradient(ctx),
          },
          {
            data: [220, 210, 260, 120, 190, 170],

            borderColor: 'rgb(99 102 241)', // color de la linea
            borderWidth: 2,
            tension: 0.2,

            pointRadius: 0,
            pointHoverRadius: 6,

            fill: true,
            backgroundColor: this.createGradient(ctx),
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          mode: 'index',
          intersect: false,
        },

        plugins: {
          legend: { display: false },

          tooltip: {
            backgroundColor: 'rgb(15 23 42)',
            borderWidth: 0,
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            position: 'nearest',
          },
        },

        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
          },

          y: {
            grid: {
              color: 'rgb(241 245 249)',
            },
            border: { display: false },
          },
        },
      },
    });
  }

  private createGradient(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);

    gradient.addColorStop(0, 'rgba(99,102,241,0.15)');
    gradient.addColorStop(1, 'rgba(99,102,241,0)');

    return gradient;
  }
}
