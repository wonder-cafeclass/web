import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewInit,
          SimpleChanges,
          Output, 
          EventEmitter,
          ElementRef,
          Input }                     from '@angular/core';

import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';

import { UrlService }                 from '../util/url.service';
import { ImageService }               from '../util/image.service';

import { MyEvent }                    from '../util/model/my-event';
import { MyChecker }                  from '../util/model/my-checker';
import { MyResponse }                 from '../util/model/my-response';

import { MyEventWatchTowerService }   from '../util/service/my-event-watchtower.service';
import { MyEventService }             from '../util/service/my-event.service';
import { MyCheckerService }           from '../util/service/my-checker.service';
import { MyLoggerService }            from '../util/service/my-logger.service';

import { HelperMyIs }                 from '../util/helper/my-is';
import { HelperMyTime }               from '../util/helper/my-time';
import { HelperMyArray }              from '../util/helper/my-array';


import { Klass }                      from '../widget/klass/model/klass';
import { KlassQuestion }              from '../widget/klass/model/klass-question';
import { KlassReview }                from '../widget/klass/model/klass-review';
import { KlassVenue }                 from '../widget/klass/model/klass-venue';

import { KlassColorService }          from '../widget/klass/service/klass-color.service';
import { KlassCommentService }        from '../widget/klass/service/klass-comment.service';
import { KlassRadioBtnService }       from '../widget/klass/service/klass-radiobtn.service';
import { KlassService }               from '../widget/klass/service/klass.service';

import { KlassVenueSearchListComponent }  from '../widget/klass/klass-venue-search-list.component';
import { KlassTeacherComponent }          from '../widget/klass/klass-teacher.component';

import { SmartEditorComponent }           from '../widget/smart-editor/smart-editor.component';
import { Comment }                        from '../widget/comment/model/comment';
import { CommentListComponent }           from '../widget/comment/comment-list.component';

import { InputsBtnsRowsComponent }        from '../widget/input-view/inputs-btns-rows.component';
import { NavTabsComponent }               from '../widget/nav-tabs/nav-tabs.component';

import { User }                           from '../users/model/user';
import { Teacher }                        from '../teachers/model/teacher';

@Component({
  moduleId: module.id,
  selector: 'klass-detail-nav-list',
  templateUrl: 'klass-detail-nav-list.component.html',
  styleUrls: [ 'klass-detail-nav-list.component.css' ]
})
export class KlassDetailNavListComponent implements OnInit, AfterViewInit {

  private questionListComponent: CommentListComponent;  
  private reviewListComponent: CommentListComponent;  

  private featureListComponent: InputsBtnsRowsComponent;
  private targetListComponent: InputsBtnsRowsComponent;

  @ViewChild(KlassVenueSearchListComponent)
  private venueSearchComponent: KlassVenueSearchListComponent;

  @ViewChild(KlassTeacherComponent)
  private teacherComponent: KlassTeacherComponent;

  @ViewChild(NavTabsComponent)
  private navTabsComponent: NavTabsComponent;

  @Input() radiobtnOptionListNavTabs:RadioBtnOption[];
  @Input() klass:Klass;
  loginUser:User;

  @Input() klassFeature:string; // @ Deprecated
  @Input() klassFeatureList:string[];
  @Input() klassTarget:string;
  @Input() klassTargetList:string[];
  @Input() klassSchedule:string;
  klassScheduleCopy:string;

  @Input() isTeacher:boolean=false;
  @Input() cageWidth:number=-1;

  cageWidthStr:string;
  colorWhite:string;
  colorOrange:string;
  colorGray:string;

  // Nav Focus
  isFocusKlassDesc:boolean=true;
  isFocusKlassVenue:boolean=false;
  isFocusTutorDesc:boolean=false;
  isFocusStudentReview:boolean=false;
  isFocusStudentQuestion:boolean=false;
  isFocusCaution:boolean=false;


  myEventSIKlassFeature:MyEvent; // @ Deprecated
  myEventSIKlassTarget:MyEvent; // @ Deprecated

  myEventForReview:MyEvent;
  myEventForQuestion:MyEvent;

  myEventForKlassFeature:MyEvent;
  myEventListForKlassFeature:MyEvent[];
  myEventListForKlassFeatureCopy:MyEvent[];
  myEventForKlassTarget:MyEvent;
  myEventListForKlassTarget:MyEvent[];
  myEventListForKlassTargetCopy:MyEvent[];

  navHeight:number=50;
  borderTopBottomWidth:number=2;

  // Admin Show
  isShowKlassFeatureAdmin:boolean=false;
  isShowKlassTargetAdmin:boolean=false;
  isShowKlassScheduleAdmin:boolean=false;
  isPreviewKlassSchedule:boolean=false;

  watchTowerImgUrl:string;
  watchTowerWhiteImgUrl:string;
  klassPointsImgUrl:string;

  seKlassFeature:SmartEditorComponent;

  // Review
  reviewCommentList:Comment[];
  // Question
  questionCommentList:Comment[];

  btnNameKlassFeature:string="수업 특징 수정하기";
  btnNameKlassTarget:string="수업 대상 수정하기";
  btnNameKlassSchedule:string="수업 일정 수정하기";

