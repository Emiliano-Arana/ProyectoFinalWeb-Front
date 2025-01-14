import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-data',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  currentPassword: string = '';

  constructor(private snackBar:MatSnackBar,private as: AuthService,private us:UsersService,private router:Router){}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser && currentUser.id) {
      // Hacemos una solicitud al backend para obtener los detalles del usuario
      this.us.getById(currentUser.id).subscribe(
        (user) => {
          this.nombre = user.name || '';
          this.apellidos = user.lastName || '';
          this.email = user.email || '';
          this.currentPassword = user.password;
        },
        (error) => {
          this.errorMessage = 'Error al cargar los datos del usuario.';
        }
      );
    }
  }

  onSubmit() {
    if (this.password !== this.currentPassword) {
      this.errorMessage = 'La contraseña no es correcta';
      return;
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    let updatedUser = new User(
      currentUser.id,
      this.email,
      this.nombre,
      this.apellidos,
      this.confirmPassword,
      currentUser.role,
      []
    );

    this.us.updateUser(currentUser.id,updatedUser).subscribe(
      (response) => {
        this.snackBar.open('Usuario Actualizado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      (error) => {
        this.errorMessage = 'Error al actualizar el perfil. Intenta nuevamente';
      }
    );
  }

  // Función para manejar el cierre de sesión
  logout() {
    this.as.logout();
    this.router.navigate(['/login']);
  }
}
