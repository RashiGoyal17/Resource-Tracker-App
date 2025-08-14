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
      // Assign the metrics
      this.metrics = data.metrics;

      // Assign the pie chart data
      this.pieChartLabels = data.employeeDistribution.map(item => item.role);
      this.pieChartData.datasets[0].data = data.employeeDistribution.map(item => item.count);

      // Assign the bar chart data
      this.barChartLabels = data.projectAssignments.map(item => item.project);
      this.barChartData[0].data = data.projectAssignments.map(item => item.assignedEmployees);
    });
  }

}
