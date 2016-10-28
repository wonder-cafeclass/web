import {  Component, OnInit, Input }      from '@angular/core';
import { ImageService }                   from '../../util/image.service';
import { ClockTime }                      from './model/clock-time';

/*
* @ Desc   : 시간을 나타내주는 원형 시계 컴포넌트, 시작 시간과 종료 시간을 작은 List로 나타내주는 시계 리스트를 담고 있는 컨테이너 컴포넌트입니다.
* @ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'clock-digital',
  templateUrl: 'clock-digital.component.html',
  styleUrls: [ 'clock-digital.component.css' ]
})
export class ClockDigitalComponent implements OnInit {

  @Input() clockHeight:number=83;
  @Input() clockTimeBegin:ClockTime;
  @Input() clockTimeEnd:ClockTime;
  @Input() is24:boolean=false;

  rowHeight:number=0;
  rowPadding:number=10;
  elementHeight:number=20;
  textMarginTop:number=0;
  fontSize:number=14;

  constructor(
    public imageService: ImageService
  ) {}

  ngOnInit(): void {

    this.rowHeight = Math.round(this.clockHeight/2);

    this.fontSize = 14;
    if(60 <= this.rowHeight) {
      this.fontSize = 24;
    }

    this.textMarginTop = Math.floor((this.rowHeight - ((this.rowPadding * 2) + this.elementHeight)) / 2);
    if(24 <= this.fontSize) {
      this.textMarginTop = 2;
    }

  }

}