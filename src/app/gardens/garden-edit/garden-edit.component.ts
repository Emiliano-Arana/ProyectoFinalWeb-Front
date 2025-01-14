import { GardenProduct } from './../../core/models/gardenProduct.model';
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { GardensService } from '../../core/services/gardens.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { GardenC } from '../../core/models/gardenC.model';
import { ProductsService } from '../../core/services/products.service'; // Servicio para obtener productos
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import { Relation } from '../../core/models/relation.model';
import { Garden } from '../../core/models/garden.model';
import { GardenProductService } from '../../core/services/garden-product.service';

@Component({
  selector: 'app-garden-edit',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './garden-edit.component.html',
  styleUrl: './garden-edit.component.css'
})
export class GardenEditComponent implements AfterViewInit {
  name: string = '';
  description: string = '';
  private map: any;
  selectedLatitude: number = 0;
  selectedLongitude: number = 0;
  gardenProducts: GardenProduct[] = [];
  availableProducts: any[] = []; // Lista de productos disponibles para agregar
  selectedProduct!: Product;
  stock: number = 1;
  private gardenId:number=0;
  private marker?: L.Marker;

  constructor(
    private gs: GardensService,
    private ps: ProductsService,
    private gps:GardenProductService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route:ActivatedRoute
  ) {}

  ngAfterViewInit() {
    // Configurar el mapa
    this.initMap();
    this.loadGardenDetails();
    this.loadAvailableProducts();
  }

  initMap(): void {
    this.map = L.map('map').setView([19.43234, -99.13241], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

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

    this.map.on('click', (e: any) => {
      if (this.marker) {
        this.marker.remove();
      }

      this.selectedLatitude = e.latlng.lat;
      this.selectedLongitude = e.latlng.lng;

      this.marker = L.marker([this.selectedLatitude, this.selectedLongitude], {
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

  loadGardenDetails(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.gardenId = +id;
        console.log('ID del jardín:', this.gardenId);
      }
    });
    this.gs.getGardenById(this.gardenId).subscribe({
      next: (garden) => {
        this.name = garden.name;
        this.description = garden.description;
        this.selectedLatitude = garden.latitude;
        this.selectedLongitude = garden.longitude;

        if (this.map) {
          this.marker = L.marker([this.selectedLatitude, this.selectedLongitude], {
            draggable: true,
          })
            .addTo(this.map)
            .on('dragend', (event: any) => {
              const marker = event.target;
              const position = marker.getLatLng();
              this.selectedLatitude = position.lat;
              this.selectedLongitude = position.lng;
            });
          }

        this.gardenProducts = garden.huertoProductos || [];
      },
      error: (err) => {
        console.error('Error al cargar los detalles del huerto:', err);
        this.snackBar.open('Error al cargar los detalles del huerto.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  loadAvailableProducts(): void {
    this.ps.getProducts().subscribe((data) => {
      this.availableProducts = data;
    });
  }

  addProduct(): void {
    let ga=new Garden(this.gardenId,'',0,0,'',[],[],[]);
    let rel=new Relation(ga,this.selectedProduct,this.stock);
    this.gps.createRelation(rel).subscribe(
      response => {
        location.reload();
        this.snackBar.open('Producto agregado correctamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
      error => {
        this.snackBar.open('No se pudo agregar el producto', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
        });
      }
    )
  }

  updateProductStock(product: GardenProduct, newStock: number): void {
    let ga=new Garden(this.gardenId,'',0,0,'',[],[],[]);
    let rel=new Relation(ga,product.producto,newStock);

    this.gps.updateRelation(product.idGardenProduct,rel).subscribe(
      response => {
        this.snackBar.open('Producto actualizado correctamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
      error => {
        this.snackBar.open('No se pudo actualizar el producto', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
        });
      }
    )
  }

  removeProduct(productId: number): void {
    this.gps.deleteRelation(productId).subscribe(
      response => {
        location.reload();
        this.snackBar.open('Producto eliminado correctamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
      error => {
        this.snackBar.open('No se pudo eliminar el producto', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
        });
      }
    )
  }

  onSubmit(): void {
    if (this.name && this.description && this.selectedLatitude && this.selectedLongitude) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      let currentU = new User(currentUser.id, '', '', '', '', '', []);
      let gardenData = new GardenC(0, this.name, this.selectedLatitude, this.selectedLongitude, this.description, currentU);

      this.gs.updateGarden(this.gardenId,gardenData).subscribe({
        next: (response) => {
          console.log('Huerto actualizado:', response);

          this.snackBar.open('Huerto actualizado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });

          this.router.navigate(['/gardens']);
        },
        error: (err) => {
          console.error('Error al actualizar el huerto:', err);

          this.snackBar.open('Error al actualizar el huerto. Inténtalo nuevamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    } else {
      this.snackBar.open(
        'Por favor, completa todos los campos y selecciona una ubicación en el mapa.',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['snackbar-warning'],
        }
      );
    }
  }
}