  // 특정 위치로 이동.
  private moveto:string="";

  @Output() emitter = new EventEmitter<any>();

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;

  constructor(  private klassColorService:KlassColorService, 
                private klassCommentService:KlassCommentService,
                private klassService:KlassService,
                private watchTower:MyEventWatchTowerService,
                public myEventService:MyEventService, 
                private myCheckerService:MyCheckerService, 
                private radiobtnService:KlassRadioBtnService,
                private myLoggerService:MyLoggerService,
                private urlService:UrlService,
                private myElement: ElementRef,
                public imageService: ImageService) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngOnInit(): void {

    if(this.isDebug()) console.log("k-d-n-l / ngOnInit / init");

    // WIDTH
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    } // end if

    this.subscribeEventPack();

    this.subscribeLoginUser();
    
  }

  ngAfterViewInit() :void {
  }

  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("k-d-n-l / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();
    if(this.isDebug()) console.log("k-d-n-l / subscribeLoginUser / this.loginUser : ",this.loginUser);

    if(null != this.loginUser) {
      // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
      this.tossLoginUser();
      return;
    } // end if

    // 로그인 유저 정보를 가져오지 못했습니다. watchTowerd에서 전달해주기를 기다립니다.
    this.watchTower.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(this.isDebug()) console.log("k-d-n-l / subscribeLoginUser / loginUser : ",loginUser);

      // 이벤트 관련 정보가 준비되었습니다.
      this.loginUser = loginUser;

      // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
      this.tossLoginUser();

    }); // end subscribe

  } // end method

  private tossLoginUser() :void {

    if(this.isDebug()) console.log("k-d-n-l / tossLoginUser / init");

    if(null == this.loginUser) {
      return;
    }

    if(null != this.questionListComponent) {
      this.questionListComponent.setLoginUser(this.loginUser);
    }

    if(null != this.reviewListComponent) {
      this.reviewListComponent.setLoginUser(this.loginUser);
    }

  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("k-d-n-l / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("k-d-n-l / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      // 1. 이미 EventPack 로딩이 완료된 경우

      // 부모 객체에게 component가 준비된 것을 알립니다.
      this.emitEventOnReady();

    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("k-d-n-l / subscribeEventPack / isEventPackReady : ",isEventPackReady);

        // 이벤트 관련 정보가 준비되었습니다.

        // 부모 객체에게 component가 준비된 것을 알립니다.
        this.emitEventOnReady();

      }); // end subscribe

    } // end if

  } // end method

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("k-d-n-l / emitEventOnReady / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(this.isDebug()) console.log("k-d-n-l / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_LIST,
      // component
      this
    );

    if(this.isDebug()) console.log("k-d-n-l / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(this.isDebug()) console.log("k-d-n-l / emitEventOnReady / Done!");

  } 

  private emitEvent(myEvent:MyEvent) :void {

    if(this.isDebug()) console.log("k-d-n-l / emitEvent / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(this.isDebug()) console.log("k-d-n-l / emitEvent / 중단 / EventPack is not valid!");    
      return;
    }

    if(null == myEvent) {
      if(this.isDebug()) console.log("k-d-n-l / emitEvent / 중단 / myEvent is not valid!");    
      return;
    }

    this.emitter.emit(myEvent);

  }     

  public setKlass(klass:Klass) :void {

    if(this.isDebug()) console.log("k-d-n-l / setKlass / init");

    if(null == klass) {
      return;
    }

    if(this.isDebug()) console.log("k-d-n-l / setKlass / klass : ",klass);

    this.klass = klass;

    // klass의 정보가 들어온 시점에 레이아웃 정보를 설정합니다.
    this.init();

  }

  private setKlassFeature() :void {

    if(this.isDebug()) console.log("k-d-n-l / setKlassFeature / init");    

    if(null == this.klass) {
      if(this.isDebug()) console.log("k-d-n-l / setKlassFeature / 중단 / this.klass is not valid!");
      return;
    }

    let featureList:string[] = this.klass.getFeatureList();
    if(null == featureList || 0 == featureList.length) {
      // 설정된 값이 없다면 기본 설정 값을 넣어줍니다.
      featureList = 
      [
        "(예시) 해외 여행시 다양한 상황에서 필요한 영어 표현들을 연습",
        "(예시) 초급 분들도 영어로 묻고 답하는데 어려움 없도록 코칭",
        "(예시) 자신감을 심어주는 클래스",
      ];
    }

    this.updateKlassFeature(featureList);

  } // end method
  private updateKlassFeature(featureList:string[]) :void {

    if(this.isDebug()) console.log("k-d-n-l / updateKlassFeature / init");

    // 3개 열 고정 노출입니다. 모자라다면 채워서 노출합니다.
    if(this.myArray.isNotOK(featureList)) {
      featureList = [];
    }
    let lengthFixed:number = 3;
    let lengthNeeded:number = lengthFixed - featureList.length;
    if(0 < lengthNeeded) {
      for (var i = (lengthFixed - lengthNeeded); i < lengthFixed; ++i) {
        featureList.push("수업 특징을 입력해주세요."); 
      } // end for
    } // end if

    let myEventKlassFeatureList:MyEvent[] = [];
    if(this.myArray.isOK(featureList)) {

      for (var i = 0; i < featureList.length; ++i) {

        let klassFeature:string = featureList[i];
        let myEventKlassFeature = 
        new MyEvent(
          // public id:string
          this.myEventService.getUniqueIdx(),
          // public eventName:string
          this.myEventService.ANY,
          // public key:string
          this.myEventService.KEY_KLASS_FEATURE_LIST,
          // public value:string
          klassFeature,
          // public metaObj:any
          {klassId:+this.klass.id},
          // public myChecker:MyChecker
          this.myCheckerService.getTitleChecker()
        );

        myEventKlassFeatureList.push(myEventKlassFeature);
      } // end for      

    } // end if

    if(this.isDebug()) console.log("k-d-n-l / updateKlassFeature / myEventKlassFeatureList : ",myEventKlassFeatureList);

    this.myEventListForKlassFeature = myEventKlassFeatureList;

  } // end method  

  private setKlassTarget() :void {

    if(this.isDebug()) console.log("k-d-n-l / setKlassTarget / init");    

    if(null == this.klass) {
      if(this.isDebug()) console.log("k-d-n-l / setKlassTarget / 중단 / this.klass is not valid!");
      return;
    }

    let targetList:string[] = this.klass.getTargetList();
    if(null == targetList || 0 == targetList.length) {
      targetList = 
      [
        "(예시) 1. 여행가서 당황하지 않을 만큼 영어 회화 연습하고 싶은 분들",
        "(예시) 2. 여행 상황별로 충분히 연습해 자신감을 갖고 싶은 분들"
      ];
    }  
    
    this.updateKlassTarget(targetList);

  } // end method
  private updateKlassTarget(targetList:string[]) :void {

    if(this.isDebug()) console.log("k-d-n-l / updateKlassTarget / init");

    // 3개 열 고정 노출입니다. 모자라다면 채워서 노출합니다.
    if(this.myArray.isNotOK(targetList)) {
      targetList = [];
    }
    let lengthFixed:number = 3;
    let lengthNeeded:number = lengthFixed - targetList.length;
    if(0 < lengthNeeded) {
      for (var i = (lengthFixed - lengthNeeded); i < lengthFixed; ++i) {
        targetList.push("수업 대상을 입력해주세요.");
      } // end for
    } // end if

    let myEventKlassTargetList:MyEvent[] = [];
    if(this.myArray.isOK(targetList)) {
      
      for (var i = 0; i < targetList.length; ++i) {

        let klassTarget:string = targetList[i];

        let myEventKlassTarget = 
        new MyEvent(
          // public id:string
          this.myEventService.getUniqueIdx(),
          // public eventName:string
          this.myEventService.ON_CHANGE,
          // public key:string
          this.myEventService.KEY_KLASS_TARGET_LIST,
          // public value:string
          klassTarget,
          // public metaObj:any
          {klassId:+this.klass.id},
          // public myChecker:MyChecker
          this.myCheckerService.getTitleChecker()
        );

        myEventKlassTargetList.push(myEventKlassTarget);
      } // end for      

    } // end if

    this.myEventListForKlassTarget = myEventKlassTargetList;

  } // end method

  private setKlassSchedule() :void {

    if(this.isDebug()) console.log("k-d-n-l / setKlassSchedule / init");    

    let klassSchedule:string = this.klass.schedule;

    if(null === klassSchedule || "" === klassSchedule) {
      klassSchedule = '<p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)1. Small talk &amp; 지난 시간 배운 표현 복습 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)2. Brainstorming – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)3. Key word 익히기 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)4. key expression – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)5. Break – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)6. Practice + Roleplay – <span style="color: rgb(255, 170, 0);">30분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)7. Q&amp;A, feedback + closing – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><br></p>';
    }

    this.klassSchedule = klassSchedule;

  } // end method

  private setImages() :void {
    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
    this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
    this.klassPointsImgUrl = this.imageService.get(this.imageService.classFeatureUrl);
  }

  private setTeacher() :void {

    if(this.isDebug()) console.log("k-d-n-l / setTeacher / init");
    if(null == this.klass || null == this.klass.teacher) {
      if(this.isDebug()) console.log("k-d-n-l / setTeacher / 중단 / null == this.klass.teacher");
      return;
    } // end if
    if(null == this.teacherComponent) {
      if(this.isDebug()) console.log("k-d-n-l / setTeacher / 중단 / null == this.teacherComponent");
      return;
    } // end if
    if(this.isDebug()) console.log("k-d-n-l / setTeacher / this.klass.teacher : ",this.klass.teacher);
    if(this.isDebug()) console.log("k-d-n-l / setTeacher / this.teacherComponent : ",this.teacherComponent);

    this.teacherComponent.setTeacher(this.klass.teacher);
    this.teacherComponent.setResume();
    this.teacherComponent.setGreeting();
  }

  private setReview() :void {

    if(this.isDebug()) console.log("k-d-n-l / setReview / init");

    let loginUserId:number = -1;
    if(null != this.loginUser) {
      loginUserId = +this.loginUser.id;
    }
    if(null == this.klass.review_list) {
      return;
    }

    this.reviewCommentList = 
    this.klassCommentService.getReviewCommentList(
      this.klass.review_list,
      loginUserId
    );

    if(this.isDebug()) console.log("k-d-n-l / setReview / this.reviewCommentList : ",this.reviewCommentList);

    // MyEvent for Review
    this.myEventForReview = 
    this.myEventService.getMyEvent(
      // eventName:string
      this.myEventService.ANY,
      // key:string
      this.myEventService.KEY_COMMENT_REVIEW,
      // value:string
      "",
      // metaObj:any
      this.klass,
      // myChecker:MyChecker
      this.myCheckerService.getCommentChecker()
    );    

  } // end method

  private setQuestion() :void {

    if(this.isDebug()) console.log("k-d-n-l / setQuestion / init");

    let loginUserId:number = -1;
    if(null != this.loginUser) {
      loginUserId = +this.loginUser.id;
    }
    if(null == this.klass.question_list) {
      return;
    }

    this.questionCommentList = 
    this.klassCommentService.getQuestionCommentList(
      this.klass.question_list,
      loginUserId
    );

    // MyEvent for Question
    this.myEventForQuestion = 
    this.myEventService.getMyEvent(
      // eventName:string
      this.myEventService.ANY,
      // key:string
      this.myEventService.KEY_COMMENT_QUESTION,
      // value:string
      "",
      // metaObj:any
      this.klass,
      // myChecker:MyChecker
      this.myCheckerService.getCommentChecker()
    );

  } // end method

  private setNavTabs():void {

    this.radiobtnOptionListNavTabs = 
    this.radiobtnService.getNavTabsKlassInfo(
      // klass:Klass, 
      this.klass,
      // keyFocus:string
      this.watchTower.getMyEventService().KLASS_DESC
    );

  }

  private init() :void {

    if(this.isDebug()) console.log("k-d-n-l / init / init");    

    if(null == this.klass) {
      if(this.isDebug()) console.log("k-d-n-l / init / 중단 / this.klass is not valid!");
      return;
    }

    if(this.isDebug()) console.log("k-d-n-l / init / this.klass : ",this.klass);

    // COLOR
    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    // KLASS FEATURE
    this.setKlassFeature();

    // KLASS TARGET
    this.setKlassTarget();

    // KLASS SCHEDULE
    this.setKlassSchedule();

    // 수업 특징, 대상, 일정에 대한 정보를 백업합니다.
    this.overwriteKlassCopies();

    // 뷰에 사용되는 이미지 설정
    this.setImages();

    // 수업 강사님 정보 가져오기
    this.setTeacher();

    // 수업 리뷰 가져오기
    this.setReview();

    // 수업 질문 가져오기
    this.setQuestion();

    // Nav Tab 설정
    this.setNavTabs();

  }

  private removeMyEventFromList(myEventToRemove:MyEvent, myEventList:MyEvent[]) :MyEvent[] {

    let myEventListNext:MyEvent[] = [];
    for (var i = 0; i < myEventList.length; ++i) {
      let myEventNext:MyEvent = myEventList[i];
      if(myEventNext.isSame(myEventToRemove)) {
        // 지울 이벤트를 찾았습니다. 리스트에서 제외합니다.
        continue;
      }
      myEventListNext.push(myEventNext);
    }

    // 삭제할 이벤트가 없습니다. 받은 리스트를 돌려줍니다.
    return myEventListNext;
  }

  private getEventValues(myEventList:MyEvent[]) :string {

    let eventValues:string = "";
    if(null == myEventList || 0 === myEventList.length) {
      return eventValues;
    }
    
    for (var i = 0; i < myEventList.length; ++i) {
      let myEvent:MyEvent = myEventList[i];
      eventValues += myEvent.value;
      if(i < (myEventList.length - 1)) {
        // unless last index...
        eventValues += "|";
      }
    }

    return eventValues;
  }

  private setQuestionList():void {

    if(null == this.questionListComponent) {
      return;
    }

    this.questionListComponent.setLoginUser(this.loginUser);

  }

  private setReviewList():void {

    if(null == this.reviewListComponent) {
      return;
    }

    this.reviewListComponent.setLoginUser(this.loginUser);

  } 

  private setVenueSearch():void {

    if(this.isDebug()) console.log("k-d-n-l / setVenueSearch / init");

    if(null == this.klass) {
      return;
    }
    if(null == this.venueSearchComponent) {
      return;
    }

    if(this.klass.hasNotKlassVenue()) {
      this.setVenueDefault();
    } else {
      this.venueSearchComponent.setVenue(this.klass.getKlassVenue());
    } // end if
  } // end method

  public setVenueDefault():void {

    if(this.isDebug()) console.log("k-d-n-l / setVenueDefault / init");

    if(null == this.klass) {
      return;
    }
    if(null == this.venueSearchComponent) {
      return;
    }

    this.venueSearchComponent.setVenue(this.venueSearchComponent.getDefaultVenue());

  } // end method

  // @ 로그인 페이지로 이동합니다. 현재 페이지 주소를 리다이렉트 주소로 사용합니다.
  private goLogin():void {

    if(this.isDebug()) console.log("k-d-n-l / goLogin / init");

    let appViewUrl:string = this.urlService.getAppViewUrl();
    if(this.isDebug()) console.log("k-d-n-l / goLogin / appViewUrl : ",appViewUrl);

    let req_url = this.urlService.get(`#/login?redirect=${appViewUrl}`);
    if(this.isDebug()) console.log("k-d-n-l / goLogin / req_url : ",req_url);

    window.location.href = req_url;
  }

  private removeReview(reviewId:number) :void {

    if(this.isDebug()) console.log("k-d-n-l / removeReview / init");

    if(this.isDebug()) console.log("k-d-n-l / removeReview / reviewId : ",reviewId);

    // DB UPDATE!
    this.klassService.removeKlassReview(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // reviewId:number
      reviewId
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("klass-detail / removeReview / myResponse : ",myResponse);
      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_review")) {

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
          `klass-detail-nav-list / removeReview / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / reviewId : ${reviewId}`
        ); // end logger      

      } // end if

    }) // end service     

  }  

  private addReview(newComment:Comment) :void {

    if(this.isDebug()) console.log("k-d-n-l / addReview / init");
    if(this.isDebug()) console.log("k-d-n-l / addReview / newComment : ",newComment);

    // DB UPDATE!
    this.klassService.addKlassReview(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // review:string,
      newComment.comment,
      // star:number
      newComment.star
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("klass-detail / addReview / myResponse : ",myResponse);
      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_review")) {

        // 리뷰가 등록되었습니다.  
        // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
        let klassReviewJSON:any = myResponse.getDataProp("klass_review");
        let klassReview:KlassReview = null;
        if(null != klassReviewJSON) {
          klassReview = new KlassReview().setJSON(klassReviewJSON);
        }
        if(null != klassReview) {
          newComment.id = klassReview.id;
        }
        this.reviewListComponent.updateComment(newComment);

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
          `klass-detail-nav-list / addReview / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / comment : ${newComment.comment}`
        ); // end logger      

      } // end if

    }) // end service     

  } // end if

  private addReviewReply(newComment:Comment) :void {

    if(this.isDebug()) console.log("k-d-n-l / addReviewReply / init");
    if(this.isDebug()) console.log("k-d-n-l / addReviewReply / newComment : ",newComment);

    // DB UPDATE!
    this.klassService.addKlassReviewReply(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // parentId:number,
      +newComment.parentId,
      // question:string
      newComment.comment
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("k-d-n-l / addReviewReply / myResponse : ",myResponse);
      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_review")) {

        // 리뷰가 등록되었습니다.  
        // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
        let klassReviewJSON:any = myResponse.getDataProp("klass_review");
        let klassReview:KlassReview = null;
        if(null != klassReviewJSON) {
          klassReview = new KlassReview().setJSON(klassReviewJSON);
        }
        if(null != klassReview) {
          newComment.id = klassReview.id;
        }
        this.reviewListComponent.updateComment(newComment);

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
          `klass-detail-nav-list / addReviewReply / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / comment : ${newComment.comment}`
        ); // end logger      

      } // end if

    }) // end service
    
  }  

  private removeQuestion(questionId:number) :void {

    if(this.isDebug()) console.log("k-d-n-l / removeQuestion / init");
    if(this.isDebug()) console.log("k-d-n-l / removeQuestion / questionId : ",questionId);

    // DB UPDATE!
    this.klassService.removeKlassQuestion(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // questionId:number
      questionId
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("klass-detail / removeQuestion / myResponse : ",myResponse);
      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_question")) {

        // 리뷰가 등록되었습니다.  
        // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
        /*
        let klassQuestionJSON:any = myResponse.getDataProp("klass_question");
        let klassQuestion:KlassQuestion = null;
        if(null != klassQuestionJSON) {
          klassQuestion = new KlassQuestion().setJSON(klassQuestionJSON);
        }
        if(null != klassQuestion) {
          newComment.id = klassQuestion.id;
        }
        this.questionListComponent.updateComment(newComment);
        */

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
          `klass-detail-nav-list / removeQuestion / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / questionId : ${questionId}`
        ); // end logger      

      } // end if

    }) // end service     

  }

  private addQuestion(newComment:Comment) :void {

    if(this.isDebug()) console.log("k-d-n-l / addQuestion / init");
    if(this.isDebug()) console.log("k-d-n-l / addQuestion / newComment : ",newComment);

    // DB UPDATE!
    this.klassService.addKlassQuestion(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // question:string
      newComment.comment
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("klass-detail / addQuestion / myResponse : ",myResponse);
      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_question")) {

        // 리뷰가 등록되었습니다.  
        // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
        let klassQuestionJSON:any = myResponse.getDataProp("klass_question");
        let klassQuestion:KlassQuestion = null;
        if(null != klassQuestionJSON) {
          klassQuestion = new KlassQuestion().setJSON(klassQuestionJSON);
        }
        if(null != klassQuestion) {
          newComment.id = klassQuestion.id;
        }
        this.questionListComponent.updateComment(newComment);

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
          `klass-detail-nav-list / addQuestion / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / comment : ${newComment.comment}`
        ); // end logger      

      } // end if

    }) // end service     


  } // end if

  private addQuestionReply(newComment:Comment) :void {

    if(this.isDebug()) console.log("k-d-n-l / addQuestionReply / init");
    if(this.isDebug()) console.log("k-d-n-l / addQuestionReply / newComment : ",newComment);

    // DB UPDATE!
    this.klassService.addKlassQuestionReply(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // klassId:number,
      +this.klass.id,
      // parentId:number,
      +newComment.parentId,
      // question:string
      newComment.comment
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("k-d-n-l / addQuestionReply / myResponse : ",myResponse);
      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_question")) {

        // 리뷰가 등록되었습니다.  
        // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
        let klassQuestionJSON:any = myResponse.getDataProp("klass_question");
        let klassQuestion:KlassQuestion = null;
        if(null != klassQuestionJSON) {
          klassQuestion = new KlassQuestion().setJSON(klassQuestionJSON);
        }
        if(null != klassQuestion) {
          newComment.id = klassQuestion.id;
        }
        this.questionListComponent.updateComment(newComment);

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
          `klass-detail-nav-list / addQuestion / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / comment : ${newComment.comment}`
        ); // end logger      

      } // end if

    }) // end service     

    
  }

  // @ Desc : 모든 자식뷰들이 완료된 상태 이후의 작업을 합니다.
  onAfterChildrenReady():void {

    if(null == this.questionListComponent) {
      return;
    }
    if(null == this.reviewListComponent) {
      return;
    }
    if(null == this.venueSearchComponent) {
      return;
    }
    if(null == this.teacherComponent) {
      return;
    }
    if(null == this.navTabsComponent) {
      return; 
    }

    // 자식 객체들이 모두 완료되었습니다.
    // 뷰가 모두 완료된 이후에 해야할 일들을 합니다.
    this.moveToAfterInit();
  }

  onChangedFromInputRow(myEvent:MyEvent) :void{
    // Smart Editor를 사용하는 Element에서 발생한 callback 처리.

    if(this.isDebug()) console.log("k-d-n-l / onChangedFromInputRow / init");
    if(this.isDebug()) console.log("k-d-n-l / onChangedFromInputRow / myEvent : ",myEvent);

    if(null == myEvent || null == myEvent.key || "" == myEvent.key) {
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {

        if(  null != myEvent.metaObj ) {
          this.questionListComponent = myEvent.metaObj; 
          this.setQuestionList();
          this.onAfterChildrenReady();
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {

        if(  null != myEvent.metaObj ) {
          this.reviewListComponent = myEvent.metaObj; 
          this.setReviewList();
          this.onAfterChildrenReady();
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_VENUE_MAP)) {

        if(  null != myEvent.metaObj ) {
          // 네이버 맵 장소 검색 컴포넌트가 준비됨.
          this.venueSearchComponent = myEvent.metaObj;
          this.setVenueSearch();
          this.onAfterChildrenReady();

        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_LIST)) {

        if(  null != myEvent.metaObj ) {
          this.teacherComponent = myEvent.metaObj;
          this.setTeacher();
          this.onAfterChildrenReady();
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_FEATURE_LIST)) {

        if(  null != myEvent.metaObj ) {
          this.featureListComponent = myEvent.metaObj;
          this.featureListComponent.setMyEventList(this.myEventListForKlassFeature);
          this.onAfterChildrenReady();
        } // end if

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {

        if(  null != myEvent.metaObj ) {
          this.targetListComponent = myEvent.metaObj;
          this.targetListComponent.setMyEventList(this.myEventListForKlassTarget);
          this.onAfterChildrenReady();
        } // end if

      } // end if

      // setMyEventList

    } else if(myEvent.hasEventName(this.myEventService.ON_LOGIN_REQUIRED)) {

      this.goLogin();


    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {

        this.myEventListForKlassFeature =
        this.myEventService.setEventValue(
          myEvent, 
          this.myEventListForKlassFeature
        );

        // 부모 객체에 전달합니다.
        this.emitEvent(myEvent);

      } else if(this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {

        this.myEventListForKlassTarget =
        this.myEventService.setEventValue(
          myEvent, 
          this.myEventListForKlassTarget
        );

        // 부모 객체에 전달합니다.
        this.emitEvent(myEvent);

      } else if(this.myEventService.KEY_KLASS_SCHEDULE=== myEvent.key) {

        this.klassSchedule = myEvent.value;

        // 부모 객체에 전달합니다.
        this.emitter.emit(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_VENUE_MAP)) {

        this.emitEvent(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        this.emitEvent(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_GREETING)) {

        this.emitEvent(myEvent);

      }  

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_COMMENT)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {

        // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
        // metaObj로 받는 comment 객체

        let newComment:Comment = new Comment().setJSON(myEvent.metaObj);
        if(this.isDebug()) console.log("k-d-n-l / onChangedFromInputRow / newComment : ",newComment);

        this.addQuestion(newComment);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {

        // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
        // metaObj로 받는 comment 객체

        let newComment:Comment = new Comment().setJSON(myEvent.metaObj);
        if(this.isDebug()) console.log("k-d-n-l / onChangedFromInputRow / newComment : ",newComment);

        this.addReview(newComment);
      }      

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_COMMENT_REPLY)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {

        // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
        // metaObj로 받는 comment 객체        

        let newComment:Comment = new Comment().setJSON(myEvent.metaObj);
        if(this.isDebug()) console.log("k-d-n-l / onChangedFromInputRow / newComment : ",newComment);

        this.addQuestionReply(newComment);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {

        // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
        // metaObj로 받는 comment 객체        

        let newComment:Comment = new Comment().setJSON(myEvent.metaObj);
        if(this.isDebug()) console.log("k-d-n-l / onChangedFromInputRow / newComment : ",newComment);

        this.addReviewReply(newComment);
      }

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {

      // 열이 추가되었습니다.
      if(this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {

        let klassFeatureNext:string = this.getEventValues(this.myEventListForKlassFeature);

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } else if(this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {

        let klassFeatureTarget:string = this.getEventValues(this.myEventListForKlassTarget);

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {

      // 열을 지웁니다.
      if(myEvent.hasKey(this.myEventService.KEY_KLASS_FEATURE_LIST)) {

        this.klassFeature = this.klass.feature = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassFeature);
        this.myEventListForKlassFeature = nextEventList;

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {

        this.klassTarget = this.klass.target = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassTarget);
        this.myEventListForKlassTarget = nextEventList;

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {

        this.removeQuestion(parseInt(myEvent.value));

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {

        this.removeReview(parseInt(myEvent.value));

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);

      } // end if


    } else if(myEvent.hasEventName(this.myEventService.ON_SAVE)) {

      let hasChanged:boolean = false;
      if(this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {
        hasChanged = this.hasChangedFeature();
      } else if(this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {
        hasChanged = this.hasChangedTarget();
      } else if(this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
        hasChanged = this.hasChangedSchedule();
      }

      if(hasChanged) {
        // 변경된 사항을 모두 저장합니다.
        this.overwriteKlassCopies();

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);
      }

    } else if(myEvent.hasEventName(this.myEventService.ON_SHUTDOWN)) {

      // 입력창을 닫습니다.
      if( this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key || 
          this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key ||
          this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
        this.shutdownKlassInfos();
      }

    } else if(myEvent.hasEventName(this.myEventService.ON_SHUTDOWN_N_ROLLBACK)) {

      // 입력창을 닫습니다.
      if( this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key || 
          this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key ||
          this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
        this.shutdownKlassInfos();
      }

      // 데이터가 변경되었는지 확인합니다.
      let hasChanged:boolean = false;
      if(this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {
        hasChanged = this.hasChangedFeature();
      } else if(this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {
        hasChanged = this.hasChangedTarget();
      } else if(this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
        hasChanged = this.hasChangedSchedule();

        // 부모에게 변경된 내역을 전파
        this.emitter.emit(myEvent);
      }

      if(hasChanged) {
        // 데이터를 롤백합니다.
        this.rollbackKlassCopies();
      }

    } else if (this.myEventService.ON_PREVIEW === myEvent.eventName) {

      if(this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
        // 화면에 현재 작업중인 모습을 보여줌.
        this.isPreviewKlassSchedule=true;
      }

    } else if (this.myEventService.ON_UNPREVIEW === myEvent.eventName) {

      if(this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
        // 화면에 현재 작업중인 모습을 보여주지 않음.
        this.isPreviewKlassSchedule=false;
      }

    }
  }

  hasChangedFeature() :boolean {
    let hasChanged:boolean = 
    this.myEventService.hasChangedList(
      this.myEventListForKlassFeature
      , this.myEventListForKlassFeatureCopy
    );

    return hasChanged;
  }
  hasChangedTarget() :boolean {
    let hasChanged:boolean = 
    this.myEventService.hasChangedList(
      this.myEventListForKlassTarget
      , this.myEventListForKlassTargetCopy
    );

    return hasChanged;
  }
  hasChangedSchedule() :boolean {
    if(this.klassScheduleCopy != this.klassSchedule) {
      return true;
    }
    return false;
  }

  private resetElementFocus():void {

    this.isFocusKlassDesc=false;
    this.isFocusKlassVenue=false;
    this.isFocusTutorDesc=false;
    this.isFocusStudentReview=false;
    this.isFocusStudentQuestion=false;
    this.isFocusCaution=false;

  }

  private getFirstBox():any {
    return this.myElement.nativeElement.getBoundingClientRect();
  } // end method

  private getMyBox(targetElement:ElementRef):any {

    if(null == targetElement) {
      return null;
    }

    return targetElement.nativeElement.getBoundingClientRect();
  } // end method

  private moveToAfterInit():void {

    if("review" === this.moveto) {
      this.moveToReview();
    } else if("question" === this.moveto) {
      this.moveToQuestion();
    } // end if

  }

  moveTo(moveto:string):void {

    this.moveto = moveto;

  } // end method  

  private moveToReview() :void {

    if(null == this.reviewListComponent) {
      return;
    } // end if

    let element:ElementRef = this.reviewListComponent.getElement();
    this.moveToSomewhere(element);
    this.isFocusStudentReview=true;
    this.navTabsComponent.setFocus(this.myEventService.STUDENT_REVIEW);

  } // end method

  private moveToQuestion() :void {

    if(null == this.questionListComponent) {
      return;
    } // end if

    let element:ElementRef = this.questionListComponent.getElement();
    this.moveToSomewhere(element);
    this.isFocusStudentQuestion=true;
    this.navTabsComponent.setFocus(this.myEventService.STUDENT_QUESTION);

  } // end method

  private moveToSomewhere(element:ElementRef):void {

    if(null == element) {
      return;
    }

    this.resetElementFocus();
    let nextYPos = 0;
    let firstBox:any = this.getFirstBox();
    let myBox:any = this.getMyBox(element);
    let scrollY:number = window.scrollY;

    if(null != myBox) {
      if(0 < (firstBox.top - this.navHeight)) {
        nextYPos = scrollY + myBox.top - (this.navHeight * 2 + this.borderTopBottomWidth);
      } else {
        nextYPos = scrollY + myBox.top - this.navHeight;
      }

      if(0 < nextYPos) {
        window.scrollTo(0, nextYPos);      
      } // end inner if
    } // end if

  } // end method




  onChangedFromChild(myEvent:MyEvent, klassDesc, klassVenue, tutorDesc, studentReview, studentQuestion, caution) :void{

    this.resetElementFocus();

    let nextYPos = 0;
    let box = null;
    let firstBox = klassDesc.getBoundingClientRect();
    let scrollY:number = window.scrollY;

    if(this.myEventService.KLASS_DESC === myEvent.key) {

      this.isFocusKlassDesc=true;
      box = klassDesc.getBoundingClientRect();

    } else if(this.myEventService.KLASS_VENUE === myEvent.key) {

      this.isFocusKlassVenue=true;
      box = klassVenue.getBoundingClientRect();

    } else if(this.myEventService.TEACHER_DESC === myEvent.key) {

      this.isFocusTutorDesc=true;
      box = tutorDesc.getBoundingClientRect();

    } else if(this.myEventService.STUDENT_REVIEW === myEvent.key) {

      this.isFocusStudentReview=true;
      box = studentReview.getBoundingClientRect();

    } else if(this.myEventService.STUDENT_QUESTION === myEvent.key) {

      this.isFocusStudentQuestion=true;
      box = studentQuestion.getBoundingClientRect();

    } else if(this.myEventService.CAUTION === myEvent.key) {

      this.isFocusCaution=true;
      box = caution.getBoundingClientRect();

    } // end if

    if(null != box) {
      if(0 < (firstBox.top - this.navHeight)) {
        nextYPos = scrollY + box.top - (this.navHeight * 2 + this.borderTopBottomWidth);
      } else {
        nextYPos = scrollY + box.top - this.navHeight;
      }

      if(0 < nextYPos) {
        window.scrollTo(0, nextYPos);      
      } // end inner if
    } // end if

  }

  onToggleKlassFeature(event) :void {

    if(this.isDebug()) console.log("k-d-n-l / onToggleKlassFeature / init");

    event.stopPropagation();
    event.preventDefault();

    this.isShowKlassFeatureAdmin = !this.isShowKlassFeatureAdmin;
    if(!this.isShowKlassFeatureAdmin) {
      this.shutdownKlassInfos();
    }

    if(this.isShowKlassFeatureAdmin) {
      this.btnNameKlassFeature = "닫기"
    } else {
      this.btnNameKlassFeature = "수업 특징 수정하기"
    }
  } // end method
  onToggleKlassTarget(event) :void {

    if(this.isDebug()) console.log("k-d-n-l / onToggleKlassTarget / init");

    event.stopPropagation();
    event.preventDefault();

    this.isShowKlassTargetAdmin = !this.isShowKlassTargetAdmin;
    if(!this.isShowKlassTargetAdmin) {
      this.shutdownKlassInfos();
    }

    if(this.isShowKlassTargetAdmin) {
      this.btnNameKlassTarget = "닫기"
    } else {
      this.btnNameKlassTarget = "수업 대상 수정하기"
    }

  } // end method
  onToggleKlassSchedule(event) :void {

    if(this.isDebug()) console.log("k-d-n-l / onToggleKlassSchedule / init");

    event.stopPropagation();
    event.preventDefault();    

    this.isShowKlassScheduleAdmin = !this.isShowKlassScheduleAdmin;
    if(!this.isShowKlassScheduleAdmin) {
      this.shutdownKlassInfos();
    } // end if

  } // end method
  shutdownKlassInfos() :void {
    this.isShowKlassFeatureAdmin=false;
    this.isShowKlassTargetAdmin=false;
    this.isShowKlassScheduleAdmin=false;
  }
  overwriteKlassCopies() :void {

    this.myEventListForKlassTargetCopy = 
    this.myEventService.getCopyEventList(
      this.myEventListForKlassTarget
    );

    this.myEventListForKlassFeatureCopy = 
    this.myEventService.getCopyEventList(
      this.myEventListForKlassFeature
    );

    this.klassScheduleCopy = this.klassSchedule;

  }
  rollbackKlassCopies() :void {
    this.myEventListForKlassTarget = this.myEventListForKlassTargetCopy;
    this.myEventListForKlassFeature = this.myEventListForKlassFeatureCopy;
    this.klassSchedule = this.klassScheduleCopy;

    this.overwriteKlassCopies();
  }
}