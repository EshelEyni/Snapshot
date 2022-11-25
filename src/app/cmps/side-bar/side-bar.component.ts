import { UserState } from './../../store/reducers/user.reducer';
import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { UserService } from './../../services/user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { Observable, lastValueFrom } from 'rxjs';
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
  userImgUrl: string = ''
  profileUrl: string = ''
  isBtnClicked = { search: false, create: false }


  async ngOnInit(): Promise<void> {
    this.isBtnClicked.create = this.isPostEdit
    const loggedinUser = this.userService.getLoggedinUser()

    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }
    this.getUserUrls()
  }

  getUserUrls() {
    this.userImgUrl = this.userService.getBlankUserImgUrl()
    if (this.loggedinUser$) {
      this.loggedinUser$.subscribe(user => {
        if (user) {
          this.userImgUrl = user.imgUrl || this.userService.getBlankUserImgUrl()
          this.profileUrl = '/profile/' + user.id
        }
      })
    }
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
}