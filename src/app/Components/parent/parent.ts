import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TabStripComponent, TabStripModule } from '@progress/kendo-angular-layout';
import { MyServices } from '../../Services/my-services';
import { Employee } from '../../Interface/Interface';
import { ExportServices } from '../../Services/export-services';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule, TabStripModule, RouterOutlet, RouterLink, RouterLinkActive, DropDownsModule, ButtonsModule],
  templateUrl: './parent.html',
  styleUrl: './parent.scss'
})

export class Parent implements OnInit {
  isLoggedIn = false;
  currentRoute: string = '';
  isAnyEmployeeSelected: boolean = false
  selectedEmployeeId?: number

  constructor(private exportService: ExportServices, private router: Router, private myService: MyServices, private toastr: ToastrService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {

    this.myService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.myService.getSelectedEmployee().subscribe((employee) => {
      if (employee) {
        this.isAnyEmployeeSelected = true
        this.selectedEmployeeId = employee.empId
      } else {
        this.isAnyEmployeeSelected = false
      }
    })
  }


  logout() {
    this.myService.logout();
    this.router.navigate(['/login']);  // Redirect to login page after logout
  }

  onExportSelect(event: Event) {
  const select = event.target as HTMLSelectElement;
  const format = select.value;

  if (!format) return;

  // reset dropdown after selection
  select.selectedIndex = 0;

  // same logic as before
  this.myService.getAll().subscribe(employeeList => {
    this.exportService.setEmployees(employeeList);

    switch (format) {
      case 'csv':
        this.exportService.exportToCSV();
        break;
      case 'excel':
        this.exportService.exportToExcel();
        break;
      case 'pdf':
        const employee = this.myService.getSelectedEmployeeValue();
        if (!employee) {
          this.toastr.warning('Please select an employee to export as PDF.', 'Warning');
          return;
        }
        if (employee.empId == null) {
          this.toastr.error('Selected employee does not have a valid ID.', 'Error');
          return;
        }
        this.myService.get(employee.empId).subscribe(fullEmp => {
          this.exportService.exportToPDF(fullEmp);
        }, error => {
          this.toastr.error('Failed to load employee details.', 'Error');
          console.error(error);
        });
        break;
    }
  });
}



  exportOptions = [
    { text: 'Export as CSV', format: 'csv' },
    { text: 'Export as Excel', format: 'excel' },
    { text: 'Export Selected as PDF', format: 'pdf' }
  ];


  routeToEditOrAddForm() {
    this.selectedEmployeeId ? this.router.navigate(['/Edit', this.selectedEmployeeId]) : this.router.navigate(['/Edit'])
  }

  isHome(): boolean {
    return this.currentRoute.includes('/Home');
  }
}

// toggleDarkMode() {
//   this.darkMode = !this.darkMode;
//   document.body.classList.toggle('dark-mode', this.darkMode);
// }
