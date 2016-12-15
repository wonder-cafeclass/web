import { Component, 
         OnInit, 
         AfterViewInit,
         OnChanges,
         SimpleChanges,
         HostBinding,
         trigger, 
         transition, 
         ViewChild,
         animate, 
         style, 
         state }                         from '@angular/core';
import { Router, 
         ActivatedRoute, 
         Params }                        from '@angular/router';
import { Observable }                    from 'rxjs/Observable';         

import { Klass }                         from './model/klass';
import { KlassPrice }                    from './model/klass-price';

import { AuthService }                   from '../auth.service';
import { KlassRadioBtnService }          from './service/klass-radiobtn.service';
import { KlassCheckBoxService }          from './service/klass-checkbox.service';
import { KlassService }                  from './service/klass.service';

import { RadioBtnOption }                from '../widget/radiobtn/model/radiobtn-option';
import { CheckBoxOption }                from '../widget/checkbox/model/checkbox-option';
import { InputViewUpdown }               from '../widget/input-view/model/input-view-updown';
import { Calendar }                      from '../widget/calendar/model/calendar';
import { DialogService }                 from '../widget/dialog.service';
import { ImageGridComponent }            from '../widget/image-grid/image-grid.component';

import { KlassDetailNavListComponent }   from './klass-detail-nav-list.component';

import { ImageService }                  from '../util/image.service';
import { MyEventService }                from '../util/service/my-event.service';
import { MyCheckerService }              from '../util/service/my-checker.service';
import { MyEvent }                       from '../util/model/my-event';
import { MyLoggerService }               from '../util/service/my-logger.service';
import { MyEventWatchTowerService }      from '../util/service/my-event-watchtower.service';
import { MyResponse }                    from '../util/model/my-response';

import { UserService }                   from '../users/service/user.service';
import { User }                          from '../users/model/user';
import { TeacherService }                from '../teachers/service/teacher.service';
import { Teacher }                       from '../teachers/model/teacher';


@Component({
  moduleId: module.id,
  styleUrls: ['klass-detail.component.css'],
  templateUrl: 'klass-detail.component.html'
})
export class KlassDetailComponent implements OnInit, OnChanges {

  klass: Klass;
  klassTimeBegin:string;
  klassTimeEnd:string;

  klassDayBegin:string;
  klassDateBegin:string;
  
  klassPriceMin:string;
  klassPriceMax:string;
  klassWeekMin:number;
  klassWeekMax:number;

  klassFeature:string;
  klassTarget:string;
  klassSchedule:string;

  // klassCalendarTableLinear:Calendar[][];
  // klassCalendarTableMonthly:Calendar[][][];

  editTitle: string;

  priceTagCurrency:string="₩";
  priceTagColor:string="#e85c41";
  priceTagWidth:number=105;
  priceTagCageWidth:number=105;
  pricePerWeekFormat:string="주";
  pricetagDesc:string;

  selectileImageTable:string[][];
  selectileImageHeight:number=60;
  selectileImageWidth:number=60;
  selectileCageWidth:number=60;

  miniCalHeight:number=60;
  miniCalWidth:number=60;
  miniCalCageWidth:number=60;

  

  watchTowerImgUrl:string;
  watchTowerWhiteImgUrl:string;
  radiobtnOptionListCourseDuration:RadioBtnOption[];
  radiobtnOptionListNavTabs:RadioBtnOption[];

  // @ Deprecated
  // Admin Section
  radiobtnOptionListEnrollment:RadioBtnOption[];
  checkboxOptionListKlassDay:CheckBoxOption[];

  klassPriceUpdown:InputViewUpdown;
  klassTimeBeginUpdown:InputViewUpdown;
  klassTimeEndUpdown:InputViewUpdown;
  klassTitleUpdown:InputViewUpdown;
  klassDescUpdown:InputViewUpdown;

  firstClassDate:Calendar;
  firstClassDateFormatStr:string;

  // Image Uploader
  imgUploaderUploadAPIUrl:string="";
  imgUploaderImagePath:string="";
  imgUploaderImageUrl:string="";
  imgUploaderEventKey:string="";

  // REMOVE ME
  // DronList
  // dronListKey:string;
  // dronListTitle:string;
  // dronListSEinnerHTML:string;
  // dronListMyEventSingleInput:MyEvent;

  loginUser:User;
  loginTeacher:Teacher;

  isAdmin:boolean=false;
  isTeacher:boolean=false;

  @ViewChild(ImageGridComponent)
  private imageGridComponent: ImageGridComponent;

