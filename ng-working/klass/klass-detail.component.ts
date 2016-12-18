import { Component, 
         OnInit, 
         AfterViewInit,
         AfterViewChecked,
         OnChanges,
         SimpleChanges,
         HostBinding,
         trigger, 
         transition, 
         ViewChild,
         ViewChildren,
         QueryList,
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
import { ImageGridV2Component }          from '../widget/image-grid/image-grid-v2.component';
import { HiddenUploaderComponent }       from '../widget/input/img-uploader/hidden-uploader.component';
import { DefaultComponent }              from '../widget/input/default/default.component';
import { DefaultMeta }                   from '../widget/input/default/model/default-meta';
import { DefaultService }                from '../widget/input/default/service/default.service';

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
export class KlassDetailComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {

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

  klassTitle:string;

  // klassCalendarTableLinear:Calendar[][];
  // klassCalendarTableMonthly:Calendar[][][];

  editTitle: string; // Deprecated

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

  imgUploaderImagePathKlassPoster:string="";
  imgUploaderImageUrlKlassPoster:string="";
  imgUploaderEventKeyKlassPoster:string="";


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

  @ViewChildren(DefaultComponent) inputComponentList: QueryList<DefaultComponent>;
  defaultMetaList:DefaultMeta[];

  private klassTitleComponent: DefaultComponent;

  @ViewChild(ImageGridV2Component)
  private imageGridComponent: ImageGridV2Component;

  @ViewChild(HiddenUploaderComponent)
  private hiddenUploaderComponent: HiddenUploaderComponent;

  imageTableBannerList:string[][] = 
  [
    ["assets/images/class/banner/drinks.png"],
    ["assets/images/class/banner/help.png"]
  ];

  eventKeyKlassBanner:string="";

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
    private teacherService:TeacherService,
    private defaultService:DefaultService,
    private myCheckerService:MyCheckerService
  ) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / constructor / init");

    this.defaultMetaList = this.myEventService.getDefaultMetaListKlassDetail();

    if(isDebug) console.log("klass-detail / ngOnInit / this.defaultMetaList : ",this.defaultMetaList);

    this.eventKeyKlassBanner = this.myEventService.KEY_KLASS_BANNER;

  }


  ngOnInit() {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngOnInit / 시작");

  } // end method

  ngAfterViewInit():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngAfterViewInit / 시작");
    if(isDebug) console.log("klass-detail / ngAfterViewInit / this.imageGridComponent : ", this.imageGridComponent);

    this.watchTower.announceIsLockedBottomFooterFlexible(false);

    this.init();
  }

  ngAfterViewChecked():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngAfterViewChecked / 시작");

  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngOnChanges / 시작");

    if(isDebug) console.log("klass-detail / ngOnChanges / changes : ",changes);


  }

  private subscribeLoginTeacher() :void {

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("klass-detail / subscribeLoginTeacher / 시작");

    // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
    // Subscribe login user
    this.watchTower.loginTeacherAnnounced$.subscribe(
      (loginTeacher:Teacher) => {

      if(isDebug) console.log("klass-detail / subscribeLoginTeacher / loginTeacher : ",loginTeacher);
    
      // 로그인한 선생님 정보가 들어왔습니다.
      this.loginTeacher = this.teacherService.getTeacherFromJSON(loginTeacher);

      this.loginUser = this.watchTower.getLoginUser();
      if(null != this.loginUser) {
        this.isAdmin = this.loginUser.getIsAdmin();
        this.isTeacher = this.loginUser.isTeacher();
      } // end if

    }); // end subscribe
  }   

  private init():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / init / 시작");

    this.setUserInfo();
    this.setKlassBannerImageUploader(); 
    this.setKlassPosterImageUploader();  
    this.setDefaultComponents();
    this.getParams(); 
  } 

  private setUserInfo() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setUserInfo / 시작");

    // 1. 로그인 정보를 가져온다
    this.loginUser = this.watchTower.getLoginUser();
    if(null != this.loginUser) {
      // 1-1. 이미 등록되어 있는 로그인 정보가 있는 경우.
      this.isAdmin = this.loginUser.getIsAdmin();
      this.isTeacher = this.loginUser.isTeacher();
    }

    this.loginTeacher = this.watchTower.getLoginTeacher();
    if(null == this.loginTeacher) {
      // 1-2. 선생님 로그인 정보가 없다!
      // 2. 선생님 로그인 정보가 업데이트 되는 것을 비동기로 기다린다.
      this.subscribeLoginTeacher();
    }

    if(isDebug) console.log("klass-detail / setUserInfo / loginUser : ",this.loginUser);
    if(isDebug) console.log("klass-detail / setUserInfo / this.isAdmin : ",this.isAdmin);
    if(isDebug) console.log("klass-detail / setUserInfo / loginTeacher : ",this.loginTeacher);
    if(isDebug) console.log("klass-detail / setUserInfo / imageGridComponent : ",this.imageGridComponent);

  }

  private setDefaultComponents() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setDefaultComponents / 시작");

    // DefaultComponent들을 세팅
    let target = this.getInput(this.myEventService.KEY_KLASS_TITLE);
    if(null != target) {
      this.klassTitleComponent = target;
    } // end if

  }  
  // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
  private getInput(eventKey:string) :any {

    return this.defaultService.getInput(this.inputComponentList, eventKey);

  } 

  private getParams() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / getParams / 시작");


    this.route.params
    .switchMap((params: Params) => {

      let klassId:number = +params['id'];

      if(klassId === -100 && null == this.loginTeacher) {

        // 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.
        if(isDebug) console.log("klass-detail / getParams / 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.");
        this.router.navigate(["/"]);
        return;

      } else if(klassId === -100) {

        // 1-2. 선생님만이, 빈 수업 화면을 볼수 있습니다.
        if(isDebug) console.log("klass-detail / getParams / 1-2. 선생님입니다. 새로운 수업을 하나 만듭니다.");
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
      if(isDebug) console.log("klass-detail / getParams / 기존 수업 가져오기 / klassId : ",klassId);
      return this.klassService.getKlass(klassId);
    })
    .subscribe((myResponse: MyResponse) => {

      if(isDebug) console.log("klass-detail / getParams / subscribe / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        let klassJSON = myResponse.getDataProp("klass");
        if(isDebug) console.log("klass-detail / getParams / subscribe / klassJSON : ",klassJSON);
        if(null != klassJSON) {

          this.klass = this.klassService.getKlassFromJSON(klassJSON);

          if(isDebug) console.log("klass-detail / getParams / subscribe / this.imageGridComponent : ",this.imageGridComponent);


          this.onAfterReceivingKlass();


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
          `klass-detail / getParams / Failed!`
        );        

      } // end if
      if(isDebug) console.log("klass-detail / getParams / subscribe / this.klass : ",this.klass);

    }); // end route    

  }   

  private onAfterReceivingKlass() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / onAfterReceivingKlass / 시작");

    // fill datas
    this.imgUploaderImageUrlKlassPoster = this.klass.class_poster_url_loadable;
    this.klassTitle = this.klass.title;

    // set image-grid
    if(null != this.imageGridComponent) {
      this.imageGridComponent.compareUserImages(this.klass.class_banner_url_arr);
    }
  }

  private setKlassBannerImageUploader():void {
    // Set image uploader props
    this.imgUploaderUploadAPIUrl="/CI/index.php/api/upload/image";
    this.imgUploaderImagePath="/assets/images/class/banner";
    this.imgUploaderImageUrl="/assets/images/class/banner/banner_default.svg";
    this.imgUploaderEventKey=this.myEventService.KEY_KLASS_BANNER;
  }

  private setKlassPosterImageUploader():void {
    // Set image uploader props
    this.imgUploaderUploadAPIUrl="/CI/index.php/api/upload/image";
    this.imgUploaderImagePathKlassPoster="/assets/images/class/poster";
    this.imgUploaderImageUrlKlassPoster="/assets/images/class/poster/no_image.svg";
    this.imgUploaderEventKeyKlassPoster=this.myEventService.KEY_KLASS_POSTER;
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
  onClickKlassPoster(event) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / onClickKlassPoster / 시작");

    if(!this.isAdmin || !this.isTeacher) {
      if(isDebug) console.log("klass-detail / onClickKlassPoster / 중단 / 수업 포스터를 수정할수 없습니다.");
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    // 수업 이미지 업로드를 시작합니다.
    this.hiddenUploaderComponent.initFileUpload();
  }


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



  onChangedFromChild(myEvent:MyEvent):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / onChangedFromChild / 시작");
    if(isDebug) console.log("klass-detail / onChangedFromChild / myEvent : ",myEvent);

    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(isDebug) console.log("klass-detail / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      let lastHistory = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("klass-detail / onChangedFromChild / lastHistory : ",lastHistory);
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {

        if(  null != myEvent.metaObj ) {
          this.klassTitleComponent = myEvent.metaObj; 
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        if( null != myEvent.metaObj ) {
          this.imageGridComponent = myEvent.metaObj;

        } // end if
        if( null != this.klass && null != this.imageGridComponent ) {
          this.imageGridComponent.compareUserImages(this.klass.class_banner_url_arr);
        } // end if

      } // end if      

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {

        this.updateKlassTitle(myEvent.value, false);

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_SUBMIT)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {

        this.updateKlassTitle(myEvent.value, true);

      }      

    } else if(myEvent.hasEventName(this.myEventService.ON_DONE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_POSTER)) {

        this.addKlassPoster(myEvent.value);

      }

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        this.addKlassBanner(myEvent.value);

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        this.removeKlassBanner(myEvent.value);

      } // end if      

    } // end if

  } // end method

  private updateKlassTitle(klassTitle:string, isDBUpdate:boolean) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassTitle / 시작");
    if(isDebug) console.log("klass-detail / updateKlassTitle / klassTitle : ",klassTitle);
    if(isDebug) console.log("klass-detail / updateKlassTitle / isDBUpdate : ",isDBUpdate);

    if(null == klassTitle || "" == klassTitle) {
      return;
    }

    this.klassTitle = klassTitle;

    if(isDBUpdate) {

      this.klassService.updateKlassTitle(
        // apiKey:string, 
        this.watchTower.getApiKey(),
        // userId:number,
        +this.loginUser.id,
        // klassId:number,
        +this.klass.id,
        // klassTitle:string
        klassTitle      
      ).then((myResponse:MyResponse) => {

        // 로그 등록 결과를 확인해볼 수 있습니다.
        if(isDebug) console.log("klass-detail / updateKlassTitle / myResponse : ",myResponse);
        if(myResponse.isSuccess() && myResponse.hasDataProp("klass_poster")) {

          // Do something..

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
            `klass-detail / updateKlassTitle / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / klassTitle : ${klassTitle}`
          ); // end logger      

        } // end if

      }) // end service 

    } // end if

  } // end method




  private addKlassPoster(posterUrl:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / addKlassPoster / 시작");

    this.klassService.addKlassPoster(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // klassPoster:string
      posterUrl
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("klass-detail / addKlassPoster / myResponse : ",myResponse);
      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_poster")) {

        let klassPosterUrl:string = myResponse.getDataProp("klass_poster");

        if(null != klassPosterUrl && "" != klassPosterUrl) {
          klassPosterUrl = `${this.imgUploaderImagePathKlassPoster}/${klassPosterUrl}`;
          this.imgUploaderImageUrlKlassPoster = klassPosterUrl;
        }

        if(isDebug) console.log("klass-detail / addKlassPoster / klassPosterUrl : ",klassPosterUrl);

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
          `klass-detail / addKlassPoster / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / posterUrl : ${posterUrl}`
        ); // end logger      

      } // end if

    }) // end service    

  }

  addKlassBanner(imgUrlToAdd:string):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / addKlassBanner / 시작");
    if(isDebug) console.log("klass-detail / addKlassBanner / imgUrlToAdd : ",imgUrlToAdd);

    if(null == imgUrlToAdd || "" == imgUrlToAdd) {
      if(isDebug) console.log("klass-detail / addKlassBanner / 중단 / imgUrlToAdd is not valid!");
      return;
    }

    // TODO - banner 이름을 추출합니다.
    let banner:string = this.klassService.extractKlassBannerFromImgUrl(imgUrlToAdd);
    if(isDebug) console.log("klass-detail / addKlassBanner / banner : ",banner);

    // TODO - 가져온 klass 객체의 banner list에서 해당하는 배너 이름이 있는지 확인합니다.
    if(this.klass.hasNotBanner(banner)) {
      // 배너가 있어야 삭제할 수 있습니다.
      this.klass.addBanner(banner);
      if(isDebug) console.log("klass-detail / addKlassBanner / this.klass.class_banner_url : ",this.klass.class_banner_url);
      if(isDebug) console.log("klass-detail / addKlassBanner / this.klass.class_banner_url_arr : ",this.klass.class_banner_url_arr);
    }


    /*
    this.klassService.addKlassBanner(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // klassBanner:string
      imgUrlToAdd
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("klass-detail / addKlassBanner / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        // TODO - 가져온 klass 객체의 banner list를 업데이트 해야 합니다.

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
          `klass-detail / addKlassBanner / removeKlassBanner / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / banner_url : ${imgUrlToDelete}`
        ); // end logger      

      } // end if
      
    }); 
    */   


  }

  removeKlassBanner(imgUrlToDelete:string):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / removeKlassBanner / 시작");
    if(isDebug) console.log("klass-detail / removeKlassBanner / imgUrlToDelete : ",imgUrlToDelete);

    if(null == imgUrlToDelete || "" == imgUrlToDelete) {
      if(isDebug) console.log("klass-detail / removeKlassBanner / 중단 / imgUrlToDelete is not valid!");
      return;
    }

    // TODO - banner 이름을 추출합니다.
    let banner:string = this.klassService.extractKlassBannerFromImgUrl(imgUrlToDelete);
    if(isDebug) console.log("klass-detail / removeKlassBanner / banner : ",banner);

    // TODO - 가져온 klass 객체의 banner list에서 해당하는 배너 이름이 있는지 확인합니다.
    if(this.klass.hasBanner(banner)) {
      // 배너가 있어야 삭제할 수 있습니다.
      this.klass.removeBanner(banner);
      if(isDebug) console.log("klass-detail / removeKlassBanner / this.klass.class_banner_url : ",this.klass.class_banner_url);
      if(isDebug) console.log("klass-detail / removeKlassBanner / this.klass.class_banner_url_arr : ",this.klass.class_banner_url_arr);
    }


    /*
    this.klassService.removeKlassBanner(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // klassBanner:string
      imgUrlToDelete
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("klass-detail / removeKlassBanner / myResponse : ",myResponse);

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
          `klass-detail / removeKlassBanner / removeKlassBanner / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / banner_url : ${imgUrlToDelete}`
        ); // end logger      

      } // end if
      
    }); // end service
    */

  }  







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
