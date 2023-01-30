import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mention'
})
export class MentionPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string | void | SafeHtml, commentMentions: { userId: number, username: string }[] | undefined): string | void | SafeHtml {
    if (!value && commentMentions !== undefined) return;
    if (typeof value !== 'string') return value;
    const DOMPurify = require('dompurify');
    const regex = /@(\w+)/g;
    const mentions: SafeHtml[] = [];
    if (commentMentions) {
      for (let i = 0; i < commentMentions.length; i++) {
        mentions[i] = `<a href="#/profile/${commentMentions[i].userId}">@${commentMentions[i].username}</a>`;
      };
    };
    let modifiedValue = value.replace(regex, (match) => mentions.shift() as string);
    modifiedValue = DOMPurify.sanitize(modifiedValue);
    return this.sanitizer.bypassSecurityTrustHtml(modifiedValue);
  };
};