import {  Component, 
          Input, 
          Output,
          EventEmitter,          
          OnInit,
          AfterViewInit }       from '@angular/core';
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
export class BirthdayComponent implements OnInit, AfterViewInit {

  @Input() top:number=-1;
  @Input() left:number=-1;
  @Input() eventKey:string="";//this.myEventService.KEY_USER_BIRTH_YEAR

  @Output() emitter = new EventEmitter<MyEvent>();

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  birthYearArr:string[]=[];
  selectedYear:number=-1;
  birthMonthArr:string[]=[];
  selectedMonth:number=-1;
  birthDayArr:string[]=[];
  selectedDay:number=-1;

  myCheckerBirthYear:MyChecker;  
  myCheckerBirthMonth:MyChecker;  
  myCheckerBirthDay:MyChecker;

  isAdmin:boolean=false;  

  isShowTooltipHead:boolean=false;
  isShowTooltipBody:boolean=false;
  isShowTooltipTail:boolean=false;

  isValidHead:boolean=false;
  isValidBody:boolean=false;
  isValidTail:boolean=false;

  tooltipHeadMsg:string="";
  tooltipBodyMsg:string="";
  tooltipTailMsg:string="";

  constructor(  private myLoggerService:MyLoggerService, 
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService,
                private myBirthdayService: MyBirthdayService) {}

