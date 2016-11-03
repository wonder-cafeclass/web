import { Component, OnInit, Input }   from '@angular/core';
import { RadioBtnOption } from '../radiobtn/model/radiobtn-option';

@Component({
  moduleId: module.id,
  selector: 'nav-tabs',
  templateUrl: 'nav-tabs.component.html',
  styleUrls: [ 'nav-tabs.component.css' ]
})
export class NavTabsComponent implements OnInit {

  @Input() radiobtnList:RadioBtnOption[];
  @Input() fontSizeTitle:number=12;
  @Input() paddingTopTitle:number=10;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() topLeftImageUrl:string;

  @Input() colorTitleFocus:string;
  @Input() colorTitleBlur:string;

  @Input() colorBGFocus:string;
  @Input() colorBGBlur:string;

  @Input() colorBorder:string;

  constructor() {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    } // end if
  }

}