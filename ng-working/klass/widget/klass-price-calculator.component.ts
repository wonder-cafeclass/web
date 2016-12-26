import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';

import { MyEventService }              from '../../util/service/my-event.service';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';

import { MyEvent }                     from '../../util/model/my-event';

import { HelperMyIs }                  from '../../util/helper/my-is';
import { HelperMyTime }                from '../../util/helper/my-time';
import { HelperMyArray }               from '../../util/helper/my-array';
import { HelperMyFormat }              from '../../util/helper/my-format';

import { DefaultComponent }            from '../../widget/input/default/default.component';
import { DefaultMeta }                 from '../../widget/input/default/model/default-meta';

@Component({
  moduleId: module.id,
  selector: 'klass-price-calculator',
  templateUrl: 'klass-price-calculator.component.html',
  styleUrls: [ 'klass-price-calculator.component.css' ]
})
export class KlassPriceCalculatorComponent implements OnInit {

  @Input() cageWidth:number=-1;
  cageWidthStr:string;

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 1인당 강의료
  private priceForStudentComponent: DefaultComponent;
  // 수수료
  private commissionComponent: DefaultComponent;    
  // 1인당 강사 지급액 
  private paymentForTeacherComponent: DefaultComponent;
  // 수업 학생수
  private studentNumberComponent: DefaultComponent;
  // 합계
  private totalComponent: DefaultComponent;

  commissionStr:string="";
  paymentForTeacherStr:string="";
  totalStr:string="";

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;
  private myFormat:HelperMyFormat;

  defaultMetaList:DefaultMeta[];

