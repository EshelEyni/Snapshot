import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Location } from '../models/post.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  http = inject(HttpClient);
  httpService = inject(HttpService);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  async getLocations(searchTerm: string): Promise<Location[]> {
    const options = { withCredentials: true };
    const locations = await lastValueFrom(
      this.http.get<Location[]>(
        `${this.baseUrl}/location?searchTerm=${searchTerm}`,
        options
      )
    );

    return locations;
  }
}
