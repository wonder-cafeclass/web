import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';

import { MyEventService }              from '../../util/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { KlassTeacher }                from '../model/klass-teacher';
import { CheckBoxOption }              from '../../widget/checkbox/model/checkbox-option';

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

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private myEventService:MyEventService, 
                private myCheckerService:MyCheckerService ) {}

  ngOnInit(): void {

    // TEST
    console.log("klass-teacher / ngOnInit / klassId : ",this.klassId);

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

    // Resume를 변경하기 위한 이벤트 리스트를 만듭니다.
    this.myEventListForTeacherResume=[];
    for (var i = 0; i < this.klassTeacher.resume_arr.length; ++i) {
      let resume:string = this.klassTeacher.resume_arr[i];

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

      this.myEventListForTeacherResume.push(myEventResume);
    } // end for

    // Greeting을 변경하기 위한 이벤트 리스트를 만듭니다.
    this.myEventListForTeacherGreeting=[];
    for (var i = 0; i < this.klassTeacher.greeting_arr.length; ++i) {
      let greeting:string = this.klassTeacher.greeting_arr[i];

      let myEventResume = 
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

      this.myEventListForTeacherGreeting.push(myEventResume);
    } // end for    
  }

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