import { Component, OnInit } from '@angular/core';
import {   GridComponent,GridModule,DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../Services/auth-service';
import { process, State } from '@progress/kendo-data-query';

// Assume this is the structure of your user data from the API
export interface User {
  // id: number;
  Username: string;
  Email: string;
  Role: string;
  Doj: string;
}

@Component({
  selector: 'app-admin-user-management',
  standalone:true,
  imports: [GridComponent,GridModule],
  templateUrl: './admin-user-management.html',
  styleUrl: './admin-user-management.scss'
})
export class AdminUserManagement implements OnInit{

  public userList: User[] = [];
  public gridView: any[] = [];
  
  public gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    },
    sort: []
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found.');
      return;
    }
    
    // Set up the headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // API endpoint for fetching all users
    this.http.get<User[]>(Environment.URI + 'Auth/GetAuthUser', { headers }).subscribe({
      next: (data: User[]) => {
        this.userList = data;
        this.applyGridState();
      },
      error: (err: any) => {
        console.error('Error fetching users:', err);
      }
    });
  }
  
  public onDataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.applyGridState();
  }
  
  private applyGridState(): void {
    this.gridView = process(this.userList, this.gridState).data;
  }

}