  private isEventPackReady:boolean = false;

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private watchTower:MyEventWatchTowerService,
                private myEventService:MyEventService, 
                private myCheckerService:MyCheckerService ) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();
    this.myFormat = new HelperMyFormat();

    this.defaultMetaList = this.myEventService.getDefaultMetaListKlassPriceCalculator();

  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / ngOnInit / init");

    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    this.subscribeEventPack();
    this.init();
  }

  private subscribeEventPack() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(isDebug) console.log("klass-price-calculator / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      // 1. 이미 EventPack 로딩이 완료된 경우
      this.isEventPackReady = true;
      this.checkComponentReady();

    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(isDebug) console.log("klass-price-calculator / subscribeEventPack / isEventPackReady : ",isEventPackReady);

        // 이벤트 관련 정보가 준비되었습니다.
        this.isEventPackReady = true;
        this.checkComponentReady();

      }); // end subscribe

    } // end if

  } // end method 
  
  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / emitEventOnReady / 시작");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("klass-price-calculator / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_PRICE_CALC,
      // component
      this
    );

    if(isDebug) console.log("klass-price-calculator / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("klass-price-calculator / emitEventOnReady / Done!");

  }

  init() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / init / 시작");

  }

  // @ Desc : 자식 컴포넌트들이 모두 준비되었는지 확인합니다. 준비되었다면 부모 객체에게 이벤트를 발송합니다.
  checkComponentReady():void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / checkComponentReady / 시작");

    if(this.isNotReady()) {
      if(isDebug) console.log("klass-price-calculator / checkComponentReady / 중단 / this.isNotReady()");
      return;
    } // end if

    this.emitEventOnReady();
  }

  isNotReady() :boolean {
    return !this.isReady();
  }

  isReady() :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / isReady / 시작");

    if(!this.isEventPackReady) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / !this.isEventPackReady");
      return false;
    } else if(null == this.priceForStudentComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.priceForStudentComponent");
      return false;
    } else if(null == this.commissionComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.commissionComponent");
      return false;
    } else if(null == this.paymentForTeacherComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.paymentForTeacherComponent");
      return false;
    } else if(null == this.studentNumberComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.studentNumberComponent");
      return false;
    } else if(null == this.totalComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.totalComponent");
      return false;
    }

    return true;
  }

  setPrice(price:number) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / setPrice / 시작");

    if(this.isNotReady()) {
      if(isDebug) console.log("klass-price-calculator / setPrice / 중단 / this.isNotReady()");
      return;
    } // end if

    if(isDebug) console.log("klass-price-calculator / setPrice / price : ",price);

    this.updatePriceForStudent(price);

  } // end method

  private updatePriceForStudent(price:number) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updatePriceForStudent / 시작");

    if(isDebug) console.log("klass-price-calculator / updatePriceForStudent / this.priceForStudentComponent : ",this.priceForStudentComponent);

    this.priceForStudentComponent.setInput(""+price);

    this.updateCommission(price);
  }
  private updateCommission(price:number) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updateCommission / 시작");

    let commission:number = this.getcommission(price);
    let commissionStr:string = `${commission}%`;

    if(isDebug) console.log("klass-price-calculator / updateCommission / commissionStr : ",commissionStr);

    this.commissionComponent.setInput(commissionStr);

    this.updatePaymentForTeacher(price, commission);

  }
  private getcommission(price:number) :void {

    /*
    5만9천원까지 20 % 
    6만원 부터 10만원 25%
    10만원초과 30%
    */

    if(0 < price && price <= 59000) {
        return 20;
    } else if(60000 <= price && price <= 100000) {
        return 25;
    } else if(100000 < price) {
        return 30;
    }    
    return -1;    
  }
  private updatePaymentForTeacher(price:number, commission:number) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / 시작");

    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / price : ",price);
    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / commission : ",commission);

    let payment:number = Math.round(price * ((100 - commission)/100));
    let paymentStr:string = this.myFormat.numberWithCommas(payment);
    paymentStr = `₩${paymentStr}`;

    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / payment : ",payment);
    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / paymentStr : ",paymentStr);

    this.paymentForTeacherComponent.setInput(paymentStr);

    this.updateStudentNumber(-1);

  }
  private updateStudentNumber(studentNumber:number) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updateStudentNumber / 시작");

    if(studentNumber < 0) {
      studentNumber = 3;
    }
    if(isDebug) console.log("klass-price-calculator / updateStudentNumber / studentNumber : ",studentNumber);

    this.studentNumberComponent.setInput("" + studentNumber);

    this.updateTotal();

  }
  private updateTotal():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updateTotal / 시작");


    let payment:number = +this.paymentForTeacherComponent.getInput().replace("₩","").replace(",","");
    let studentNumber:number = +this.studentNumberComponent.getInput();

    if(isDebug) console.log("klass-price-calculator / updateStudentNumber / payment : ",payment);
    if(isDebug) console.log("klass-price-calculator / updateStudentNumber / studentNumber : ",studentNumber);

    let total:number = payment * studentNumber;
    let totalStr:string = this.myFormat.numberWithCommas(total);
    totalStr = `₩${totalStr}`;

    if(isDebug) console.log("klass-price-calculator / updateStudentNumber / total : ",total);
    if(isDebug) console.log("klass-price-calculator / updateStudentNumber / totalStr : ",totalStr);

    this.totalComponent.setInput(totalStr);

  }


  onChangedFromChild(myEvent:MyEvent) :void{

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / onChangedFromChild / 시작");

    if(isDebug) console.log("klass-price-calculator / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      return;
    }

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT)) {

        this.priceForStudentComponent = myEvent.metaObj;
        this.checkComponentReady();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_COMMISSION)) {

        this.commissionComponent = myEvent.metaObj;
        this.checkComponentReady();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PAYMENT_FOR_TEACHER)) {

        this.paymentForTeacherComponent = myEvent.metaObj;
        this.checkComponentReady();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER)) {

        this.studentNumberComponent = myEvent.metaObj;
        this.checkComponentReady();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_TOTAL)) {

        this.totalComponent = myEvent.metaObj;
        this.checkComponentReady();

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT)) {

        let price:number = +myEvent.value;
        this.updatePriceForStudent(price);

        // 가격 변경을 부모 객체에도 전달.

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER)) {

        let studentNumber:number = +myEvent.value;
        this.updateStudentNumber(studentNumber);

      } // end if       

    } // end if

  } // end method

} // end class