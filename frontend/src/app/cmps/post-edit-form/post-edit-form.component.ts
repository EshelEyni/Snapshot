import { LocationService } from './../../services/location.service';
import { MiniUser } from './../../models/user.model';
import { lastValueFrom } from 'rxjs';
import { Location } from './../../models/post.model';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'

@Component({
  selector: 'post-edit-form',
  templateUrl: './post-edit-form.component.html',
  styleUrls: ['./post-edit-form.component.scss'],
  inputs: ['txt', 'location', 'loggedinUser'],
  outputs: ['postChanged']
})
export class PostEditFormComponent implements OnInit {

  constructor() { }
  userService = inject(UserService)
  locationService = inject(LocationService)

  txt!: string;
  location!: Location;
  loggedinUser!: MiniUser;
  postChanged = new EventEmitter<{ txt: string, location: Location }>()

  isEmojiPickerShown: boolean = false
  isMainScreenShown: boolean = false
  isLocationModalShown: boolean = false
  faFaceSmile = faFaceSmile

  locations!: Location[];

  ngOnInit(): void {

  }

  onChangeTxt() {
    if (!this.location.name) this.isLocationModalShown = false
    this.postChanged.emit({ txt: this.txt, location: this.location })
  }

  async onChangeLocation() {
    const res = await this.locationService.getLocations(this.location.name);
    if (res) {
      this.locations = res;
      this.isLocationModalShown = true
      this.isMainScreenShown = true
    }
    this.postChanged.emit({ txt: this.txt, location: this.location })

  }

  onToggleModal(modalName: string) {
    switch (modalName) {
      case 'emoji':
        this.isEmojiPickerShown = !this.isEmojiPickerShown;
        break;
      case 'location':
        this.isLocationModalShown = !this.isLocationModalShown;
        break;
      case 'main-screen':
        if (this.isEmojiPickerShown) this.isEmojiPickerShown = !this.isEmojiPickerShown
        if (this.isLocationModalShown) this.isLocationModalShown = !this.isLocationModalShown
        break;
    }

    this.isMainScreenShown = !this.isMainScreenShown
  }

  onAddEmoji(emoji: any) {
    if (typeof emoji.emoji !== 'string') this.txt += emoji.emoji.native
    else this.txt += emoji.emoji
    this.postChanged.emit({ txt: this.txt, location: this.location })

  }

  onSelectLocation(location: Location) {
    this.location = location
    this.isLocationModalShown = false
    this.isMainScreenShown = false
    this.postChanged.emit({ txt: this.txt, location: this.location })
  }
}
