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
import { KlassCalendar }                 from './model/klass-calendar';
import { KlassCalendarDay }              from './model/klass-calendar-day';
import { KlassVenue }                    from './model/klass-venue';

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
import { ImageGridComponent }            from '../widget/image-grid/image-grid.component';
import { HiddenUploaderComponent }       from '../widget/input/img-uploader/hidden-uploader.component';
import { DefaultComponent }              from '../widget/input/default/default.component';
import { DefaultMeta }                   from '../widget/input/default/model/default-meta';
import { DefaultOption }                 from '../widget/input/default/model/default-option';

import { DefaultService }                from '../widget/input/default/service/default.service';
import { PriceTagHComponent }            from '../widget/pricetag/pricetag-h.component';
import { ClockBoardComponent }           from '../widget/clock/clock-board.component';
import { ButterflyComponent }            from '../widget/butterfly/butterfly.component';

import { KlassDetailNavListComponent }   from './klass-detail-nav-list.component';
import { KlassPriceCalculatorComponent } from './widget/klass-price-calculator.component';

import { ImageService }                  from '../util/image.service';
import { MyEventService }                from '../util/service/my-event.service';
import { MyCheckerService }              from '../util/service/my-checker.service';
import { MyEvent }                       from '../util/model/my-event';
import { MyLoggerService }               from '../util/service/my-logger.service';
import { MyEventWatchTowerService }      from '../util/service/my-event-watchtower.service';
import { MyResponse }                    from '../util/model/my-response';
import { HelperMyTime }                  from '../util/helper/my-time';
import { HelperMyArray }                 from '../util/helper/my-array';
import { HelperMyIs }                    from '../util/helper/my-is';
import { HelperMyFormat }                from '../util/helper/my-format';
import { HelperMyConst }                 from '../util/helper/my-const';

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

  editTitle: string; // Deprecated

  priceTagCurrency:string="₩";
  priceTagColor:string="#e85c41";
  priceTagWidth:number=105;
  priceTagCageWidth:number=105;
  pricePerWeekFormat:string="4주";
  pricetagDesc:string;

  // @ Deprecated
  selectileImageTable:string[][];
  selectileImageHeight:number=60;
  selectileImageWidth:number=60;
  selectileCageWidth:number=60;

  // @ Deprecated
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


  // Image Uploader
  imgUploaderUploadAPIUrl:string="";
  imgUploaderImagePath:string="";
  imgUploaderImageUrl:string="";
  imgUploaderEventKey:string="";

  imgUploaderImagePathKlassPoster:string="";
  imgUploaderImageUrlKlassPoster:string="";
  imgUploaderEventKeyKlassPoster:string="";

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
  private klassDateEnrollmentComponent: DefaultComponent;
  private klassLevelComponent: DefaultComponent;
  private klassSubwayLineComponent: DefaultComponent;
  private klassSubwayStationComponent: DefaultComponent;
  private klassDaysComponent: DefaultComponent;
  private klassWeeksComponent: DefaultComponent;

  @ViewChild(ImageGridV2Component)
  private bannerComponent: ImageGridV2Component;

  @ViewChild(ImageGridComponent)
  private selectTileViewComponent: ImageGridComponent;

  @ViewChild(HiddenUploaderComponent)
  private hiddenUploaderComponent: HiddenUploaderComponent;

  @ViewChild(PriceTagHComponent)
  private priceTagHComponent: PriceTagHComponent;

  // @ Deprecated / REMOVE ME
  // @ViewChild(KlassFilterTileComponent)
  // private klassFilterTileComponent: KlassFilterTileComponent;

  @ViewChild(ClockBoardComponent)
  private clockBoardComponent: ClockBoardComponent;

  @ViewChild(ButterflyComponent)
  private butterflyComponent: ButterflyComponent;

  @ViewChild(KlassDetailNavListComponent)
  private klassDetailNavListComponent: KlassDetailNavListComponent;

  @ViewChild(KlassPriceCalculatorComponent)
  private priceCalculator: KlassPriceCalculatorComponent;


  // 운영자가 보게되는 배너 이미지 템플릿 리스트
  imageTableBannerList:string[][] = 
  [
    ["assets/images/class/banner/drinks_x.png"],
    ["assets/images/class/banner/drinks_o.png"],
    ["assets/images/class/banner/help.png"]
  ];

  // 사용자가 보게되는 배너 이미지 리스트
  imageTableBannerListService:string[][] = [];

  klassTimeMinutesMin:number = 60;
  klassTimeMinutesMax:number = 180;

  private myTime:HelperMyTime;
  private myArray:HelperMyArray;
  private myIs:HelperMyIs;
  private myFormat:HelperMyFormat;

  isSaveBtnDisabled:boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private klassService:KlassService,
    public imageService: ImageService,
    public dialogService: DialogService,
    private authService: AuthService,
    private myLoggerService:MyLoggerService,
    public myEventService: MyEventService,
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

    this.myTime = new HelperMyTime();
    this.myArray = new HelperMyArray();
    this.myIs = new HelperMyIs();
    this.myFormat = new HelperMyFormat();

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
    if(isDebug) console.log("klass-detail / ngAfterViewInit / this.bannerComponent : ", this.bannerComponent);

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
    if(isDebug) console.log("klass-detail / setUserInfo / bannerComponent : ",this.bannerComponent);

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

          this.klass = new Klass().setJSON(klassJSON);
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

  private setKlassWeeks() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassWeeks / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassWeeks / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.priceTagHComponent) {
      if(isDebug) console.log("klass-detail / setKlassWeeks / 중단 / this.priceTagHComponent is not valid!");
      return;
    }

    let classWeeksList:any = 
    this.watchTower.getMyConst().getList("class_weeks_list");

    let classWeeksKorList:any = 
    this.watchTower.getMyConst().getList("class_weeks_kor_list");

    let week:string = "" + this.klassCopy.week;
    if(!(0 < this.klassCopy.week)) {
      week = classWeeksList[0];
      // 초기 값은 원본에도 업데이트합니다.
      this.klass.week = this.klassCopy.week = +week;
    } // end if


    let weekKor:string =
    this.myArray.getValueFromLists(
      // key:string, 
      week,
      // srcList:string[], 
      classWeeksList,
      // targetList:string[]
      classWeeksKorList
    );
    this.priceTagHComponent.setTitle(weekKor);

  } // end method

  private updateKlassWeeks(klassWeeks:number) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassWeeks / 시작");
    if(isDebug) console.log("klass-detail / updateKlassWeeks / klassWeeks : ",klassWeeks);

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / updateKlassWeeks / 중단 / this.klassCopy is not valid!");
      return;
    }
    
    this.klassCopy.week = klassWeeks;

    this.setKlassWeeks();
    this.updateSaveBtnStatus();

  } // end method

  private setKlassPrice() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassPrice / 시작");

    if(null == this.klass || null == this.klassCopy.price || !(0 < this.klassCopy.price)) {
      return;
    } // end if

    if(null != this.priceTagHComponent) {
      let priceForStudent:number = this.klassCopy.getPriceForStudent();
      this.priceTagHComponent.setPrice(priceForStudent);
    } // end if

    // @ Deprecated
    if(null != this.klassPriceComponent) {
      this.klassPriceComponent.setInput(""+this.klassCopy.price);
    } // end if

  } // end method

  private setKlassTimeBegin() :void {

    if(null == this.klassCopy || null == this.klassCopy.time_begin || "" == this.klassCopy.time_begin) {
      return;
    }
    if(null == this.klassTimeBeginComponent) {
      return;
    }

    this.klassTimeBeginComponent.setInput(""+this.klassCopy.time_begin);

  } // end method

  private setKlassTimeEnd() :void {

    if(null == this.klassCopy || null == this.klassCopy.time_end || "" == this.klassCopy.time_end) {
      return;
    }
    if(null == this.klassTimeEndComponent) {
      return;
    }

    this.klassTimeEndComponent.setInput(""+this.klassCopy.time_end);

  } // end method

  // @ 가장 가까운 수업 시작일을 의미합니다.
  private setKlassDateEnrollmentView() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.klassCopy is not valid!");
      return;
    }

    if(null == this.butterflyComponent) {
      if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.butterflyComponent is not valid!");
      return;
    }

    let enrollmentDateStr:string = this.klassCopy.getEnrollmentDate();
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / enrollmentDateStr : ",enrollmentDateStr);
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / this.butterflyComponent : ",this.butterflyComponent);

    this.butterflyComponent.setText(enrollmentDateStr);

  }

  // @ 가장 가까운 수업 시작일을 의미합니다.
  private setKlassDateEnrollmentInput() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.klassCopy is not valid!");
      return;
    }

    if(null == this.klassDateEnrollmentComponent) {
      if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.klassDateEnrollmentComponent is not valid!");
      return;
    }

    let enrollmentDateStr:string = this.klassCopy.getEnrollmentDate();
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / enrollmentDateStr : ",enrollmentDateStr);
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / this.butterflyComponent : ",this.butterflyComponent);

    // 운영자가 선택할 수 있는 수업 시작 등록 날짜를 select box 리스트로 만듭니다.
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / 운영자가 선택할 수 있는 수업 시작 등록 날짜를 select box 리스트로 만듭니다.");

    let enrollmentDateList:KlassCalendarDay[] = this.klassCopy.getEnrollmentDateList();
    let selectOptionList:DefaultOption[] = [];

    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / enrollmentDateList : ",enrollmentDateList);

    // 시작 날짜가 지정되지 않았다면, 가장 가까운 날짜를 지정해줍니다.
    // 해당 날짜가 등록 날짜 안에 있어야 합니다. 없다면 기본값.
    let hasValidEnrollmentDate:boolean = false;
    for (var i = 0; i < enrollmentDateList.length; ++i) {

      let enrollmentDate:KlassCalendarDay = enrollmentDateList[i];
      if(enrollmentDate.getYYYYMMDD() === this.klassCopy.date_begin) {
        hasValidEnrollmentDate = true;
        break;
      } // end if

    } // end for

    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / hasValidEnrollmentDate : ",hasValidEnrollmentDate);
    if( !hasValidEnrollmentDate && this.myArray.isOK(enrollmentDateList) ) {

      let enrollmentDate:KlassCalendarDay = enrollmentDateList[0];
      this.klass.date_begin = this.klassCopy.date_begin = enrollmentDate.getYYYYMMDD();

    } // end if

    for (var i = 0; i < enrollmentDateList.length; ++i) {

      let enrollmentDate:KlassCalendarDay = enrollmentDateList[i];

      let key:string = this.klassCopy.getEnrollmentDateStr(enrollmentDate);
      let value:string = enrollmentDate.getYYYYMMDD();
      let isFocus:boolean = (enrollmentDateStr === key)?true:false;

      let defaultOption:DefaultOption = 
      new DefaultOption(
        // public key:string,
        key,
        // public value:string,
        value,
        // public isFocus:boolean
        isFocus
      );
      if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / defaultOption : ",defaultOption);

      selectOptionList.push(defaultOption);

    }
    if(isDebug) console.log("klass-detail / setKlassDateEnrollmentView / selectOptionList : ",selectOptionList);
    this.klassDateEnrollmentComponent.setSelectOption(selectOptionList);

  } 

  // @ 주당 수업 횟수 데이터를 준비합니다.
  // @ 주당 수업을 하는 요일을 선택하는 데이터를 준비합니다.
  private setKlassLevel() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassLevel / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassLevelComponent) {
      if(isDebug) console.log("klass-detail / setKlassLevel / 중단 / this.klassLevelComponent is not valid!");
      return;
    }

    if(isDebug) console.log("klass-detail / setKlassLevel / 시작");

    let classLevelList:string[] = this.watchTower.getMyConst().getListNoDefault("class_level_list");
    let classLevelKorList:string[] = this.watchTower.getMyConst().getListNoDefault("class_level_kor_list");

    if(isDebug) console.log("klass-detail / setKlassLevel / classLevelList : ",classLevelList);
    if(isDebug) console.log("klass-detail / setKlassLevel / classLevelKorList : ",classLevelKorList);
  
    let klassLevel:string = this.klassCopy.level;

    let selectOptionList:DefaultOption[] = [];
    for (var i = 0; i < classLevelList.length; ++i) {

      let klassLevelFromList:string = classLevelList[i];
      let klassLevelKorFromList:string = classLevelKorList[i];

      let key:string = klassLevelKorFromList;
      let value:string = klassLevelFromList;
      let isFocus:boolean = (klassLevelFromList === klassLevel)?true:false;

      let defaultOption:DefaultOption = 
      new DefaultOption(
        // public key:string,
        key,
        // public value:string,
        value,
        // public isFocus:boolean
        isFocus
      );
      if(isDebug) console.log("klass-detail / setKlassLevel / defaultOption : ",defaultOption);

      selectOptionList.push(defaultOption);

    }

    if(isDebug) console.log("klass-detail / setKlassLevel / selectOptionList : ",selectOptionList);
    this.klassLevelComponent.setSelectOption(selectOptionList);

  }

  private setKlassSubwayLine() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassSubwayLine / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassSubwayLineComponent) {
      if(isDebug) console.log("klass-detail / setKlassSubwayLine / 중단 / this.klassSubwayLineComponent is not valid!");
      return;
    }

    if(isDebug) console.log("klass-detail / setKlassSubwayLine / 시작");

    let constMap:any = this.watchTower.getConstMap();
    let valueList:string[] = constMap["subway_line_list"];
    let keyList:string[] = constMap["subway_line_kor_list"];
    // let classLevelImgUrlList:string[] = constMap["class_level_img_url_list"];
  
    let valueFromKlassCopy:string = this.klassCopy.subway_line;
    let subwayLineList:string[] = constMap["subway_line_list"];
    if(null == valueFromKlassCopy || "" == valueFromKlassCopy) {
      // 선택된 역이 없다면, 2호선으로 임의 선택합니다.
      valueFromKlassCopy = subwayLineList[2];
      this.klass.subway_line = this.klassCopy.subway_line = valueFromKlassCopy;
    } // end if    

    let selectOptionList:DefaultOption[] = [];
    for (var i = 1; i < valueList.length; ++i) {

      let keyFromList:string = keyList[i];
      let valueFromList:string = valueList[i];

      let key:string = keyFromList;
      let value:string = valueFromList;
      let isFocus:boolean = (valueFromList === valueFromKlassCopy)?true:false;

      let defaultOption:DefaultOption = 
      new DefaultOption(
        // public key:string,
        key,
        // public value:string,
        value,
        // public isFocus:boolean
        isFocus
      );
      if(isDebug) console.log("klass-detail / setKlassSubwayLine / defaultOption : ",defaultOption);

      selectOptionList.push(defaultOption);

    }

    if(isDebug) console.log("klass-detail / setKlassSubwayLine / selectOptionList : ",selectOptionList);
    this.klassSubwayLineComponent.setSelectOption(selectOptionList);    

  }

  private setKlassSubwayStation() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassSubwayStation / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassSubwayStationComponent) {
      if(isDebug) console.log("klass-detail / setKlassSubwayStation / 중단 / this.klassSubwayStationComponent is not valid!");
      return;
    }

    if(isDebug) console.log("klass-detail / setKlassSubwayStation / 시작");
    if(isDebug) console.log("klass-detail / setKlassSubwayStation / this.klassCopy.subway_line : ",this.klassCopy.subway_line);

    // 몇호선인지 검사 해야 한다.
    let subwayLine:string = this.klassCopy.subway_line;
    if(null == subwayLine || "" == subwayLine) {
      // 선택된 역이 없다면, 기본값을 선택합니다.
      this.klassCopy.subway_line = subwayLine = this.watchTower.getMyConst().getFirst("subway_line_list");
    } // end if
    if(isDebug) console.log("klass-detail / setKlassSubwayStation / subwayLine : ",subwayLine);

    this.updateSelectOptionSubwayStations(subwayLine);

  }
  private updateSelectOptionSubwayStations(subwayLine:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateSelectOptionSubwayStations / 시작");

    if(null == subwayLine || "" === subwayLine) {
      return;
    }

    if(isDebug) console.log("klass-detail / updateSelectOptionSubwayStations / subwayLine : ",subwayLine);

    // HERE - 중첩된 값을 가져와야 함.
    // 지하철 역 이름을 가져옵니다.

    let subwayStationList:any = 
    this.watchTower.getMyConst().getNestedChildList(
      // parentKey:string,
      "subway_line_list",
      // parentValue:string,
      subwayLine,
      // childKey:string
      "subway_station_list"
    );

    if(isDebug) console.log("klass-detail / updateSelectOptionSubwayStations / subwayStationList : ",subwayStationList);

    let subwayStationKorList:any = 
    this.watchTower.getMyConst().getNestedChildListFromPrevParent("subway_station_kor_list");

    let subwayStationImgList:any = 
    this.watchTower.getMyConst().getNestedChildListFromPrevParent("subway_station_img_list");

    let subwayStation:string = this.klassCopy.subway_station;
    let subwasStationImgPrev:string = this.klassCopy.subway_station_img;
    let subwasStationImgNext:string = "";

    // 선택된 역이 역 리스트에 있는지 확인합니다.
    if( this.myArray.isOK(subwayStationKorList) && 
        this.myArray.isOK(subwayStationImgList) && 
        this.myArray.hasNotStr(subwayStationList, subwayStation) ) {

      // 선택된 역이 없다면, 선택한 호선의 첫번째 역으로 임의 선택합니다. 이미지도 설정합니다.
      this.klassCopy.subway_station = this.klass.subway_station = subwayStation = subwayStationList[0];
      this.klassCopy.subway_station_img = this.klass.subway_station_img = subwasStationImgNext = subwayStation = subwayStationImgList[0];
      this.replaceSubwayStationImage(subwasStationImgPrev, subwasStationImgNext);

    } // end if
    if(isDebug) console.log("klass-detail / updateSelectOptionSubwayStations / subwayStation : ",subwayStation);

    let selectOptionList:DefaultOption[] = 
    this.getDefaultOptionList(
      // keyList:string[],
      subwayStationKorList, 
      // valueList:string[],
      subwayStationList, 
      // valueFocus:string
      this.klassCopy.subway_station
    );
    if(isDebug) console.log("klass-detail / updateSelectOptionSubwayStations / selectOptionList : ",selectOptionList);

    this.klassSubwayStationComponent.setSelectOption(selectOptionList);

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

  private setPriceCalculator() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setPriceCalculator / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassDetailNavList / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.priceCalculator) {
      if(isDebug) console.log("klass-detail / setKlassDays / 중단 / this.priceCalculator is not valid!");
      return;
    }

    if(isDebug) console.log("klass-detail / setKlassDays / this.klassCopy.price : ",this.klassCopy.price);
    if(isDebug) console.log("klass-detail / setKlassDays / this.klassCopy.student_cnt : ",this.klassCopy.student_cnt);

    this.priceCalculator.setPriceNStudentCnt(
      // price:number, 
      this.klassCopy.price,
      // studentCnt:number
      this.klassCopy.student_cnt
    );

    this.priceCalculator.setWeeks(this.klassCopy.week);

  } // end method

  private setKlassDetailNavList() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassDetailNavList / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassDetailNavList / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassDetailNavListComponent) {
      if(isDebug) console.log("klass-detail / setKlassDays / 중단 / this.klassDetailNavListComponent is not valid!");
      return;
    }
    if(isDebug) console.log("klass-detail / setKlassDays / this.klassDetailNavListComponent : ",this.klassDetailNavListComponent);    

    this.klassDetailNavListComponent.setKlass(this.klassCopy);

  }


  // @ 주당 수업을 하는 요일을 선택하는 데이터를 준비합니다.
  private setKlassDays() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassDays / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassDays / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassDaysComponent) {
      if(isDebug) console.log("klass-detail / setKlassDays / 중단 / this.klassDaysComponent is not valid!");
      return;
    }
    if(isDebug) console.log("klass-detail / setKlassDays / this.klassDaysComponent : ",this.klassDaysComponent);    

    // 컴포넌트가 준비되었습니다.

    // 1. 선택한 요일 리스트를 가져옵니다.
    let days:string = this.klassCopy.days;
    let daysList:string[] = this.klassCopy.days_list;

    if(isDebug) console.log("klass-detail / setKlassDays / days : ",days);
    if(isDebug) console.log("klass-detail / setKlassDays / daysList : ",daysList);

    let selectOptionList:DefaultOption[] = 
    this.watchTower
    .getMyConst()
    .getDefaultOptionListWithKeyValueFocus(
      // nameKeyList:string, 
      "class_days_kor_list", 
      // nameValueList:string,
      "class_days_list", 
      // valueFocus:string
      daysList
    );
    if(isDebug) console.log("klass-detail / setKlassDays / selectOptionList : ",selectOptionList);
    this.klassDaysComponent.setCheckOption([selectOptionList]);

  } // end method

  private getSubwayStationImg(subwayLine:string, subwayStation:string) :string {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / getSubwayStationImg / 시작");

    if(isDebug) console.log(`klass-detail / getSubwayStationImg / subwayLine : ${subwayLine}`);
    if(isDebug) console.log(`klass-detail / getSubwayStationImg / subwayStation : ${subwayStation}`);

    if(null == subwayLine || "" === subwayLine) {
      subwayLine = 
      this.watchTower
      .getMyConst()
      .getFirst(
        "subway_line_list"
      );
    }
    if(isDebug) console.log(`klass-detail / getSubwayStationImg / subwayLine : ${subwayLine}`);

    if(null == subwayStation || "" === subwayStation) {
      subwayStation = 
      this.watchTower
      .getMyConst()
      .getDefaultNested(
        // parentKey:string, 
        "subway_line_list", 
        // parentValue:string, 
        subwayLine, 
        // childKey:string
        "subway_station_list"
      );
    }
    if(isDebug) console.log(`klass-detail / getSubwayStationImg / subwayStation : ${subwayStation}`);

    let subwayStationImg:string = 
    this.watchTower.getMyConst().getNestedChildValue(
      // parentKey:string, 
      "subway_line_list",
      // parentValue:string,
      subwayLine,
      // childKeySrc:string,
      "subway_station_list",
      // childValue:string,
      subwayStation,
      // childKeyTarget:string
      "subway_station_img_list"
    );
    return subwayStationImg;

  }

  private getLevelImage(klassLevel:string):string {

    return this.watchTower
    .getMyConst()
    .getValue(
      // srcKey:string, 
      "class_level_list",
      // srcValue:string, 
      klassLevel,
      // targetKey:string
      "class_level_img_url_list"
    );
  }

  private setSelectileImageTable() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setSelectileImageTable / 시작");

    // 레벨 이미지 설정하기
    let levelImg:string = 
    this.klassCopy.level_img_url =
    this.getLevelImage(this.klassCopy.level);
    if(isDebug) console.log("klass-detail / setSelectileImageTable / levelImg : ",levelImg);

    // 지하철 역 이미지 설정하기. - 시작
    let subwayStationImg:string = 
    this.klassCopy.subway_station_img =
    this.getSubwayStationImg(
      this.klassCopy.subway_line, 
      this.klassCopy.subway_station
    );
    if(isDebug) console.log("klass-detail / setSelectileImageTable / subwayStationImg : ",subwayStationImg);

    this.selectileImageTable = 
    [
      [
        levelImg,
        subwayStationImg,
        this.klassCopy.time_begin_img_url
      ]
    ];

    if(null != this.klassCopy.days_img_url_list) {
      for (var i = 0; i < this.klassCopy.days_img_url_list.length; ++i) {
        let days_img_url:string = this.klassCopy.days_img_url_list[i];
        this.selectileImageTable[0].push(days_img_url);
      } // end for
    } // end if
  } // end method

  private setDaysImg() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setDaysImg / 시작");

    let days_list:string[] = this.klass.days_list;
    let days_img_url_list:string[] = [];
    for (var i = 0; i < days_list.length; ++i) {
      let day:string = days_list[i];

      let day_img_url:string = 
      this.watchTower
      .getMyConst()
      .getValue(
        // srcKey:string, 
        "class_days_list",
        // srcValue:string, 
        day,
        // targetKey:string
        "class_days_img_url_list"
      );

      days_img_url_list.push(day_img_url);
    } // end for   

    if(isDebug) console.log("klass-detail / setDaysImg / days_img_url_list : ",days_img_url_list);

    this.klass.days_img_url_list = days_img_url_list;

  }

  private onAfterReceivingKlass() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / onAfterReceivingKlass / 시작");
    if(isDebug) console.log("klass-detail / onAfterReceivingKlass / this.klass : ",this.klass);

    // 수업 정보를 받은 뒤에, 요일 이미지 정보를 업데이트합니다.
    this.setDaysImg();


    // 저장 이전의 모든 데이터는 복사본에서 가져와 사용합니다.
    // 저장 이후에 복사본의 데이터를 원본으로 백업합니다.
    this.klassCopy = this.klass.copy();

    // fill datas
    this.imgUploaderImageUrlKlassPoster = this.klassCopy.class_poster_url_loadable;
    this.klassTitle = this.klassCopy.title;

    // set image-grid admin
    if(null != this.bannerComponent) {
      this.bannerComponent.compareUserImages(this.klassCopy.class_banner_url_arr);
    }

    this.setSelectileImageTable();

    // set default-input: klass price
    this.setKlassPrice();
    this.setKlassWeeks();
    this.setKlassTimeBegin();
    this.setKlassTimeEnd();
    this.setKlassDays();
    this.setKlassPriceDesc();

    // @ Deprecated
    this.setKlassDateEnrollmentView();
    this.setKlassDateEnrollmentInput();

    // set image-grid service
    let classBannerUrlArr:string[] = this.klassCopy.class_banner_url_arr;
    if(null != classBannerUrlArr && 0 < classBannerUrlArr.length) {
      for (var i = 0; i < classBannerUrlArr.length; ++i) {
        let classBannerUrl:string = classBannerUrlArr[i];
        classBannerUrl = this.klassService.getKlassBannerUrlLoadable(classBannerUrl);
        this.imageTableBannerListService.push([classBannerUrl]);    
      } // end for
    } // end if

    // 수업 정보 리스트에게 klass 정보를 전달합니다.
    

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

  // REMOVE ME
  /*
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
  */



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

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_WEEKS)) {  

        if( null != myEvent.metaObj ) {
          this.klassWeeksComponent = myEvent.metaObj;
          this.setKlassWeeks();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_VIEW)) {

        if( null != myEvent.metaObj ) {
          this.priceTagHComponent = myEvent.metaObj;
          this.setKlassPrice();
          this.setKlassPriceDesc();
          this.setKlassWeeks();
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

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DATE_ENROLLMENT_VIEW)) {  

        if( null != myEvent.metaObj ) {
          this.butterflyComponent = myEvent.metaObj;
          this.setKlassDateEnrollmentView();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DATE_ENROLLMENT_INPUT)) {  

        if( null != myEvent.metaObj ) {
          this.klassDateEnrollmentComponent = myEvent.metaObj;
          this.setKlassDateEnrollmentInput();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_LEVEL)) {  

        if( null != myEvent.metaObj ) {
          this.klassLevelComponent = myEvent.metaObj;
          this.setKlassLevel();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_LINE)) {  

        if( null != myEvent.metaObj ) {
          this.klassSubwayLineComponent = myEvent.metaObj;
          this.setKlassSubwayLine();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_STATION)) {  

        if( null != myEvent.metaObj ) {
          this.klassSubwayStationComponent = myEvent.metaObj;
          this.setKlassSubwayStation();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS)) {  

        if( null != myEvent.metaObj ) {
          this.klassDaysComponent = myEvent.metaObj;
          this.setKlassDays();
        }

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        if( null != myEvent.metaObj ) {
          this.bannerComponent = myEvent.metaObj;
        } // end if
        if( null != this.klass && null != this.bannerComponent ) {
          this.bannerComponent.compareUserImages(this.klassCopy.class_banner_url_arr);
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_LIST)) {  

        if( null != myEvent.metaObj ) {
          this.klassDetailNavListComponent = myEvent.metaObj;
          this.setKlassDetailNavList();
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER_VIEW)) {  

        // Do something...

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_SELECTILE_VIEW)) {  

        if( null != myEvent.metaObj ) {
          this.selectTileViewComponent = myEvent.metaObj;
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC)) {  

        if( null != myEvent.metaObj ) { // wonder.jung
          this.priceCalculator = myEvent.metaObj;
          this.setPriceCalculator();
        } // end if

      } // end if  

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {

        this.updateKlassTitle(myEvent.value, false);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_VENUE_MAP)) {

        this.updateKlassVenue(myEvent.metaObj);
/*
      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE)) {

        // this.updateKlassPrice(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_WEEKS)) {

        // this.updateKlassWeeks(+myEvent.value);
*/
      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        this.updateKlassBanners(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_BEGIN)) {  

        this.updateKlassTimeBegin(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_END)) {  

        this.updateKlassTimeEnd(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DATE_ENROLLMENT_INPUT)) {  

        this.updateKlassDateEnrollment(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS)) {  

        this.updateKlassDays(myEvent.metaObj);     

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_LEVEL)) {  

        this.updateKlassLevel(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_LINE)) {

        this.updateKlassSubwayLine(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_STATION)) {  

        this.updateKlassSubwayStation(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_FEATURE_LIST)) {  

        this.updateKlassFeatureList(myEvent.metaObj);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {

        this.updateKlassTargetList(myEvent.metaObj);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_SCHEDULE)) {

        this.updateKlassSchedule(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC)) {

        this.updateKlassPriceCalc(myEvent.metaObj);
        // this.setKlassWeeks();

// REMOVE ME
/*
      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_PRICE_FOR_STUDENT)) {

        this.updateKlassPrice(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_CALC_STUDENT_NUMBER)) {

        this.updateKlassStudentCnt(myEvent.value);
*/

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

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        this.klassCopy.setTeacherResumeList(myEvent.metaObj);
        this.updateSaveBtnStatus();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        this.klassCopy.setTeacherGreetingList(myEvent.metaObj);
        this.updateSaveBtnStatus();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        this.addKlassBanner(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {

        this.updateKlassTargetList(myEvent.metaObj);

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        this.klassCopy.setTeacherResumeList(myEvent.metaObj);
        this.updateSaveBtnStatus();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        this.klassCopy.setTeacherGreetingList(myEvent.metaObj);
        this.updateSaveBtnStatus();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {

        this.removeKlassBanner(myEvent.value);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {

        this.updateKlassTargetList(myEvent.metaObj);

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_SHUTDOWN_N_ROLLBACK)) { 

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_SCHEDULE)) {

        this.updateKlassSchedule(myEvent.value);

      } // end if

    } // end if

    if(isDebug) console.log("klass-detail / onChangedFromChild / this.klassCopy : ",this.klassCopy);
    if(isDebug) console.log("klass-detail / onChangedFromChild / Done");

  } // end method


  private updateKlassPriceCalc(klassPriceCalc:any) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassPriceCalc / 시작");

    if(null == klassPriceCalc) {
      return;
    }

    if(isDebug) console.log("klass-detail / updateKlassPriceCalc / klassPriceCalc : ",klassPriceCalc);

    this.klassCopy.week = parseInt(klassPriceCalc.weeks);
    this.klassCopy.price = parseInt(klassPriceCalc.price);
    this.klassCopy.student_cnt = parseInt(klassPriceCalc.studentCnt);

    let studentPrice:number = this.klassCopy.getPriceForStudent();
    if(isDebug) console.log("klass-detail / updateKlassPriceCalc / studentPrice : ",studentPrice);

    this.priceTagHComponent.setPrice(studentPrice);

    this.setKlassPriceDesc();
    this.updateSaveBtnStatus();
    this.updateKlassWeeks(this.klassCopy.week);

  }

  // @ Desc : 해당 수업의 선생님인 경우, 수수료 요율등의 정보를 표시합니다.
  private setKlassPriceDesc() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassPriceDesc / 시작");

    if(null == this.loginUser) {
      if(isDebug) console.log("klass-detail / setKlassPriceDesc / 중단 / this.loginUser is not valid!");
      return;
    }
    if(!this.loginUser.isTeacher()) {
      if(isDebug) console.log("klass-detail / setKlassPriceDesc / 중단 / this.loginUser is not teacher!");
      return;
    }
    if(null == this.priceTagHComponent) {
      if(isDebug) console.log("klass-detail / setKlassPriceDesc / 중단 / this.priceTagHComponent is not valid!");
      return;
    }
    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassPriceDesc / 중단 / this.klassCopy is not valid!");
      return;
    }

    if(isDebug) console.log("klass-detail / setKlassPriceDesc / 선생님이라면 가격의 수수료를 노출합니다.");

    let commision:number = this.klassCopy.getCommision();

    let paymentForTeacherStr:string = this.klassCopy.getPaymentForTeacherStr();
    let klassPriceDesc:string = `실수령액 : ${paymentForTeacherStr} (수수료 : ${commision}%)`;

    if(isDebug) console.log("klass-detail / setKlassPriceDesc / commision : ",commision);
    if(isDebug) console.log("klass-detail / setKlassPriceDesc / paymentForTeacherStr : ",paymentForTeacherStr);
    if(isDebug) console.log("klass-detail / setKlassPriceDesc / klassPriceDesc : ",klassPriceDesc);

    this.priceTagHComponent.setPriceDesc(klassPriceDesc);

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

    this.updateSaveBtnStatus();

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

    this.updateSaveBtnStatus();

    if(isDebug) console.log("klass-detail / updateKlassTimeEnd / this.klassCopy : ",this.klassCopy);

  }

  private updateKlassDays(metaObj:any) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassDays / 시작");
    if(isDebug) console.log("klass-detail / updateKlassDays / metaObj : ",metaObj);

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / updateKlassDays / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.selectTileViewComponent) {
      if(isDebug) console.log("klass-detail / updateKlassDays / 중단 / this.selectTileViewComponent is not valid!");
      return;
    }    


    let selectedValue:string = metaObj.value;
    let constMap:any = this.watchTower.getConstMap();
    let classDaysList:string[] = constMap["class_days_list"];
    let classDaysImgUrlList:string[] = constMap["class_days_img_url_list"];

    let daysImgUrl:string = "/"+this.myArray.getValueFromLists(selectedValue, classDaysList, classDaysImgUrlList);

    if(isDebug) console.log("klass-detail / updateKlassDays / daysImgUrl : ",daysImgUrl);

    if(metaObj.isFocus) {

      if(isDebug) console.log("klass-detail / updateKlassDays / 이미지를 추가합니다.");

      // 이미지를 추가합니다.
      this.selectileImageTable[0].push(daysImgUrl);
      // 데이터를 추가합니다.
      this.klassCopy.addDay(selectedValue, daysImgUrl);

    } else if(0 < this.klassCopy.days_list.length) {

      if(isDebug) console.log("klass-detail / updateKlassDays / 이미지를 제거합니다.");

      // 이미지를 제거합니다.
      this.selectileImageTable[0] = this.myArray.removeStr(this.selectileImageTable[0], daysImgUrl);
      // 데이터를 삭제합니다.
      this.klassCopy.removeDay(selectedValue, daysImgUrl);

    } // end if

    this.updateSaveBtnStatus();
  }

  private updateKlassLevel(klassLevel:string) :void {  

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassLevel / 시작");

    if(this.klassCopy.level === klassLevel) {
      if(isDebug) console.log("klass-detail / updateKlassLevel / 중단 / 같은 레벨입니다.");
      return;
    }

    if(isDebug) console.log("klass-detail / updateKlassLevel / klassLevel : ",klassLevel);

    this.klassCopy.level = klassLevel;
    let levelImagePrev:string = this.klassCopy.level_img_url;
    let levelImageNext:string = this.klassCopy.level_img_url = this.getLevelImage(klassLevel);

    if(isDebug) console.log("klass-detail / updateKlassLevel / levelImagePrev : ",levelImagePrev);
    if(isDebug) console.log("klass-detail / updateKlassLevel / levelImageNext : ",levelImageNext);

    this.replaceSubwayStationImage(levelImagePrev, levelImageNext);

    this.updateSaveBtnStatus();
  }

  private updateKlassSubwayLine(klassSubwayLine:string) :void {  

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassSubwayLine / 시작");

    if(isDebug) console.log("klass-detail / updateKlassSubwayLine / klassSubwayLine : ",klassSubwayLine);

    let constMap:any = this.watchTower.getConstMap();
    let subwayLineList:string[] = constMap["subway_line_list"];

    // 새로운 지하철 호선 정보로 교체!
    this.klassCopy.subway_line = klassSubwayLine;

    // 변경된 지하철 호선에 맞게 역의 선택 리스트를 옮겨줍니다.
    this.updateSelectOptionSubwayStations(klassSubwayLine);

    this.updateSaveBtnStatus();
  }

  private updateKlassSubwayStation(klassSubwayStation:string) :void {  

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassSubwayStation / 시작");

    if(isDebug) console.log("klass-detail / updateKlassSubwayStation / klassSubwayStation : ",klassSubwayStation);

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / updateKlassSubwayStation / 중단 / this.klassCopy is not valid!");
      return;
    }

    // REMOVE ME
    /*
    if(this.klassCopy.subway_station === klassSubwayStation) {
      if(isDebug) console.log("klass-detail / updateKlassSubwayStation / 중단 / 동일한 지하철 역을 선택했습니다.");
      return;
    }
    */

    // 새로운 지하철 역 정보로 교체!
    this.klassCopy.subway_station = klassSubwayStation;

    // 이전 이미지를 가져옵니다.
    let subwayImagePrev:string = this.klassCopy.subway_station_img;
    // 새로운 이미지 정보로 교체
    let subwayImageNext:string = 
    this.klassCopy.subway_station_img = 
    this.getSubwayStationImg(
      this.klassCopy.subway_line,
      this.klassCopy.subway_station
    );

    // 이미지를 교체합니다.
    if(isDebug) console.log("klass-detail / updateKlassSubwayStation / subwayImagePrev : ",subwayImagePrev);
    if(isDebug) console.log("klass-detail / updateKlassSubwayStation / subwayImageNext : ",subwayImageNext);
    
    this.replaceSubwayStationImage(subwayImagePrev, subwayImageNext);

    this.updateSaveBtnStatus();
  }
  private replaceSubwayStationImage(subwayImagePrev:string, subwayImageNext:string) :void{

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / replaceSubwayStationImage / 시작");
    if(isDebug) console.log("klass-detail / replaceSubwayStationImage / subwayImagePrev : ",subwayImagePrev);
    if(isDebug) console.log("klass-detail / replaceSubwayStationImage / subwayImageNext : ",subwayImageNext);

    this.selectileImageTable[0] = this.myArray.replaceStr(this.selectileImageTable[0], subwayImagePrev, subwayImageNext);
  }

  private updateKlassFeatureList(featureList:string[]) :void {  

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassFeatureList / 시작");
    if(isDebug) console.log("klass-detail / updateKlassFeatureList / featureList : ",featureList);

    this.klassCopy.setFeatureList(featureList);

    this.updateSaveBtnStatus();

  }

  private updateKlassTargetList(targetList:string[]) :void {  

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassTargetList / 시작");

    if(isDebug) console.log("klass-detail / updateKlassTargetList / targetList : ",targetList);

    this.klassCopy.setTargetList(targetList);

    this.updateSaveBtnStatus();

  }

  private updateKlassSchedule(schedule:string) :void {  

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassSchedule / 시작");

    if(isDebug) console.log("klass-detail / updateKlassSchedule / schedule : ",schedule);

    // 가장 마지막에 추가되는 불필요한 태그를 삭제합니다.
    schedule = schedule.replace(/\<p\>\<br\>\<\/p\>$/gi,"");

    this.klassCopy.setSchedule(schedule);

    this.updateSaveBtnStatus();

  }

  private updateKlassStudentCnt(studentCnt:string) :void {  

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassStudentCnt / 시작");

    if(null == studentCnt || "" === studentCnt) {
      if(isDebug) console.log("klass-detail / updateKlassStudentCnt / 중단 / studentCnt is not valid!");
      return;
    }

    this.klassCopy.student_cnt = +studentCnt;

    this.updateSaveBtnStatus();

  } // end method

  private setKlassDateEnrollment() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / setKlassDateEnrollment / 시작");

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / setKlassDateEnrollment / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassDateEnrollmentComponent) {
      if(isDebug) console.log("klass-detail / setKlassDateEnrollment / 중단 / this.klassDateEnrollmentComponent is not valid!");
      return;
    }





  }

  private updateKlassDateEnrollment(klassDateEnrollment:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassDateEnrollment / 시작");
    if(isDebug) console.log("klass-detail / updateKlassDateEnrollment / klassDateEnrollment : ",klassDateEnrollment);

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / updateKlassDateEnrollment / 중단 / this.klassCopy is not valid!");
      return;
    }
    if(null == this.klassDateEnrollmentComponent) {
      if(isDebug) console.log("klass-detail / updateKlassDateEnrollment / 중단 / this.klassDateEnrollmentComponent is not valid!");
      return;
    }

    let dateEnrollmentStr:string = this.klassDateEnrollmentComponent.getKeyFromSelect(klassDateEnrollment);
    if(null == dateEnrollmentStr || "" === dateEnrollmentStr) {
      if(isDebug) console.log("klass-detail / updateKlassDateEnrollment / 중단 / dateEnrollmentStr is not valid!");
      return;
    }

    if(isDebug) console.log("klass-detail / updateKlassDateEnrollment / dateEnrollmentStr : ",dateEnrollmentStr);

    this.klassCopy.date_begin = klassDateEnrollment;
    this.butterflyComponent.setText(dateEnrollmentStr);

    this.updateSaveBtnStatus();

    if(isDebug) console.log("klass-detail / updateKlassDateEnrollment / this.klassCopy.date_begin : ",this.klassCopy.date_begin);

  }

  private getTimeImage(hhmmBegin:string):string {

    // selectile의 시간 이미지를 업데이트합니다.
    let hours:number = this.myTime.getHoursFromHHMM(hhmmBegin);

    let targetIdx:number = -1;
    if(6 <= hours && hours < 12) 
    {       
      // 오전
      targetIdx = 1;
    } 
    else if(12 <= hours && hours < 14) 
    {
      // 점심
      targetIdx = 2;
    }
    else if(14 <= hours && hours < 18) 
    {
      // 오후
      targetIdx = 3;
    }
    else if(18 <= hours && hours < 20) 
    {
      // 저녁
      targetIdx = 4;
    }
    else 
    {
      targetIdx = 0;
    } 

    return this.watchTower
    .getMyConst()
    .getValueWithIdx(
      // targetKey:string, 
      "class_times_img_url_list",
      // targetIdx:number,
      targetIdx
    );
  }

  private replaceTimeImage(timeImagePrev:string, timeImageNext:string) :void{

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / replaceTimeImage / 시작");

    if(null == timeImagePrev || "" === timeImagePrev ){
      if(isDebug) console.log("klass-detail / replaceTimeImage / 중단 / timeImagePrev is not valid!");
      return;
    } // end if
    if(null == timeImageNext || "" === timeImageNext ){
      if(isDebug) console.log("klass-detail / replaceTimeImage / 중단 / timeImageNext is not valid!");
      return;
    } // end if

    if(isDebug) console.log("klass-detail / replaceSubwayStationImage / timeImagePrev : ",timeImagePrev);
    if(isDebug) console.log("klass-detail / replaceSubwayStationImage / timeImageNext : ",timeImageNext);

    this.selectileImageTable[0] = this.myArray.replaceStr(this.selectileImageTable[0], timeImagePrev, timeImageNext);
  } // end method

  private updateClockTime(hhmmBegin:string, hhmmEnd:string) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateClockTime / 시작");

    // 서비스에 표시되는 시계 아이콘을 업데이트합니다.
    this.clockBoardComponent.setClockTimeBeginEnd(hhmmBegin, hhmmEnd);

    let timeImgNext:string = this.getTimeImage(hhmmBegin);
    if(isDebug) console.log("klass-detail / updateClockTime / timeImgNext : ",timeImgNext);

    this.replaceTimeImage(this.klassCopy.time_begin_img_url, timeImgNext);
    this.klassCopy.time_begin_img_url = timeImgNext;

    this.updateSaveBtnStatus();

  } // end method

  private updateKlassVenue(klassVenue:KlassVenue) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassVenue / 시작");

    if(isDebug) console.log("klass-detail / updateKlassVenue / klassVenue : ",klassVenue);

    if(null == this.klassCopy) {
      if(isDebug) console.log("klass-detail / updateKlassVenue / 중단 / this.klassCopy is not valid!");      
      return;
    }

    // Klass 객체에 수업 장소 관련 데이터를 저장합니다.
    this.klassCopy.setKlassVenue(klassVenue);

    this.updateSaveBtnStatus();
    
    if(isDebug) console.log("klass-detail / updateKlassVenue / this.klassCopy : ",this.klassCopy);

  }

  private updateKlassTitle(klassTitle:string, isDBUpdate:boolean) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateKlassTitle / 시작");
    if(isDebug) console.log("klass-detail / updateKlassTitle / klassTitle : ",klassTitle);
    if(isDebug) console.log("klass-detail / updateKlassTitle / isDBUpdate : ",isDBUpdate);

    if(null == klassTitle || "" == klassTitle) {
      return;
    }

    if(null == this.klassCopy) {
      return;
    }

    this.klassTitle = klassTitle;  // @ Deprecated
    this.klassCopy.title = klassTitle;

    this.updateSaveBtnStatus();

  } // end method




  private addKlassPoster(posterUrl:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / addKlassPoster / 시작");

    if(null == this.klassCopy) {
      return;
    }
    this.klassCopy.class_poster_url = posterUrl;

    this.updateSaveBtnStatus();

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

    this.updateSaveBtnStatus();

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

    if(null == this.klassCopy) {
      return;
    }

    this.klassCopy.class_banner_url = classBannerUrlNext;
    // wonder.jung
    this.updateSaveBtnStatus();

  } // end method

  
  // @ Desc : 수업 저장 항목이 모두 이상이 없는지 확인합니다. 이상이 있다면 해당 컴포넌트에 메시지를 표시합니다.
  isNotOKKlass() :boolean {
    return !this.isOKKlass();
  }
  isOKKlass() :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / isOKKlass / 시작");

    // 입력 관련 모든 컴포넌트를 가져옴.
    // this.klassCopy의 정보를 검사.

    if(null == this.klassTitleComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTitleComponent is not valid!`);
      return false;
    }
    if(this.klassTitleComponent.hasNotDone()) {
      let value:string = this.klassTitleComponent.getInput();
      let history:any = this.klassTitleComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTitleComponent.hasNotDone() / ${value}`);
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTitleComponent.hasNotDone() / history : `,history);
      return false;
    }
    if(null == this.klassTimeBeginComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTimeBeginComponent is not valid!`);
      return false;
    }
    if(this.klassTimeBeginComponent.hasNotDone()) {
      let value:string = this.klassTimeBeginComponent.getInput();
      let history:any = this.klassTimeBeginComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTimeBeginComponent.hasNotDone() / ${value}`);
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTimeBeginComponent.hasNotDone() / history : `,history);
      return false;
    }
    if(null == this.klassTimeEndComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTimeEndComponent is not valid!`);
      return false;
    }
    if(this.klassTimeEndComponent.hasNotDone()) {
      let value:string = this.klassTimeEndComponent.getInput();
      let history:any = this.klassTimeEndComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTimeEndComponent.hasNotDone() / ${value}`);
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassTimeEndComponent.hasNotDone() / history : `,history);
      return false;
    }
    if(null == this.klassDateEnrollmentComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassDateEnrollmentComponent is not valid!`);
      return false;
    }
    if(this.klassDateEnrollmentComponent.hasNotDone()) {
      let value:string = this.klassDateEnrollmentComponent.getInput();
      let history:any = this.klassDateEnrollmentComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassDateEnrollmentComponent.hasNotDone() / ${value}`);
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassDateEnrollmentComponent.hasNotDone() / history : `,history);
      return false;
    }    
    if(null == this.klassLevelComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassLevelComponent is not valid!`);
      return false;
    }
    if(this.klassLevelComponent.hasNotDone()) {
      let value:string = this.klassLevelComponent.getInput();
      let history:any = this.klassLevelComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassLevelComponent.hasNotDone() / ${value}`);
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassLevelComponent.hasNotDone() / history : `,history);
      return false;
    }        
    if(null == this.klassSubwayLineComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassSubwayLineComponent is not valid!`);
      return false;
    }
    if(this.klassSubwayLineComponent.hasNotDone()) {
      let value:string = this.klassSubwayLineComponent.getInput();
      let history:any = this.klassSubwayLineComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassSubwayLineComponent.hasNotDone() / ${value}`);
      return false;
    }            
    if(null == this.klassSubwayStationComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassSubwayStationComponent is not valid!`);
      return false;
    }
    if(this.klassSubwayStationComponent.hasNotDone()) {
      let value:string = this.klassSubwayStationComponent.getInput();
      let history:any = this.klassSubwayStationComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassSubwayStationComponent.hasNotDone() / ${value}`);
      return false;
    }                
    if(null == this.klassDaysComponent) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassDaysComponent is not valid!`);
      return false;
    }
    if(this.klassDaysComponent.hasNotDone()) {
      let value:string = this.klassDaysComponent.getInput();
      let history:any = this.klassDaysComponent.getHistory();
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassDaysComponent.hasNotDone() / ${value}`);
      return false;
    }
    if( null == this.klassCopy.klassVenue || 
        null == this.klassCopy.venue_address || 
        "" == this.klassCopy.venue_address ) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassCopy.klassVenue is not valid!`);
      alert("지도에서 수업 장소를 확인해주세요.");
      return false;
    }
    if( null == this.klassCopy.student_cnt || 
        !(0 < this.klassCopy.student_cnt) ) {
      if(isDebug) console.log(`klass-detail / isOKKlass / 중단 / this.klassCopy.klassVenue is not valid!`);
      return false;
    }

    if(isDebug) console.log(`klass-detail / isOKKlass / All is OK`);

    return true;
  }

  onClickSave(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / onClickSave / 시작");

    // 1. 변경되었는지 다시 한번 확인합니다.
    let hasChanged:boolean = this.klassCopy.isNotSame(this.klass);
    if(!hasChanged) {
      if(isDebug) console.log("klass-detail / onClickSave / 중단 / 변경된 사항이 없습니다.");
      return;
    } // end if

    if(this.isNotOKKlass()) {
      if(isDebug) console.log("klass-detail / onClickSave / 중단 / this.isNotOKKlass()");
      return;
    } // end if

    if(!this.loginUser.isTeacher()) {
      if(isDebug) console.log("klass-detail / onClickSave / 중단 / !this.loginUser.isTeacher()");
      return;
    }

    // 2. DB Update!
    this.klassService.updateKlass(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // teacherId:number,
      this.loginUser.getTeacherId(),
      // klass:Klass
      this.klassCopy
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("klass-detail / onClickSave / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("klass")) {

        // 저장 완료! 초기화!
        this.klass = this.klassCopy.copy();
        this.isSaveBtnDisabled = true;

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
          `klass-detail / updateKlass / user_id : ${this.loginUser.id} / klass_id : ${this.klassCopy.id}`
        ); // end logger      

      } // end if

    }) // end service

  } // end method

  updateSaveBtnStatus() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail / updateSaveBtnStatus / 시작");

    let hasChanged:boolean = this.klassCopy.isNotSame(this.klass);

    if(isDebug) console.log("klass-detail / updateSaveBtnStatus / hasChanged : ",hasChanged);

    this.isSaveBtnDisabled = !hasChanged;
  }


  // REMOVE ME
  /*
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
  */  

  /*
  private updateKlassLevelDayTimeStation(klassSelectile:any) :void {

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

      // REMOVE ME
      // this.klassCopy.venue_subway_station = klassStation.key;
      // this.klassCopy.venue_subway_station_img_url = klassStation.img_url;

    } // end if
    let klassTime:KlassTime = klassSelectile.time;
    if(null != klassTime) {
      if(isDebug) console.log("klass-detail / updateKlassLevelDayTimeStation / klassTime : ",klassTime); 

      this.klassCopy.time_begin = klassTime.hh_mm;
      this.klassCopy.time_begin_img_url = klassTime.img_url;
    } // end if

    this.updateSaveBtnStatus();

  } // end if
  */


} // end class
