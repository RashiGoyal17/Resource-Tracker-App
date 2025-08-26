import { Component, OnInit } from '@angular/core';
import { MyServices } from '../../Services/my-services';
import { DashboardMetrics } from '../../Interface/DashboardData';
import { ChartOptions, ChartType, ChartDataset, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  // Metrics
  metrics: DashboardMetrics = {} as DashboardMetrics;

  // Pie Chart Data
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
        data: []
    }]
};
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLegend = true;

  // Bar Chart Data
  public barChartLabels: string[] = [];
public barChartData: ChartDataset<'bar'>[] = [
  { data: [], label: 'Assigned Employees' }
];
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  constructor(private myServices:MyServices) { }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

fetchDashboardData(): void {
  this.myServices.getDashboardData().subscribe(data => {
    console.log("API Data:", data);

    // Metrics
    this.metrics = {
      totalEmployees: data.metrics.totalEmployees,
      projectsActive: data.metrics.projectsActive,
      billable_FTEs: data.metrics.billable_FTEs,
      unassignedEmployees: data.metrics.unassignedEmployees
    };

    // Pie Chart Data
    this.pieChartData = {
      labels: data.employeeDistribution.map((item: any) => item.role),
      datasets: [{ data: data.employeeDistribution.map((item: any) => item.count) }]
    };

    // Bar Chart Data
    this.barChartLabels = data.projectAssignments.map((item: any) => item.project);
    this.barChartData = [
      { data: data.projectAssignments.map((item: any) => item.assignedEmployees), label: 'Assigned Employees' }
    ];
  });
}


}
