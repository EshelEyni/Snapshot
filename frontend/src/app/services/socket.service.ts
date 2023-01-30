import { UserService } from 'src/app/services/user.service';
import { Injectable, inject } from '@angular/core';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }
  userService = inject(UserService);

  baseUrl = (process.env['NODE_ENV'] === 'production') ? '' : '//localhost:3030'
  socket: any = null;

  public setup(): void {
    this.socket = io(this.baseUrl);
  };

  public on(eventName: string, cb: any): void {
    this.socket.on(eventName, cb);
  };

  public off(eventName: string, cb?: any): void {
    this.socket.off(eventName, cb);
  };

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  };

  public terminate(): void {
    this.socket = null;
  };
};