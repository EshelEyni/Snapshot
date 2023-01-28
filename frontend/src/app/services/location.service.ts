import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Location } from '../models/post.model';

const BASE_URL = process.env['NODE_ENV'] === 'production'
  ? '/api/'
  : '//localhost:3030/api';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  http = inject(HttpClient)

  async getLocations(searchTerm?: string): Promise<Location[]> {
    const locations = await lastValueFrom(
      this.http.get<Location[]>(`${BASE_URL}/location?searchTerm=${searchTerm}`)
    )

    return locations
  }

}
