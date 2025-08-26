import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataStateChangeEvent, GridDataResult, GridModule } from '@progress/kendo-angular-grid';
import { Employee } from '../../Interface/Interface';
import { MyServices } from '../../Services/my-services';
import { Router } from '@angular/router';
import { State } from '@progress/kendo-data-query';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExportServices } from '../../Services/export-services';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import * as XLSX from 'xlsx';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DialogModule,
    ToolBarModule,
    ButtonsModule,
    LabelModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  bulkEditForm!: FormGroup;
  showBulkEditModal: boolean = false;
  displayModal: boolean = false;
  requireSelectOrCtrlKeys: boolean = false;

  // Dropdown data
  designations: string[] = [];
  locations: string[] = [];
  skills: string[] = [];
  projects: string[] = [];
  managers: string[] = [];

  // Server-side grid configuration
  public gridView: GridDataResult = { data: [], total: 0 };
  public selectedKeys: number[] = [];
  public loading: boolean = false;

  public gridState: State = {
    skip: 0,
    take: 10,
    sort: [],
    filter: { logic: 'and', filters: [] },
    group: []
  };

  constructor(
    private fb: FormBuilder, 
    private empService: MyServices,
    private router: Router, 
    private exportService: ExportServices, 
    private authService: AuthService, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeBulkEditForm();
    this.loadInitialData();
    this.loadData();
  }

  private initializeBulkEditForm(): void {
    this.bulkEditForm = this.fb.group({
      designation: [''],
      location: [''],
      billable: [''],
      skill: [[]],
      project: [[]],
      reportingTo: [[]],
      doj: [''],
      remarks: ['']
    });
  }

  private loadData(): void {
    this.loading = true;
    this.empService.getGridData(this.gridState).subscribe({
      next: (response: any) => {
        console.log("Grid API response:", response);
        
        // Handle different response formats from server
        let data: Employee[] = [];
        let total: number = 0;

        if (response.Data && response.Total !== undefined) {
          // Format: { Data: [...], Total: number }
          data = response.Data;
          total = response.Total;
        } else if (response.data && response.total !== undefined) {
          // Format: { data: [...], total: number }
          data = response.data;
          total = response.total;
        } else if (Array.isArray(response)) {
          // Format: [...]
          data = response;
          total = response.length;
        } else {
          console.warn('Unexpected response format:', response);
        }

        this.gridView = {
          data: data.map((emp: any) => ({
            ...emp,
            billable: emp.billable ? 'yes' : 'no' // Normalize for UI
          })),
          total: total
        };

        this.exportService.setEmployees(this.gridView.data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load grid data:', error);
        this.toastr.error('Failed to load grid data', 'Error');
        this.gridView = { data: [], total: 0 };
        this.loading = false;
      }
    });
  }

  private loadInitialData(): void {
    const requests = {
      designations: this.empService.getDesignations(),
      locations: this.empService.getLocations(),
      skills: this.empService.getSkills(),
      projects: this.empService.getProjects(),
      managers: this.empService.getManagers()
    };

    forkJoin(requests).subscribe({
      next: (results) => {
        this.designations = results.designations;
        this.locations = results.locations;
        this.skills = results.skills;
        this.projects = results.projects;
        this.managers = results.managers;
      },
      error: (error) => {
        console.error('Failed to load initial data:', error);
      }
    });
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    console.log('Data state changed:', state);
    this.gridState = state;
    this.loadData(); // Fetch new data from server
  }

  IsEmployee(): boolean {
    return this.authService.getRole() === "Employee";
  }

  onEdit(employee: Employee): void {
    console.log("Employee", employee);
    this.empService.setSelectedEmployee(employee);
    this.router.navigate(['/Edit', employee.empId]);
  }

  onMore(employee: Employee): void {
    this.empService.setSelectedEmployee(employee);
    this.router.navigate(['/Details', employee.empId]);
  }

  onDel(empId: number): void {
    const delConfirm = confirm('Are you sure you want to delete?');
    if (delConfirm) {
      this.empService.delete(empId).subscribe({
        next: () => {
          this.empService.setSelectedEmployee(null);
          this.loadData(); // Refresh server-side data
          this.toastr.success('Employee deleted successfully', 'Success');
          console.log('Employee deleted successfully');
        },
        error: (error) => {
          console.error('Delete failed', error);
          this.toastr.error('Failed to delete employee', 'Error');
        }
      });
    }
  }

  onDeleteMultiple(): void {
    if (this.selectedKeys.length === 0) {
      this.toastr.warning('No employees selected', 'Warning');
      return;
    }

    const delConfirm = confirm(`Are you sure you want to delete ${this.selectedKeys.length} employee(s)?`);
    if (delConfirm) {
      const deleteObservables = this.selectedKeys.map(empId => 
        this.empService.delete(empId)
      );

      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.loadData(); // Refresh server-side data
          this.selectedKeys = [];
          this.toastr.success('Employees deleted successfully', 'Success');
        },
        error: (error) => {
          console.error('Bulk delete failed', error);
          this.toastr.error('Failed to delete some employees', 'Error');
        }
      });
    }
  }

  onSelectionChange(event: any): void {
    const newlySelectedRows = event.selectedRows.map((row: any) => row.dataItem.empId);
    const newlyDeselectedRows: number[] = event.deselectedRows.map((row: any) => row.dataItem.empId);

    // Remove deselected items
    this.selectedKeys = this.selectedKeys.filter((empId: number) => 
      !newlyDeselectedRows.includes(empId)
    );

    // Add newly selected items
    newlySelectedRows.forEach((newlySelectedId: number) => {
      if (!this.selectedKeys.includes(newlySelectedId)) {
        this.selectedKeys.push(newlySelectedId);
      }
    });

    console.log('Selected Keys:', this.selectedKeys);

    // Set the first selected employee as active
    if (newlySelectedRows.length > 0) {
      const selectedEmployeeObj = event.selectedRows[0]?.dataItem;
      this.empService.setSelectedEmployee(selectedEmployeeObj);
    } else if (this.selectedKeys.length === 0) {
      this.empService.setSelectedEmployee(null);
    }
  }

  // onAddNew(): void {
  //   this.router.navigate(['/form']);
  //   this.empService.setSelectedEmployee(null);
  // }

  onBulkEdit(): void {
    if (this.selectedKeys.length === 0) {
      this.toastr.warning('Please select employees to edit', 'Warning');
      return;
    }
    this.bulkEditForm.reset();
    this.showBulkEditModal = true;
  }

  closeBulkEditModal(): void {
    this.showBulkEditModal = false;
  }

  onBulkEditSubmit(): void {
  if (this.selectedKeys.length === 0) {
    this.toastr.warning('No employees selected', 'Warning');
    return;
  }

  const formData = this.bulkEditForm.value;

  // Create payload with only non-empty values
  const payload: any = {};

  if (formData.designation) payload.designation = formData.designation;
  if (formData.location) payload.location = formData.location;
  if (formData.billable) payload.billable = formData.billable === 'yes';
  if (formData.skill && formData.skill.length > 0) payload.skill = formData.skill.join(',');
  if (formData.project && formData.project.length > 0) payload.project = formData.project.join(',');
  if (formData.reportingTo && formData.reportingTo.length > 0) {
    payload.reportingTo = formData.reportingTo.join(',');
  }
  if (formData.doj) payload.doj = new Date(formData.doj).toISOString().split('T')[0];
  if (formData.remarks) payload.remarks = formData.remarks;

  // Build full update objects
const updateObservables = this.selectedKeys.map((empId: number) => {
  const existingEmployee = this.gridView.data.find((e: any) => e.empId === empId);

  const updated = {
    ...existingEmployee,
    ...payload,
    empId,
    billable: payload.billable !== undefined 
      ? payload.billable  // already true/false
      : existingEmployee.billable === 'yes' // normalize UI back to boolean
  };

  return this.empService.update(empId, updated); // <-- send raw Employee object
});


  forkJoin(updateObservables).subscribe({
    next: () => {
      this.toastr.success('Bulk update successful', 'Success');
      this.closeBulkEditModal();
      this.loadData(); // Refresh server-side data
      this.selectedKeys = [];
    },
    error: (error) => {
      console.error('Bulk update failed', error);
      this.toastr.error('Bulk update failed. Please try again.', 'Error');
    }
  });
}


  onImportExcel(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = (evt: any) => {
          try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const employees = jsonData.map((row: any): any => {
              const normalizedRow: any = {};
              Object.keys(row).forEach(k => {
                normalizedRow[k.toLowerCase().trim()] = row[k];
              });

              let doj: string | null = null;
              if (normalizedRow["doj"]) {
                if (typeof normalizedRow["doj"] === "number") {
                  const parsed = XLSX.SSF.parse_date_code(normalizedRow["doj"]);
                  doj = `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
                } else {
                  doj = new Date(normalizedRow["doj"]).toISOString().split("T")[0];
                }
              }

              return {
                empId: null,
                name: normalizedRow["name"] || '',
                email: normalizedRow["email"] || '',
                designation: normalizedRow["designation"] || '',
                ReportingTo: (normalizedRow["reportingto"] || '').toString().split(',').map((s: string) => s.trim()).filter((s: string) => s).join(', '),
                billable: (normalizedRow["billable"] || '').toString().toLowerCase() === 'yes',
                skill: (normalizedRow["skill"] || '').toString().split(',').map((s: string) => s.trim()).filter((s: string) => s).join(', '),
                project: (normalizedRow["project"] || '').toString().split(',').map((s: string) => s.trim()).filter((s: string) => s).join(', '),
                location: normalizedRow["location"] || '',
                doj: doj,
                remarks: normalizedRow["remarks"] || ''
              };
            });

            console.log('Processed employees for backend:', employees);

            this.empService.bulkAddEmployees(employees).subscribe({
              next: (response) => {
                console.log('Backend response:', response);
                this.toastr.success(`${employees.length} employees imported successfully`, 'Success');
                this.loadData(); // Refresh server-side data
              },
              error: (error) => {
                console.error('Bulk import error:', error);
                this.toastr.error('Failed to import employees', 'Error');
                if (error.error) {
                  console.error('Backend error details:', error.error);
                }
              }
            });
          } catch (parseError) {
            console.error('Error parsing Excel file:', parseError);
            this.toastr.error('Error parsing Excel file', 'Error');
          }
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error reading file:', error);
        this.toastr.error('Error reading file', 'Error');
      }
    };

    input.click();
  }
}
