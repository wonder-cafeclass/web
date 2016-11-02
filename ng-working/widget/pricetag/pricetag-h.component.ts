import { Component, OnInit, Input }   from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'pricetag-h',
  templateUrl: 'pricetag-h.component.html',
  styleUrls: [ 'pricetag-h.component.css' ]
})
export class PriceTagHComponent implements OnInit {

  @Input() title:string;
  @Input() price:number;
  @Input() fontSizeTitle:number=12;
  @Input() paddingTopTitle:number=10;
  @Input() fontSizePrice:number=12;
  @Input() paddingTopPrice:number=10;
  @Input() cageWidth:number=150;
  @Input() currency:string;
  @Input() color:string;

  priceWithFormat:string;

  constructor() {}

  ngOnInit(): void {
    this.priceWithFormat = this.numberWithCommas(this.price);
  }

  private numberWithCommas(x) :string{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}