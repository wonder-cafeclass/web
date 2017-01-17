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
  selector: 'klass-info-for-teacher',
  templateUrl: 'klass-info-for-teacher.component.html',
  styleUrls: [ 'klass-info-for-teacher.component.css' ]
})
export class KlassInfoForTeacherComponent implements OnInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  // @ User Custom
  @Input() eventKey:string;
  @Input() klass:Klass;
  @Input() isLast:boolean=false;

  isShowAttendance:boolean=false;
  attendancePercentage:string="";

  private myArray:HelperMyArray;

  constructor(private watchTower:MyEventWatchTowerService) {

    // Do something...
    this.myArray = new HelperMyArray();

  } // end constructor

  private isDebug():boolean {
    return this.watchTower.isDebug();
  } // end method

  ngOnInit(): void {

    if(this.isDebug()) console.log("klass-info-for-teacher / ngOnInit / init");
    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("klass-info-for-teacher / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-info-for-teacher / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("klass-info-for-teacher / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private init() :void {

    if(this.isDebug()) console.log("klass-info-for-teacher / init / 시작");

    // 출석률을 업데이트합니다.
    this.updateAttendancePercentage();

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();

  } // end method

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("klass-info-for-teacher / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("klass-info-for-teacher / emitEventOnReady / Done!");

  }

  // @ Desc : 현재 클래스 상태를 우리말로 표시합니다.
  getKlassStatusDesc(klass:Klass):string {

    if(this.isDebug()) console.log("klass-info-for-teacher / getKlassStatusDesc / 시작");

    if(null == klass) {
      if(this.isDebug()) console.log("klass-info-for-teacher / getKlassStatusDesc / 중단 / null == klass");
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

    if(this.isDebug()) console.log("klass-info-for-teacher / onClickKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

    // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
    if(null == klass) {
      if(this.isDebug()) console.log("klass-info-for-teacher / onClickKlass / 중단 / null == klass");
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

  emitOnChangeMeta(value:string, meta:any):void {

    let myEvent:MyEvent = 
    this.watchTower.getEventOnChangeMeta(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      value,
      // myChecker:MyChecker,
      this.watchTower.getMyCheckerService().getFreePassChecker(),
      // meta:any
      meta
    );
    this.emitter.emit(myEvent);
  } // end method


  isValidAttendance():boolean {

    if(this.isDebug()) console.log("klass-info-for-teacher / isValidAttendance / 시작");

    if(null == this.klass) {
      return false;
    }
    if(this.myArray.isNotOK(this.klass.klass_n_student_list)) {
      return false;        
    }

    return true;
  }

  onClickAttendance(event):void {

    if(this.isDebug()) console.log("klass-info-for-teacher / onClickAttendance / 시작");

    event.preventDefault();
    event.stopPropagation();

    if(null == this.klass) {
      if(this.isDebug()) console.log("klass-info-for-teacher / onClickAttendance / 중단 / null == this.klass");
      return;
    } else if(this.myArray.isNotOK(this.klass.klass_n_student_list)) {
      if(this.isDebug()) console.log("klass-info-for-teacher / onClickAttendance / 중단 / this.klass.klass_n_student_list is not valid!");
      return;
    }

    this.isShowAttendance = !this.isShowAttendance;

  } // end method

  onClickAttendanceDate(event, attendance:KlassAttendance):void {

    if(this.isDebug()) console.log("klass-info-for-teacher / onClickAttendance / 시작");

    event.preventDefault();
    event.stopPropagation();

    if(null == attendance) {
      if(this.isDebug()) console.log("klass-info-for-teacher / onClickAttendance / 중단 / null == attendance");
      return;
    }

    attendance.updateStatus();

    // 부모 객체에게 출석 데이터 업데이트 전달
    this.emitOnChangeMeta("", attendance);

    // 화면에 표시된 출석률 업데이트
    this.updateAttendancePercentage();


  } // end method

  updateAttendancePercentage():void {

    if(this.isDebug()) console.log("klass-info-for-teacher / updateAttendancePercentage / 시작");

    if(null == this.klass) {
      if(this.isDebug()) console.log("klass-info-for-teacher / updateAttendancePercentage / 중단 / null == klass");
      return;
    } // end if

    if(this.myArray.isNotOK(this.klass.klass_n_student_list)) {
      if(this.isDebug()) console.log("klass-info-for-teacher / updateAttendancePercentage / 중단 / klass_n_student_list is not valid!");
      return;      
    }

    for (var i = 0; i < this.klass.klass_n_student_list.length; ++i) {
      let klassNStudent:KlassNStudent = this.klass.klass_n_student_list[i];

      if(this.myArray.isNotOK(klassNStudent.attendance_list)) {
        continue;
      }
      let attendance_list:KlassAttendance[] = klassNStudent.attendance_list;
      let attendance_total_cnt:number=0;
      let attendance_ready_cnt:number=0;
      let attendance_presence_cnt:number=0;
      let attendance_absence_cnt:number=0;

      for (var j = 0; j < attendance_list.length; ++j) {
        let attendance:KlassAttendance = attendance_list[j];

        attendance_total_cnt++;

        if(attendance.isReady()) {
          attendance_ready_cnt++;
        } else if(attendance.isPresence()) {
          attendance_presence_cnt++;
        } else if(attendance.isAbsence()) {
          attendance_absence_cnt++;
        }

      } // end for

      klassNStudent.attendance_total_cnt = attendance_total_cnt;
      klassNStudent.attendance_ready_cnt = attendance_ready_cnt;
      klassNStudent.attendance_presence_cnt = attendance_presence_cnt;
      klassNStudent.attendance_absence_cnt = attendance_absence_cnt;

    } // end for

    this.attendancePercentage = this.klass.getAttendancePercentage();

  }

  onClickTeacher(event):void {

    if(this.isDebug()) console.log("klass-info-for-teacher / onClickTeacher / 시작");

    event.preventDefault();
    event.stopPropagation();

  } // end method

  onClickStatus(event):void {

    if(this.isDebug()) console.log("klass-info-for-teacher / onClickStatus / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickPrintCertipicate(event):void {

    if(this.isDebug()) console.log("klass-info-for-teacher / onClickPrintCertipicate / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickSupplement(event):void {

    if(this.isDebug()) console.log("klass-info-for-teacher / onClickSupplement / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

} // end class