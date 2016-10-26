import {  Component, OnInit, Input }      from '@angular/core';
import { ImageService }                   from '../../util/image.service';

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

  @Input() klassTimeBegin:string;
  @Input() klassTimeEnd:string;

  constructor(
    public imageService: ImageService
  ) {}

  ngOnInit(): void {

    // Do something

    // 24h

    // 12h

    // 모드 변경 될 수 있도록!

  }


}