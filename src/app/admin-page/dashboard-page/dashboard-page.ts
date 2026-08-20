import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { PageTitleComponent } from '../../components/template/page-title.component/page-title.component';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    TuiCardLarge,
    PageTitleComponent,
    HighchartsChartComponent
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage {
  chartPerbandinganOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      reflow: true
    },
    title: {
      text: 'Perbandingan Penjualan Mobil LCGC'
    },

    tooltip: {
      pointFormat: '<b>{point.y}</b> Unit'
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}'
        }
      }
    },
    series: [
      {
        type: "pie",
        data: [
          {
            name: "Toyota Agya",
            y: 150
          },
          {
            name: "Toyota Cayla",
            y: 300
          }
        ]
      }
    ]
  };

  chartPenjualanOptions: Highcharts.Options = {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Penjualan Tiap Bulannya'
    },
    subtitle: {
      text:
        'Untuk Tahun 2025 - 2026'
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],

      accessibility: {
        description: 'Months of the year'
      },
      crosshair: true
    },
    yAxis: {
      title: {
        text: 'Unit'
      },
      labels: {
        format: '{value}°'
      }
    },
    tooltip: {
      shared: true
    },
    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: '#666666',
          lineWidth: 1
        }
      }
    },
    series: [
      {
        name: 'Total Unit',
        marker: {
          symbol: 'square'
        },
        data: [
          10,
          20,
          15,
          25,
          17,
          18,
          24,
          25,
          27,
          17,
          13,
          15
        ]
      },
    ]
  }
}
