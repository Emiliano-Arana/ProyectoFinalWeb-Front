import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private api: string = 'http://localhost:8080/api/productos'


  constructor(private http: HttpClient) { }

  getProducts():Observable<Product []>{
    return this.http.get<Product[]>(this.api);
  }
}
