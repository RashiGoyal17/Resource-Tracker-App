import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

interface payLoad {
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient) { }

  Login(data: any) {
    return this.http.post<any>(Environment.URI + 'Auth/login', data);
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken = jwtDecode<payLoad>(token);
    return decodedToken;
  }

  getRole(): string | null {
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      return decodedToken?.role;
    }
    return null;
  }

  // getAuth(data:any){
  //   return this.http.get<any>(Environment.URI + 'Auth/GetAuthUser',data);
  // }



}
