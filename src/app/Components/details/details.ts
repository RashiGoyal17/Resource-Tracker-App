import { Component, OnInit } from '@angular/core';
import { Employee } from '../../Interface/Interface';
import { MyServices } from '../../Services/my-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class Details {
  user?: Employee;
  empId!: number;

  constructor(private empService: MyServices) { }

  ngOnInit() {
    this.empService.getSelectedEmployee().subscribe((emp) => {
      console.log(emp);
      this.user = emp!;
    });
  }
}

