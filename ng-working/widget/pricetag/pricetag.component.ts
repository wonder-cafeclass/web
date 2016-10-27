import { Component, OnInit, Input }   from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'pricetag-updown',
  templateUrl: 'pricetag.component.html',
  styleUrls: [ 'pricetag.component.css' ]
})
export class PriceTagComponent implements OnInit {

  @Input() title:string;
  @Input() price:number;
  @Input() currency:string;
  @Input() color:string;

  priceWithFormat:string;
  fontSizePrice:number=16;

  constructor() {}

  ngOnInit(): void {
    this.priceWithFormat = this.numberWithCommas(this.price);
    // 최대 백만원 단위까지 나타낼 수 있도록 폰트 사이즈를 조정.
    if(1000000 < this.price) {
       this.fontSizePrice=14;
    }
  }

  private numberWithCommas(x) :string{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}