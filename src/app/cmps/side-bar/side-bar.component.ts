import { UserState } from './../../store/reducers/user.reducer';
import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { UserService } from './../../services/user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

export class SideBarComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  @Output() togglePostEdit = new EventEmitter<boolean>()
  @Input() isPostEdit!: boolean
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  userImgUrl: string = this.userService.getDefaultUserImgUrl()
  profileUrl: string = ''
  isBtnClicked = { search: false, create: false, notifications: false }
  sub: Subscription | null = null;


  async ngOnInit(): Promise<void> {
    this.isBtnClicked.create = this.isPostEdit
    const loggedinUser = this.userService.getLoggedinUser()

    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }
    this.getUserUrls()
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

  onTogglePostEdit() {
    this.isBtnClicked.create = true
    this.togglePostEdit.emit(true)
  }

  onToggleSearch() {
    this.isBtnClicked.search = !this.isBtnClicked.search
  }

  onToggleNotifications() {
    this.isBtnClicked.notifications = !this.isBtnClicked.notifications
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}