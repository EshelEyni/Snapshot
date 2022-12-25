import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Location } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  http = inject(HttpClient)

  async getLocations(searchTerm?: string): Promise<Location[]> {
    const locations = await lastValueFrom(
      this.http.get<Location[]>(`http://localhost:3030/api/location?searchTerm=${searchTerm}`)
    )

    return locations
  }

}
