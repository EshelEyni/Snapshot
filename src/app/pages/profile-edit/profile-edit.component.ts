import { SaveUser } from './../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { UploadImgService } from './../../services/upload-img.service';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private uploadImgService: UploadImgService,
    private store: Store<State>

  ) {
    this.form = this.fb.group({
      username: [''],
      fullname: [''],
      password: [''],
      website: [''],
      bio: [''],
      email: [''],
      phone: [''],
      gender: ['']
    })
  }

  form!: FormGroup
  paramsSubscription!: Subscription;
  user!: User;
  userMsg: string = 'aaaaaa';
  userImgUrl: string = this.userService.getDefaultUserImgUrl()
  isImgSettingModalOpen = true


  ngOnInit(): void {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const user = data['user']
      if (user) {
        this.user = user
        this.userImgUrl = this.user.imgUrl
        this.form.patchValue(user)
      }
    })
  }

  onToggleModal() {
    this.isImgSettingModalOpen = !this.isImgSettingModalOpen
  }

  async onImgChange(ev: any) {
    const img = ev.target.files[0]
    const url = await this.uploadImgService.uploadImg(img)
    this.user.imgUrl = url
    this.userImgUrl = url
    await this.store.dispatch(new SaveUser(this.user))
    this.isImgSettingModalOpen = false
    this.userMsg = 'Profile photo added.'
  }

  async onRemoveImg() {
    this.user.imgUrl = ''
    this.userImgUrl = this.userService.getDefaultUserImgUrl()
    await this.store.dispatch(new SaveUser(this.user))
    this.isImgSettingModalOpen = false
    this.userMsg = 'Profile photo removed.'
  }
  
  async onSubmit() {
    const { username, fullname, password, website, bio, email, phone, gender } = this.form.value
    const user = { ...this.user, username, fullname, password, website, bio, email, phone, gender }
    console.log(user)
    await this.store.dispatch(new SaveUser(user))
    this.userMsg = 'Profile saved.'
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe()
  }

}
