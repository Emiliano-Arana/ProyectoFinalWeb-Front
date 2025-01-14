import { CommonModule } from '@angular/common';
import { AuthService } from './../../core/services/auth.service';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (response && response.role === 'usuario' ||response.role === 'propietario') {
          this.router.navigate(['/gardens']);
        }
      },
      (error) => {
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    );
  }

}
