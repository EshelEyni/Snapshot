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
    const user = this.userService.getLoggedinUser();
    if (user) {
      this.socket.emit('set-user-socket', user.id);
    }
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

  public login(userId: number) {
    this.socket.emit('set-user-socket', userId);
  }

  public logout() {
    this.socket.emit('unset-user-socket');
  }

  public terminate() {
    this.socket = null;
  }


}
