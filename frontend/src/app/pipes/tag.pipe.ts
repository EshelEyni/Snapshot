import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'tag'
})
export class TagPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }


  transform(value: string): string | void | SafeHtml {
    if (!value) return;
    const regex = /#(\w+)/g;
    const hashtags = value.match(regex);
    if (!hashtags) return value;

    for (let i = 0; i < hashtags.length; i++) {
      hashtags[i] = `<a href="#/tag/${hashtags[i].slice(1)}">${hashtags[i]}</a>`
    }

    return this.sanitizer.bypassSecurityTrustHtml(value.replace(regex, (match) => hashtags.shift() as string));
  }
}
