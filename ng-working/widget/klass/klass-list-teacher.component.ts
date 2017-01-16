import {  Component, 
          Input, 
          Output,
          EventEmitter,          
          OnInit }                  from '@angular/core';

import { MyEvent }                  from '../../util/model/my-event';
import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';
import { HelperMyArray }            from '../../util/helper/my-array';

import { PaymentImport }            from '../../widget/payment/model/payment-import';

import { Klass }                    from '../../klass/model/klass';
import { KlassAttendance }          from '../../klass/model/klass-attendance';
import { KlassNStudent }            from '../../klass/model/klass-n-student';

import { User }                     from '../../users/model/user';
import { Teacher }                  from '../../teachers/model/teacher';

@Component({
  moduleId: module.id,
  selector: 'klass-list-teacher',
  templateUrl: 'klass-list-teacher.component.html',
  styleUrls: [ 'klass-list-teacher.component.css' ]
})
export class KlassListTeacherComponent implements OnInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  // @ User Custom
  @Input() eventKey:string;
  @Input() klassList:Klass[];

  private myArray:HelperMyArray;

  constructor(private watchTower:MyEventWatchTowerService) {

    // Do something...
    this.myArray = new HelperMyArray();

  } // end constructor

  private isDebug():boolean {
    return this.watchTower.isDebug();
  } // end method

  ngOnInit(): void {

    if(this.isDebug()) console.log("klass-list-teacher / ngOnInit / init");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("klass-list-teacher / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-list-teacher / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("klass-list-teacher / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private init() :void {

    if(this.isDebug()) console.log("klass-list-teacher / init / 시작");

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();

  } // end method

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("klass-list-teacher / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("klass-list-teacher / emitEventOnReady / Done!");

  }

  // @ Desc : 현재 클래스 상태를 우리말로 표시합니다.
  getKlassStatusDesc(klass:Klass):string {

    if(this.isDebug()) console.log("klass-list-teacher / getKlassStatusDesc / 시작");

    if(null == klass) {
      if(this.isDebug()) console.log("klass-list-teacher / getKlassStatusDesc / 중단 / null == klass");
      return;
    }

    let klassStatusKor:string = 
    this.watchTower
    .getMyConst()
    .getValue(
      // srcKey:string, 
      "class_status_list",
      // srcValue:string, 
      klass.status,
      // targetKey:string
      "class_status_kor_list"
    );

    return klassStatusKor;
  }


  onClickKlass(event, klass:Klass):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

    // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
    if(null == klass) {
      if(this.isDebug()) console.log("klass-list-teacher / onClickKlass / 중단 / null == klass");
      return;
    } // end if

    this.emitOnClickMeta(""+klass.id, klass);

  } // end method

  emitOnClickMeta(value:string, meta:any):void {
    let myEvent:MyEvent = 
    this.watchTower.getEventOnClickMetaFreePass(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      value,
      // meta:any
      meta
    );
    this.emitter.emit(myEvent);
  } // end method

  onClickCancelKlass(event):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickCancelKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

  } // end method

  onClickRequestCancelKlass(event):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickRequestCancelKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

  } // end method  

  onClickTeacher(event):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickTeacher / 시작");

    event.preventDefault();
    event.stopPropagation();

  } // end method

  onClickStatus(event):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickStatus / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickPrintReceipt(event, klassNStudent:KlassNStudent):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickPrintReceipt / 시작");

    event.preventDefault();
    event.stopPropagation();

    // 새로운 윈도우를 열어서 영수증 링크 열기.
    if( null != klassNStudent && 
        null != klassNStudent.receipt_url && 
        "" != klassNStudent.receipt_url ) {
      window.open(klassNStudent.receipt_url);
    } // end if
    
  } // end method

  onClickPrintCertipicate(event):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickPrintCertipicate / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickSupplement(event):void {

    if(this.isDebug()) console.log("klass-list-teacher / onClickSupplement / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

} // end class