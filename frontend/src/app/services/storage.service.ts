import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { };

  public saveToStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  };

  public loadFromStorage(key: string): any {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : undefined;
  };
};