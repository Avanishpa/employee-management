import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
} from 'ng-apexcharts';
import { DashboardService } from '../../core/services/dashboard.service';
import { Employee } from '../../shared/components/models/employee.model';
export type WeeklyAttendanceChartOptions = {

  series: ApexAxisChartSeries;

  chart: ApexChart;

  xaxis: ApexXAxis;

  yaxis: ApexYAxis;

  stroke: ApexStroke;

  legend: ApexLegend;

  dataLabels: ApexDataLabels;

};
// ========================================
// ATTENDANCE CHART TYPE
// ========================================

export type AttendanceChartOptions = {

  series: ApexNonAxisChartSeries;

  chart: ApexChart;

  labels: string[];

  responsive: ApexResponsive[];

  legend: ApexLegend;

};


// ========================================
// DEPARTMENT CHART TYPE
// ========================================

export type DepartmentChartOptions = {

  series: ApexAxisChartSeries;

  chart: ApexChart;

  dataLabels: ApexDataLabels;

  plotOptions: ApexPlotOptions;

  xaxis: ApexXAxis;

  yaxis: ApexYAxis;

};


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    NgApexchartsModule
  ],

  templateUrl:
    './dashboard.component.html',

  styleUrl:
    './dashboard.component.scss'
})
export class DashboardComponent
  implements OnInit {

// ========================================
// RECENT EMPLOYEES
// ========================================

recentEmployees: Employee[] = [];
  // ========================================
  // DASHBOARD STATISTICS
  // ========================================

  totalEmployees = 0;

  totalDepartments = 0;

  presentToday = 0;

  absentToday = 0;

  lateToday = 0;

  workFromHomeToday = 0;


  // ========================================
  // CHART OPTIONS
  // ========================================

  public attendanceChartOptions:
    AttendanceChartOptions = {

      series: [],

      chart: {
        type: 'pie',
        height: 350
      },

      labels: [],

      responsive: [],

      legend: {
        position: 'bottom'
      }

    };


  public departmentChartOptions:
    DepartmentChartOptions = {

      series: [],

      chart: {
        type: 'bar',
        height: 350
      },

      dataLabels: {
        enabled: false
      },

      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: false
        }
      },

      xaxis: {
        categories: []
      },

      yaxis: {
        title: {
          text: 'Number of Employees'
        }
      }

    };

// ========================================
// WEEKLY ATTENDANCE CHART
// ========================================

public weeklyAttendanceChartOptions:
  WeeklyAttendanceChartOptions = {

    series: [],

    chart: {
      type: 'line',
      height: 350
    },

    xaxis: {
      categories: []
    },

    yaxis: {
      title: {
        text: 'Employees'
      }
    },

    stroke: {
      curve: 'smooth',
      width: 3
    },

    legend: {
      position: 'bottom'
    },

    dataLabels: {
      enabled: false
    }

  };
  constructor(
    private dashboardService:
      DashboardService
  ) {}


  // ========================================
  // ON INIT
  // ========================================

  ngOnInit(): void {

    this.loadDashboard();

    this.createAttendanceChart();

    this.createDepartmentChart();

  this.createWeeklyAttendanceChart();

  }


  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  loadDashboard(): void {

    this.totalEmployees =
      this.dashboardService
        .getTotalEmployees();


    this.totalDepartments =
      this.dashboardService
        .getTotalDepartments();


    this.presentToday =
      this.dashboardService
        .getPresentToday();


    this.absentToday =
      this.dashboardService
        .getAbsentToday();


    this.lateToday =
      this.dashboardService
        .getLateToday();


    this.workFromHomeToday =
      this.dashboardService
        .getWorkFromHomeToday();

  this.recentEmployees =
    this.dashboardService.getRecentEmployees(5);
  }


  // ========================================
  // ATTENDANCE PIE CHART
  // ========================================

  createAttendanceChart(): void {

    this.attendanceChartOptions = {

      series: [

        this.presentToday,

        this.absentToday,

        this.lateToday,

        this.workFromHomeToday

      ],

      chart: {
        type: 'pie',
        height: 350
      },

      labels: [

        'Present',

        'Absent',

        'Late',

        'Work From Home'

      ],

      responsive: [

        {

          breakpoint: 480,

          options: {

            chart: {
              width: 300
            },

            legend: {
              position: 'bottom'
            }

          }

        }

      ],

      legend: {
        position: 'bottom'
      }

    };

  }


  // ========================================
  // DEPARTMENT BAR CHART
  // ========================================

  createDepartmentChart(): void {

    const departmentData =
      this.dashboardService
        .getDepartmentEmployeeData();


    this.departmentChartOptions = {

      series: [

        {

          name: 'Employees',

          data:
            departmentData.map(
              item => item.count
            )

        }

      ],

      chart: {
        type: 'bar',
        height: 350
      },

      dataLabels: {
        enabled: false
      },

      plotOptions: {

        bar: {

          borderRadius: 6,

          horizontal: false

        }

      },

      xaxis: {

        categories:

          departmentData.map(
            item => item.department
          )

      },

      yaxis: {

        title: {

          text:
            'Number of Employees'

        }

      }

    };

  }
  // ========================================
// CREATE WEEKLY ATTENDANCE CHART
// ========================================

createWeeklyAttendanceChart(): void {

  const weeklyData =
    this.dashboardService
      .getWeeklyAttendanceData();


  this.weeklyAttendanceChartOptions = {

    series: [

      {
        name: 'Present',
        data: weeklyData.presentData
      },

      {
        name: 'Absent',
        data: weeklyData.absentData
      },

      {
        name: 'Late',
        data: weeklyData.lateData
      },

      {
        name: 'Work From Home',
        data: weeklyData.workFromHomeData
      }

    ],

    chart: {
      type: 'line',
      height: 350
    },

    xaxis: {
      categories: weeklyData.days
    },

    yaxis: {
      title: {
        text: 'Employees'
      }
    },

    stroke: {
      curve: 'smooth',
      width: 3
    },

    legend: {
      position: 'bottom'
    },

    dataLabels: {
      enabled: false
    }

  };

}
}
