import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GardenProduct } from '../models/gardenProduct.model';
import { Observable } from 'rxjs';
import { Relation } from '../models/relation.model';

@Injectable({
  providedIn: 'root'
})
export class GardenProductService {
  private api: string = 'http://localhost:8080/api/huerto-productos';
  constructor(private http:HttpClient) { }

  createRelation(relation:Relation):Observable<Relation>{
    return this.http.post<Relation>(this.api,relation);
  }

  deleteRelation(id:number):Observable<any>{
    return this.http.delete(`${this.api}/${id}`);
  }

  updateRelation(id:number,relation:Relation):Observable<any>{
    return this.http.put(`${this.api}/${id}`,relation);
  }
}
