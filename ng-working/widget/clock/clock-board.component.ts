import { Component, 
         ViewChild,
         Output,
         EventEmitter,
         OnInit, 
         Input } from '@angular/core';

import { ClockComponent }            from './clock.component';
import { ClockDigitalComponent }     from './clock-digital.component';

import { ImageService }              from '../../util/image.service';
import { HelperMyTime }              from '../../util/helper/my-time';
import { MyClockTime }               from '../../util/model/my-clock-time';

import { MyEventWatchTowerService }  from '../../util/service/my-event-watchtower.service';

import { MyCheckerService }          from '../../util/service/my-checker.service';
import { MyChecker }                 from '../../util/model/my-checker';
import { MyEventService }            from '../../util/service/my-event.service';
import { MyEvent }                   from '../../util/model/my-event';


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

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  @Input() klassTimeBegin:string;
  @Input() klassTimeEnd:string;

  @Input() clockHeight:number=83;
  @Input() clockWidth:number=-1;
  @Input() simpleClockHeight:number=82;
  @Input() clockDigitalHeight:number=83;

  @Input() eventKey:string="";

  clockTimeBegin:MyClockTime;
  clockTimeEnd:MyClockTime;
  dcLeftMargin:number=40;
  clockDigitalWidthStr:string;
  private myTime:HelperMyTime;

  @ViewChild(ClockComponent)
  private clockComponent: ClockComponent;
  @ViewChild(ClockDigitalComponent)
  private clockDigitalComponent: ClockDigitalComponent;


  constructor(
    public imageService: ImageService,
    private myCheckerService:MyCheckerService,
    private myEventService:MyEventService,
    private watchTower:MyEventWatchTowerService    
  ) {

    this.myTime = new HelperMyTime();

  } // end method

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngOnInit(): void {

    if(this.isDebug()) console.log("clock-board / ngOnInit / init");

    this.asyncViewPack();

  } // end method

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("clock-board / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("clock-board / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("clock-board / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  } // end method  

  private init() :void {

    if(this.isDebug()) console.log("clock-board / init / 시작");

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();
    this.setClockTimeBeginEnd(this.klassTimeBegin, this.klassTimeEnd);

  } // end method 

  setClockTimeBeginEnd(timeBegin:string, timeEnd:string) {

    if(this.isDebug()) console.log("clock-board / setClockTimeBeginEnd / 시작"); 

    if(this.isDebug()) console.log("clock-board / setClockTimeBeginEnd / timeBegin : ",timeBegin);
    if(this.isDebug()) console.log("clock-board / setClockTimeBeginEnd / timeEnd : ",timeEnd);

    if(this.myTime.isNotHHMM(timeBegin)) {
      if(this.isDebug()) console.log("clock-board / setClockTimeBeginEnd / 중단 / isNotHHMM(timeBegin)");
      return;
    }
    if(this.myTime.isNotHHMM(timeEnd)) {
      if(this.isDebug()) console.log("clock-board / setClockTimeBeginEnd / 중단 / isNotHHMM(timeEnd)");
      return;
    }
    if(this.isNotSafeTimeRange(timeBegin, timeEnd)) {
      if(this.isDebug()) console.log("clock-board / setClockTimeBeginEnd / 중단 / this.klassTimeBegin is not valid!");
      return;
    } // end if
    if(null == this.clockComponent) {
      if(this.isDebug()) console.log("clock-board / setClockTimeBeginEnd / 중단 / this.clockComponent is not valid!");
      return;
    }

    this.klassTimeBegin = timeBegin;
    this.klassTimeEnd = timeEnd;

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

    this.clockComponent.show(this.clockTimeBegin, this.clockTimeEnd);
  }

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("clock-board / emitEventOnReady / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_READY,
      // public key:string
      this.eventKey,
      // public value:string
      "",
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );
    this.emitter.emit(myEventOnChange);

    if(this.isDebug()) console.log("clock-board / emitEventOnReady / Done!");

  }    

  private isNotSafeTimeRange(hhmmBegin:string, hhmmEnd:string) :boolean {
    return !this.isSafeTimeRange(hhmmBegin, hhmmEnd);
  } // end method

  private isSafeTimeRange(hhmmBegin:string, hhmmEnd:string) :boolean {

    if(this.isDebug()) console.log("clock-board / isSafeTimeRange / 시작");

    if(this.isDebug()) console.log("clock-board / isSafeTimeRange / hhmmBegin : ",hhmmBegin);
    if(this.isDebug()) console.log("clock-board / isSafeTimeRange / hhmmEnd : ",hhmmEnd);

    if(this.myTime.isNotHHMM(hhmmBegin)) {
      if(this.isDebug()) console.log("clock-board / isSafeTimeRange / 중단 / this.myTime.isNotHHMM(hhmmBegin)");
      return false;
    }
    if(this.myTime.isNotHHMM(hhmmEnd)) {
      if(this.isDebug()) console.log("clock-board / isSafeTimeRange / 중단 / this.myTime.isNotHHMM(hhmmEnd)");
      return false;
    }
    let diffMinutes:number = this.myTime.getDiffMinutesHHMM(hhmmBegin, hhmmEnd);
    if(this.isDebug()) console.log("clock-board / isSafeTimeRange / diffMinutes : ",diffMinutes);

    // 최대 표현할 수 있는 시간 범위인지 확인한다.
    // 1hr/1hr 30mins/2hr/2hr 30mins/3hr
    if(!(60 <= diffMinutes && diffMinutes <= 180)) {
      if(this.isDebug()) console.log("clock-board / isSafeTimeRange / 중단 / 최소,최대시간 범위 밖입니다.");
      return false;
    }

    let clockTimeBegin:MyClockTime = this.myTime.getClockTime(hhmmBegin);
    if(null == clockTimeBegin) {
      if(this.isDebug()) console.log("clock-board / isSafeTimeRange / 중단 / null == clockTimeBegin");
      return false;
    }
    let clockTimeEnd:MyClockTime = this.myTime.getClockTime(hhmmEnd);
    if(null == clockTimeEnd) {
      if(this.isDebug()) console.log("clock-board / isSafeTimeRange / 중단 / null == clockTimeEnd");
      return false;
    }

    return true;
  } // end method

}