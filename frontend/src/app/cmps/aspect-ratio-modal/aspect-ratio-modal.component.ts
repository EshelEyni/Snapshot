import { Component, OnInit, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'aspect-ratio-modal',
  templateUrl: './aspect-ratio-modal.component.html',
  styleUrls: ['./aspect-ratio-modal.component.scss'],
  inputs: ['currAspectRatio'],
  outputs: ['aspectRatioSelected']

})
export class AspectRatioModalComponent implements OnInit, OnChanges {

  constructor() { }
  aspectRatioSelected = new EventEmitter<string>();
  currAspectRatio!: string;

  btns = [
    {
      aspectRatio: 'Original',
      isActive: false,
      text: 'Original',
      icon: '../../../assets/svgs/image.svg'
    },
    {
      aspectRatio: '1:1',
      isActive: false,
      text: '1:1',
      icon: '../../../assets/svgs/aspect-ratio-1-1.svg'
    },
    {
      aspectRatio: '4:5',
      isActive: false,
      text: '4:5',
      icon: '../../../assets/svgs/aspect-ratio-4-3.svg'
    },
    {
      aspectRatio: '16:9',
      isActive: false,
      text: '16:9',
      icon: '../../../assets/svgs/aspect-ratio-16-9.svg'
    },
  ]

  ngOnInit(): void { }

  ngOnChanges() {
    this.btns.forEach(btn => {
      if (btn.aspectRatio === this.currAspectRatio) btn.isActive = true;
      else btn.isActive = false;
    })
  }

  onSetAspectRatio(aspectRatio: string) {
    this.btns.forEach(btn => {
      if (btn.aspectRatio === aspectRatio) btn.isActive = true;
      else btn.isActive = false;
    })
    this.aspectRatioSelected.emit(aspectRatio);
  }

}
