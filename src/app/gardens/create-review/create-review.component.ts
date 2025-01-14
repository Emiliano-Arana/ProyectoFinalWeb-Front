import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '../../core/models/review.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewsService } from '../../core/services/reviews.service';
import { Garden } from '../../core/models/garden.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-review',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.css'
})
export class CreateReviewComponent {
  opinion = {
    title: '',
    content: '',
    score: 1,
    date: ''
  };
  gardenId: number=0 ;

  constructor(
    private route:ActivatedRoute,
    private rs:ReviewsService,
    private snackBar:MatSnackBar,
    private router:Router
  ){}

  submitOpinion() {
    this.gardenId = Number(this.route.snapshot.paramMap.get('id'));
    const fecha = new Date();
    this.opinion.date = fecha.toISOString().split('T')[0];
    const g = new Garden(this.gardenId,'',0,0,'',[],[],[]);
    const r = new Review(0,this.opinion.title,this.opinion.content,this.opinion.score,this.opinion.date,g);

    this.rs.createReview(r).subscribe({
      next: (res) => {
        this.snackBar.open('Opinion guardada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.router.navigate([`/gardens/garden-detail/${this.gardenId}`]);
      },
      error: (err) => {
        this.snackBar.open('No se pudo guardar la opinion', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });

  }
}
