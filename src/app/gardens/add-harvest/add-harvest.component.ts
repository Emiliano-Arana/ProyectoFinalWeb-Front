import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CropService } from '../../core/services/crop.service';
import { Garden } from '../../core/models/garden.model';
import { Crop } from '../../core/models/crop.model';

@Component({
  selector: 'app-add-harvest',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './add-harvest.component.html',
  styleUrl: './add-harvest.component.css'
})
export class AddHarvestComponent {
  harvestType: string = '';
  quantity: number = 0;
  date:string = '';
  gardenId: number=0 ;

  constructor(
    private route:ActivatedRoute,
    private cs:CropService,
    private snackBar:MatSnackBar,
    private router:Router
  ){}

  onSubmit() {
    this.gardenId = Number(this.route.snapshot.paramMap.get('id'));
      let fecha = new Date();
      this.date = fecha.toISOString().split('T')[0];
      const g = new Garden(this.gardenId,'',0,0,'',[],[],[]);
      const c = new Crop(0,this.quantity,this.harvestType,this.date,g);
      
      this.cs.createHarvest(c).subscribe({
        next: (res) => {
          this.snackBar.open('Cosecha guardada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
  
          this.router.navigate([`/gardens/edit-garden/${this.gardenId}`]);
        },
        error: (err) => {
          this.snackBar.open('No se pudo guardar la cosecha', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
}
