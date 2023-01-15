import { Component, OnInit, ViewChildren, ElementRef, QueryList, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { faX } from '@fortawesome/free-solid-svg-icons'
import { SvgIconComponent } from 'angular-svg-icon';


@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})

export class SideBarComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  @ViewChildren('link') links!: QueryList<ElementRef>;
  @ViewChildren('svgIcon') icons!: QueryList<SvgIconComponent>;
  isPostEdit: boolean = false;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  isBtnClicked = { search: false, create: false, notification: false, more: false }
  isMainScreen: boolean = false;
  sub: Subscription | null = null;
  iconColor: string = 'var(--tertiary-color)'

  faX = faX


  async ngOnInit(): Promise<void> {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user }
        this.setIconColor();
      }
    })
  }

  setIconColor() {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)'
    this.icons.forEach(icon => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor }
    })
  }

  get isLoginSignupPath() {
    return !(this.router.url === '/login' || this.router.url === '/signup')
  }

  onCloseModal() {
    if (!this.isMainScreen) return;

    switch (this.router.url) {
      case '/':
        this.links.get(0)?.nativeElement.classList.add('active')
        break;
      case '/explore':
        this.links.get(1)?.nativeElement.classList.add('active')
        break;
      case '/inbox':
        this.links.get(2)?.nativeElement.classList.add('active')
        break;
      case `/profile/${this.loggedinUser.id}`:
        this.links.get(3)?.nativeElement.classList.add('active')
        break;
    }

    this.isBtnClicked = { search: false, create: false, notification: false, more: false }
    this.isMainScreen = false;

  }

  onTogglePostEdit(e: Event) {
    e.stopPropagation()
    this.isBtnClicked = {
      search: false,
      create: !this.isBtnClicked.create,
      notification: false,
      more: false
    }

    this.isMainScreen = !this.isMainScreen;

    this.links.forEach(link => {
      link.nativeElement.classList.remove('active')
    })
  }

  onToggleSearch(e: Event) {
    e.stopPropagation()
    this.isBtnClicked = {
      search: !this.isBtnClicked.search,
      create: false,
      notification: false,
      more: false
    }

    this.onToggleBtnClicked(this.isBtnClicked.search)
  }

  onToggleNotifications(e: Event) {
    e.stopPropagation()
    this.isBtnClicked = {
      search: false,
      create: false,
      notification: !this.isBtnClicked.notification,
      more: false
    }

    this.onToggleBtnClicked(this.isBtnClicked.notification)
  }

  onToggleMoreOptionsModal(e: Event) {
    e.stopPropagation()
    this.isBtnClicked = {
      search: false,
      create: false,
      notification: false,
      more: !this.isBtnClicked.more
    }

    this.onToggleBtnClicked(this.isBtnClicked.more)
  }

  onToggleBtnClicked(isBtnClicked: boolean) {

    this.isMainScreen = !this.isMainScreen;

    if (isBtnClicked) {
      this.links.forEach(link => {
        link.nativeElement.classList.remove('active')
      })
    } else {
      this.onCloseModal()
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}