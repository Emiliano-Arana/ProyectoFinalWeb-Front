import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../models/review.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private api: string='http://localhost:8080/api/opiniones';

  constructor(private http:HttpClient) { }

  createReview(review:Review):Observable<Review>{
    return this.http.post<Review>(this.api,review);
  }
}