  // bannerImageTable:string[][];

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private klassService:KlassService,
    public imageService: ImageService,
    public dialogService: DialogService,
    private authService: AuthService,
    private myLoggerService:MyLoggerService,
    private myEventService: MyEventService,
    private watchTower:MyEventWatchTowerService,
    private radiobtnService:KlassRadioBtnService,
    private checkboxService:KlassCheckBoxService,
    private myCheckerService:MyCheckerService
  ) {}

  ngOnInit() {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngOnInit / 시작");

    // 1. 로그인 정보를 가져온다
    this.loginUser = this.watchTower.getLoginUser();
    if(null != this.loginUser) {
      this.isAdmin = this.loginUser.getIsAdmin();
      this.loginTeacher = this.watchTower.getLoginTeacher();
    }

    if(isDebug) console.log("klass-detail / ngOnInit / loginUser : ",this.loginUser);
    if(isDebug) console.log("klass-detail / ngOnInit / this.isAdmin : ",this.isAdmin);
    if(isDebug) console.log("klass-detail / ngOnInit / loginTeacher : ",this.loginTeacher);


    this.route.params
    .switchMap((params: Params) => {

      let klassId:number = +params['id'];

      if(klassId === -100 && null == this.loginTeacher) {

        // 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.
        if(isDebug) console.log("klass-detail / ngOnInit / 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.");
        this.router.navigate(["/"]);
        return;

      } else if(klassId === -100) {

        // 1-2. 선생님만이, 빈 수업 화면을 볼수 있습니다.
        if(isDebug) console.log("klass-detail / ngOnInit / 1-2. 선생님입니다. 새로운 수업을 하나 만듭니다.");
        return this.klassService.addKlassEmpty(
          // apiKey:string, 
          this.watchTower.getApiKey(),
          // userId:number,
          +this.loginUser.id,
          // teacherId:number,
          +this.loginTeacher.id,
          // teacherResume:string,
          this.loginTeacher.resume,
          // teacherGreeting:string
          this.loginTeacher.greeting
        );

      } // end if

      // 기존 수업 가져오기
      if(isDebug) console.log("klass-detail / ngOnInit / 기존 수업 가져오기 / klassId : ",klassId);
      return this.klassService.getKlass(klassId);
    })
    .subscribe((myResponse: MyResponse) => {

      if(isDebug) console.log("klass-detail / ngOnInit / subscribe / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        let klassJSON = myResponse.getDataProp("klass");
        if(isDebug) console.log("klass-detail / ngOnInit / subscribe / klassJSON : ",klassJSON);
        if(null != klassJSON) {
          this.klass = this.klassService.getKlassFromJSON(klassJSON);
        } // end if

      } else if(myResponse.isFailed() && null != myResponse.error) {  

        this.watchTower.announceErrorMsgArr([myResponse.error]);

      } else {

        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `klass-detail / ngOnInit / Failed!`
        );        

      } // end if
      if(isDebug) console.log("klass-detail / ngOnInit / subscribe / this.klass : ",this.klass);

    }); // end route

    this.setKlassBannerImageUploader();

  } // end method

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngOnChanges / 시작");

    if(isDebug) console.log("klass-detail / ngOnChanges / changes : ",changes);


  }  

  private setKlassBannerImageUploader():void {
    // Set image uploader props
    this.imgUploaderUploadAPIUrl="/CI/index.php/api/upload/image";
    this.imgUploaderImagePath="/assets/images/class/banner";
    this.imgUploaderImageUrl="/assets/images/class/banner/banner_default.svg";
    this.imgUploaderEventKey=this.myEventService.KEY_KLASS_BANNER;
  }

  private setEmptyKlass() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setEmptyKlass / 시작");

    // 새로운 수업을 만들때, 빈 수업 데이터를 만들어 가져옵니다.


  }

  private setFirstClassDateFormat() :void {
    this.firstClassDate = this.getFirstClassDate(this.klass);

    if(this.firstClassDate) {
      this.firstClassDateFormatStr = `${this.firstClassDate.month}월 ${this.firstClassDate.date}일 ${this.firstClassDate.dayKor}요일`;
    }
  }
  private getFirstClassDate(klass:Klass) :Calendar {

    let calendar_table_monthly = klass.calendar_table_monthly;
    for (var i = 0; i < calendar_table_monthly.length; ++i) {
      let calendar_table = calendar_table_monthly[i];
      // console.log("calendar_table : ",calendar_table);
      for (var j = 0; j < calendar_table.length; ++j) {
        let week = calendar_table[j];
        // console.log("week : ",week);
        for (var k = 0; k < week.length; ++k) {
          let date:Calendar = week[k];
          // console.log("date : ",date);

          if(null === date) {
            continue;
          }
          if(date.isExpired) {
            continue; 
          }
          if(!date.hasKlass) {
            continue;
          }

          if(4 == +klass.enrollment_interval_week && !date.isEnrollment4weeks) {
            continue; 
          } else if(2 == +klass.enrollment_interval_week && !date.isEnrollment2weeks) {
            continue; 
          } else if(1 == +klass.enrollment_interval_week && !date.isEnrollmentWeek) {
            continue; 
          }

          // 첫 수업을 찾았습니다.
          return date;
        }
      }
    }

    return null;
  }

  initAdmin() {

    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
    this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);

    // 수강단위 기간 - (4주/8주/12주)
    this.radiobtnOptionListCourseDuration =
    this.radiobtnService.getKlassEnrolmentWeeks(this.klass);

    // 수강신청 가능 기간
    let optionList:RadioBtnOption[] = 
    this.radiobtnService.getKlassEnrolmentInterval(this.klass, ""+this.klass.enrollment_interval_week);
    this.radiobtnOptionListEnrollment = optionList;

    let fontSizeTitle:number=16;
    let fontSizeText:number=12;
    let color:string="#f0f";

    this.klassTitleUpdown = 
    new InputViewUpdown(
      // public title:string
      "강의 제목",
      // public fontSizeTitle:number
      fontSizeTitle,
      // public fontSizeText:number
      fontSizeText, 
      // public type:string
      "title",
      // public color:string
      color,
      // public myEvent:MyEvent
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ANY,
        // public key:string
        this.myEventService.KLASS_TITLE,
        // public value:string
        this.klass.title,
        // public metaObj:any
        this.klass,
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker()
      )
    ); 

    this.klassDescUpdown = 
    new InputViewUpdown(
      // public title:string
      "강의 설명",
      // public fontSizeTitle:number
      fontSizeTitle,
      // public fontSizeText:number
      fontSizeText, 
      // public type:string
      "title",
      // public color:string
      color,
      // public myEvent:MyEvent
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ANY,
        // public key:string
        this.myEventService.KLASS_DESC,
        // public value:string
        this.klass.desc,
        // public metaObj:any
        this.klass,
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker()
      )
    );     

    // 수업 시작 시간  
    this.klassTimeBeginUpdown = 
    new InputViewUpdown(
      // public title:string
      "수업 시작 시간",
      // public fontSizeTitle:number
      fontSizeTitle,
      // public fontSizeText:number
      fontSizeText, 
      // public type:string
      "price",
      // public color:string
      color,
      // public myEvent:MyEvent
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ANY,
        // public key:string
        this.myEventService.KLASS_TIME_BEGIN,
        // public value:string
        this.klass.time_begin,
        // public metaObj:any
        this.klass,
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker()
      )
    );

    //   
    this.klassTimeEndUpdown = 
    new InputViewUpdown(
      // public title:string
      "수업 종료 시간",
      // public fontSizeTitle:number
      fontSizeTitle,
      // public fontSizeText:number
      fontSizeText, 
      // public type:string
      "price",
      // public color:string
      color,
      // public myEvent:MyEvent
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ANY,
        // public key:string
        this.myEventService.KLASS_TIME_END,
        // public value:string
        this.klass.time_end,
        // public metaObj:any
        this.klass,
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker()
      )
    );    

    // 수강 금액
    this.klassPriceUpdown = 
    new InputViewUpdown(
      // public title:string
      "수강 금액",
      // public fontSizeTitle:number
      fontSizeTitle,
      // public fontSizeText:number
      fontSizeText, 
      // public type:string
      "price",
      // public color:string
      color,
      // public myEvent:MyEvent
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ANY,
        // public key:string
        this.myEventService.KLASS_WEEK_MAX,
        // public value:string
        ""+this.klass.price,
        // public metaObj:any
        this.klass,
        // public myChecker:MyChecker
        this.myCheckerService.getTitleChecker()
      )
    );

    // 운영자 지정 - 수업 요일 
    // days_list
    this.checkboxOptionListKlassDay = this.checkboxService.getKlassDays(this.klass);
  }

  cancel() {
    this.gotoKlassList();
  }

  save() {
    this.klass.title = this.editTitle;
    this.gotoKlassList();
  }

  // @ Deprecated
  canDeactivate(): Promise<boolean> | boolean {
    return true;

    /*
    // Allow synchronous navigation (`true`) if no klass or the klass is unchanged
    if (!this.klass || this.klass.title === this.editTitle) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
    */
  }

  gotoKlassList() {
    let klassId = this.klass ? this.klass.id : null;

    console.log("gotoKlassList / klassId : ",klassId);

    // Pass along the klass id if available
    // so that the KlassListComponent can select that klass.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises

    // this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
  }

  // EVENT
  onClickEnrollment(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickEnrollment / klass ::: ",klass);
  }

  onClickWishList(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickEnrollment / klass ::: ",klass);
  }

  onClickYellowID(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickYellowID / klass ::: ",klass);
  }

  onChangedFromMiniCalendar(myEvent:MyEvent) {

    let eventName:string = myEvent.eventName;
    let myEventService:MyEventService = this.myEventService;

    /*
    if(this.myEventService.is_it(eventName,myEventService.ON_MOUSEENTER_KLASS_CALENDAR_DATE)) {
      console.log("ON_MOUSEENTER_KLASS_CALENDAR_DATE / myEvent : ",myEvent);
    } else if(this.myEventService.is_it(eventName,myEventService.ON_MOUSELEAVE_KLASS_CALENDAR_DATE)) {
      console.log("ON_MOUSELEAVE_KLASS_CALENDAR_DATE / myEvent : ",myEvent);
    }
    */

  }

  // @ Deprecated
  onChangedFromInputView(myEvent:MyEvent) {

    let eventName:string = myEvent.eventName;
    let myEventService:MyEventService = this.myEventService;

    /*
    if(this.myEventService.is_it(eventName,myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
      // '수강신청일'이 변경되었습니다.
      console.log("'수강신청일'이 변경되었습니다.");
    } // end if
    */
  }

  onChangedFromChild(myEvent:MyEvent) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / onChangedFromChild / 시작");
    if(isDebug) console.log("klass-detail / onChangedFromChild / myEvent : ",myEvent);

    let eventName:string = myEvent.eventName;

    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(isDebug) console.log("klass-detail / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        // 섬네일 주소가 넘어옴.
        let banner_url:string = `${this.imgUploaderImagePath}/${myEvent.value}`;

        // 이미지를 추가합니다. 
        this.imageGridComponent.addImageSingleColumn(banner_url);

        // REMOVE ME
        /*
        if(null == this.bannerImageTable || 0 == this.bannerImageTable.length) {
          if(isDebug) console.log("klass-detail / onChangedFromChild / 첫번째 배너 추가");
          this.bannerImageTable = [[banner_url]];
        } else {
          if(isDebug) console.log("klass-detail / onChangedFromChild / 첫번째 배너 이후 추가");
          this.bannerImageTable.push([banner_url]);
        } // end if
        */

        // Footer의 속성을 fixed-bottom을 해제해야 함.
        this.watchTower.announceContentHeight();
        if(isDebug) console.log("klass-detail / onChangedFromChild / banner_url : ",banner_url);

        // TODO - class banner를 등록합니다.
        this.klassService.addKlassBanner(
          // apiKey:string, 
          this.watchTower.getApiKey(),
          // userId:number,
          +this.loginUser.id,
          // klassId:number,
          +this.klass.id,
          // klassBanner:string
          myEvent.value
        ).then((myResponse:MyResponse) => {
          // 로그 등록 결과를 확인해볼 수 있습니다.
          if(isDebug) console.log("klass-detail / onChangedFromChild / myResponse : ",myResponse);
          if(myResponse.isSuccess()) {

          } else if(myResponse.isFailed() && null != myResponse.error) {  

            this.watchTower.announceErrorMsgArr([myResponse.error]);

          } else {
            // 에러 로그 등록
            this.myLoggerService.logError(
              // apiKey:string
              this.watchTower.getApiKey(),
              // errorType:string
              this.myLoggerService.errorAPIFailed,
              // errorMsg:string
              `klass-detail / onChangedFromChild / addKlassBanner / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / banner_url : ${banner_url}`
            ); // end logger      

          } // end if

        }) // end service

        // wonder.jung
        

      } // end if

    } // end if

  } // end method




  // Admin Section
  showSEKlassFeature() :void {

  }

  // REMOVE ME
  /*
  clearDronList() :void {
    this.dronListTitle = null;
    this.dronListSEinnerHTML = null;
    this.dronListMyEventSingleInput = null;
  }
  */  
}
