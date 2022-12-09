import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isPostEdit: boolean = false;
 
  onTogglePostEdit(isPostEdit: boolean) {
    this.isPostEdit = isPostEdit;
  }
}
