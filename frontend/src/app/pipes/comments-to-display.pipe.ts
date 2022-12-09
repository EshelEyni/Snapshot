import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commentsToDisplay'
})
export class CommentsToDisplayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
