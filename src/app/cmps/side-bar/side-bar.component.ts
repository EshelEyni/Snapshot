import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { UserService } from './../../services/user.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, ElementRef, QueryList, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})

export class SideBarComponent implements OnInit, OnChanges {

  constructor(
    private router: Router,
    private userService: UserService,
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  @ViewChildren('link') links!: QueryList<ElementRef>;
  @Output() togglePostEdit = new EventEmitter<boolean>()
  @Input() isPostEdit!: boolean
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  userImgUrl: string = this.userService.getDefaultUserImgUrl()
  profileUrl: string = ''
  isBtnClicked = { search: false, create: false, notifications: false }
  isMainScreen: boolean = false;
  sub: Subscription | null = null;


  async ngOnInit(): Promise<void> {
    this.isBtnClicked.create = this.isPostEdit
    this.getUserUrls()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isBtnClicked.create = this.isPostEdit
  }

  getUserUrls() {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
        this.userImgUrl = this.loggedinUser.imgUrl || this.userService.getDefaultUserImgUrl()
        this.profileUrl = '/profile/' + this.loggedinUser.id
      }
    })

  }

  get isLoginSignupPath() {
    return !(this.router.url === '/login' || this.router.url === '/signup')
  }

  onToggleModal() {
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
      case this.profileUrl:
        this.links.get(3)?.nativeElement.classList.add('active')
        break;
    }
    this.isBtnClicked = { search: false, create: false, notifications: false }
    this.isMainScreen = false;

  }

  onTogglePostEdit() {
    console.log('onTogglePostEdit');
    this.isBtnClicked.create = true
    this.togglePostEdit.emit(true)
  }

  onToggleSearch() {
    this.isBtnClicked.search = !this.isBtnClicked.search
    this.isMainScreen = !this.isMainScreen;
    this.links.forEach(link => {
      link.nativeElement.classList.remove('active')
    })
  }

  onToggleNotifications() {
    this.isBtnClicked.notifications = !this.isBtnClicked.notifications
    this.isMainScreen = !this.isMainScreen;
    this.links.forEach(link => {
      link.nativeElement.classList.remove('active')
    })
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}