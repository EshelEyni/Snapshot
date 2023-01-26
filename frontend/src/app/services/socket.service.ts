import { UserService } from 'src/app/services/user.service';
import { Injectable, inject } from '@angular/core';
import io from 'socket.io-client';

const baseUrl = (process.env['NODE_ENV'] === 'production') ? '' : '//localhost:3030'


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }
  userService = inject(UserService);

  socket: any = null;

  public setup() {
    this.socket = io(baseUrl);
  }

  public on(eventName: string, cb: any) {
    this.socket.on(eventName, cb)
  }

  public off(eventName: string, cb?: any) {
    this.socket.off(eventName, cb)
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data)
  }

  public terminate() {
    this.socket = null;
  }
}