import { Component, 
         OnInit, 
         Input, 
         Output, 
         ViewChild,
         EventEmitter }                from '@angular/core';

import { Teacher }                     from '../../teachers/model/teacher';

import { CheckBoxOption }              from '../../widget/checkbox/model/checkbox-option';
import { InputsBtnsRowsComponent }     from '../../widget/input-view/inputs-btns-rows.component';

import { DefaultMeta }                 from '../../widget/input/default/model/default-meta';
import { DefaultType }                 from '../../widget/input/default/model/default-type';

import { MyEventService }              from '../../util/service/my-event.service';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';
import { MyEvent }                     from '../../util/model/my-event';
import { HelperMyIs }                  from '../../util/helper/my-is';
import { HelperMyTime }                from '../../util/helper/my-time';
import { HelperMyArray }               from '../../util/helper/my-array';

//DefaultMeta

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
  @Input() teacher:Teacher;
  @Input() klassId:number;

  isShowResume:boolean=false;
  isShowGreeting:boolean=false;

  myEventListForTeacherResume:MyEvent[];
  myEventListForTeacherGreeting:MyEvent[];

  @ViewChild(InputsBtnsRowsComponent)
  private teacherResumeListComponent: InputsBtnsRowsComponent;

  defaultMetaGreeting:DefaultMeta;
  defaultType:DefaultType;

  // @ViewChild(InputsBtnsRowsComponent)
  // private teacherGreetingComponent: InputsBtnsRowsComponent;


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

    this.defaultType = new DefaultType();
    this.defaultMetaGreeting = this.getDefaultMetaTextAreaTeacherGreeting();

  }

  getDefaultMetaTextAreaTeacherGreeting(): DefaultMeta{

    return new DefaultMeta(
      // public title:string
      "인사말",
      // public placeholder:string
      "인사말을 입력해주세요",
      // public eventKey:string
      this.myEventService.KEY_TEACHER_GREETING,
      // public checkerKey:string
      "teacher_greeting",
      // public type:string
      this.defaultType.TYPE_TEXTAREA
    );

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngOnInit(): void {

    if(this.isDebug()) console.log("klass-teacher / ngOnInit / init");

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

    if(this.isDebug()) console.log("klass-teacher / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("klass-teacher / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      // 1. 이미 EventPack 로딩이 완료된 경우

      // 부모 객체에게 component가 준비된 것을 알립니다.
      this.emitEventOnReady();

    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("klass-teacher / subscribeEventPack / isEventPackReady : ",isEventPackReady);

        // 이벤트 관련 정보가 준비되었습니다.

        // 부모 객체에게 component가 준비된 것을 알립니다.
        this.emitEventOnReady();

      }); // end subscribe

    } // end if

  } // end method 
  
  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("klass-teacher / emitEventOnReady / 시작");

    if(!this.watchTower.getIsEventPackReady()) {
      if(this.isDebug()) console.log("klass-teacher / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_TEACHER_LIST,
      // component
      this
    );

    if(this.isDebug()) console.log("klass-teacher / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(this.isDebug()) console.log("klass-teacher / emitEventOnReady / Done!");

  }

  init() :void {

    if(this.isDebug()) console.log("klass-teacher / init / 시작");
    if(this.isDebug()) console.log("klass-teacher / init / this.teacher : ",this.teacher);

    this.setResume();

    this.setGreeting();

  }

  setTeacher(teacher:Teacher) :void {

    if(this.isDebug()) console.log("klass-teacher / setTeacher / 시작");
    if(this.isDebug()) console.log("klass-teacher / setTeacher / teacher : ",teacher);

    this.teacher = teacher;
  }

  setResume() :void {

    if(this.isDebug()) console.log("klass-teacher / setResume / 시작");

    if(null == this.teacher) {
      if(this.isDebug()) console.log("klass-teacher / setResume / 중단 / null == this.teacher");
      return;
    }

    // Resume를 변경하기 위한 이벤트 리스트를 만듭니다.
    let resumeArr:string[] = this.teacher.getResumeArr();
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
        this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST,
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

    if(this.isDebug()) console.log("klass-teacher / setGreeting / 시작");

    if(null == this.teacher) {
      if(this.isDebug()) console.log("klass-teacher / setGreeting / 중단 / null == this.teacher");
      return;
    }

    /*
    // Greeting을 변경하기 위한 이벤트 리스트를 만듭니다.
    let greetingArr:string[] = this.teacher.getGreetingArr();
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
        this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST,
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
    */

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

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 객체가 준비되었습니다. 부모 객체에게 전달합니다.
        this.teacherResumeListComponent = myEvent.metaObj;
        this.teacherResumeListComponent.setMyEventList(this.myEventListForTeacherResume);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 객체가 준비되었습니다. 부모 객체에게 전달합니다.

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 변경되었습니다. 부모 객체에게 전달합니다.

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 변경되었습니다. 부모 객체에게 전달합니다.

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 추가되었습니다. 부모 객체에게 전달합니다.
        this.emitter.emit(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 추가되었습니다. 부모 객체에게 전달합니다.
        this.emitter.emit(myEvent);

      } // end if      

    } else if(myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 삭제되었습니다. 부모 객체에게 전달합니다.
        this.emitter.emit(myEvent);

        // 삭제된 데이터로 업데이트.
        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherResume = myEvent.parentEventList;
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 삭제되었습니다. 부모 객체에게 전달합니다.
        this.emitter.emit(myEvent);

        // 삭제된 데이터로 업데이트.
        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherGreeting = myEvent.parentEventList;
        } // end if

      } // end if       

    } else if(myEvent.hasEventName(this.myEventService.ON_SAVE)) {

    } else if(myEvent.hasEventName(this.myEventService.ON_SHUTDOWN)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 사용자가 저장 이후, 창을 닫았습니다.
        this.isShowResume = false;

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 사용자가 저장 이후, 창을 닫았습니다.
        this.isShowGreeting = false;

      } // end if      

    } else if(myEvent.hasEventName(this.myEventService.ON_SHUTDOWN_N_ROLLBACK)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 사용자가 저장하지 않고, 창을 닫았습니다.
        this.isShowResume = false;

        // 이전 데이터롤 롤백.
        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherResume = myEvent.parentEventList;
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 사용자가 저장하지 않고, 창을 닫았습니다.
        this.isShowGreeting = false;

        // 이전 데이터롤 롤백.
        if(null != myEvent.parentEventList) {
          this.myEventListForTeacherGreeting = myEvent.parentEventList;
        } // end if

      } // end if      

    } // end if

  } // end method

} // end class