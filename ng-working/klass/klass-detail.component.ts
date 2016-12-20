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
import { KlassLevel }                    from './model/klass-level';
import { KlassStation }                  from './model/klass-station';
import { KlassDay }                      from './model/klass-day';
import { KlassTime }                     from './model/klass-time';
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
import { PriceTagHComponent }            from '../widget/pricetag/pricetag-h.component';
import { ClockBoardComponent }           from '../widget/clock/clock-board.component';

import { KlassDetailNavListComponent }   from './klass-detail-nav-list.component';
import { KlassFilterTileComponent }      from './klass-filter-tile.component';

import { ImageService }                  from '../util/image.service';
import { MyEventService }                from '../util/service/my-event.service';
import { MyCheckerService }              from '../util/service/my-checker.service';
import { MyEvent }                       from '../util/model/my-event';
import { MyLoggerService }               from '../util/service/my-logger.service';
import { MyEventWatchTowerService }      from '../util/service/my-event-watchtower.service';
import { MyResponse }                    from '../util/model/my-response';
import { HelperMyTime }                  from '../util/helper/my-time';

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
  klassCopy: Klass;
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
  pricePerWeekFormat:string="4주";
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
  private klassPriceComponent: DefaultComponent;
  private klassTimeBeginComponent: DefaultComponent;
  private klassTimeEndComponent: DefaultComponent;

  @ViewChild(ImageGridV2Component)
  private imageGridComponent: ImageGridV2Component;

  @ViewChild(HiddenUploaderComponent)
  private hiddenUploaderComponent: HiddenUploaderComponent;

  @ViewChild(PriceTagHComponent)
  private priceTagHComponent: PriceTagHComponent;

  @ViewChild(KlassFilterTileComponent)
  private klassFilterTileComponent: KlassFilterTileComponent;

  @ViewChild(ClockBoardComponent)
  private clockBoardComponent: ClockBoardComponent;


  // 운영자가 보게되는 배너 이미지 템플릿 리스트
  imageTableBannerList:string[][] = 
  [
    ["assets/images/class/banner/drinks.png"],
    ["assets/images/class/banner/help.png"]
  ];

  // 사용자가 보게되는 배너 이미지 리스트
  imageTableBannerListService:string[][] = [];

  eventKeyKlassBanner:string="";

  klassTimeMinutesMin:number = 60;
  klassTimeMinutesMax:number = 180;

  private myTime:HelperMyTime;

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

    this.myTime = new HelperMyTime();

  }


  ngOnInit() {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngOnInit / 시작");

  } // end method

  ngAfterViewInit():void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngAfterViewInit / 시작");
    if(isDebug) console.log("klass-detail / ngAfterViewInit / this.imageGridComponent : ", this.imageGridComponent);

    this.watchTower.announceIsLockedBottomFooterFlexible(false);

    this.init();
  }

  ngAfterViewChecked():void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / ngAfterViewChecked / 시작");

  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setDefaultComponents / 시작");

    // DefaultComponent들을 세팅
    let target = this.getInput(this.myEventService.KEY_KLASS_TITLE);
    if(null != target) {
      this.klassTitleComponent = target;
    } // end if

    target = this.getInput(this.myEventService.KEY_KLASS_PRICE);
    if(null != target) {
      this.klassPriceComponent = target;
    } // end if

    target = this.getInput(this.myEventService.KEY_KLASS_TIME_BEGIN);
    if(null != target) {
      this.klassTimeBeginComponent = target;
    } // end if

    target = this.getInput(this.myEventService.KEY_KLASS_TIME_END);
    if(null != target) {
      this.klassTimeEndComponent = target;
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

  private setKlassPrice() :void {

    if(null == this.klass || null == this.klassCopy.price || !(0 < this.klassCopy.price)) {
      return;
    }
    if(null == this.klassPriceComponent) {
      return;
    }

    this.klassPriceComponent.setInput(""+this.klassCopy.price);

  } // end method

  private setKlassTimeBegin() :void {

    if(null == this.klass || null == this.klassCopy.time_begin || "" == this.klassCopy.time_begin) {
      return;
    }
    if(null == this.klassTimeBeginComponent) {
      return;
    }

    this.klassTimeBeginComponent.setInput(""+this.klassCopy.time_begin);

  } // end method

  private setKlassTimeEnd() :void {

    if(null == this.klass || null == this.klassCopy.time_end || "" == this.klassCopy.time_end) {
      return;
    }
    if(null == this.klassTimeEndComponent) {
      return;
    }

    this.klassTimeEndComponent.setInput(""+this.klassCopy.time_end);

  } // end method

  private onAfterReceivingKlass() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / onAfterReceivingKlass / 시작");
    if(isDebug) console.log("klass-detail / onAfterReceivingKlass / this.klass : ",this.klass);

    // 저장 이전의 모든 데이터는 복사본에서 가져와 사용합니다.
    // 저장 이후에 복사본의 데이터를 원본으로 백업합니다.
    this.klassCopy = this.klass.copy();

    // fill datas
    this.imgUploaderImageUrlKlassPoster = this.klassCopy.class_poster_url_loadable;
    this.klassTitle = this.klassCopy.title;

    // set image-grid admin
    if(null != this.imageGridComponent) {
      this.imageGridComponent.compareUserImages(this.klassCopy.class_banner_url_arr);
    }

    // set selectileImageTable for service
    this.selectileImageTable = 
    [
      [
        this.klassCopy.level_img_url,
        this.klassCopy.venue_subway_station_img_url,
        this.klassCopy.days_img_url, 
        this.klassCopy.time_begin_img_url
      ]
    ];
    if(null != this.klassFilterTileComponent) {
      this.updateKlassSelectile();
    }

    // set selectile admin
    if(isDebug) console.log("klass-detail / onAfterReceivingKlass / this.klassFilterTileComponent : ",this.klassFilterTileComponent);

    // set default-input: klass price
    this.setKlassPrice();
    this.setKlassTimeBegin();
    this.setKlassTimeEnd();

    // set image-grid service
    let classBannerUrlArr:string[] = this.klassCopy.class_banner_url_arr;
    if(null != classBannerUrlArr && 0 < classBannerUrlArr.length) {
      for (var i = 0; i < classBannerUrlArr.length; ++i) {
        let classBannerUrl:string = classBannerUrlArr[i];
        classBannerUrl = this.klassService.getKlassBannerUrlLoadable(classBannerUrl);
        this.imageTableBannerListService.push([classBannerUrl]);    
      } // end for
    } // end if

    if(isDebug) console.log("klass-detail / onAfterReceivingKlass / this.imageTableBannerListService : ",this.imageTableBannerListService);
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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
    this.radiobtnService.getKlassEnrolmentInterval(this.klass, ""+this.klassCopy.enrollment_interval_week);
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
        this.klassCopy.title,
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
        this.klassCopy.desc,
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
        this.klassCopy.time_begin,
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
        this.klassCopy.time_end,
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
        ""+this.klassCopy.price,
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
    this.klassCopy.title = this.editTitle;
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
    let klassId = this.klass ? this.klassCopy.id : null;

    console.log("gotoKlassList / klassId : ",klassId);

    // Pass along the klass id if available
    // so that the KlassListComponent can select that klass.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises

    // this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
  }

  // EVENT
  onClickKlassPoster(event) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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





  onChangedFromChild(myEvent:MyEvent):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE)) {

        if( null != myEvent.metaObj ) {
          this.klassPriceComponent = myEvent.metaObj;
          this.setKlassPrice();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_BEGIN)) {  

        if( null != myEvent.metaObj ) {
          this.klassTimeBeginComponent = myEvent.metaObj;
          this.setKlassTimeBegin();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_END)) {  

        if( null != myEvent.metaObj ) {
          this.klassTimeEndComponent = myEvent.metaObj;
          this.setKlassTimeEnd();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        if( null != myEvent.metaObj ) {
          this.imageGridComponent = myEvent.metaObj;
        } // end if
        if( null != this.klass && null != this.imageGridComponent ) {
          this.imageGridComponent.compareUserImages(this.klassCopy.class_banner_url_arr);
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_SELECTILE)) {  

        if( null != myEvent.metaObj ) {
          this.klassFilterTileComponent = myEvent.metaObj;
        } // end if
        if( null != this.klass && null != this.klassFilterTileComponent ) {

          // 지정된 레벨/장소/요일/시간 으로 업데이트.
          this.updateKlassSelectile();

        } // end if

      } // end if      

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {

        this.updateKlassTitle(myEvent.value, false);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE)) {

        this.updateKlassPrice(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        this.updateKlassBanners(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_BEGIN)) {  

        this.updateKlassTimeBegin(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_END)) {  

        this.updateKlassTimeEnd(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_SELECTILE)) {

        this.updateKlassLevelDayTimeStation(myEvent.metaObj);

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

  private updateKlassSelectile() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassSelectile / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / updateKlassSelectile / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassFilterTileComponent) {
      if(isDebug) console.log("klass-detail / updateKlassSelectile / 중단 / this.klassFilterTileComponent is not valid!");
      return;
    }
    let constMap:any = this.watchTower.getConstMap();
    if(null == constMap) {
      if(isDebug) console.log("klass-detail / updateKlassSelectile / 중단 / constMap is not valid!");
      return;
    }

    if(isDebug) console.log("klass-detail / updateKlassSelectile / this.klass : ", this.klass);

    let klassLevel:KlassLevel = this.klassService.getKlassLevel(constMap, this.klass.level);
    if(null == klassLevel) {
      if(isDebug) console.log("klass-detail / updateKlassSelectile / 중단 / klassLevel is not valid!");
      return;
    }
    let klassStation:KlassStation = this.klassService.getKlassStation(constMap, this.klass.venue_subway_station);
    if(null == klassStation) {
      if(isDebug) console.log("klass-detail / updateKlassSelectile / 중단 / klassStation is not valid!");
      return;
    }
    let klassDay:KlassDay = this.klassService.getKlassDay(constMap, this.klass.days);
    if(null == klassDay) {
      if(isDebug) console.log("klass-detail / updateKlassSelectile / 중단 / klassDay is not valid!");
      return;
    }
    let klassTime:KlassTime = this.klassService.getKlassTime(constMap, this.klass.time_begin);
    if(null == klassTime) {
      if(isDebug) console.log("klass-detail / updateKlassSelectile / 중단 / klassTime is not valid!");
      return;
    }

    this.klassFilterTileComponent.updateShowingSelectilesAll(
      // klassLevel:KlassLevel, 
      klassLevel, 
      // klassStation:KlassStation, 
      klassStation,
      // klassDay:KlassDay, 
      klassDay,
      // klassTime:KlassTime
      klassTime
    );

    if(isDebug) console.log("klass-detail / updateKlassSelectile / klassLevel : ", klassLevel);
    if(isDebug) console.log("klass-detail / updateKlassSelectile / klassStation : ", klassStation);
    if(isDebug) console.log("klass-detail / updateKlassSelectile / klassDay : ", klassDay);
    if(isDebug) console.log("klass-detail / updateKlassSelectile / klassTime : ", klassTime);

  }

  private updateKlassLevelDayTimeStation(klassSelectile:any) :void { // wonder.jung

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / 시작");
    if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / klassSelectile : ",klassSelectile);

    if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / this.klassCopy : ",this.klassCopy);

    let klassDay:KlassDay = klassSelectile.day;
    if(null != klassDay) {
      if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / klassDay : ",klassDay);

      this.klassCopy.days = klassDay.key;
      this.klassCopy.days_img_url = klassDay.img_url;
    } // end if
    let klassLevel:KlassLevel = klassSelectile.level;
    if(null != klassLevel) {
      if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / klassLevel : ",klassLevel);

      this.klassCopy.level = klassLevel.key;
      this.klassCopy.level_img_url = klassLevel.img_url;
    } // end if
    let klassStation:KlassStation = klassSelectile.station;
    if(null != klassStation) {
      if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / klassStation : ",klassStation);

      this.klassCopy.venue_subway_station = klassStation.key;
      this.klassCopy.venue_subway_station_img_url = klassStation.img_url;
    } // end if
    let klassTime:KlassTime = klassSelectile.time;
    if(null != klassTime) {
      if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / klassTime : ",klassTime); 

      this.klassCopy.time_begin = klassTime.hh_mm;
      this.klassCopy.time_begin_img_url = klassTime.img_url;
    } // end if
  } // end if

  private updateKlassPrice(klassPrice:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassPrice / 시작");
    if(isDebug) console.log("klass-detail / updateKlassPrice / klassPrice : ",klassPrice);

    if(null == klassPrice || "" == klassPrice) {
      return;
    }

    this.klassCopy.price = parseInt(klassPrice);
    this.priceTagHComponent.setPrice(this.klassCopy.price);

  }

  private updateKlassTimeBegin(klassTimeBegin:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassTimeBegin / 시작");

    if(this.myTime.isNotHHMM(klassTimeBegin)) {
      if(isDebug) console.log("klass-detail / updateKlassTimeBegin / 중단 / this.myTime.isNotHHMM(klassTimeBegin)");
      return;
    }
    if(null == this.klassTimeBeginComponent) {
      if(isDebug) console.log("klass-detail / updateKlassTimeBegin / 중단 / this.klassTimeBeginComponent is not valid!");
      return;
    }
    if(null == this.klassTimeEndComponent) {
      if(isDebug) console.log("klass-detail / updateKlassTimeBegin / 중단 / this.klassTimeEndComponent is not valid!");
      return;
    }
    let klassTimeEnd:string = this.klassTimeEndComponent.getInput();
    if(this.myTime.isNotHHMM(klassTimeEnd)) {  
      if(isDebug) console.log("klass-detail / updateKlassTimeBegin / 중단 / this.klassTimeEnd is not valid!");
      return;
    }

    let minutesDiff:number = this.myTime.getDiffMinutesHHMM(klassTimeBegin, klassTimeEnd);
    if(isDebug) console.log("klass-detail / updateKlassTimeBegin / klassTimeBegin : ",klassTimeBegin);
    if(isDebug) console.log("klass-detail / updateKlassTimeBegin / klassTimeEnd : ",klassTimeEnd);
    if(isDebug) console.log("klass-detail / updateKlassTimeBegin / minutesDiff : ",minutesDiff);

    if(minutesDiff < this.klassTimeMinutesMin) {

      if(isDebug) console.log("klass-detail / updateKlassTimeBegin / 1시간 미만의 수업은 불가능합니다.");

      // 1시간 미만의 수업은 불가능합니다.
      // 1시간 미만일 경우, 변경한 시작 시간에서 1시간 이후를 종료 시간으로 고정합니다.
      // FIX ME - 00시를 경계로 2시간이 증가되는 버그가 있음.
      let klassTimeEnd1hrAfter:string = this.myTime.addMinutesHHMM(klassTimeBegin, this.klassTimeMinutesMin);
      this.klassTimeEndComponent.setInput(klassTimeEnd1hrAfter);

      this.klassCopy.setTimeBeginEnd(klassTimeBegin, klassTimeEnd1hrAfter);

    } else if(this.klassTimeMinutesMax < minutesDiff) {

      if(isDebug) console.log("klass-detail / updateKlassTimeBegin / 3시간 이상의 수업은 불가능합니다.");

      // 3시간 이상의 수업은 불가능합니다.
      // 3시간 이상일 경우, 변경한 시작 시간에서 3시간 이후를 종료 시간으로 고정합니다.
      let klassTimeEnd3hrsAfter:string = this.myTime.addMinutesHHMM(klassTimeBegin, this.klassTimeMinutesMax);
      this.klassTimeEndComponent.setInput(klassTimeEnd3hrsAfter);

      this.klassCopy.setTimeBeginEnd(klassTimeBegin, klassTimeEnd3hrsAfter);

    } else {

      this.klassCopy.setTimeBegin(klassTimeBegin);

    }

    this.updateClockTime(this.klassCopy.time_begin, this.klassCopy.time_end);

    if(isDebug) console.log("klass-detail / updateKlassTimeBegin / this.klassCopy : ",this.klassCopy);

  } // end method

  private updateKlassTimeEnd(klassTimeEnd:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassTimeEnd / 시작");
    if(isDebug) console.log("klass-detail / updateKlassTimeEnd / klassTimeEnd : ",klassTimeEnd);

    if(this.myTime.isNotHHMM(klassTimeEnd)) {
      if(isDebug) console.log("klass-detail / updateKlassTimeEnd / 중단 / this.myTime.isNotHHMM(klassTimeBegin)");
      return;
    }
    if(null == this.klassTimeBeginComponent) {
      if(isDebug) console.log("klass-detail / updateKlassTimeEnd / 중단 / this.klassTimeBeginComponent is not valid!");
      return;
    }
    if(null == this.klassTimeEndComponent) {
      if(isDebug) console.log("klass-detail / updateKlassTimeEnd / 중단 / this.klassTimeEndComponent is not valid!");
      return;
    }
    let klassTimeBegin:string = this.klassTimeBeginComponent.getInput();
    if(this.myTime.isNotHHMM(klassTimeBegin)) {
      if(isDebug) console.log("klass-detail / updateKlassTimeEnd / 중단 / this.myTime.isNotHHMM(klassTimeBegin)");
      return;
    }

    let minutesDiff:number = this.myTime.getDiffMinutesHHMM(klassTimeBegin, klassTimeEnd);
    if(isDebug) console.log("klass-detail / updateKlassTimeEnd / minutesDiff : ",minutesDiff);

    if(minutesDiff < this.klassTimeMinutesMin) {

      if(isDebug) console.log("klass-detail / updateKlassTimeEnd / 1시간 미만의 수업은 불가능합니다.");

      // 1시간 미만의 수업은 불가능합니다.
      // 1시간 미만일 경우, 변경한 시작 시간에서 1시간 이후를 종료 시간으로 고정합니다.
      let klassTimeBegin1hrBefore:string = this.myTime.addMinutesHHMM(klassTimeEnd, -1 * this.klassTimeMinutesMin);
      this.klassTimeBeginComponent.setInput(klassTimeBegin1hrBefore);

      this.klassCopy.setTimeBeginEnd(klassTimeBegin1hrBefore, klassTimeEnd);

    } else if(this.klassTimeMinutesMax < minutesDiff) {

      if(isDebug) console.log("klass-detail / updateKlassTimeEnd / 3시간 이상의 수업은 불가능합니다.");

      // 3시간 이상의 수업은 불가능합니다.
      // 3시간 이상일 경우, 변경한 시작 시간에서 3시간 이후를 종료 시간으로 고정합니다.
      let klassTimeBegin3hrsBefore:string = this.myTime.addMinutesHHMM(klassTimeEnd, -1 * this.klassTimeMinutesMax);
      this.klassTimeBeginComponent.setInput(klassTimeBegin3hrsBefore);

      this.klassCopy.setTimeBeginEnd(klassTimeBegin3hrsBefore, klassTimeEnd);

    } else {

      this.klassCopy.setTimeEnd(klassTimeEnd);

    }

    this.updateClockTime(this.klassCopy.time_begin, this.klassCopy.time_end);

    if(isDebug) console.log("klass-detail / updateKlassTimeEnd / this.klassCopy : ",this.klassCopy);

  }

  private updateClockTime(hhmmBeing:string, hhmmEnd:string) {
    // 서비스에 표시되는 시계 아이콘을 업데이트합니다.
    this.clockBoardComponent.setClockTimeBeginEnd(hhmmBeing, hhmmEnd);
  } // end method

  private updateKlassTitle(klassTitle:string, isDBUpdate:boolean) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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
        +this.klassCopy.id,
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
            `klass-detail / updateKlassTitle / user_id : ${this.loginUser.id} / klass_id : ${this.klassCopy.id} / klassTitle : ${klassTitle}`
          ); // end logger      

        } // end if

      }) // end service 

    } // end if

  } // end method




  private addKlassPoster(posterUrl:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / addKlassPoster / 시작");

    this.klassService.addKlassPoster(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klassCopy.id,
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
          `klass-detail / addKlassPoster / user_id : ${this.loginUser.id} / klass_id : ${this.klassCopy.id} / posterUrl : ${posterUrl}`
        ); // end logger      

      } // end if

    }) // end service    

  }

  addKlassBanner(imgUrlToAdd:string):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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
    let classBannerUrlNext:string="";
    if(this.klassCopy.hasNotBanner(banner)) {
      // 배너가 있어야 삭제할 수 있습니다.
      this.klassCopy.addBanner(banner);
      if(isDebug) console.log("klass-detail / addKlassBanner / this.klassCopy.class_banner_url : ",this.klassCopy.class_banner_url);
      if(isDebug) console.log("klass-detail / addKlassBanner / this.klassCopy.class_banner_url_arr : ",this.klassCopy.class_banner_url_arr);

      // 새로 추가된 배너가 포함된 전체 문자열을 만들어 DB에 업데이트합니다.
      classBannerUrlNext = this.klassCopy.class_banner_url;
    }
    if(null == classBannerUrlNext || "" === classBannerUrlNext) {
      if(isDebug) console.log("klass-detail / addKlassBanner / 중단 / classBannerUrlNext is not valid!");
      return;
    }

    this.updateKlassBanners(classBannerUrlNext);

  } // end method
  removeKlassBanner(imgUrlToDelete:string):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
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
    let classBannerUrlNext:string="";
    if(this.klassCopy.hasBanner(banner)) {
      // 배너가 있어야 삭제할 수 있습니다.
      this.klassCopy.removeBanner(banner);
      if(isDebug) console.log("klass-detail / removeKlassBanner / this.klassCopy.class_banner_url : ",this.klassCopy.class_banner_url);
      if(isDebug) console.log("klass-detail / removeKlassBanner / this.klassCopy.class_banner_url_arr : ",this.klassCopy.class_banner_url_arr);

      // 삭제된 배너가 빠진 전체 문자열을 만들어 DB에 업데이트합니다.
      // 공백도 가능합니다.
      classBannerUrlNext = this.klassCopy.class_banner_url;
    }
    if(null == classBannerUrlNext) {
      if(isDebug) console.log("klass-detail / addKlassBanner / 중단 / classBannerUrlNext is not valid!");
      return;
    } // end if

    this.updateKlassBanners(classBannerUrlNext);
  } // end method
  private updateKlassBanners(classBannerUrlNext:string):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassBanners / 시작");
    if(isDebug) console.log("klass-detail / updateKlassBanners / classBannerUrlNext : ",classBannerUrlNext);


    if(null == classBannerUrlNext) {
      if(isDebug) console.log("klass-detail / updateKlassBanners / 중단 / classBannerUrlNext is not valid!");
      return;
    }

    this.klassService.updateKlassBanner(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klassCopy.id,
      // klassBanners:string
      classBannerUrlNext
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("klass-detail / updateKlassBanner / myResponse : ",myResponse);

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
          `klass-detail / updateKlassBanner / user_id : ${this.loginUser.id} / klass_id : ${this.klassCopy.id} / banner_url : ${classBannerUrlNext}`
        ); // end logger      

      } // end if
      
    }); // end service

  } // end method



  // Admin Section
  showSEKlassFeature() :void {

  }

} // end class
