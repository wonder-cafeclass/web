import { Component, OnInit, Input }   from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'butterfly',
  templateUrl: 'butterfly.component.html',
  styleUrls: [ 'butterfly.component.css' ]
})
export class ButterflyComponent implements OnInit {

  @Input() title:string;
  @Input() text:string;
  @Input() fontSizeTitle:number=12;
  @Input() paddingTitle:number=10;
  @Input() fontSizeText:number=12;
  @Input() paddingText:number=10;
  @Input() cageWidth:number=150;
  @Input() color:string;

  priceWithFormat:string;

  constructor() {}

  ngOnInit(): void {
    // Do something.
  }

}