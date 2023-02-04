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

  faX = faX;

  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;

  isBtnClicked = { search: false, create: false, notification: false, more: false }
  isMainScreen: boolean = false;

  iconColor: string = 'var(--tertiary-color)';

  async ngOnInit(): Promise<void> {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user };
        setTimeout(() => {
          this.setIconColor();
        }, 0);
      };
    });
  };

  setIconColor(): void {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)';
    this.icons.forEach(icon => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor };
    });
  };

  get isLoginSignupPath(): boolean {
    return !(this.router.url === '/login' || this.router.url === '/signup');
  };

  onModalContainerClick(e: Event): void {
    e.stopPropagation();
  };

  onCloseModal(): void {
    if (!this.isMainScreen) return;

    switch (this.router.url) {
      case '/':
        this.links.get(0)?.nativeElement.classList.add('active');
        break;
      case '/explore':
        this.links.get(1)?.nativeElement.classList.add('active');
        break;
      case '/inbox':
        this.links.get(2)?.nativeElement.classList.add('active');
        break;
      case `/profile/${this.loggedinUser.id}`:
        this.links.get(3)?.nativeElement.classList.add('active');
        break;
    };

    this.isBtnClicked = { search: false, create: false, notification: false, more: false };
    this.isMainScreen = false;
  };

  onTogglePostEdit(e: Event): void {
    e?.stopPropagation();
    if (window.innerWidth < 1260) {
      this.router.navigate(['/post-edit']);
    } else {

      this.isBtnClicked = {
        search: false,
        create: !this.isBtnClicked.create,
        notification: false,
        more: false
      };

      this.isMainScreen = !this.isMainScreen;

      this.links.forEach(link => {
        link.nativeElement.classList.remove('active');
      });
    };
  };

  onToggleSearch(e: Event): void {
    e.stopPropagation();
    this.isBtnClicked = {
      search: !this.isBtnClicked.search,
      create: false,
      notification: false,
      more: false
    };

    this.onToggleBtnClicked(this.isBtnClicked.search);
  };

  onToggleNotifications(e: Event): void {
    e.stopPropagation();
    this.isBtnClicked = {
      search: false,
      create: false,
      notification: !this.isBtnClicked.notification,
      more: false
    };

    this.onToggleBtnClicked(this.isBtnClicked.notification);
  };

  onToggleMoreOptionsModal(e: Event): void {
    e.stopPropagation();
    this.isBtnClicked = {
      search: false,
      create: false,
      notification: false,
      more: !this.isBtnClicked.more
    };

    this.onToggleBtnClicked(this.isBtnClicked.more);
  };

  onToggleBtnClicked(isBtnClicked: boolean): void {

    this.isMainScreen = !this.isMainScreen;

    if (isBtnClicked) {
      this.links.forEach(link => {
        link.nativeElement.classList.remove('active');
      });
    } else {
      this.onCloseModal();
    };
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };
};