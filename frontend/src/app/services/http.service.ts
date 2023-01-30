import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { };

  public getBaseUrl(): '/api' | '//localhost:3030/api' {
    return (process.env['NODE_ENV'] === 'production') ? '/api' : '//localhost:3030/api'
  };

};