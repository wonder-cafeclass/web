import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';

import { KlassTeacher }                from '../model/klass-teacher';
import { CheckBoxOption }              from '../../widget/checkbox/model/checkbox-option';

import { MyEventService }              from '../../util/service/my-event.service';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';

import { MyEvent }                     from '../../util/model/my-event';

import { HelperMyIs }                  from '../../util/helper/my-is';
import { HelperMyTime }                from '../../util/helper/my-time';
import { HelperMyArray }               from '../../util/helper/my-array';

@Component({
  moduleId: module.id,
  selector: 'klass-teacher',
  templateUrl: 'klass-teacher.component.html',
  styleUrls: [ 'klass-teacher.component.css' ]
})
export class KlassTeacherComponent implements OnInit {

  @Input() isAdmin:Boolean;
  @Input() key:string;
  @Input() myEvent:MyEvent;

  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() cageHeight:number=-1;
  cageHeightStr:string;

  myEventCallback:MyEvent;
  @Input() klassTeacher:KlassTeacher;
  @Input() klassId:number;

  isShowResume:boolean=false;
  isShowGreeting:boolean=false;

  myEventListForTeacherResume:MyEvent[];
  myEventListForTeacherGreeting:MyEvent[];

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private watchTower:MyEventWatchTowerService,
                private myEventService:MyEventService, 
                private myCheckerService:MyCheckerService ) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();

  }

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-teacher / ngOnInit / init");

    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    if(0 < this.cageHeight) {
      this.cageHeightStr=`${this.cageHeight}px`;
    } else {
      this.cageHeightStr="100%";
    }

    this.subscribeEventPack();

    this.init();

  }

  private subscribeEventPack() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-teacher / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(isDebug) console.log("klass-teacher / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      // 1. 이미 EventPack 로딩이 완료된 경우

      // 부모 객체에게 component가 준비된 것을 알립니다.
      this.emitEventOnReady();

    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(isDebug) console.log("klass-teacher / subscribeEventPack / isEventPackReady : ",isEventPackReady);

        // 이벤트 관련 정보가 준비되었습니다.

        // 부모 객체에게 component가 준비된 것을 알립니다.
        this.emitEventOnReady();

      }); // end subscribe

    } // end if

  } // end method 
  
  private emitEventOnReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-teacher / emitEventOnReady / 시작");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("klass-teacher / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_TEACHER_LIST,
      // component
      this
    );

    if(isDebug) console.log("klass-teacher / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("klass-teacher / emitEventOnReady / Done!");

  }

  init() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-teacher / init / 시작");
    if(isDebug) console.log("klass-teacher / init / this.klassTeacher : ",this.klassTeacher);

    this.setResume();

    this.setGreeting();

  }

  setResume() :void {

    // Resume를 변경하기 위한 이벤트 리스트를 만듭니다.
    let resumeArr:string[] = this.klassTeacher.getResumeArr();
    let myEventList:MyEvent[] = [];
    for (var i = 0; i < resumeArr.length; ++i) {
      let resume:string = resumeArr[i];

      let myEventResume = 
      new MyEvent(
        // public id:string
        this.myEventService.getUniqueIdx(),
        // public eventName:string
        this.myEventService.ANY,
        // public key:string
        this.myEventService.TEACHER_RESUME,
        // public value:string
        resume,
        // public metaObj:any
        {klassId:+this.klassId},
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker()
      );

      myEventList.push(myEventResume);
    } // end for

    this.myEventListForTeacherResume = myEventList;

  } // end method

  setGreeting() :void {

    // Greeting을 변경하기 위한 이벤트 리스트를 만듭니다.
    let greetingArr:string[] = this.klassTeacher.getGreetingArr();
    let myEventList:MyEvent[] = [];
    for (var i = 0; i < greetingArr.length; ++i) {
      let greeting:string = greetingArr[i];

      let myEventGreeting = 
      new MyEvent(
        // public id:string
        this.myEventService.getUniqueIdx(),
        // public eventName:string
        this.myEventService.ANY,
        // public key:string
        this.myEventService.TEACHER_GREETING,
        // public value:string
        greeting,
        // public metaObj:any
        {klassId:+this.klassId},
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker()
      );

      myEventList.push(myEventGreeting);      
    }
    this.myEventListForTeacherGreeting = myEventList;

  } // end method  

  onClickResume(event) :void {

    event.stopPropagation();
    event.preventDefault();

    this.isShowResume = !this.isShowResume;
    console.log("klass-teacher / onClickResume / this.isShowResume : ",this.isShowResume);
  }

  onClickGreeting(event) :void {

    event.stopPropagation();
    event.preventDefault();

    this.isShowGreeting = !this.isShowGreeting;
    console.log("klass-teacher / onClickResume / this.isShowGreeting : ",this.isShowGreeting);
  }

  onChangedFromChild(myEvent:MyEvent) :void{
    console.log("klass-teacher / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      return;
    }

    if(this.myEventService.TEACHER_RESUME === myEvent.key) {

      if(this.myEventService.ON_CHANGE === myEvent.eventName) {
        // Do something...
      } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {

        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherResume = myEvent.parentEventList;
        }

      } else if(this.myEventService.ON_SAVE === myEvent.eventName) {

        // DB UPDATE!
        console.log("klass-teacher / onChangedFromChild / DB UPDATE!");

      } else if(this.myEventService.ON_SHUTDOWN === myEvent.eventName) {

        this.isShowResume = false;

      } else if(this.myEventService.ON_SHUTDOWN_N_ROLLBACK === myEvent.eventName) {

        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherResume = myEvent.parentEventList;
        }
        this.isShowResume = false;

      }

    } else if(this.myEventService.TEACHER_GREETING === myEvent.key) {

      if(this.myEventService.ON_CHANGE === myEvent.eventName) {
        // Do something...
      } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {

        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherGreeting = myEvent.parentEventList;
        }

      } else if(this.myEventService.ON_SAVE === myEvent.eventName) {

        // DB UPDATE!
        console.log("klass-teacher / onChangedFromChild / DB UPDATE!");

      } else if(this.myEventService.ON_SHUTDOWN === myEvent.eventName) {

        this.isShowGreeting = false;

      } else if(this.myEventService.ON_SHUTDOWN_N_ROLLBACK === myEvent.eventName) {

        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherGreeting = myEvent.parentEventList;
        }
        this.isShowGreeting = false;

      }
    }
  }
}