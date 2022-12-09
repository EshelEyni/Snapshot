import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private history: string[] = []

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
  }


  public storyDetailsGoBack() {
    const lastUrl = this.history.reverse().find(url => !url.includes('story'))
    this.router.navigateByUrl(lastUrl || '/')
  }
}
