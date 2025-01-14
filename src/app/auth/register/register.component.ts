import { User } from './../../core/models/user.model';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isOwner: boolean = false;
  errorMessage: string = '';

  constructor(private us : UsersService,private router: Router,private snackBar: MatSnackBar){}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.addUser();
  }

  addUser(){
    const role = this.isOwner ? 'propietario' : 'usuario';
    let user = new User(0,this.email,this.nombre,this.apellidos,this.password,role,[]);
    console.log(user);
    this.us.registerUser(user).subscribe({
      next: (res) => {
        this.snackBar.open('Usuario creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Correo electrónico en uso. Intente con otro.';
        console.error(err);
      }
    });
  }
}
