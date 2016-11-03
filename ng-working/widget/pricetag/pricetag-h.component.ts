import { Component, OnInit, Input }   from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'pricetag-h',
  templateUrl: 'pricetag-h.component.html',
  styleUrls: [ 'pricetag-h.component.css' ]
})
export class PriceTagHComponent implements OnInit {

  @Input() title:string;
  @Input() fontSizeTitle:number=12;
  @Input() paddingTitle:number=10;

  @Input() desc:string;
  @Input() fontSizeDesc:number=12;
  @Input() paddingDesc:number=10;

  @Input() price:number;
  @Input() fontSizePrice:number=12;
  @Input() paddingTopPrice:number=10;

  @Input() cageWidth:number=-1;
  cageWidthStr:string="";
  @Input() currency:string;
  @Input() color:string;

  priceWithFormat:string;

  constructor() {}

  ngOnInit(): void {
    this.priceWithFormat = this.numberWithCommas(this.price);

    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

  }

  private numberWithCommas(x) :string{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}