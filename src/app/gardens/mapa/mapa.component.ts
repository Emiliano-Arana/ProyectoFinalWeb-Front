import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { Garden } from '../../core/models/garden.model';
import { GardensService } from '../../core/services/gardens.service';

@Component({
  selector: 'app-mapa',
  imports: [RouterModule,CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit{
  private map:any;
  gardens : Garden[] = [];
  
  constructor(private gs:GardensService){}

  ngAfterViewInit(){
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

    this.listAllGardens();
  }

  listAllGardens(){
    this.gs.getAllGardensList().subscribe(
      data => {
        this.gardens=data;
        console.log(this.gardens);

        this.gardens.forEach((garden) => {
          if (garden.latitude && garden.longitude) {
            const marker = L.marker([garden.latitude, garden.longitude]).addTo(this.map!); // Crea un marcador en el mapa
            marker.bindPopup(`<b>${garden.name}</b><br>${garden.description}`); // Agrega un popup al marcador
          }
        });
      }

      
    );
  }
}
