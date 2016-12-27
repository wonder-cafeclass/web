import { 
         Component, 
         ViewChild,
         OnInit, 
         Input } from '@angular/core';

import { ClockComponent }            from './clock.component';
import { ClockDigitalComponent }     from './clock-digital.component';


import { ImageService }              from '../../util/image.service';
import { HelperMyTime }              from '../../util/helper/my-time';
import { MyClockTime }               from '../../util/model/my-clock-time';

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
  @Input() clockWidth:number=-1;
  @Input() simpleClockHeight:number=82;
  @Input() clockDigitalHeight:number=83;

  clockTimeBegin:MyClockTime;
  clockTimeEnd:MyClockTime;
  dcLeftMargin:number=10;
  clockDigitalWidthStr:string;
  private myTime:HelperMyTime;

  @ViewChild(ClockComponent)
  private clockComponent: ClockComponent;
  @ViewChild(ClockDigitalComponent)
  private clockDigitalComponent: ClockDigitalComponent;


  constructor(
    public imageService: ImageService
  ) {

    this.myTime = new HelperMyTime();

  }

  ngOnInit(): void {

    // Do something

    if(this.isNotSafeTimeRange(this.klassTimeBegin, this.klassTimeEnd)) {
      return;
    } // end if

    this.clockTimeBegin = this.myTime.getClockTime(this.klassTimeBegin);
    this.clockTimeEnd = this.myTime.getClockTime(this.klassTimeEnd);

    this.dcLeftMargin = Math.round(this.clockHeight/2);

    this.simpleClockHeight = this.clockHeight - 1;
    this.clockDigitalHeight = this.clockHeight;
    let clockDigitalWidth = this.clockWidth - Math.round(this.clockHeight/2);

    if(0 < this.clockWidth) {
      this.clockDigitalWidthStr=`${clockDigitalWidth}px`;
    } else {
      this.clockDigitalWidthStr="100%";
    } // end if

  } // end method

  private isNotSafeTimeRange(hhmmBegin:string, hhmmEnd:string) :boolean {
    return !this.isSafeTimeRange(hhmmBegin, hhmmEnd);
  } // end method

  private isSafeTimeRange(hhmmBegin:string, hhmmEnd:string) :boolean {

    if(this.myTime.isNotHHMM(hhmmBegin)) {
      return false;
    }
    if(this.myTime.isNotHHMM(hhmmEnd)) {
      return false;
    }
    let diffMinutes:number = this.myTime.getDiffMinutesHHMM(hhmmBegin, hhmmEnd);

    // 최대 표현할 수 있는 시간 범위인지 확인한다.
    // 1hr/1hr 30mins/2hr/2hr 30mins/3hr
    if(!(60 <= diffMinutes && diffMinutes <= 180)) {
      return false;
    }

    let clockTimeBegin:MyClockTime = this.myTime.getClockTime(hhmmBegin);
    if(null == clockTimeBegin) {
      return false;
    }
    let clockTimeEnd:MyClockTime = this.myTime.getClockTime(hhmmEnd);
    if(null == clockTimeEnd) {
      return false;
    }

    return true;
  } // end method

  setClockTimeBeginEnd(hhmmBegin:string, hhmmEnd:string):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("clock-board / setClockTimeBeginEnd / init");

    if(this.myTime.isNotHHMM(hhmmBegin)) {
      if(isDebug) console.log("clock-board / setClockTimeBeginEnd / 중단 / this.myTime.isNotHHMM(hhmmBegin)");
      return;
    }
    if(this.myTime.isNotHHMM(hhmmEnd)) {
      if(isDebug) console.log("clock-board / setClockTimeBeginEnd / 중단 / this.myTime.isNotHHMM(hhmmEnd)");
      return;
    }
    if(this.isNotSafeTimeRange(hhmmBegin, hhmmEnd)) {
      return;
    }

    let clockTimeBegin:MyClockTime = this.myTime.getClockTime(hhmmBegin);
    let clockTimeEnd:MyClockTime = this.myTime.getClockTime(hhmmEnd);

    if(isDebug) console.log("clock-board / setClockTimeBeginEnd / clockTimeBegin : ",clockTimeBegin);
    if(isDebug) console.log("clock-board / setClockTimeBeginEnd / clockTimeEnd : ",clockTimeEnd);

    if(null == clockTimeBegin || null == clockTimeEnd) {
      return;
    }

    this.clockTimeBegin = clockTimeBegin;
    this.clockTimeEnd = clockTimeEnd;

    if(null != this.clockComponent) {
      this.clockComponent.show(this.clockTimeBegin, this.clockTimeEnd);
    }

  } // end method


}