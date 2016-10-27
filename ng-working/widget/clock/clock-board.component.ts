import { Component, OnInit, Input } from '@angular/core';
import { ImageService }              from '../../util/image.service';

import { ClockComponent }            from './clock.component';
import { ClockDigitalComponent }     from './clock-digital.component';
import { ClockTime }                 from './model/clock-time';

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


  clockTimeBegin:ClockTime;
  clockTimeEnd:ClockTime;
  dcLeftMargin:number=10;

  constructor(
    public imageService: ImageService
  ) {}

  ngOnInit(): void {

    // Do something
    this.clockTimeBegin = this.getClockTime(this.klassTimeBegin);
    this.clockTimeEnd = this.getClockTime(this.klassTimeEnd);

    this.dcLeftMargin = Math.round(this.clockHeight/2);
  }

  getClockTime(time_hh_mm:string): any {

    if(null === time_hh_mm || "" === time_hh_mm) {
      return null;
    }

    // 0. 유효한 시간값인지 검사합니다.
    // ex) 07:30, 08:00 처럼 30분 단위만 허용합니다.
    // 23:00 ~ 25:00 처럼 순방향 진행은 24시를 넘는 표현도 허용합니다.
    // 23:00 ~ 01:00 는 오류로 처리합니다.
    let res = time_hh_mm.match(/^([0-9]|0[0-9]|1[0-9]|2[0-6]):(0|3)0$/gi);
    if(null === res || !(0 < res.length)) {
      console.log("유효한 시간 값이 아닙니다.",time_hh_mm);
      return null;
    }

    // 1. ex) 16:00 24시간 형태로 인자를 받습니다.
    let time_hh_mm_fragments = time_hh_mm.split(":");
    let hoursStr = time_hh_mm_fragments[0];
    let hours = parseInt(hoursStr);
    let minutesStr = time_hh_mm_fragments[1];
    let minutes = parseInt(minutesStr);
    let totalMinutes = 60 * hours +  minutes;
    let hoursForRotate = hours;
    let isAM = true;
    let time_hh_mm_24 = time_hh_mm;
    let time_hh_mm_12 = `오전 ${hoursStr}:${minutesStr}`;
    if(12 <= hoursForRotate) {
      hoursForRotate -= 12;

      let hoursIn12:string = ""+hoursForRotate;
      if(hoursForRotate < 10) {
        hoursIn12 = `0${hoursForRotate}`;
      } 
      time_hh_mm_12 = `오후 ${hoursIn12}:${minutesStr}`;
      isAM = false;
    }

    let clockTimeObj:ClockTime = new ClockTime();
    clockTimeObj.time_hh_mm = time_hh_mm;
    clockTimeObj.hours = hours;
    clockTimeObj.minutes = minutes;
    clockTimeObj.totalMinutes = totalMinutes;
    clockTimeObj.hoursForRotate = hoursForRotate;
    clockTimeObj.isAM = isAM;
    clockTimeObj.time_hh_mm_24 = time_hh_mm_24;
    clockTimeObj.time_hh_mm_12 = time_hh_mm_12;

    return clockTimeObj;
  }  


}