import {  Component, 
          ViewChild,
          OnInit, 
          OnChanges,
          SimpleChanges,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';
import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';
import { MyEventService }             from '../util/my-event.service';
import { MyEvent }                    from '../util/model/my-event';
import { ImageService }               from '../util/image.service';
import { KlassColorService }          from './service/klass-color.service';
import { SmartEditorComponent }       from '../widget/smart-editor/smart-editor.component';
import { Klass }                      from './model/klass';

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

  @Input() klassFeature:string; // @ Deprecated
  @Input() klassFeatureList:string[];
  @Input() klassTarget:string;
  @Input() klassTargetList:string[];
  @Input() klassSchedule:string;

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
  myEventListForKlassFeature:MyEvent[];
  myEventListForKlassTarget:MyEvent[];

  navHeight:number=50;
  borderTopBottomWidth:number=2;

  // Admin Show
  isShowKlassFeatureAdmin:boolean=false;
  isShowKlassTargetAdmin:boolean=false;
  isShowKlassScheduleAdmin:boolean=false;

  watchTowerImgUrl:string;
  watchTowerWhiteImgUrl:string;
  klassPointsImgUrl:string;

  seKlassFeature:SmartEditorComponent;

  @Output() emitter = new EventEmitter<any>();

  constructor(  private klassColorService:KlassColorService, 
                private myEventService:MyEventService, 
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

      let metaObj = {
        klassId:+this.klass.id,
        idx:i
      };
      let myEventKlassFeature = 
      new MyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public title:string
        "수업 특징",
        // public key:string
        "feature",
        // public value:string
        klassFeature,
        // public metaObj:any
        metaObj
      );

      this.myEventListForKlassFeature.push(myEventKlassFeature);
    }

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

      let myEventKlassFeature = 
      new MyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public title:string
        "수업 대상",
        // public key:string
        "target",
        // public value:string
        klassTarget,
        // public metaObj:any
        this.klass.id
      );

      this.myEventListForKlassTarget.push(myEventKlassFeature);
    }    

    // KLASS SCHEDULE
    console.log("HERE / this.klassSchedule : ",this.klassSchedule);
    if(null === this.klassSchedule || "" === this.klassSchedule) {
      this.klassSchedule = '<p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)1. Small talk &amp; 지난 시간 배운 표현 복습 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)2. Brainstorming – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)3. Key word 익히기 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)4. key expression – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)5. Break – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)6. Practice + Roleplay – <span style="color: rgb(255, 170, 0);">30분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)7. Q&amp;A, feedback + closing – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><br></p>';
    }

    // IMAGES
    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
    this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
    this.klassPointsImgUrl = this.imageService.get(this.imageService.classFeatureUrl);
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

    let idxToRemove = -1;
    let nextMyEventList:MyEvent[] = [];
    if(null != myEventToRemove.metaObj || null != myEventToRemove.metaObj.idx) {
      idxToRemove = myEventToRemove.metaObj.idx;
    }
    if(-1 < idxToRemove) {

      for (var i = 0; i < this.myEventListForKlassFeature.length; ++i) {
        let myEvent = this.myEventListForKlassFeature[i];
        if(i === idxToRemove) {
          continue;
        }
        nextMyEventList.push(myEvent);
      }

      // 새로운 리스트로 업데이트
      return nextMyEventList;
    }

    // 삭제할 이벤트가 없습니다. 받은 리스트를 돌려줍니다.
    return myEventList;
  }
  
  onChangedFromInputRow(myEvent:MyEvent) :void{
    // Smart Editor를 사용하는 Element에서 발생한 callback 처리.

    if(null == myEvent || null == myEvent.key || "" == myEvent.key) {
      return;
    }

    console.log("klass-detail-nav-list / onChangedFromInputRow / myEvent : ",myEvent);

    if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
      // 열을 지웁니다.
      if("feature" === myEvent.key) {
        this.klassFeature = this.klass.feature = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassFeature);
        this.myEventListForKlassFeature = nextEventList;

        // DB UPDATE
        console.log("klass-detail-nav-list / onChangedFromInputRow / feature / DB UPDATE");

      } else if("target" === myEvent.key) {
        this.klassTarget = this.klass.target = myEvent.value;

        let nextEventList:MyEvent[] = this.removeMyEventFromList(myEvent, this.myEventListForKlassTarget);
        this.myEventListForKlassTarget = nextEventList;

        // DB UPDATE
        console.log("klass-detail-nav-list / onChangedFromInputRow / target / DB UPDATE");

      } // end if

    } else if(this.myEventService.ON_SHUTDOWN === myEvent.eventName) {

      // 입력창을 닫습니다.
      if("feature" === myEvent.key || "target" === myEvent.key) {
        this.shutdownKlassInfos();
      }

    } else if(this.myEventService.ON_SHUTDOWN_N_ROLLBACK === myEvent.eventName) {

      // 입력창을 닫습니다.
      if("feature" === myEvent.key || "target" === myEvent.key) {
        this.shutdownKlassInfos();
      }

      // 데이터를 롧백합니다.

    } else if(this.myEventService.ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW === myEvent.eventName) {

      if("feature" === myEvent.key || "target" === myEvent.key || "schedule" === myEvent.key) {
        this.shutdownKlassInfos();
      }

    } else if(this.myEventService.ON_CHANGE_INPUT_ROW === myEvent.eventName) {

      if("feature" === myEvent.key) {
        this.klassFeature = this.klass.feature = myEvent.value;
      } else if("target" === myEvent.key) {
        this.klassTarget = this.klass.target = myEvent.value;
      } else if("schedule" === myEvent.key) {
        this.klassSchedule = this.klass.schedule = myEvent.value;
      }

    } else if(this.myEventService.ON_SAVE_INPUT_ROW === myEvent.eventName) {

      // DB로 변경된 데이터를 저장합니다.
      if("feature" === myEvent.key) {
        // Not implemented!
      } else if("target" === myEvent.key) {
        // Not implemented!
      } else if("schedule" === myEvent.key) {
        // Not implemented!
      }

    } else if(this.myEventService.ON_SHUTDOWN_INPUT_ROW === myEvent.eventName) {
       // Need to implement
       /*
      if("feature" === myEvent.key) {
        this.klassFeature = this.klass.feature = myEvent.value;
      } else if("target" === myEvent.key) {
        this.klassTarget = this.klass.target = myEvent.value;
      } else if("schedule" === myEvent.key) {
        this.klassSchedule = this.klass.schedule = myEvent.value;
      }
      */
    }
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

    if("klass_desc" === myEvent.key) {
      this.isFocusKlassDesc=true;
      box = klassDesc.getBoundingClientRect();
    } else if("klass_venue" === myEvent.key) {
      this.isFocusKlassVenue=true;
      box = klassVenue.getBoundingClientRect();
    } else if("tutor_desc" === myEvent.key) {
      this.isFocusTutorDesc=true;
      box = tutorDesc.getBoundingClientRect();
    } else if("student_review" === myEvent.key) {
      this.isFocusStudentReview=true;
      box = studentReview.getBoundingClientRect();
    } else if("student_question" === myEvent.key) {
      this.isFocusStudentQuestion=true;
      box = studentQuestion.getBoundingClientRect();
    } else if("caution" === myEvent.key) {
      this.isFocusCaution=true;
      box = caution.getBoundingClientRect();
    }

    if(0 < (firstBox.top - this.navHeight)) {
      nextYPos = scrollY + box.top - (this.navHeight * 2 + this.borderTopBottomWidth);
    } else {
      nextYPos = scrollY + box.top - this.navHeight;
    }

    if(0 < nextYPos) {
      window.scrollTo(0, nextYPos);      
    }
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
}