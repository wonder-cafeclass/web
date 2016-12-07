import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit,
          AfterViewInit }       from '@angular/core';
import { Router }               from '@angular/router';

import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';
import { MyLoggerService }      from '../../../util/service/my-logger.service';
import { MyEventWatchTowerService }  from '../../../util/service/my-event-watchtower.service';

import { UserService }          from '../../../users/service/user.service';
import { User }                 from '../../../users/model/user';

import { MyResponse }           from '../../../util/model/my-response';

@Component({
  moduleId: module.id,
  selector: 'email',
  templateUrl: 'email.component.html',
  styleUrls: [ 'email.component.css' ]
})
export class EmailComponent implements OnInit, AfterViewInit {

  @Input() width:number=380;

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() isCheckUnique:boolean=true;

  @Output() emitter = new EventEmitter<MyEvent>();

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isWarning:boolean=false;

  myChecker:MyChecker;

  isSuccessInput:boolean=false;
  tooltipMsg:string="";
  tooltipMsgEmailNotValid:string="이메일 주소를 다시 확인해주세요.";
  tooltipMsgEmailNotUnique:string="이미 등록되어 있는 이메일입니다.";
  tooltipMsgEmailValid:string="성공! 이메일 주소가 완벽해요.";

  isShowPopover:boolean=false;

  isAdmin:boolean=false;

