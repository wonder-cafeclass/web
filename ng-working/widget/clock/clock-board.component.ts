import {  Component, OnInit, Input }      from '@angular/core';
import { ImageService }            from '../../util/image.service';
import { ClockComponent }            from './clock.component';
import { ClockDigitalComponent }            from './clock-digital.component';


/*
* @ Desc   : 시간을 나타내주는 원형 시계 컴포넌트, 시작 시간과 종료 시간을 작은 List로 나타내주는 시계 리스트를 담고 있는 컨테이너 컴포넌트입니다.
* @ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'clock-board',
  templateUrl: 'clock-board.component.html',
  styleUrls: [ 'clock-board.component.css' ]
})
export class ClockBoardComponent implements OnInit {

  @Input() klassTimeBegin:string;
  @Input() klassTimeEnd:string;

  @Input() clockHeight:number=83;

  constructor(
    public imageService: ImageService
  ) {}

  ngOnInit(): void {

    // Do something
    console.log("TEST / ClockBoardComponent / this.klassTimeBegin : ",this.klassTimeBegin);
    console.log("TEST / ClockBoardComponent / this.klassTimeEnd : ",this.klassTimeEnd);
  }


}