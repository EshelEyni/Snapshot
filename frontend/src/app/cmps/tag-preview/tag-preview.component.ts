import { User } from './../../models/user.model';
import { map, Subscription, Observable } from 'rxjs';
import { State } from './../../store/store';
import { Tag } from '../../models/tag.model';
import { Component, OnInit, QueryList, ViewChildren, inject, OnDestroy } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tag-preview',
  templateUrl: './tag-preview.component.html',
  styleUrls: ['./tag-preview.component.scss'],
  inputs: ['tag']
})
export class TagPreviewComponent implements OnInit, OnDestroy {
  @ViewChildren('svgIcon') icons!: QueryList<SvgIconComponent>;

  constructor() {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }
  store = inject(Store<State>);

  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;

  tag!: Tag;
  iconColor: string = 'var(--tertiary-color)';


  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = { ...user };

        setTimeout(() => {
          this.setIconColor();
        }, 0);
      };
    }); 
  };

  setIconColor() {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)';
    this.icons.forEach(icon => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor };
    });
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };
};