  ngOnInit(): void {

    if(this.isDebug()) console.log("birthday / ngOnInit / init");

    if(null == this.eventKey || "" == this.eventKey) {
      this.eventKey = this.myEventService.KEY_USER_BIRTH;
    } // end if

  } // end method

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("birthday / ngAfterViewInit");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("birthday / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("birthday / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("birthday / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdmin();
    this.myCheckerService.setReady(
      // checkerMap:any
      this.watchTower.getCheckerMap(),
      // constMap:any
      this.watchTower.getConstMap(),
      // dirtyWordList:any
      this.watchTower.getDirtyWordList(),
      // apiKey:string
      this.watchTower.getApiKey()
    ); // end setReady
  }

  private setBirthdayDefault() :void {

    if(this.isDebug()) console.log("birthday / setBirthdayDefault / 시작");

    this.birthYearArr = this.myBirthdayService.getYear();
    if(this.isDebug()) console.log("birthday / setBirthdayDefault / this.birthYearArr : ",this.birthYearArr);
    if(!(0 < this.selectedYear)) {
      // 지정된 '연도'가 없다면, 초기 값은 '선택안됨'
      if(this.isDebug()) console.log("birthday / setBirthdayDefault / birthYearArr / 지정된 '월'이 없다면, 초기 값은 '선택안됨'");
      this.birthYearArr.unshift("-");
    } // end if


    this.birthMonthArr = this.myBirthdayService.getMonth();
    if(this.isDebug()) console.log("birthday / setBirthdayDefault / this.birthMonthArr : ",this.birthMonthArr);
    if(!(0 < this.selectedMonth)) {
      // 지정된 '월'이 없다면, 초기 값은 '선택안됨'
      if(this.isDebug()) console.log("birthday / setBirthdayDefault / birthMonthArr / 지정된 '월'이 없다면, 초기 값은 '선택안됨'");
      this.birthMonthArr.unshift("-");
    } // end if


    this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
    if(this.isDebug()) console.log("birthday / setBirthdayDefault / this.birthDayArr : ",this.birthDayArr);
    if(!(0 < this.selectedMonth)) {
      // 지정된 '월'이 없다면, 초기 값은 '선택안됨'
      if(this.isDebug()) console.log("birthday / setBirthdayDefault / birthDayArr / 지정된 '월'이 없다면, 초기 값은 '선택안됨'");
      this.birthDayArr.unshift("-");
    } // end if

  } // end method

  private setMyChecker() :void {

    if(this.isDebug()) console.log("birthday / setMyChecker / 시작");

    if(null == this.myCheckerService) {
      if(this.isDebug()) console.log("birthday / setMyChecker / 중단 / this.myCheckerService is not valid!");
      return;
    }

    if(null == this.myCheckerBirthYear) {
      if(this.isDebug()) console.log("birthday / setMyChecker / update checker / this.myCheckerBirthYear");
      this.myCheckerBirthYear = this.myCheckerService.getMyChecker("user_birth_year");
    }
    if(null == this.myCheckerBirthMonth) {
      if(this.isDebug()) console.log("birthday / setMyChecker / update checker / this.myCheckerBirthMonth");
      this.myCheckerBirthMonth = this.myCheckerService.getMyChecker("user_birth_month");
    }
    if(null == this.myCheckerBirthDay) {
      if(this.isDebug()) console.log("birthday / setMyChecker / update checker / this.myCheckerBirthDay");
      this.myCheckerBirthDay = this.myCheckerService.getMyChecker("user_birth_day");
    }

  }     

  private init() :void {

    if(this.isDebug()) console.log("birthday / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    // Ready Event 발송
    this.emitEventOnReady();
  }

  emitEventOnReady():void {

    if(this.isDebug()) console.log("birthday / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

  } // end method  

  // @ Desc : 부모 객체가 Birthday Component의 참조를 받아 호출하는 세팅 메서드
  setDefault() :void {

    if(this.isDebug()) console.log("birthday / init / 시작");

    this.setBirthdayDefault();
    this.setMyChecker();

  }

  isNotOKBirthYear(input:string) :boolean {
    return !this.isOKBirthYear(input);
  }
  isOKBirthYear(input:string) :boolean {

    if(this.isDebug()) console.log("birthday / isOKBirthYear / 시작");

    if(null == this.myCheckerService) {
      if(this.isDebug()) console.log("birthday / isOKBirthYear / 중단 / null == this.myCheckerService");
      return false;
    } // end if
    if(null == this.myCheckerBirthYear) {
      this.setMyChecker();
    } // end if

    let isOK:boolean = this.myCheckerService.isOK(this.myCheckerBirthYear, input);
    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("birthday / isOKBirthYear / 중단 / history : ",history);
    }

    return isOK;
  }  
  isNotOKBirthMonth(input:string) :boolean {
    return !this.isOKBirthMonth(input);
  }
  isOKBirthMonth(input:string) :boolean {

    if(this.isDebug()) console.log("birthday / isOKBirthMonth / 시작");

    if(null == this.myCheckerService) {
      if(this.isDebug()) console.log("birthday / isOKBirthMonth / 중단 / null == this.myCheckerService");
      return false;
    }
    if(null == this.myCheckerBirthMonth) {
      this.setMyChecker();
    } // end if

    let isOK:boolean = this.myCheckerService.isOK(this.myCheckerBirthMonth, input);
    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("birthday / isOKBirthMonth / 중단 / history : ",history);
    } // end if

    return isOK;
  }  
  isNotOKBirthDay(input:string) :boolean {
    return !this.isOKBirthDay(input);
  }
  isOKBirthDay(input:string) :boolean {

    if(this.isDebug()) console.log("birthday / isOKBirthDay / 시작");

    if(null == this.myCheckerService) {
      if(this.isDebug()) console.log("birthday / isOKBirthDay / 중단 / null == this.myCheckerService");
      return false;
    }
    if(null == this.myCheckerBirthDay) {
      this.setMyChecker();
    } // end if

    let isOK:boolean = this.myCheckerService.isOK(this.myCheckerBirthDay, input);
    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("birthday / isOKBirthDay / 중단 / history : ",history);
    } // end if

    return isOK;
  } 
  setBirthYear(year:string) :void {

    if(this.isDebug()) console.log("birthday / setBirthYear / year : ",year);

    if(this.isOKBirthYear(year)) {
      if(this.isDebug()) console.log("birthday / setBirthYear / done");
      this.birthYearArr = this.myBirthdayService.getYear();
      this.selectedYear = +year;
    }
  }
  setBirthMonth(month:string) :void {

    if(this.isDebug()) console.log("birthday / setBirthMonth / month : ",month);

    if(this.isOKBirthMonth(month)) {
      if(this.isDebug()) console.log("birthday / setBirthMonth / done");
      this.birthMonthArr = this.myBirthdayService.getMonth();
      this.selectedMonth = +month;
    }
  }
  setBirthDay(month:string, day:string) :void {

    if(this.isDebug()) console.log("birthday / setBirthDay / day : ",day);

    if(this.isOKBirthDay(day)) {
      if(this.isDebug()) console.log("birthday / setBirthDay / done");

      // 날짜가 설정되어 있지 않다면, 세팅해줍니다.
      this.birthDayArr = this.myBirthdayService.getDay(+month);
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
    this.isShowTooltipHead = true;
    this.isValidHead = false;
    this.tooltipHeadMsg = "태어난 연도를 확인해주세요";
  }
  public hideWarningBirthYear() :void {
    this.isShowTooltipHead = false;
    this.tooltipHeadMsg = "";
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
    }

    return isOK;
  }  
  // @ Desc : 생월을 입력해달라는 표시를 화면에 보여줍니다.
  public showWarningBirthMonth() :void {
    this.isShowTooltipBody = true;
    this.isValidBody = false;
    this.tooltipBodyMsg = "태어난 월을 확인해주세요";
  }  
  public hideWarningBirthMonth() :void {
    this.isShowTooltipBody = false;
    this.tooltipBodyMsg = "";
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

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
    }

