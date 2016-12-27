import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit,
          AfterViewInit }       from '@angular/core';
import { Router }               from '@angular/router';

import { MyLoggerService }      from '../../../util/service/my-logger.service';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';

import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../../util/model/my-response';


@Component({
  moduleId: module.id,
  selector: 'gender',
  templateUrl: 'gender.component.html',
  styleUrls: [ 'gender.component.css' ]
})
export class GenderComponent implements OnInit, AfterViewInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() gender:string="";

  @Output() emitter = new EventEmitter<MyEvent>();

  tooltipMsgGenderNotValid:string="앗! 성별이 필요합니다.";
  tooltipMsg:string;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isSuccessInput:boolean=false;

  keyFemale:string="F";
  keyMale:string="M";
  keyNoGender:string="U";

  isShowPopover:boolean=false;

  myChecker:MyChecker;

  isAdmin:boolean=false;

  constructor(  private myLoggerService:MyLoggerService,
                private watchTower:MyEventWatchTowerService,  
                private myCheckerService:MyCheckerService,
                private myEventService:MyEventService) {}

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("gender / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("gender / ngAfterViewInit");

    this.asyncViewPack();

  } 
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("gender / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("gender / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("gender / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdmin();
    this.myCheckerService.setReady(
      // checkerMap:any
      this.watchTower.getCheckerMap(),
      // constMap:any
      this.watchTower.getConstMap(),
      // dirtyWordList:any
      this.watchTower.getDirtyWordList(),
      // apiKey:string
      this.watchTower.getApiKey()
    ); // end setReady
  }

  private setMyChecker() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("gender / setMyChecker / 시작");

    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_gender");
    }
  }

  private init() :void {

    // 성별 검사에 필요한 checker를 가져옵니다.
    this.setMyChecker();

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

  }

  isNotOK(input:string) :boolean {
    return this.isOK(input);
  }
  isOK(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  } 
  setGender(gender:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("gender / gender / init");
    if(isDebug) console.log("gender / gender / gender : ",gender);

    if(this.isOK(gender)) {
      if(isDebug) console.log("gender / gender / 성별이 변경됩니다.");
      this.gender = gender;
    }
  }

  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {
    return this.isOK(this.gender);
  }
  // @ Desc : 성별 입력을 확인해 달라는 표시를 보여줍니다.
  public showWarning() :void {
    this.isSuccessInput = false;
    this.tooltipMsg = this.tooltipMsgGenderNotValid;
  }

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if
  } 

  onBlur(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if
  }  

  onMouseOverInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusInfo) {
      this.isFocusInfo = true;      
    } // end if
  }

  onMouseOutInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusInfo) {
      this.isFocusInfo = false;
    } // end if
  }

  private emitGenderSelected(gender:string) :void {

    if(this.keyFemale != gender && this.keyMale != gender) {
      return;
    }

    // 부모 객체에게 Change Event 발송 
    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      this.myEventService.KEY_USER_GENDER,
      // public value:string
      gender,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

  }

  onClickGenderFemale(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("gender / onClickGenderFemale / init");
    
    event.stopPropagation();
    event.preventDefault();

    this.setGender(this.keyFemale);

    this.emitGenderSelected(this.keyFemale);

    this.tooltipMsg = null;
  }

  onClickGenderMale(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("gender / onClickGenderMale / init");

    event.stopPropagation();
    event.preventDefault();

    this.setGender(this.keyMale);

    this.emitGenderSelected(this.keyMale);

    this.tooltipMsg = null;
  }   

}
