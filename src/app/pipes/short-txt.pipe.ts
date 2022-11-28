import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortTxt'
})
export class ShortTxtPipe implements PipeTransform {

  transform(value: string): string {
    if (value.length > 100) return value.slice(0, 100) + '...';
    return value;
  }

}