    return isOK;
  }   
  // @ Desc : 생일을 입력해달라는 표시를 화면에 보여줍니다.
  public showWarningBirthDay() :void {
    this.isShowTooltipTail = true;
    this.isValidTail = false;
    this.tooltipTailMsg = "태어난 일을 확인해주세요";
  }
  public hideWarningBirthDay() :void {
    this.isShowTooltipTail = false;
    this.tooltipTailMsg = "";
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

    if(this.isDebug()) console.log("birtday / onChangeBirthYear / init");

    this.selectedYear = selectBirthYear;

    if(this.isDebug()) console.log("birtday / onChangeBirthYear / this.selectedYear : ",this.selectedYear);

    let isOK:boolean = this.isOKBirthYear(""+this.selectedYear);

    if(this.isDebug()) console.log("birtday / onChangeBirthYear / isOK : ",isOK);

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

      // 노출된 경고창이 있다면 감춘다.
      this.hideWarningBirthYear();
    } else {

      let history = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("birtday / onChangeBirthYear / history : ",history);

    } // end if
  }

  onChangeBirthMonth(selectBirthMonth) :void {

    if(this.isDebug()) console.log("birtday / onChangeBirthMonth / init");    

    this.selectedMonth = selectBirthMonth;

    // 월이 바뀌었습니다. 월별 날짜도 연동되어 바꿉니다.
    this.birthDayArr = this.myBirthdayService.getDay(this.selectedMonth);
    this.selectedDay = +this.birthDayArr[Math.round(this.birthDayArr.length/2)];    

    if(this.isDebug()) console.log("birtday / onChangeBirthMonth / this.selectedMonth : ",this.selectedMonth);

    let monthCalFormat = this.setCalendarFormat("" + this.selectedMonth);
    let dayCalFormat = this.setCalendarFormat("" + this.selectedDay);
    let isOK:boolean = this.isOKBirthMonth(monthCalFormat);

    if(this.isDebug()) console.log("birtday / onChangeBirthMonth / isOK : ",isOK);

    if(isOK) {

      // 부모 객체에게 Change Event 발송 
      let myEventOnChangeBirthMonth:MyEvent =
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
      this.emitter.emit(myEventOnChangeBirthMonth);

      // 부모 객체에게 Change Event 발송 
      let myEventOnChangeBirthDay:MyEvent =
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
      this.emitter.emit(myEventOnChangeBirthDay);     

      // 노출된 경고창이 있다면 감춘다.
      this.hideWarningBirthMonth();

    } else {

      let history = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("birtday / onChangeBirthMonth / history : ",history);

    } // end if

  }  

  onChangeBirthDay(selectBirthDay) :void {

    if(this.isDebug()) console.log("birtday / onChangeBirthDay / init");    

    this.selectedDay = selectBirthDay;

    if(this.isDebug()) console.log("birtday / onChangeBirthDay / this.selectedDay : ",this.selectedDay);

    let dayCalFormat = this.setCalendarFormat("" + this.selectedDay);
    let isOK:boolean = this.isOKBirthDay(dayCalFormat);

    if(this.isDebug()) console.log("birtday / onChangeBirthDay / isOK : ",isOK);
    if(this.isDebug()) console.log("birtday / onChangeBirthDay / dayCalFormat : ",dayCalFormat);

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

      // 노출된 경고창이 있다면 감춘다.
      this.hideWarningBirthDay();

    } else {

      let history = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("birtday / onChangeBirthDay / history : ",history);

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
