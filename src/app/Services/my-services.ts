import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CreateEmployeeRequest, Employee } from '../Interface/Interface';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyServices {

  private baseUrl: string = Environment.URI + 'Home/';

  selectedTabIndex$ = new BehaviorSubject<number>(0)
  selectedEmployee$ = new BehaviorSubject<Employee | null>(null)

  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  getSelectedEmployee() {
    return this.selectedEmployee$.asObservable()
  }

  setSelectedEmployee(employee: Employee | null = null) {
    this.selectedEmployee$.next(employee)
  }


  constructor(private http: HttpClient) { }
  getAll(): Observable<Employee[]> { return this.http.get<Employee[]>(this.baseUrl + 'GetAll'); }
  get(empId: number): Observable<Employee> { return this.http.get<Employee>(`${this.baseUrl}${empId}`); }
  add(emp: any): Observable<Employee> { return this.http.post<Employee>(this.baseUrl + 'AddEmployee', emp); }
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
    return this.http.post(this.baseUrl + 'AddEmployees', employees);
  }

  getSelectedEmployeeValue(): Employee | null {
    return this.selectedEmployee$.getValue();
  }

  // Observable to track login state
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn$.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn$.next(false);
  }

  isLoggedInValue(): boolean {
    return !!localStorage.getItem('token');
  }

};
