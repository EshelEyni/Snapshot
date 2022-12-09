import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public saveToStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }
  public loadFromStorage(key: string) {
    let data = localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
  }
}
