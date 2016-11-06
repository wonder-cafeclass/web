import {  Component, 
          ViewChild,
          OnInit, 
          Input }                     from '@angular/core';
import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';
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
export class KlassDetailNavListComponent implements OnInit {

  @ViewChild(SmartEditorComponent)
  private seComponent: SmartEditorComponent;  

  @Input() radiobtnOptionListNavTabs:RadioBtnOption[];
  @Input() klass:Klass;
  @Input() isAdmin:boolean=false;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  colorWhite:string;
  colorOrange:string;
  colorGray:string;

  isFocusKlassDesc:boolean=true;
  isFocusKlassVenue:boolean=false;
  isFocusTutorDesc:boolean=false;
  isFocusStudentReview:boolean=false;
  isFocusStudentQuestion:boolean=false;
  isFocusCaution:boolean=false;

  navHeight:number=50;
  borderTopBottomWidth:number=2;

  isShowKlassFeature:boolean=false;
  isShowKlassTarget:boolean=false;
  isShowKlassSchedule:boolean=false;

  watchTowerImgUrl:string;
  watchTowerWhiteImgUrl:string;

  seKlassFeature:SmartEditorComponent;

  constructor(  private klassColorService:KlassColorService, 
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

    // Sanitize safe html
    // http://stackoverflow.com/questions/39628007/angular2-innerhtml-binding-remove-style-attribute
    if(null === this.klass.feature || "" === this.klass.feature) {
      this.klass.feature = '<p style="color:#f00;">수업의 특징을 입력해주세요.</p>';
    }
    if(null === this.klass.target || "" === this.klass.target) {
      this.klass.target = '<p style="color:#f00;">수업 추천 대상을 입력해주세요.</p>';
    }
    if(null === this.klass.schedule || "" === this.klass.schedule) {
      this.klass.schedule = '<p style="color:#f00;">일일 수업 스케쥴을 입력해주세요.</p>';
    }

    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
    this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
  }

  onChangedFromChildSE(myEvent:MyEvent) :void{
    // Smart Editor를 사용하는 Element에서 발생한 callback 처리.

    if(null == myEvent || null == myEvent.key || "" == myEvent.key) {
      return;
    }

    if("feature" === myEvent.key) {
      this.klass.feature = myEvent.value;
    } else if("target" === myEvent.key) {
      this.klass.target = myEvent.value;
    } else if("schedule" === myEvent.key) {
      this.klass.schedule = myEvent.value;
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
    this.isShowKlassTarget = false;
    this.isShowKlassSchedule = false;

  }
  onClickKlassTarget() :void {

    this.isShowKlassFeature = false;
    this.isShowKlassTarget = !this.isShowKlassTarget;
    this.isShowKlassSchedule = false;
    
  }
  onClickKlassSchedule() :void {

    this.isShowKlassFeature = false;
    this.isShowKlassTarget = false;
    this.isShowKlassSchedule = !this.isShowKlassSchedule;
    
  }  
}