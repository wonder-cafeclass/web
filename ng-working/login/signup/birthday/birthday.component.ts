import {  Component, 
          Input, 
          Output,
          EventEmitter,          
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

import { MyLoggerService }      from '../../../util/service/my-logger.service';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';

import { MyBirthdayService }    from "../../../util/service/my-birthday.service";


@Component({
  moduleId: module.id,
  selector: 'birthday',
  templateUrl: 'birthday.component.html',
  styleUrls: [ 'birthday.component.css' ]
})
export class BirthdayComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() myCheckerService:MyCheckerService = null;

  @Output() emitter = new EventEmitter<MyEvent>();

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  birthYearArr:number[];
  selectedYear:number=-1;
  birthMonthArr:number[];
  selectedMonth:number=-1;
  birthDayArr:number[];
  selectedDay:number=-1;

  myCheckerBirthYear:MyChecker;  
  myCheckerBirthMonth:MyChecker;  
  myCheckerBirthDay:MyChecker;    

  constructor(  private myLoggerService:MyLoggerService, 
                private myEventService:MyEventService,
                private myBirthdayService: MyBirthdayService) {}

  ngOnInit(): void {

    this.birthYearArr = this.myBirthdayService.getYear();
    this.selectedYear = this.birthYearArr[Math.round(this.birthYearArr.length*2/3)];
    this.birthMonthArr = this.myBirthdayService.getMonth();
    this.selectedMonth = this.birthMonthArr[Math.round(this.birthMonthArr.length/2)];
    this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
    this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length/2)];
    
  }

  private setMyChecker() :void {
    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myCheckerBirthYear) {
      this.myCheckerBirthYear = this.myCheckerService.getMyChecker("user_birth_year");
    }
    if(null == this.myCheckerBirthMonth) {
      this.myCheckerBirthMonth = this.myCheckerService.getMyChecker("user_birth_month");
    }
    if(null == this.myCheckerBirthDay) {
      this.myCheckerBirthDay = this.myCheckerService.getMyChecker("user_birth_day");
    }

  }
  isOKBirthYear(input:string) :boolean {

    this.setMyChecker();

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerBirthYear, input);
  }  
  isOKBirthMonth(input:string) :boolean {

    this.setMyChecker();

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerBirthMonth, input);
  }  
  isOKBirthDay(input:string) :boolean {

    this.setMyChecker();

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerBirthDay, input);
  } 

  // @ Desc : 생년이 제대로 입력되었는지 확인합니다.
  public hasNotDoneBirthYear() :boolean {
    return !this.hasDoneBirthYear();
  }
  public hasDoneBirthYear() :boolean {

    let isOK:boolean = this.isOKBirthYear(""+this.selectedYear);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      console.log("birthday / hasDoneBirthYear / history : ",history);
    }

    return isOK;
  }
  // @ Desc : 생년을 입력해달라는 표시를 화면에 보여줍니다.
  public showWarningBirthYear() :void {
    // Do something...
  }
  public getBirthYear() :string {
    return "" + this.selectedYear;
  }

  public hasNotDoneBirthMonth() :boolean {
    return !this.hasDoneBirthMonth();
  }
  public hasDoneBirthMonth() :boolean {

    let monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
    let isOK:boolean = this.isOKBirthMonth(monthCalFormat);
    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      console.log("birthday / hasDoneBirthMonth / history : ",history);
    }

    return isOK;
  }  
  // @ Desc : 생월을 입력해달라는 표시를 화면에 보여줍니다.
  public showWarningBirthMonth() :void {
    // Do something...
  }  
  public getBirthMonth() :string {
    let monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
    return monthCalFormat;
  }


  public hasNotDoneBirthDay() :boolean {
    return !this.hasDoneBirthDay();
  }
  public hasDoneBirthDay() :boolean {

    let dayCalFormat = this.setCalendarFormat("" + this.selectedDay);
    let isOK:boolean = this.isOKBirthDay(dayCalFormat);

    console.log("TEST / hasDoneBirthDay / dayCalFormat : ",dayCalFormat);
    console.log("TEST / hasDoneBirthDay / isOK : ",isOK);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      console.log("birthday / hasDoneBirthDay / history : ",history);
    }

    return isOK;
  }   
  // @ Desc : 생일을 입력해달라는 표시를 화면에 보여줍니다.
  public showWarningBirthDay() :void {
    // Do something...
  }
  public getBirthDay() :string {
    let monthCalFormat = this.setCalendarFormat("" + this.selectedDay);
    return monthCalFormat;
  }



  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if
  }

  onBlur(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if
  } 

  onClickInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    this.isFocusInfo = !this.isFocusInfo;
  }

  onMouseOverInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusInfo) {
      this.isFocusInfo = true;      
    } // end if
  }

  onMouseOutInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusInfo) {
      this.isFocusInfo = false;
    } // end if
  }

  onChangeBirthYear(selectBirthYear) :void {

    this.setMyChecker();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("birtday / onChangeBirthYear / init");

    this.selectedYear = selectBirthYear;

    if(isDebug) console.log("birtday / onChangeBirthYear / this.selectedYear : ",this.selectedYear);

    let isOK:boolean = this.isOKBirthYear(""+this.selectedYear);

    if(isDebug) console.log("birtday / onChangeBirthYear / isOK : ",isOK);

    if(isOK) {

      // 부모 객체에게 Change Event 발송 
      let myEventOnChange:MyEvent =
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public key:string
        this.myEventService.KEY_USER_BIRTH_YEAR,
        // public value:string
        "" + this.selectedYear,
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        this.myCheckerBirthYear
      );
      this.emitter.emit(myEventOnChange);

    } else {

      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("birtday / onChangeBirthYear / history : ",history);

    } // end if
  }

  onChangeBirthMonth(selectBirthMonth) :void {

    this.setMyChecker();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("birtday / onChangeBirthMonth / init");    

    this.selectedMonth = selectBirthMonth;

    // 월이 바뀌었습니다. 월별 날짜도 연동되어 바꿉니다.
    this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
    this.selectedDay = this.birthDayArr[Math.round(this.birthDayArr.length/2)];    

    if(isDebug) console.log("birtday / onChangeBirthMonth / this.selectedMonth : ",this.selectedMonth);

    let monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
    let isOK:boolean = this.isOKBirthMonth(monthCalFormat);

    if(isDebug) console.log("birtday / onChangeBirthMonth / isOK : ",isOK);

    if(isOK) {

      // 부모 객체에게 Change Event 발송 
      let myEventOnChange:MyEvent =
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public key:string
        this.myEventService.KEY_USER_BIRTH_MONTH,
        // public value:string
        monthCalFormat,
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        this.myCheckerBirthMonth
      );
      this.emitter.emit(myEventOnChange);

    } else {

      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("birtday / onChangeBirthMonth / history : ",history);

    } // end if

  }  

  onChangeBirthDay(selectBirthDay) :void {

    this.setMyChecker();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("birtday / onChangeBirthDay / init");    

    this.selectedDay = selectBirthDay;

    if(isDebug) console.log("birtday / onChangeBirthDay / this.selectedDay : ",this.selectedDay);

    let dayCalFormat = this.setCalendarFormat("" + this.selectedDay);
    let isOK:boolean = this.isOKBirthDay(dayCalFormat);

    if(isDebug) console.log("birtday / onChangeBirthDay / isOK : ",isOK);
    if(isDebug) console.log("birtday / onChangeBirthDay / dayCalFormat : ",dayCalFormat);

    if(isOK) {

      // 부모 객체에게 Change Event 발송 
      let myEventOnChange:MyEvent =
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public key:string
        this.myEventService.KEY_USER_BIRTH_DAY,
        // public value:string
        dayCalFormat,
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        this.myCheckerBirthDay
      );
      this.emitter.emit(myEventOnChange);

    } else {

      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("birtday / onChangeBirthDay / history : ",history);

    } // end if

  }  

  setCalendarFormat(calNumStr:string) :string {

    let calNum:number = parseInt(calNumStr);
    let calNumStrFormatted:string = "";
    if(0 < calNum && calNum < 10) {
      calNumStrFormatted = "0" + calNum;
    } else {
      calNumStrFormatted = "" + calNum;
    }

    return calNumStrFormatted;
  }

}
