import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  userService = inject(UserService)
  route = inject(Router)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const loggedinUser = this.userService.getLoggedinUser()
    if (!loggedinUser) {
      this.route.navigateByUrl('/login')
      return of(false)
    }
    return of(true)
  }

}
