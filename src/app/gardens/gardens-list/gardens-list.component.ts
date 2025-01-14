import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Garden } from '../../core/models/garden.model';
import { GardensService } from '../../core/services/gardens.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gardens-list',
  imports: [RouterModule,CommonModule],
  templateUrl: './gardens-list.component.html',
  styleUrl: './gardens-list.component.css'
})
export class GardensListComponent implements OnInit{
  gardens : Garden[] = [];

  constructor(private gs:GardensService){}

  ngOnInit(): void {
    this.listAllGardens();
  }

  listAllGardens(){
    this.gs.getAllGardensList().subscribe(
      data => {
        this.gardens=data;
        console.log(this.gardens);
      }
    );
  }
}
