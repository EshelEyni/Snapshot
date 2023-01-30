import { CommunicationService } from 'src/app/services/communication.service';
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

  constructor() { };

  communicationService = inject(CommunicationService);
  storyService = inject(StoryService);
  userService = inject(UserService);
  router = inject(Router);

  story!: Story;
  loggedinUser!: User;
  isConfirmDeleteMsgShown: boolean = false;

  closeModal = new EventEmitter();

  ngOnInit(): void { };

  onToggleConfirmDelete(): void {
    this.isConfirmDeleteMsgShown = !this.isConfirmDeleteMsgShown;
  };

  async onDeleteStory(): Promise<void> {
    const res = await this.storyService.remove(this.story.id);
    const user = { ...this.loggedinUser };
    user.storySum--;
    const updatedUser = await lastValueFrom(this.userService.update(user));
    if (res && updatedUser) {
      this.communicationService.setUserMsg('Story Deleted.');
      this.router.navigate(['/']);
    };
  };

  async onRemoveStoryFromProfile(): Promise<void> {
    const story = { ...this.story };
    story.isSaved = false;
    story.highlightTitle = '';
    story.highlightCover = 0;
    await this.storyService.save(story);
    this.communicationService.setUserMsg('Story removed from profile.')
    this.closeModal.emit();
  };

  onCloseModal(): void {
    this.closeModal.emit();
  };
};