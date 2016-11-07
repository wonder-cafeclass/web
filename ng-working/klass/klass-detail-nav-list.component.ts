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

  @Input() klassFeature:string;
  @Input() klassTarget:string;
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

  myEventSIKlassFeature:MyEvent;
  myEventSIKlassTarget:MyEvent;

  navHeight:number=50;
  borderTopBottomWidth:number=2;

  // Admin Show
  isShowKlassFeature:boolean=false;
  isShowKlassTarget:boolean=false;
  isShowKlassSchedule:boolean=false;

  watchTowerImgUrl:string;
  watchTowerWhiteImgUrl:string;
  klassPointsImgUrl:string;

  seKlassFeature:SmartEditorComponent;

  @Output() emitter = new EventEmitter<any>();

  constructor(  private klassColorService:KlassColorService, 
                private myEventService:MyEventService, 
                public imageService: ImageService) {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    } // end if

    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    console.log("klass-detail-nav-list / ");

    // Sanitize safe html
    // http://stackoverflow.com/questions/39628007/angular2-innerhtml-binding-remove-style-attribute
    if(null == this.klassFeature || "" == this.klassFeature) {
      this.klassFeature = '수업의 특징을 입력해주세요.';
    }
    this.myEventSIKlassFeature = 
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE_KLASS_FEATURE,
        // public title:string
        "수업 특징",
        // public key:string
        "feature",
        // public value:string
        this.klassFeature,
        // public metaObj:any
        this.klass
    );
    console.log("TEST / this.myEventSIKlassFeature : ",this.myEventSIKlassFeature);     
    
    
    if(null == this.klassTarget || "" == this.klassTarget) {
      this.klassTarget = '수업 추천 대상을 입력해주세요.';
    }
    this.myEventSIKlassTarget = 
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE_KLASS_TARGET,
        // public title:string
        "수업 대상",
        // public key:string
        "target",
        // public value:string
        this.klassTarget,
        // public metaObj:any
        this.klass
    );
    console.log("TEST / this.myEventSIKlassTarget : ",this.myEventSIKlassTarget);     


    if(null === this.klassSchedule || "" === this.klassSchedule) {
      this.klassSchedule = '<p style="color:#f00;">일일 수업 스케쥴을 입력해주세요.</p>';
    }

    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
    this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
    this.klassPointsImgUrl = this.imageService.get(this.imageService.classFeatureUrl);
  }
  ngOnChanges(changes: SimpleChanges) :void {

    console.log("klass-detail-nav-list / ngOnChanges / changes : ",changes);

    if(null != changes) {
      if(null != changes['title']) {
        // 타이틀이 변경된 경우.
        // Do nothing...
      }
    } // end outer if
  }  

  onChangedFromInputRow(myEvent:MyEvent) :void{
    // Smart Editor를 사용하는 Element에서 발생한 callback 처리.

    if(null == myEvent || null == myEvent.key || "" == myEvent.key) {
      return;
    }

    console.log("klass-detail-nav-list / onChangedFromInputRow / myEvent : ",myEvent);


    if(this.myEventService.ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW === myEvent.eventName) {

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
      console.log("DB로 변경된 데이터를 저장합니다.");
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
    this.isShowKlassFeature = !this.isShowKlassFeature;
    if(!this.isShowKlassFeature) {
      this.shutdownKlassInfos();
    }
  }
  onClickKlassTarget() :void {
    this.isShowKlassTarget = !this.isShowKlassTarget;
    if(!this.isShowKlassTarget) {
      this.shutdownKlassInfos();
    }
  }
  onClickKlassSchedule() :void {
    this.isShowKlassSchedule = !this.isShowKlassSchedule;
    if(!this.isShowKlassSchedule) {
      this.shutdownKlassInfos();
    }
  }
  shutdownKlassInfos() :void {
    this.isShowKlassFeature=false;
    this.isShowKlassTarget=false;
    this.isShowKlassSchedule=false;
  }
}