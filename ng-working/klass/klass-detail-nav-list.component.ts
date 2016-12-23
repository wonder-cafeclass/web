import {  Component, 
          ViewChild,
          OnInit, 
          SimpleChanges,
          Output, 
          EventEmitter,
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

import { SmartEditorComponent }       from '../widget/smart-editor/smart-editor.component';
import { Comment }                    from '../widget/comment/model/comment';
import { CommentListComponent }       from '../widget/comment/comment-list.component';

import { Klass }                      from './model/klass';
import { KlassTeacher }               from './model/klass-teacher';

import { KlassColorService }          from './service/klass-color.service';
import { KlassCommentService }        from './service/klass-comment.service';
import { KlassRadioBtnService }       from './service/klass-radiobtn.service';
import { KlassService }               from './service/klass.service';

import { User }                       from '../users/model/user';

@Component({
  moduleId: module.id,
  selector: 'klass-detail-nav-list',
  templateUrl: 'klass-detail-nav-list.component.html',
  styleUrls: [ 'klass-detail-nav-list.component.css' ]
})
export class KlassDetailNavListComponent implements OnInit {

  @ViewChild(SmartEditorComponent)
  private seComponent: SmartEditorComponent;  

  @ViewChild(CommentListComponent)
  private questionListComponent: CommentListComponent;  


  @Input() radiobtnOptionListNavTabs:RadioBtnOption[];
  @Input() klass:Klass;
  klassTeacher:KlassTeacher;
  loginUser:User;

  @Input() klassFeature:string; // @ Deprecated
  @Input() klassFeatureList:string[];
  @Input() klassTarget:string;
  @Input() klassTargetList:string[];
  @Input() klassSchedule:string;
  klassScheduleCopy:string;

  @Input() isAdmin:boolean=false;
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
                public imageService: ImageService) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();

  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / ngOnInit / init");

    // WIDTH
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    } // end if

    this.subscribeEventPack();

    this.subscribeLoginUser();
    
  }

  private subscribeLoginUser() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();
    if(isDebug) console.log("k-d-n-l / subscribeLoginUser / this.loginUser : ",this.loginUser);

    if(null != this.loginUser) {
      // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
      this.tossLoginUser();
      return;
    } // end if

    // 로그인 유저 정보를 가져오지 못했습니다. watchTowerd에서 전달해주기를 기다립니다.
    this.watchTower.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(isDebug) console.log("k-d-n-l / subscribeLoginUser / loginUser : ",loginUser);

      // 이벤트 관련 정보가 준비되었습니다.
      this.loginUser = loginUser;

      // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
      this.tossLoginUser();

    }); // end subscribe

  } // end method

  private tossLoginUser() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / tossLoginUser / init");

    if(null == this.loginUser) {
      return;
    }

    if(null != this.questionListComponent) {
      this.questionListComponent.setLoginUser(this.loginUser);
    }

  }

  private subscribeEventPack() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(isDebug) console.log("k-d-n-l / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      // 1. 이미 EventPack 로딩이 완료된 경우

      // 부모 객체에게 component가 준비된 것을 알립니다.
      this.emitEventOnReady();

    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(isDebug) console.log("k-d-n-l / subscribeEventPack / isEventPackReady : ",isEventPackReady);

        // 이벤트 관련 정보가 준비되었습니다.

        // 부모 객체에게 component가 준비된 것을 알립니다.
        this.emitEventOnReady();

      }); // end subscribe

    } // end if

  } // end method

  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / emitEventOnReady / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("k-d-n-l / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_LIST,
      // component
      this
    );

    if(isDebug) console.log("k-d-n-l / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("k-d-n-l / emitEventOnReady / Done!");

  }   

  public setKlass(klass:Klass) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / setKlass / init");

    if(null == klass) {
      return;
    }

    if(isDebug) console.log("k-d-n-l / setKlass / klass : ",klass);

    this.klass = klass;

    // klass의 정보가 들어온 시점에 레이아웃 정보를 설정합니다.
    this.init();

  }

  private setKlassFeature() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / setKlassFeature / init");    

    if(null == this.klass) {
      if(isDebug) console.log("k-d-n-l / setKlassFeature / 중단 / this.klass is not valid!");
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
          this.myEventService.KLASS_FEATURE,
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

    this.myEventListForKlassFeature = myEventKlassFeatureList;

  } // end method  

  private setKlassTarget() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / setKlassTarget / init");    

    if(null == this.klass) {
      if(isDebug) console.log("k-d-n-l / setKlassTarget / 중단 / this.klass is not valid!");
      return;
    }

    let targetList:string[] = this.klass.getFeatureList();
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / updateKlassTarget / init");    

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
          this.myEventService.KLASS_TARGET,
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / setKlassSchedule / init");    

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
    if(null != this.klass.teacher) {
      this.klassTeacher = this.klass.teacher;
    } // end if
  }

  private setReview() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / setReview / init");

    if(null != this.klass.review_list) {
      this.reviewCommentList = 
      this.klassCommentService.getReviewCommentList(
        this.klass.review_list
      );
    } // end if

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

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / setQuestion / init");

    if(null != this.klass.question_list) {
      this.questionCommentList = 
      this.klassCommentService.getQuestionCommentList(
        this.klass.question_list
      );
    } // end if

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / init / init");    

    if(null == this.klass) {
      if(isDebug) console.log("k-d-n-l / init / 중단 / this.klass is not valid!");
      return;
    }

    if(isDebug) console.log("k-d-n-l / init / this.klass : ",this.klass);

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

    if(null == this.loginUser) {
      return;
    }
    if(null == this.questionListComponent) {
      return;
    }

    this.questionListComponent.setLoginUser(this.loginUser);

  }

  // @ 로그인 페이지로 이동합니다. 현재 페이지 주소를 리다이렉트 주소로 사용합니다.
  private goLogin():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / goLogin / init");

    let appViewUrl:string = this.urlService.getAppViewUrl();
    if(isDebug) console.log("k-d-n-l / goLogin / appViewUrl : ",appViewUrl);

    let req_url = this.urlService.get(`#/login?redirect=${appViewUrl}`);
    if(isDebug) console.log("k-d-n-l / goLogin / req_url : ",req_url);

    window.location.href = req_url;
  }

  private addQuestion(newComment:Comment) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / addQuestion / init");

    if(isDebug) console.log("k-d-n-l / addQuestion / newComment : ",newComment);

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
      if(isDebug) console.log("klass-detail / addQuestion / myResponse : ",myResponse);
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
          `klass-detail-nav-list / addQuestion / user_id : ${this.loginUser.id} / klass_id : ${this.klass.id} / comment : ${newComment.comment}`
        ); // end logger      

      } // end if

    }) // end service     


  } // end if

  private addQuestionReply(newComment:Comment) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / addQuestionReply / init");

    if(isDebug) console.log("k-d-n-l / addQuestionReply / newComment : ",newComment);

    
  }


  onChangedFromInputRow(myEvent:MyEvent) :void{
    // Smart Editor를 사용하는 Element에서 발생한 callback 처리.

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-d-n-l / onChangedFromInputRow / init");
    if(isDebug) console.log("k-d-n-l / onChangedFromInputRow / myEvent : ",myEvent);

    if(null == myEvent || null == myEvent.key || "" == myEvent.key) {
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {

        if(  null != myEvent.metaObj ) {
          this.questionListComponent = myEvent.metaObj; 
          this.setQuestionList();
        } // end if

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_LOGIN_REQUIRED)) {

      this.goLogin();

    } else if(this.myEventService.ON_CHANGE === myEvent.eventName) {

      if(this.myEventService.KLASS_FEATURE === myEvent.key) {

        this.myEventListForKlassFeature =
        this.myEventService.setEventValue(
          myEvent, 
          this.myEventListForKlassFeature
        );

      } else if(this.myEventService.KLASS_TARGET === myEvent.key) {

        this.myEventListForKlassTarget =
        this.myEventService.setEventValue(
          myEvent, 
          this.myEventListForKlassTarget
        );

      } else if(this.myEventService.KLASS_SCHEDULE=== myEvent.key) {

        this.klassSchedule = myEvent.value;

      }  

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_COMMENT)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {

        // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
        // metaObj로 받는 comment 객체

        let newComment:Comment = new Comment().setJSON(myEvent.metaObj);
        if(isDebug) console.log("k-d-n-l / onChangedFromInputRow / newComment : ",newComment);

        this.addQuestion(newComment);
      }

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_COMMENT_REPLY)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {

        // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
        // metaObj로 받는 comment 객체        

        let newComment:Comment = new Comment().setJSON(myEvent.metaObj);
        if(isDebug) console.log("k-d-n-l / onChangedFromInputRow / newComment : ",newComment);

        this.addQuestionReply(newComment);
      }

    } else if(this.myEventService.ON_ADD_ROW === myEvent.eventName) {

      // 열이 추가되었습니다.
      if(this.myEventService.KLASS_FEATURE === myEvent.key) {

        let klassFeatureNext:string = this.getEventValues(this.myEventListForKlassFeature);

      } else if(this.myEventService.KLASS_TARGET === myEvent.key) {

        let klassFeatureTarget:string = this.getEventValues(this.myEventListForKlassTarget);

      }

    } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {

      // 열을 지웁니다.
      if(this.myEventService.KLASS_FEATURE === myEvent.key) {
        this.klassFeature = this.klass.feature = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassFeature);
        this.myEventListForKlassFeature = nextEventList;

      } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
        this.klassTarget = this.klass.target = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassTarget);
        this.myEventListForKlassTarget = nextEventList;

      } // end if

    } else if(this.myEventService.ON_SAVE === myEvent.eventName) {

      let hasChanged:boolean = false;
      if(this.myEventService.KLASS_FEATURE === myEvent.key) {
        hasChanged = this.hasChangedFeature();
      } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
        hasChanged = this.hasChangedTarget();
      } else if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
        hasChanged = this.hasChangedSchedule();
      }

      if(hasChanged) {
        // 변경된 사항을 모두 저장합니다.
        this.overwriteKlassCopies();
      }

    } else if(this.myEventService.ON_SHUTDOWN === myEvent.eventName) {

      // 입력창을 닫습니다.
      if( this.myEventService.KLASS_FEATURE === myEvent.key || 
          this.myEventService.KLASS_TARGET === myEvent.key ||
          this.myEventService.KLASS_SCHEDULE === myEvent.key) {
        this.shutdownKlassInfos();
      }

    } else if(this.myEventService.ON_SHUTDOWN_N_ROLLBACK === myEvent.eventName) {

      // 입력창을 닫습니다.
      if( this.myEventService.KLASS_FEATURE === myEvent.key || 
          this.myEventService.KLASS_TARGET === myEvent.key ||
          this.myEventService.KLASS_SCHEDULE === myEvent.key) {
        this.shutdownKlassInfos();
      }

      // 데이터가 변경되었는지 확인합니다.
      let hasChanged:boolean = false;
      if(this.myEventService.KLASS_FEATURE === myEvent.key) {
        hasChanged = this.hasChangedFeature();
      } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
        hasChanged = this.hasChangedTarget();
      } else if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
        hasChanged = this.hasChangedSchedule();
      }

      if(hasChanged) {
        // 데이터를 롤백합니다.
        this.rollbackKlassCopies();
      }

    } else if (this.myEventService.ON_PREVIEW === myEvent.eventName) {

      if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
        // 화면에 현재 작업중인 모습을 보여줌.
        this.isPreviewKlassSchedule=true;
      }

    } else if (this.myEventService.ON_UNPREVIEW === myEvent.eventName) {

      if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
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


  onChangedFromChild(myEvent:MyEvent, klassDesc, klassVenue, tutorDesc, studentReview, studentQuestion, caution) :void{

    this.isFocusKlassDesc=false;
    this.isFocusKlassVenue=false;
    this.isFocusTutorDesc=false;
    this.isFocusStudentReview=false;
    this.isFocusStudentQuestion=false;
    this.isFocusCaution=false;

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

  onClickKlassFeature() :void {
    this.isShowKlassFeatureAdmin = !this.isShowKlassFeatureAdmin;
    if(!this.isShowKlassFeatureAdmin) {
      this.shutdownKlassInfos();
    }
  }
  onClickKlassTarget() :void {
    this.isShowKlassTargetAdmin = !this.isShowKlassTargetAdmin;
    if(!this.isShowKlassTargetAdmin) {
      this.shutdownKlassInfos();
    }
  }
  onClickKlassSchedule() :void {
    this.isShowKlassScheduleAdmin = !this.isShowKlassScheduleAdmin;
    if(!this.isShowKlassScheduleAdmin) {
      this.shutdownKlassInfos();
    }
  }
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