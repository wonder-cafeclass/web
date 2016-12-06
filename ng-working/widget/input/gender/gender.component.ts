import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit }              from '@angular/core';
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
export class GenderComponent implements OnInit {

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
                private myEventWatchTowerService:MyEventWatchTowerService,  
                private myCheckerService:MyCheckerService,
                private myEventService:MyEventService) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("gender / ngOnInit / init");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerServiceReady();

  }

  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("gender / setIsAdmin / 시작");

    // 사전에 등록된 값을 가져옴. 페이지 이동시에는 직접 값을 가져와야 함.
    this.isAdmin = this.myEventWatchTowerService.getIsAdmin();
    if(isDebug) console.log("gender / setIsAdmin / 시작 / this.isAdmin : ",this.isAdmin);

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("gender / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerServiceReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("gender / setMyCheckerServiceReady / 시작");

    // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {
      this.setMyCheckerService();
      this.init();
    }

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("gender / setMyCheckerServiceReady / isReady : ",isReady);

      if(!isReady) {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorTypeNotValidValue,
          // errorMsg:string
          `gender / setMyCheckerServiceReady / Failed! / isReady : ${isReady}`
        );        
        return;
      }

      this.setMyCheckerService();
      this.init();
    });    
  }  

  private setMyCheckerService() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("gender / setMyCheckerService / 시작");

    if(this.myEventWatchTowerService.getIsMyCheckerReady()) {

      this.myCheckerService.setReady(
        // checkerMap:any
        this.myEventWatchTowerService.getCheckerMap(),
        // constMap:any
        this.myEventWatchTowerService.getConstMap(),
        // dirtyWordList:any
        this.myEventWatchTowerService.getDirtyWordList(),
        // apiKey:string
        this.myEventWatchTowerService.getApiKey()
      ); // end setReady

      if(isDebug) console.log("gender / setMyCheckerService / done!");
    } // end if

  }   

  private setMyChecker() :void {
    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_gender");
    }
  }

  private init() :void {
    this.setMyChecker();
  }

  isOK(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  } 
  setGender(gender:string) :void {
    if(this.isOK(gender)) {
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
  // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
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
    
    event.stopPropagation();
    event.preventDefault();

    if(this.gender === this.keyMale) {
      this.gender = this.keyMale;
    }

    this.emitGenderSelected(this.keyFemale);

    this.tooltipMsg = null;
  }

  onClickGenderMale(event) :void {

    event.stopPropagation();
    event.preventDefault();

    if(this.gender === this.keyFemale) {
      this.gender = this.keyFemale;
    }

    this.emitGenderSelected(this.keyMale);

    this.tooltipMsg = null;
  }   

}