  constructor(  private myEventService:MyEventService,
                private myLoggerService:MyLoggerService, 
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService,
                private userService:UserService) {}

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / ngOnInit / 시작");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / ngAfterViewInit");

    this.asyncViewPack();

  }
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("email / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("email / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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
    if(isDebug) console.log("email / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_email");
    }
  }  

  private init() :void {
    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // 이메일 검사에 필요한 checker를 가져옵니다.
    this.setMyChecker();
  }

  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {
    return this.isOK(this.inputStrPrevOnKeyup);
  }
  // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
  public showWarning() :void {
    this.isFocus = true;
    this.isWarning = true;
    this.isSuccessInput = false;
    this.tooltipMsg = this.tooltipMsgEmailNotValid;
  }

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();
  }

  private inputStrPrevOnBlur:string="";
  onBlur(event, email, element) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / onBlur / logPageEnter / 시작");

    event.stopPropagation();
    event.preventDefault();

    if(null == this.myCheckerService) {
      if(isDebug) console.log("email / onBlur / 중단 / null == this.myCheckerService");
      return;
    }

    // 내용이 동일하다면 중단합니다.
    if(null != this.inputStrPrevOnBlur && this.inputStrPrevOnBlur === email) {
      if(isDebug) console.log("email / onBlur / 중단 / 내용이 동일하다면 중단합니다.");
      this.isFocus = false;
      return;
    }

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    // 이메일 주소가 입력된 경우에만 검사를 진행합니다.
    if(null != email && "" != email) {

      // 마지막 공백 입력이 있다면 공백을 제거해줍니다.
      let regExpLastEmptySpace:RegExp = /[\s]+$/gi;
      element.value = this.inputStrPrevOnBlur = email = email.replace(regExpLastEmptySpace, "");

      // 1. 사용자가 입력한 이메일 주소를 검사합니다.

      let isOK:boolean = this.isOK(email);
      if(isDebug) console.log("email / onBlur / getUserByEmail / isOK : ",isOK);
      if(isDebug) console.log("email / onBlur / getUserByEmail / this.isCheckUnique : ",this.isCheckUnique);

      if(isOK && this.isCheckUnique) {
        // 회원 가입시, 유일한 이메일인지 검사.
        this.userService
        .getUserByEmail(email)
        .then((myResponse:MyResponse) => {

          if(isDebug) console.log("email / onBlur / getUserByEmail / myResponse : ",myResponse);

          let user:User = null;
          if(myResponse.isSuccess()) {
            user = myResponse.getDataProp("user");
            if(null != user) {
              // 이미 이메일이 등록되어 있습니다.
              this.emailFailed(this.tooltipMsgEmailNotUnique);
            } else {
              // 이메일이 등록되어 있지 않습니다. 회원 가입 다음단계로 진행합니다.
              this.emailSuccess(email);
            }
          } else {
            // Error Report

            if(isDebug) console.log("email / onBlur / getUserByEmail / Error Report");

            // Error Report
            this.myLoggerService.logError(
              // apiKey:string
              this.watchTower.getApiKey(),
              // errorType:string
              this.myLoggerService.errorAPIFailed,
              // errorMsg:string
              `email / getUserByEmail / Failed!`
            );
          } // end if

        }); // end service

      } else if(isOK) {
        // 로그인 시에는 이메일이 유일한지 검사하지 않습니다.
        if(isDebug) console.log("email / onBlur / 로그인 시에는 이메일이 유일한지 검사하지 않습니다.");
        this.emailSuccess(email);
      } else {
        if(isDebug) console.log("email / onBlur / 이메일에 문제가 있습니다.");
        this.emailFailed(this.tooltipMsgEmailNotValid);
      } // end if

    } // end if

  } 

  private emailFailed(msgWarning:string) :void {

    if(null == msgWarning || "" == msgWarning) {
      return;
    }

    // 1-1-1. 이메일 주소에 문제가 있습니다!
    let lastHistory = this.myCheckerService.getLastHistory();

    this.isWarning = true;

    // 1-1-2. 경고 메시지를 노출합니다.
    this.tooltipMsg = msgWarning;
    this.isSuccessInput = false;

  }

  private emailSuccess(email:string) :void {

    if(null == email || "" == email) {
      return;
    }

    // 노출되어 있는 툴팁이 있다면 내립니다.
    this.hideTooltipNow();

    // 1-2-1. 정상적인 이메일 주소를 등록했습니다.
    this.isWarning = false;

    // 1-1-2. 성공 메시지를 노출합니다.
    // this.tooltipMsg = this.tooltipMsgEmailValid;
    this.tooltipMsg = null;
    this.isSuccessInput = true;

    // 1-1-3. 부모 객체에게 정상적인 이메일 주소를 전달합니다.
    // 부모 객체에게 Ready Event 발송 
    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      this.myEventService.KEY_USER_EMAIL,
      // public value:string
      email,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    this.hideTooltip(2);    
  }

  hideTooltip(sec:number) :void {
    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipMsg = null;
      _self.isSuccessInput = false;
    }, 1000 * sec);        

  }

  hideTooltipNow() :void {

    this.tooltipMsg = null;
    this.isSuccessInput = false;

  }

  onKeyupEnter(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / onKeyupEnter / init");

    event.stopPropagation();
    event.preventDefault();

    // 사용자가 input 영역에서 enter를 누르는 이벤트를 부모 객체로 전달합니다.
    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_KEYUP_ENTER,
      // public key:string
      this.myEventService.KEY_USER_EMAIL,
      // public value:string
      this.inputStrPrevOnKeyup,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);    

  }

  private inputStrPrevOnKeyup:string="";
  onKeyup(event, element) :void {

    event.stopPropagation();
    event.preventDefault();    

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / onKeyup / init");

    let inputStr:string = element.value;

    // 비어있는 문자열이라면 검사하지 않습니다.
    if(null == inputStr || "" == inputStr) {
      if(isDebug) console.log("email / onKeyup / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return;
    }

    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.inputStrPrevOnKeyup === inputStr) {
      if(isDebug) console.log("email / onKeyup / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }

    // 한글 및 공백 입력시 삭제 처리.
    let regExpNotAllowed:RegExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]/gi;
    let matchArr:RegExpMatchArray = inputStr.match(regExpNotAllowed);
    if(null != matchArr && 0 < matchArr.length) {
      for (var i = 0; i < matchArr.length; ++i) {
        let match:string = matchArr[i];
        if(null == match || "" == match) {
          continue;
        }

        inputStr = inputStr.replace(match, "");
      }

      // 1-1-2. 삭제 안내 메시지를 노출합니다.
      this.tooltipMsg = "한글 및 공백을 사용할 수 없어요.";
      this.isSuccessInput = false;
      this.hideTooltip(2);

      if(isDebug) console.log("email / onKeyup / 한글 및 공백 입력시 삭제 처리.");
    }

    element.value = this.inputStrPrevOnKeyup = inputStr;
  }  

  onFocus(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if
      
  }  

  public setEmail(email:string) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / setEmail / init");
    if(isDebug) console.log("email / setEmail / email : ",email);

    // 외부에서 email주소를 지정하는 경우.
    if(this.isOK(email)) {
      if(isDebug) console.log("email / setEmail / 2");
      this.inputStrPrevOnKeyup = email;
    }
  }

  public isOK(email:string) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("email / isOK / 시작");

    let isOK:boolean = false;

    if(null == this.myCheckerService) {
      if(isDebug) console.log("email / isOK / 중단 / this.myCheckerService is not valid!");
      return isOK;
    }

    // 1. myChecker로 검사.
    return this.myCheckerService.isOK(this.myChecker, email);
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

}
