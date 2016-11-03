import { Component, OnInit, Input }   from '@angular/core';
import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';
import { KlassColorService } from './service/klass-color.service'

@Component({
  moduleId: module.id,
  selector: 'klass-detail-nav-list',
  templateUrl: 'klass-detail-nav-list.component.html',
  styleUrls: [ 'klass-detail-nav-list.component.css' ]
})
export class KlassDetailNavListComponent implements OnInit {

  @Input() radiobtnOptionListNavTabs:RadioBtnOption[];
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  colorWhite:string;
  colorOrange:string;
  colorGray:string;

  constructor(private klassColorService:KlassColorService) {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    } // end if

    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;
  }

}