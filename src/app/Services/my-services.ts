import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { CreateEmployeeRequest, Employee } from '../Interface/Interface';
import { Environment } from '../../environments/environment'; 
import { DashboardData } from '../Interface/DashboardData';
import { State } from '@progress/kendo-data-query';

@Injectable({
  providedIn: 'root'
})
export class MyServices {

  private baseUrl: string = Environment.URI + 'Home/';

  selectedTabIndex$ = new BehaviorSubject<number>(0)
  selectedEmployee$ = new BehaviorSubject<Employee | null>(null)

  getSelectedEmployee() {
    return this.selectedEmployee$.asObservable()
  }

  setSelectedEmployee(employee: Employee | null = null) {
    this.selectedEmployee$.next(employee)
  }


  constructor(private http: HttpClient) { }

  getAll(): Observable<Employee[]> { return this.http.get<Employee[]>(this.baseUrl + 'GetAll'); }
  get(empId: number): Observable<Employee> { return this.http.get<Employee>(`${this.baseUrl}${empId}`); }
  add(emp: any): Observable<Employee> { 
    console.log(emp);
    return this.http.post<Employee>(this.baseUrl + 'AddEmployee', emp); }
  update(empId: number, emp: CreateEmployeeRequest): Observable<Employee> { return this.http.put<Employee>(`${this.baseUrl}${empId}`, emp); }
  delete(empId: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}Delete/${empId}`); }
  getDesignations(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'designations');
  }

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'locations');
  }

  getSkills(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'skills');
  }

  getProjects(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'projects');
  }

  getManagers(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'managers');
  }

  bulkAddEmployees(employees: any[]): Observable<any> {
    console.log(employees);
    return this.http.post(this.baseUrl + 'AddEmployees', employees);
  }

  getSelectedEmployeeValue(): Employee | null {
    return this.selectedEmployee$.getValue();
  }

getDashboardData(): Observable<DashboardData> {
  return this.http.get<any>(this.baseUrl + 'DashboardData').pipe(
    map(res => ({
      metrics: {
        totalEmployees: res.Metrics.TotalEmployees,
        projectsActive: res.Metrics.ProjectsActive,
        billable_FTEs: res.Metrics.Billable_FTEs,
        unassignedEmployees: res.Metrics.UnassignedEmployees
      },
      employeeDistribution: res.EmployeeDistribution.map((e: any) => ({
        role: e.Role,
        count: e.Count
      })),
      projectAssignments: res.ProjectAssignments.map((p: any) => ({
        project: p.Project,
        assignedEmployees: p.AssignedEmployees
      }))
    }))
  );
}


getGridData(state: State): Observable<any> {
  let params = new HttpParams()
    .set('skip', state.skip?.toString() || '0')
    .set('take', state.take?.toString() || '10');

  if (state.sort && state.sort.length > 0) {
    params = params.set(
      'sort',
      state.sort.map(s => `${s.field} ${s.dir || 'asc'}`).join(',')
    );
  }

  if (state.filter && state.filter.filters.length > 0) {
    params = params.set('filter', JSON.stringify(state.filter));
  }

  return this.http.get<any>(this.baseUrl + 'GetGridData', { params });
}


};
