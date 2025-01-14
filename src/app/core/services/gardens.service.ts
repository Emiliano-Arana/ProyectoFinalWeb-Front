import { Garden } from './../models/garden.model';
import { GardenC } from './../models/gardenC.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GardensService {
  private api: string = 'http://localhost:8080/api/huertos';

  constructor(private http: HttpClient) {  }
  
  getAllGardensList():Observable<Garden []>{
    return this.http.get<Garden[]>(this.api);
  }

  getGardenById(id: number):Observable<Garden>{
    return this.http.get<Garden>(`${this.api}/${id}`);
  }

  getGardenByUserId(id: number):Observable<Garden []>{
    return this.http.get<Garden[]>(`${this.api}/user/${id}`);
  }

  deleteGarden(idGarden: number):Observable<any> {
    return this.http.delete(`${this.api}/${idGarden}`);
  }

  createGarden(garden:GardenC):Observable<GardenC>{
    return this.http.post<GardenC>(this.api,garden);
  }

  updateGarden(id:number,garden:GardenC):Observable<any>{
    return this.http.put(`${this.api}/${id}`,garden);
  }
}
