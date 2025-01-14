import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { userCredential } from '../models/userCredential.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private currentUserSubject: BehaviorSubject<userCredential | null>;
  public currentUser: Observable<userCredential | null>;

  constructor(private http: HttpClient, private router: Router) {
    const userData = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<userCredential | null>(
      userData ? JSON.parse(userData) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<userCredential> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
  
    return this.http.post<userCredential>(`${this.apiUrl}/login`, null, { params }).pipe(
      map((response: userCredential) => {
        // Guardar los datos del usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']); // Redirigir al login
  }

  get currentUserValue(): userCredential | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
}
