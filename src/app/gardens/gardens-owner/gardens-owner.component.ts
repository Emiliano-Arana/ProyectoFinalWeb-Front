import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Garden } from '../../core/models/garden.model';
import { GardensService } from '../../core/services/gardens.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gardens-owner',
  imports: [RouterModule,CommonModule],
  templateUrl: './gardens-owner.component.html',
  styleUrl: './gardens-owner.component.css'
})
export class GardensOwnerComponent implements OnInit{
  gardens : Garden[] = [];
  showModal: boolean = false;
  gardenIdToDelete: number | null = null;

  constructor(private gs:GardensService, private dialog:MatDialog){}

  ngOnInit(): void {
    this.listAllGardens();
  }

  listAllGardens(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.gs.getGardenByUserId(currentUser.id).subscribe(
      data => {
        this.gardens=data;
        console.log(this.gardens);
      }
    );
  }
  openDeleteDialog(idGarden: number): void {
    this.showModal = true; // Mostrar el modal
    this.gardenIdToDelete = idGarden; // Guardar el ID del huerto a eliminar
  }

  closeDeleteDialog(): void {
    this.showModal = false;
    this.gardenIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.gardenIdToDelete !== null) {
      this.gs.deleteGarden(this.gardenIdToDelete).subscribe(
        () => this.listAllGardens()
      );
      this.closeDeleteDialog();
    }
  }
}
