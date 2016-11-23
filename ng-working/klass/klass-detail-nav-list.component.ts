import {  Component, 
          ViewChild,
          OnInit, 
          OnChanges,
          SimpleChanges,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';
import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';

import { MyEventService }             from '../util/service/my-event.service';
import { MyEvent }                    from '../util/model/my-event';

import { MyCheckerService }           from '../util/service/my-checker.service';
import { MyChecker }                  from '../util/model/my-checker';

import { ImageService }               from '../util/image.service';
import { KlassColorService }          from './service/klass-color.service';
import { KlassCommentService }          from './service/klass-comment.service';
import { SmartEditorComponent }       from '../widget/smart-editor/smart-editor.component';
import { Comment }                    from '../widget/comment/model/comment';

import { Klass }                      from './model/klass';
import { KlassTeacher }               from './model/klass-teacher';

@Component({
  moduleId: module.id,
  selector: 'klass-detail-nav-list',
  templateUrl: 'klass-detail-nav-list.component.html',
  styleUrls: [ 'klass-detail-nav-list.component.css' ]
})
export class KlassDetailNavListComponent implements OnInit, OnChanges {

  @ViewChild(SmartEditorComponent)
  private seComponent: SmartEditorComponent;  

  @Input() radiobtnOptionListNavTabs:RadioBtnOption[];
  @Input() klass:Klass;
  klassTeacher:KlassTeacher;

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

  constructor(  private klassColorService:KlassColorService, 
                private klassCommentService:KlassCommentService,
                public myEventService:MyEventService, 
                private myCheckerService:MyCheckerService, 
                public imageService: ImageService) {}

  ngOnInit(): void {

    // WIDTH
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    } // end if

    // COLOR
    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    // KLASS FEATURE
    if(null == this.klassFeatureList || 0 == this.klassFeatureList.length) {
      this.klassFeatureList = 
      [
        "(예시) 해외 여행시 다양한 상황에서 필요한 영어 표현들을 연습",
        "(예시) 초급 분들도 영어로 묻고 답하는데 어려움 없도록 코칭",
        "(예시) 자신감을 심어주는 클래스",
      ];
    }

    this.myEventListForKlassFeature=[];
    for (var i = 0; i < this.klassFeatureList.length; ++i) {
      let klassFeature:string = this.klassFeatureList[i];

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

      this.myEventListForKlassFeature.push(myEventKlassFeature);
    } // end for



    // KLASS TARGET
    if(null == this.klassTargetList || 0 == this.klassTargetList.length) {
      // this.klassFeature = '(예시) 해외 여행시 다양한 상황에서 필요한 영어 표현들을 연습|(예시) 초급 분들도 영어로 묻고 답하는데 어려움 없도록 코칭|(예시) 자신감을 심어주는 클래스';
      this.klassTargetList = 
      [
        "(예시) 1. 여행가서 당황하지 않을 만큼 영어 회화 연습하고 싶은 분들",
        "(예시) 2. 여행 상황별로 충분히 연습해 자신감을 갖고 싶은 분들"
      ];
    }


    this.myEventListForKlassTarget=[];
    for (var i = 0; i < this.klassTargetList.length; ++i) {

      let klassTarget:string = this.klassTargetList[i];

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

      this.myEventListForKlassTarget.push(myEventKlassTarget);
    } // end for

    // KLASS SCHEDULE
    if(null === this.klassSchedule || "" === this.klassSchedule) {
      this.klassSchedule = '<p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)1. Small talk &amp; 지난 시간 배운 표현 복습 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)2. Brainstorming – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)3. Key word 익히기 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)4. key expression – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)5. Break – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)6. Practice + Roleplay – <span style="color: rgb(255, 170, 0);">30분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)7. Q&amp;A, feedback + closing – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><br></p>';
    }

    this.overwriteKlassCopies();

    // IMAGES
    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
    this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
    this.klassPointsImgUrl = this.imageService.get(this.imageService.classFeatureUrl);

    // 수업 강사님 정보 가져오기
    if(null != this.klass.teacher) {
      this.klassTeacher = this.klass.teacher;
    }

    // 수업 리뷰 가져오기
    if(null != this.klass.review_list) {
      this.reviewCommentList = 
      this.klassCommentService.getReviewCommentList(
        this.klass.review_list
      );
    }

    // 수업 질문 가져오기
    if(null != this.klass.question_list) {
      this.questionCommentList = 
      this.klassCommentService.getQuestionCommentList(
        this.klass.question_list
      );
    }

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

  }
  // @ Deprecated
  ngOnChanges(changes: SimpleChanges) :void {

    if(null != changes) {
      if(null != changes['title']) {
        // 타이틀이 변경된 경우.
        // Do nothing...
      }
    } // end outer if
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

  onChangedFromInputRow(myEvent:MyEvent) :void{
    // Smart Editor를 사용하는 Element에서 발생한 callback 처리.

    if(null == myEvent || null == myEvent.key || "" == myEvent.key) {
      return;
    }

    console.log("klass-detail-nav-list / onChangedFromInputRow / myEvent : ",myEvent);

    if(this.myEventService.ON_CHANGE === myEvent.eventName) {

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
        console.log("ON_CHANGE / this.klassSchedule.length : ",this.klassSchedule.length);

      }

    } else if(this.myEventService.ON_ADD_COMMENT === myEvent.eventName) {

      if(this.myEventService.KEY_COMMENT === myEvent.key) {

        console.log("klass-detail-nav-list / onChangedFromInputRow / " + myEvent.key + " / DB UPDATE");
        console.log("klass-detail-nav-list / onChangedFromInputRow / myEvent.metaObj : ",myEvent.metaObj);

      }      

    } else if(this.myEventService.ON_ADD_COMMENT_REPLY === myEvent.eventName) {

      if(this.myEventService.KEY_COMMENT === myEvent.key) {

        console.log("klass-detail-nav-list / onChangedFromInputRow / " + myEvent.key + " / DB UPDATE");
        console.log("klass-detail-nav-list / onChangedFromInputRow / myEvent.metaObj : ",myEvent.metaObj);

      }

    } else if(this.myEventService.ON_ADD_ROW === myEvent.eventName) {

      // 열이 추가되었습니다.
      console.log("열이 추가되었습니다. / myEvent : ",myEvent);
      if(this.myEventService.KLASS_FEATURE === myEvent.key) {

        let klassFeatureNext:string = this.getEventValues(this.myEventListForKlassFeature);

        console.log("klass-detail-nav-list / onChangedFromInputRow / feature / DB UPDATE");
        console.log(klassFeatureNext);
      } else if(this.myEventService.KLASS_TARGET === myEvent.key) {

        let klassFeatureTarget:string = this.getEventValues(this.myEventListForKlassTarget);

        console.log("klass-detail-nav-list / onChangedFromInputRow / target / DB UPDATE");
        console.log(klassFeatureTarget);
      }

    } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {

      // 열을 지웁니다.
      console.log("열을 지웁니다. / myEvent : ",myEvent);
      if(this.myEventService.KLASS_FEATURE === myEvent.key) {
        this.klassFeature = this.klass.feature = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassFeature);
        this.myEventListForKlassFeature = nextEventList;

        // DB UPDATE
        console.log("klass-detail-nav-list / onChangedFromInputRow / feature / DB UPDATE");
        console.log(this.myEventListForKlassFeature);

      } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
        this.klassTarget = this.klass.target = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassTarget);
        this.myEventListForKlassTarget = nextEventList;

        // DB UPDATE
        console.log("klass-detail-nav-list / onChangedFromInputRow / target / DB UPDATE");
        console.log(this.myEventListForKlassTarget);

      } // end if

    } else if(this.myEventService.ON_SAVE === myEvent.eventName) {

      console.log("klass-detail-nav-list / ON_SAVE / 데이터를 저장합니다.");
      // wonder.jung
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
        console.log("변경된 사항을 모두 저장합니다.");
        this.overwriteKlassCopies();
      }

      console.log("ON_SAVE / this.klassSchedule.length : ",this.klassSchedule.length);

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
      console.log("데이터가 변경되었는지 확인합니다. / hasChanged : ",hasChanged);

      if(hasChanged) {
        // 데이터를 롤백합니다.
        console.log("데이터를 롤백합니다.");
        this.rollbackKlassCopies();
      }

    } else if (this.myEventService.ON_PREVIEW === myEvent.eventName) {

      console.log("XXX - 01");

      if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
        // 화면에 현재 작업중인 모습을 보여줌.

        console.log("XXX - 02");
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