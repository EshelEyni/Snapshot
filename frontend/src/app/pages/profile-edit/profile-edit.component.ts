import { SaveUser } from './../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UploadImgService } from './../../services/upload-img.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private uploadImgService: UploadImgService,
    private store: Store<State>,
    private communicationService: CommunicationService
  ) {
    this.form = this.fb.group({
      username: [''],
      fullname: [''],
      password: [''],
      newPassword: [''],
      confirmPassword: [''],
      website: [''],
      bio: [''],
      email: [''],
      phone: [''],
      gender: ['']
    });
  };

  @ViewChild('file') file!: any;
  form!: FormGroup;

  paramsSubscription!: Subscription;
  user!: User;

  userImgUrl: string = this.userService.getDefaultUserImgUrl();

  isImgSettingModalOpen: boolean = false;
  isUploading: boolean = false;

  ngOnInit(): void {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const user = data['user'];

      if (user) {
        this.user = user;
        this.userImgUrl = this.user.imgUrl;
        this.form.patchValue(user);
      };
    });
  };

  onToggleModal(): void {
    this.isImgSettingModalOpen = !this.isImgSettingModalOpen;
  };

  onChangeImg(): void {
    if (this.user.imgUrl === this.userService.getDefaultUserImgUrl()) {
      this.file.nativeElement.click();
    }
    else {
      this.isImgSettingModalOpen = true;
    };
  };

  async onImgSelected(ev: any): Promise<void> {
    this.isImgSettingModalOpen = false;
    this.isUploading = true;
    const img = ev.target.files[0];
    const url = await this.uploadImgService.uploadImg(img);
    if(!url) return;
    const user = { ...this.user, imgUrl: url };
    this.userImgUrl = url;
    await this.store.dispatch(new SaveUser(user));
    this.isUploading = false;
    this.communicationService.setUserMsg('Profile photo added.');
  };

  async onRemoveImg(): Promise<void> {
    const user = { ...this.user, imgUrl: this.userService.getDefaultUserImgUrl() };
    this.userImgUrl = this.userService.getDefaultUserImgUrl();
    await this.store.dispatch(new SaveUser(user));
    this.isImgSettingModalOpen = false;
    this.communicationService.setUserMsg('Profile photo removed.');
  };

  async onSubmit(): Promise<void> {
    const { username, fullname, password, newPassword, confirmPassword, website, bio, email, phone, gender } = this.form.value;

    if (newPassword && newPassword !== confirmPassword) {
      this.communicationService.userMsgEmitter.emit('Passwords do not match.');
      return;
    }

    if (newPassword) {
      const hashedPassword = await this.userService.checkPassword(newPassword, password);
      if (!hashedPassword) {
        this.communicationService.userMsgEmitter.emit('Password is incorrect.');
        return;
      }
      else {
        this.user.password = hashedPassword;
      };
    };

    if (this.user.username !== username) {
      const isUsernameTaken = await this.userService.checkIfUsernameTaken(username);
      if (isUsernameTaken) {
        this.communicationService.userMsgEmitter.emit('Username is taken.');
        return;
      };
    };

    const user = { ...this.user, username, fullname, website, bio, email, phone, gender };
    this.form.patchValue(user);
    await this.store.dispatch(new SaveUser(user));
    this.communicationService.userMsgEmitter.emit('Profile saved.');
  };

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  };
};