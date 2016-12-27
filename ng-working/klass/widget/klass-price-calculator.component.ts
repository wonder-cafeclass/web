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
import { DefaultOption }               from '../../widget/input/default/model/default-option';

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
  private studentCntComponent: DefaultComponent;
  // 합계
  private totalComponent: DefaultComponent;
  // 수업 주수
  private weeksComponent: DefaultComponent;

  commissionStr:string="";
  paymentForTeacherStr:string="";
  

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

  private emitEventOnChange() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / emitEventOnReady / 시작");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("klass-price-calculator / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let metaObj:any = {
      price:this.price,
      studentCnt:this.studentCnt,
      commission:this.commission,
      weeks:this.weeks,
      total:this.total,
      totalStr:this.totalStr
    };

    let myEventOnChange:MyEvent = 
    this.watchTower.getEventOnChangeMeta(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_PRICE_CALC,
      // value:string, 
      "",
      // myChecker:MyChecker, 
      this.watchTower.getMyCheckerService().getFreePassChecker(),
      // meta:any
      metaObj
    );

    if(isDebug) console.log("klass-price-calculator / emitEventOnReady / myEventOnChange : ",myEventOnChange);
    this.emitter.emit(myEventOnChange);

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
    } else if(null == this.studentCntComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.studentCntComponent");
      return false;
    } else if(null == this.totalComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.totalComponent");
      return false;
    } else if(null == this.weeksComponent) {
      if(isDebug) console.log("klass-price-calculator / isReady / 중단 / null == this.weeksComponent");
      return false;
    }

    return true;
  }

  setPriceNStudentCnt(price:number, studentCnt:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / setPriceNStudentCnt / 시작");

    if(this.isNotReady()) {
      if(isDebug) console.log("klass-price-calculator / setPriceNStudentCnt / 중단 / this.isNotReady()");
      return;
    } // end if
    if(!(0 < price)) {
      if(isDebug) console.log("klass-price-calculator / setPriceNStudentCnt / 중단 / price is not valid!");
      return;
    } // end if
    if(!(0 < studentCnt)) {
      if(isDebug) console.log("klass-price-calculator / setPriceNStudentCnt / 중단 / studentCnt is not valid!");
      return;
    } // end if

    this.setPrice(price);
    this.updateStudentCnt(studentCnt);

  } // end method

  setPrice(price:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / setPrice / 시작");

    if(this.isNotReady()) {
      if(isDebug) console.log("klass-price-calculator / setPrice / 중단 / this.isNotReady()");
      return;
    } // end if

    if(isDebug) console.log("klass-price-calculator / setPrice / price : ",price);

    this.updatePriceForStudent(price);

  } // end method

  setWeeks(weeks:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / setWeeks / 시작");

    if(!(0 < weeks)) {
      if(isDebug) console.log("klass-price-calculator / setWeeks / 중단 / weeks is not valid!");
      return;
    }
    if(null == this.weeksComponent) {
      if(isDebug) console.log("klass-price-calculator / setWeeks / 중단 / this.weeksComponent is not valid!");
      return;
    }

    let classWeeksList:any = 
    this.watchTower.getMyConst().getList("class_weeks_list");

    let classWeeksKorList:any = 
    this.watchTower.getMyConst().getList("class_weeks_kor_list");

    let weekKor:string =
    this.myArray.getValueFromLists(
      // key:string, 
      "" + weeks,
      // srcList:string[], 
      classWeeksList,
      // targetList:string[]
      classWeeksKorList
    );

    let selectOptionList:DefaultOption[] = 
    this.getDefaultOptionList(
      // keyList:string[],
      classWeeksKorList, 
      // valueList:string[],
      classWeeksList, 
      // valueFocus:string
      "" + weeks
    );

    if(isDebug) console.log("klass-price-calculator / setWeeks / selectOptionList : ",selectOptionList);
    if(isDebug) console.log("klass-price-calculator / setWeeks / weeks : ",weeks);
    if(isDebug) console.log("klass-price-calculator / setWeeks / weekKor : ",weekKor);

    this.weeksComponent.setSelectOption(selectOptionList);

    this.updateWeeks(weeks);

  }

  // @ Desc : 변경된 수업 주수에 따라서 가격 데이터를 다시 표시해야 합니다.
  private weeks:number = -1;
  private updateWeeks(weeks:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updateWeeks / 시작");
    if(isDebug) console.log("klass-price-calculator / updateWeeks / weeks : ",weeks);

    this.weeks = weeks

    this.updateTotal();
  }

  private getDefaultOptionList(keyList:string[],valueList:string[],valueFocus:string) :DefaultOption[] {

    if(null == this.watchTower) {
      return [];
    }

    return this.watchTower
    .getMyConst()
    .getDefaultOptionList(
      // keyList:string[], 
      keyList,
      // valueList:string[],
      valueList,
      // valueFocus:string
      valueFocus
    );
  } // end method    

  private price:number = -1;
  private updatePriceForStudent(price:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updatePriceForStudent / 시작");

    if(isDebug) console.log("klass-price-calculator / updatePriceForStudent / this.priceForStudentComponent : ",this.priceForStudentComponent);

    this.price = price;
    this.priceForStudentComponent.setInput(""+price);

    this.updateCommission(price);
  }
  private commission:number =-1;
  private updateCommission(price:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updateCommission / 시작");

    let commission:number  = this.commission = this.getcommission(price);
    let commissionStr:string = `${commission}%`;

    if(isDebug) console.log("klass-price-calculator / updateCommission / commissionStr : ",commissionStr);

    this.commissionComponent.setInput(commissionStr);

    this.updatePaymentForTeacher(price, commission);

  }
  private getcommission(price:number) :number {

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
  private payment:number = -1;
  private updatePaymentForTeacher(price:number, commission:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / 시작");

    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / price : ",price);
    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / commission : ",commission);

    let profitPercentage:number = (100 - this.commission);
    let priceStr = this.myFormat.numberWithCommas(price);
    priceStr = `₩${priceStr}`;

    let payment:number = this.payment = Math.round(price * ((100 - commission)/100));
    let paymentStr:string = this.myFormat.numberWithCommas(payment);
    // paymentStr = `₩${paymentStr}`;

    paymentStr = `${priceStr} X ${profitPercentage}% = ₩${paymentStr}`;

    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / payment : ",payment);
    if(isDebug) console.log("klass-price-calculator / updatePaymentForTeacher / paymentStr : ",paymentStr);

    this.paymentForTeacherComponent.setInput(paymentStr);

    this.updateStudentCnt(-1);

  }
  private studentCnt:number = -1;
  private updateStudentCnt(studentCnt:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updateStudentCnt / 시작");

    if(studentCnt < 0) {
      studentCnt = 3;
    }
    this.studentCnt = studentCnt;
    if(isDebug) console.log("klass-price-calculator / updateStudentCnt / studentCnt : ",studentCnt);

    this.studentCntComponent.setInput("" + studentCnt);

    this.updateTotal();

  }
  private total:Number = -1;
  private totalStr:string="";
  private updateTotal():void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-price-calculator / updateTotal / 시작");

    let paymentStr:string = "₩" + this.myFormat.numberWithCommas(this.payment);
    let studentCnt:number = +this.studentCntComponent.getInput();
    let weekCnt:number = 1;
    if(0 < this.weeks && 0 == (this.weeks % 4)) {
      weekCnt = (this.weeks / 4);
    } // end if

    if(isDebug) console.log("klass-price-calculator / updateTotal / this.payment : ",this.payment);
    if(isDebug) console.log("klass-price-calculator / updateTotal / paymentStr : ",paymentStr);
    if(isDebug) console.log("klass-price-calculator / updateTotal / this.studentCnt : ",this.studentCnt);
    if(isDebug) console.log("klass-price-calculator / updateTotal / weekCnt : ",weekCnt);

    let total:number = this.total = this.payment * this.studentCnt * weekCnt;
    let totalStr:string = this.totalStr = this.myFormat.numberWithCommas(total);
    totalStr = `${paymentStr} X ${studentCnt}명 X ${this.weeks}주 = ₩${totalStr}`;

    if(isDebug) console.log("klass-price-calculator / updateTotal / total : ",total);
    if(isDebug) console.log("klass-price-calculator / updateTotal / totalStr : ",totalStr);

    this.totalComponent.setInput(totalStr);

  } // end method


  onChangedFromChild(myEvent:MyEvent) :void{

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

        this.studentCntComponent = myEvent.metaObj;
        this.checkComponentReady();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_TOTAL)) {

        this.totalComponent = myEvent.metaObj;
        this.checkComponentReady();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_WEEK)) {

        this.weeksComponent = myEvent.metaObj;
        this.checkComponentReady();

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT)) {

        let price:number = +myEvent.value;
        this.updatePriceForStudent(price);

        // 가격 변경을 부모 객체에도 전달.
        this.emitEventOnChange();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER)) {

        let studentCnt:number = +myEvent.value;
        this.updateStudentCnt(studentCnt);

        // 전체 데이터를 부모 객체에도 전달.
        this.emitEventOnChange();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_WEEK)) {

        this.updateWeeks(+myEvent.value);

        // 전체 데이터를 부모 객체에도 전달.
        this.emitEventOnChange();

      } // end if       

    } // end if

  } // end method

} // end class