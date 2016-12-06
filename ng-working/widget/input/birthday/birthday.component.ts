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

import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../../util/model/my-response';



@Component({
  moduleId: module.id,
  selector: 'birthday',
  templateUrl: 'birthday.component.html',
  styleUrls: [ 'birthday.component.css' ]
})
export class BirthdayComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

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

  isAdmin:boolean=false;    

  constructor(  private myLoggerService:MyLoggerService, 
                private myEventService:MyEventService,
                private myEventWatchTowerService:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService,
                private myBirthdayService: MyBirthdayService) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / ngOnInit / init");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerServiceReady();    

    
  }

  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / setIsAdmin / 시작");

    // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
    this.isAdmin = this.myEventWatchTowerService.getIsAdmin();
    if(isDebug) console.log("user-my-nav-list / setIsAdmin / 시작 / this.isAdmin : ",this.isAdmin);

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("user-my-nav-list / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerServiceReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / setMyCheckerServiceReady / 시작");

    // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {
      this.setMyCheckerService();
      this.init();
    }

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("user-my-nav-list / setMyCheckerServiceReady / isReady : ",isReady);

      if(!isReady) {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorTypeNotValidValue,
          // errorMsg:string
          `user-my-nav-list / setMyCheckerServiceReady / Failed! / isReady : ${isReady}`
        );        
        return;
      }

      this.setMyCheckerService();
      this.init();
    });    
  }  

  private setMyCheckerService() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / setMyCheckerService / 시작");

    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {

      this.myCheckerService.setReady(
        // checkerMap:any
        this.myEventWatchTowerService.getCheckerMap(),
        // constMap:any
        this.myEventWatchTowerService.getConstMap(),
        // dirtyWordList:any
        this.myEventWatchTowerService.getDirtyWordList(),
        // apiKey:string
        this.myEventWatchTowerService.getApiKey()
      ); // end setReady

      if(isDebug) console.log("user-my-nav-list / setMyCheckerService / done!");
    } // end if

  }

  private setBirthdayDefault() :void {
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

  private init() :void {
    this.setBirthdayDefault();
    this.setMyChecker();
  }

  isOKBirthYear(input:string) :boolean {
    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerBirthYear, input);
  }  
  isOKBirthMonth(input:string) :boolean {
    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerBirthMonth, input);
  }  
  isOKBirthDay(input:string) :boolean {
    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerBirthDay, input);
  } 
  setBirthYear(year:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("birthday / setBirthYear / year : ",year);

    if(this.isOKBirthYear(year)) {
      if(isDebug) console.log("birthday / setBirthYear / done");
      this.selectedYear = +year;
    }
  }
  setBirthMonth(month:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("birthday / setBirthMonth / month : ",month);

    if(this.isOKBirthMonth(month)) {
      if(isDebug) console.log("birthday / setBirthMonth / done");
      this.selectedMonth = +month;
    }
  }
  setBirthDay(day:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("birthday / setBirthDay / day : ",day);

    if(this.isOKBirthDay(day)) {
      if(isDebug) console.log("birthday / setBirthDay / done");
      this.selectedDay = +day;
    }
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
