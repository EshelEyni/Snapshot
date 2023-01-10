import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate'
})
export class FormattedDatePipe implements PipeTransform {

  transform(value: number | Date, format: 'short' | 'long' = 'long'): string {
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
      const str = format === 'long' ? ' seconds ago' : 's'
      timeStr = formattedTimeStamp + str
    }
    if (formattedTimeStamp > minute) {
      const str = format === 'long' ? ' minutes ago' : 'm'
      timeStr = (formattedTimeStamp / minute).toFixed() + str
    }
    if (formattedTimeStamp > hour) {
      const str = format === 'long' ? ' hours ago' : 'h'
      timeStr = (formattedTimeStamp / hour).toFixed() + str
    }
    if (formattedTimeStamp > day) {
      const str = format === 'long' ? ' days ago' : 'd'
      timeStr = (formattedTimeStamp / day).toFixed() + str
    }
    if (formattedTimeStamp > week) {
      if (format === 'long') {
        const date = new Date(value)
        const month = date.toLocaleString('default', { month: 'long' })
        timeStr = `${month} ${date.getDate()}, ${date.getFullYear()}`
      } else {
        timeStr = (formattedTimeStamp / week).toFixed() + 'w'
      }
    }

    return timeStr
  }

}
