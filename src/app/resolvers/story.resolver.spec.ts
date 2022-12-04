import { TestBed } from '@angular/core/testing';

import { StoryResolver } from './story.resolver';

describe('StoryResolver', () => {
  let resolver: StoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
