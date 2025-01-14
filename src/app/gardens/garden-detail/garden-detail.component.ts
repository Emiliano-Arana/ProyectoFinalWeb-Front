import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Garden } from '../../core/models/garden.model';
import { GardensService } from '../../core/services/gardens.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-garden-detail',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './garden-detail.component.html',
  styleUrls: ['./garden-detail.component.css'], // Cambié de `styleUrl` a `styleUrls`
})
export class GardenDetailComponent implements AfterViewInit {
  private map: L.Map | undefined;
  idGarden!: number;
  latitude!: number;
  longitude!: number;
  garden: Garden = {} as Garden;

  constructor(private route: ActivatedRoute, private gs: GardensService) {}

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.idGarden = +id;
        console.log('ID del jardín:', this.idGarden);

        this.detailGarden(this.idGarden);
      }
    });
  }

  detailGarden(id: number) {
    this.gs.getGardenById(id).subscribe((data) => {
      this.garden = data;
      console.log('Datos del jardín:', this.garden);

      this.latitude = this.garden.latitude;
      this.longitude = this.garden.longitude;

      this.initMap();
    });
  }

  initMap() {
    this.map = L.map('map').setView([this.latitude, this.longitude], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);

    const DefaultIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    L.marker([this.latitude, this.longitude]).addTo(this.map);
  }
}
