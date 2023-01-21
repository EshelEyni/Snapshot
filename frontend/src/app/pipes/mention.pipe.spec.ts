import { MentionPipe } from './mention.pipe';

describe('MentionPipe', () => {
  it('create an instance', () => {
    const pipe = new MentionPipe();
    expect(pipe).toBeTruthy();
  });
});
