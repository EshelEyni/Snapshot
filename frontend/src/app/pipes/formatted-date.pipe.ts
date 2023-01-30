import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate'
})
export class FormattedDatePipe implements PipeTransform {

  transform(value: number | Date, format: 'short' | 'long' = 'long'): string {
    if (!value) return '';
    if (typeof value !== 'number') value = value.getTime();

    const formattedTimestamp = Math.floor(((Date.now() - value) / 1000));
    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    let timeStr!: string
    if (formattedTimestamp < minute) {
      const str = format === 'long' ? ' seconds ago' : 's';
      timeStr = Math.floor(formattedTimestamp / 1000) + str;
    }
    else if (formattedTimestamp < hour) {
      const str = format === 'long' ? ' minutes ago' : 'm';
      timeStr = Math.floor(formattedTimestamp / minute) + str;
    }
    else if (formattedTimestamp < day) {
      const str = format === 'long' ? ' hours ago' : 'h';
      timeStr = Math.floor(formattedTimestamp / hour) + str;
    }
    else if (formattedTimestamp < week) {
      const str = format === 'long' ? ' days ago' : 'd';
      timeStr = Math.floor(formattedTimestamp / day) + str;
    }
    else {
      if (format === 'long') {
        const date = new Date(value);
        const month = date.toLocaleString('default', { month: 'long' });
        timeStr = `${month} ${date.getDate()}, ${date.getFullYear()}`;
      } else {
        timeStr = Math.floor(formattedTimestamp / week) + 'w';
      };
    };
    return timeStr;
  };
};
