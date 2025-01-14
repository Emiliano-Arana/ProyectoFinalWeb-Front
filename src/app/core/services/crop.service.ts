import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crop } from '../models/crop.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private api: string='http://localhost:8080/api/cosechas';

  constructor(private http:HttpClient) { }

  createHarvest(crop:Crop):Observable<Crop>{
    return this.http.post<Crop>(this.api,crop);
  }
}
