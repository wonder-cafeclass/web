import {  Component, 
          Input, 
          Output,
          EventEmitter,          
          OnInit }           from '@angular/core';

import { MyEvent }                  from '../../util/model/my-event';
import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';
import { HelperMyArray }            from '../../util/helper/my-array';

import { PaymentImport }            from '../../widget/payment/model/payment-import';

import { Klass }                    from '../../klass/model/klass';
import { KlassAttendance }          from '../../klass/model/klass-attendance';
import { KlassNStudent }            from '../../klass/model/klass-n-student';

@Component({
  moduleId: module.id,
  selector: 'klass-card',
  templateUrl: 'klass-card.component.html',
  styleUrls: [ 'klass-card.component.css' ]
})
export class KlassCardComponent implements OnInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  // @ User Custom
  @Input() eventKey:string;
  @Input() klass:Klass;
  @Input() klassNStudent:KlassNStudent;
  @Input() isSmall:boolean=false;
  @Input() width:number=-1;
  widthStr:string="";
  katStatus:string="";
  isValidPayment:boolean=false;
  isShowCertificate:boolean=false;

  private myArray:HelperMyArray;

  // @ Deprecated
  @Input() size:string="default";

  constructor(private watchTower:MyEventWatchTowerService) {

    // Do something...
    this.myArray = new HelperMyArray();

  } // end constructor

  private isDebug():boolean {
    return this.watchTower.isDebug();
  } // end method

  ngOnInit(): void {

    if(this.isDebug()) console.log("klass-card / ngOnInit / init");
    if(this.isDebug()) console.log("klass-card / ngOnInit / this.width : ",this.width);

    if(0 < this.width) {
      this.widthStr = this.width + "px";
    } else {
      this.widthStr = "100%";
    }

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("klass-card / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-card / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("klass-card / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private init() :void {

    if(this.isDebug()) console.log("klass-card / init / 시작");

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();

    // 전달받은 katList 데이터로 '남은 수업 일수/전체 수업 일수'를 표시합니다.
    this.updateKatProgressView();

    // 영수증 및 수강증등 결제 관련 버튼 노출 여부 업데이트.
    this.updatePaymentView();

  } // end method

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("klass-card / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("klass-card / emitEventOnReady / Done!");

  }

  private updateKatProgressView():void {

    if(this.isDebug()) console.log("klass-card / updateKatProgressView / 시작");
    if(null == this.klassNStudent) {
      if(this.isDebug()) console.log("klass-card / updateKatProgressView / 중단 / null == this.klassNStudent");
      return;
    }

    let progress:string = this.klassNStudent.getProgress();
    if(null != progress && "" != progress) {
      this.katStatus = `진행상황 ${progress}회`;
    }

  } // end method

  private updatePaymentView():void {

    if(this.isDebug()) console.log("klass-card / updatePaymentView / 시작");
    if(null == this.klassNStudent) {
      if(this.isDebug()) console.log("klass-card / updatePaymentView / 중단 / null == this.klassNStudent");
      return;
    }

    // 영수증 및 자료실 버튼 노출 여부
    this.isValidPayment = (0 < this.klassNStudent.paymentTotalCnt)?true:false;  

    // 수강증 노출 여부
    this.isShowCertificate = this.klassNStudent.isFinished();

  } // end method

  onClickKlass(event):void {

    if(this.isDebug()) console.log("klass-card / onClickKlass / 시작");

    event.preventDefault();
    event.stopPropagation();

    // 부모 객체로 클래스를 선택한 것을 전달. 해당 수업 상세 페이지로 이동!
    if(null == this.klass) {
      if(this.isDebug()) console.log("klass-card / onClickKlass / 중단 / null == this.klass");
      return;
    } // end if

    this.emitOnClickMeta(""+this.klass.id, this.klass);

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

  onClickTeacher(event):void {

    if(this.isDebug()) console.log("klass-card / onClickTeacher / 시작");

    event.preventDefault();
    event.stopPropagation();

  } // end method

  onClickStatus(event):void {

    if(this.isDebug()) console.log("klass-card / onClickStatus / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickReceipt(event):void {

    if(this.isDebug()) console.log("klass-card / onClickReceipt / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickCertificate(event):void {

    if(this.isDebug()) console.log("klass-card / onClickCertificate / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

  onClickSupplement(event):void {

    if(this.isDebug()) console.log("klass-card / onClickSupplement / 시작");

    event.preventDefault();
    event.stopPropagation();

  }

} // end class