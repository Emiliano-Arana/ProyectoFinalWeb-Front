import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { GardensService } from '../../core/services/gardens.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { GardenC } from '../../core/models/gardenC.model';

@Component({
  selector: 'app-garden-add',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './garden-add.component.html',
  styleUrl: './garden-add.component.css'
})
export class GardenAddComponent implements AfterViewInit{
  name:string= '';
  description:string= '';
  private map:any;
  selectedLatitude: number = 0;
  selectedLongitude: number = 0;

  constructor(
    private gardensService: GardensService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(){
    // Configurar el mapa
    this.initMap();
  }

  initMap():void {
    this.map = L.map('map').setView([19.43234, -99.13241],12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    setTimeout(()=>{
      this.map?.invalidateSize();
    },0);

    const DefaultIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41], // Tamaño del icono
      iconAnchor: [12, 41], // Punto del icono que se ancla al mapa
      popupAnchor: [1, -34], // Punto del popup respecto al icono
      shadowSize: [41, 41], // Tamaño de la sombra
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    let marker: L.Marker;

    this.map.on('click', (e: any) => {
      
      if (marker) {
        marker.remove();
      }

      this.selectedLatitude = e.latlng.lat;
      this.selectedLongitude = e.latlng.lng;

      marker = L.marker([this.selectedLatitude, this.selectedLongitude], {
        draggable: true,
      })
        .addTo(this.map)
        .on('dragend', (event: any) => {
          const marker = event.target;
          const position = marker.getLatLng();
          this.selectedLatitude = position.lat;
          this.selectedLongitude = position.lng;
        });
    });
  }

  onSubmit(): void {
    if (this.name && this.description && this.selectedLatitude && this.selectedLongitude) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      let currentU= new User(currentUser.id,'','','','','',[]);
      let gardenData = new GardenC(0,this.name,this.selectedLatitude,this.selectedLongitude,this.description,currentU);

      // Llamar al servicio para guardar el huerto
      this.gardensService.createGarden(gardenData).subscribe({
        next: (response) => {
          console.log('Huerto creado:', response);
          this.router.navigate(['/gardens']);
          // Mostrar mensaje de éxito
          this.snackBar.open('Huerto creado exitosamente', 'Cerrar', {
            duration: 3000, // 3 segundos
            panelClass: ['snackbar-success'], // Clase personalizada para estilos
          });
        },
        error: (err) => {
          console.error('Error al crear el huerto:', err);

          // Mostrar mensaje de error
          this.snackBar.open('Error al crear el huerto. Inténtalo nuevamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'], // Clase personalizada para estilos
          });
        },
      });
    } else {
      // Mostrar mensaje si el formulario es inválido o falta la ubicación
      this.snackBar.open(
        'Por favor, completa todos los campos y selecciona una ubicación en el mapa.',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['snackbar-warning'], // Clase personalizada para estilos
        }
      );
    }
  }
}
