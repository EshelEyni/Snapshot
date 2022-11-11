import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate'
})
export class FormattedDatePipe implements PipeTransform {

  transform(value: number | Date): string {
    // typeof value from local storage = string
    if (typeof value === 'string') value = new Date(value)

    if (typeof value !== 'number') value = value.getTime()
    const formattedTimeStamp = +((Date.now() - value) / 1000).toFixed()
    const minute = 60
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day

    let timeStr!: string
    if (formattedTimeStamp < minute) {
      timeStr = formattedTimeStamp + ' seconds ago'
    }
    if (formattedTimeStamp > minute) {
      timeStr = (formattedTimeStamp / minute).toFixed() + ' minutes ago'
    }
    if (formattedTimeStamp > hour) {
      timeStr = (formattedTimeStamp / hour).toFixed() + ' hours ago'
    }
    if (formattedTimeStamp > day) {
      timeStr = (formattedTimeStamp / day).toFixed() + ' days ago'
    }
    if (formattedTimeStamp > week) {
      timeStr = new Date(value).toLocaleDateString('he-IL')
    }

    return timeStr
  }

}
