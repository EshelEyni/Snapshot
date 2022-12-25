import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'post-filter-picker',
  templateUrl: './post-filter-picker.component.html',
  styleUrls: ['./post-filter-picker.component.scss'],
  outputs: ['filterSelected']
})
export class PostFilterPickerComponent implements OnInit {

  constructor() { }

  filterSelected = new EventEmitter<string>();

  filters = [
    { name: 'Original', value: 'normal', imgUrl: '../../../assets/imgs/filter-img/Normal.jpg', isSelected: true },
    { name: 'Clarendon', value: 'clarendon', imgUrl: '../../../assets/imgs/filter-img/Clarendon.jpg', isSelected: false },
    { name: 'Gingham', value: 'gingham', imgUrl: '../../../assets/imgs/filter-img/Gingham.jpg', isSelected: false },
    { name: 'Moon', value: 'moon', imgUrl: '../../../assets/imgs/filter-img/Moon.jpg', isSelected: false },
    { name: 'Lark', value: 'lark', imgUrl: '../../../assets/imgs/filter-img/Lark.jpg', isSelected: false },
    { name: 'Reyes', value: 'reyes', imgUrl: '../../../assets/imgs/filter-img/Reyes.jpg', isSelected: false },
    { name: 'Juno', value: 'juno', imgUrl: '../../../assets/imgs/filter-img/Juno.jpg', isSelected: false },
    { name: 'Slumber', value: 'slumber', imgUrl: '../../../assets/imgs/filter-img/Slumber.jpg', isSelected: false },
    { name: 'Crema', value: 'crema', imgUrl: '../../../assets/imgs/filter-img/Crema.jpg', isSelected: false },
  ]

  ngOnInit(): void {
  }

  onSelectFilter(filter: any) {
    this.filters.forEach(f => f.isSelected = false)
    filter.isSelected = true

    this.filterSelected.emit(filter.value)
  }
}
