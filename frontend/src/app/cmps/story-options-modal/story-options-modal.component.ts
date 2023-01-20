import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Story } from 'src/app/models/story.model';
import { Component, OnInit, EventEmitter, inject } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'story-options-modal',
  templateUrl: './story-options-modal.component.html',
  styleUrls: ['./story-options-modal.component.scss'],
  inputs: ['story', 'loggedinUser'],
  outputs: ['closeModal'],
})
export class StoryOptionsModalComponent implements OnInit {

  constructor() { }

  storyService = inject(StoryService);
  userService = inject(UserService);
  router = inject(Router);
  closeModal = new EventEmitter();
  story!: Story;
  loggedinUser!: User;
  isConfirmDeleteMsgShown: boolean = false;

  ngOnInit(): void {
  }

  onToggleConfirmDelete() {
    this.isConfirmDeleteMsgShown = !this.isConfirmDeleteMsgShown;
  }

  async onDeleteStory() {
    const res = await this.storyService.remove(this.story.id);
    const user = { ...this.loggedinUser };
    user.storySum--;
    const updatedUser = await lastValueFrom(this.userService.update(user));
    if (res && updatedUser) this.router.navigate(['/']);
  }

  onRemoveStoryFromProfile() {

    const story = {...this.story};
    story.isSaved = false;
    story.highlightTitle = '';
    story.highlightCover = 0;
    
    this.storyService.save(story);
    this.closeModal.emit();
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}
