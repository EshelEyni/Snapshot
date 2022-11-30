import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[sideBarIcon]'
})
export class SideBarIconDirective {

  constructor(private el: ElementRef) { }

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.classList.add('active')
  }

  @HostListener('blur')
  onBlur() {
    // this.el.nativeElement.classList.remove('active')
  }
}