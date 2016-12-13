import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit,
          AfterViewInit }             from '@angular/core';
import { Router }                     from '@angular/router';

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';
import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyLoggerService }            from '../../../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../../util/model/my-response';

// @ Deprecated - REMOVE ME
@Component({
  moduleId: module.id,
  selector: 'password',
  templateUrl: 'password.component.html',
  styleUrls: [ 'password.component.css' ]
})
export class PasswordComponent implements OnInit, AfterViewInit {

  @Input() width:number=380;

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  // 비밀번호만 입력을 받을 때 사용합니다.
  @Input() isLogin:boolean=false;
  // 현재 비밀번호 입력을 받을 때 사용합니다.
  @Input() isCheckCurPW:boolean=false;

  @Output() emitter = new EventEmitter<MyEvent>();

  isFocusPassword:boolean=false;
  isFocusInfo:boolean=false;

  isFocusRepassword:boolean=false;

  password:string="";
  repassword:string="";

  titleHead:string="비밀번호";
  placeholderHead:string="비밀번호를 입력해주세요";
  isValidPassword:boolean = false;
  isWarningPassword:boolean = false;
  isShowTooltipPassword:boolean = false;
  tooltipHeadMsg:string=null;
  tooltipHeadPasswordNeeds:string="패스워드를 먼저 입력해주세요.";
  tooltipHeadNotAllowed:string="앗! 패스워드에 문제가 있습니다.";
  tooltipHeadAllowed:string="성공! 패스워드가 완벽합니다.";

  KeyupTypeTab:string="tab";
  KeyupTypeChar:string="char";
  // 마지막에 사용자가 누른 키의 타입을 추적, 탭 이동시 패스워드 중복 성공 표시를 하지 않도록 합니다.
  lastKeyupTypeP:string="";

  isValidRepassword:boolean = false;
  isWarningRepassword:boolean = false;
  isShowTooltipRepassword:boolean = false;
  tooltipTailMsg:string=null;
  tooltipTailInit:string="입력한 패스워드를 확인해볼께요.";
  tooltipTailNotMatch:string="앗! 패스워드가 일치하지 않습니다.";
  tooltipTailMatched:string="성공! 패스워드가 정확히 일치합니다.";

  // 마지막에 사용자가 누른 키의 타입을 추적, 탭 이동시 패스워드 중복 성공 표시를 하지 않도록 합니다.
  lastKeyupTypeRP:string="";

  // 패스워드 입력 기준 (네이버)
  // 6~16 characters with letters(a-z), numbers, and special letters.

  isShowPopover:boolean=false;

  myChecker:MyChecker;

  isAdmin:boolean=false;

  constructor(  private myEventService:MyEventService,
                private myLoggerService:MyLoggerService,
                private watchTower:MyEventWatchTowerService,
                private myCheckerService:MyCheckerService ) {}

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / ngOnInit / init");

    if(this.isCheckCurPW) {
      this.setTitleHead("비밀번호 바꾸기");
      this.setPlaceHolderHead("현재의 비밀번호를 입력해주세요");
    }
  }


  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / ngAfterViewInit");

    this.asyncViewPack();

  }
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("password / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("password / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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
    if(isDebug) console.log("password / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_password");
    } // end if
  }

  private init() :void {
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    this.setMyChecker();
  }

  isOK(input:string) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / isOK / 시작");

    if(null == this.myCheckerService) {
      return;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  }

  private hasNotDonePassword(elementPassword):boolean {
    return !this.hasDonePassword(elementPassword);
  }
  private hasDonePassword(elementPassword):boolean {
    if(null == elementPassword) {
      return false;
    }

    if(!this.hasPassword(elementPassword) || this.isWarningPassword) {
      // 패스워드가 없거나, 패스워드에 문제가 있는 경우.
      return false;
    }

    // 패스워드 문제 없음!
    return true;
  } 

  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDoneP() :boolean {
    return !this.hasDoneP();
  }
  public hasDoneP() :boolean {
    return this.isOK(this.password);
  }
  // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
  public showWarningP() :void {

    this.isFocusPassword = true;
    this.isWarningPassword = true;
    this.isValidPassword = false;
    this.isShowTooltipPassword = true;
    this.tooltipHeadMsg = this.tooltipHeadNotAllowed;

  }
  // @ Desc : 이메일 재입력이 제대로 입력되었는지 확인합니다.
  public hasNotDoneRP() :boolean {
    return !this.hasDoneRP();
  }
  public hasDoneRP() :boolean {
    let isOK:boolean = this.isOK(this.repassword);

    if(isOK) {
      // 정상적인 패스워드 포맷이라면 이전에 입력한 패스워드와 비교한다.
      // 동일한 패스워드여야 합니다.
      isOK = (this.password === this.repassword)?true:false;
    }

    return isOK;
  }
  // @ Desc : 이메일 재입력을 확인해 달라는 표시를 보여줍니다.
  public showWarningRP() :void {

    this.isFocusRepassword = true;
    this.isWarningRepassword = true;
    this.isValidRepassword = false;
    this.isShowTooltipRepassword = true;

    if((this.password !== this.repassword)) {
      this.tooltipTailMsg = this.tooltipTailNotMatch;  
    } else {
      this.tooltipTailMsg = this.tooltipHeadNotAllowed;
    }

  }  



  onClickPassword(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPassword) {
      this.isFocusPassword = true;      
    } // end if

    this.password = element.value;
  } 

  onClickPasswordConfirm(event, element) :void {

    // 현재 패스워드 입력시에만 작동한다. 
    if(!this.isCheckCurPW) {
      return;
    }

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onClickPasswordConfirm / 시작");

    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPassword) {
      this.isFocusPassword = true;      
    } // end if

    this.passwordPrev = this.password = element.value;

    if(isDebug) console.log("password / onClickPasswordConfirm / this.password : ",this.password);

    // wonder.jung

    // 입력된 패스워드를 검사한다. - onBlur와 동일한 처리.
    let issueMsg:string = this.getPasswordIssue(this.password);
    if(isDebug) console.log("password / onClickPasswordConfirm / issueMsg : ",issueMsg);

    if(null == issueMsg || "" == issueMsg) {

      if(isDebug) console.log("password / onClickPasswordConfirm / 패스워드가 정상입니다.");
      this.emitEventOnSubmitPW(this.myEventService.KEY_USER_CUR_PASSWORD);

    } else {

      if(isDebug) console.log("password / onClickPasswordConfirm / 패스워드에 문제가 있습니다.");
      this.showTooltipHeadFailWarning(issueMsg, false);

    }
  }   

  onFocusPassword(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;    

    this.isFocusPassword = true;
  }

  private getPasswordIssue(password:string) :string {

    let msg:string = "";
    if(null == password || "" === password) {
      return this.tooltipHeadPasswordNeeds;
    }

    let isOK:boolean = this.isOK(this.password);
    if(isOK) {
      return msg;
    }

    // 패스워드에 문제가 있습니다.
    // 원인을 찾아봅니다.
    let history = this.myCheckerService.getLastHistory();

    if( null == history || 
        null == history.key || 
        null == history.msg) {

      return msg;
    }
  
    if("min" === history.key) {
      // 최소 문자 갯수보다 적은 경우.
      msg = history.msg;
    } else if("max" === history.key) {
      // 최대 문자 갯수보다 많은 경우.
      msg = history.msg;
    } else if("regexInclude" === history.key) {
      // 정규표현식에 포함되지 않는 문자열인 경우.
      msg = history.msg;

      let regExpStr:string = history.value + "";
      let regExpStrSpecialChar:string = /[!@#\\$%\^\&*\)\(+=._-]+/g + "";
      let regExpStrNumbers:string = /[0-9]+/g + "";
      let regExpAlphabet:string = /[a-z]+/g + "";

      if(regExpStr == regExpStrSpecialChar) {
        msg = "특수문자가 최소 1글자가 있어야 해요.";
      } else if(regExpStr == regExpStrNumbers) {
        msg = "숫자가 최소 1개 있어야 해요.";
      } else if(regExpStr == regExpAlphabet) {
        msg = "알파벳 소문자가 최소 1개 있어야 해요.";
      }

    } else {
      // 이에 해당되지 않는 예외 실패.
      msg = this.tooltipHeadNotAllowed;
    }

    return msg;
  }

  private passwordPrev:string="";
  onBlurPassword(event, element, elementNext) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;    
    if(isDebug) console.log("password / onBlurPassword / init");

    if(null == this.myCheckerService) {
      if(isDebug) console.log("password / onBlurPassword / 중단 / null == this.myCheckerService");
      return;
    }

    this.password = element.value;

    if(this.isFocusPassword) {
      this.isFocusPassword = false;
    } // end if

    // 패스워드의 유효성과 관계없이, 포커싱은 제거합니다.
    this.isFocusPassword = false;

    if(null == this.password || "" == this.password) {
      // 패스워드가 없다면 검사를 중단합니다.
      return;
    }

    let issueMsg:string = this.getPasswordIssue(this.password);
    if(this.isLogin && (null == issueMsg || "" == issueMsg)) {

      // 로그인 창은 패스워드 검사 결과를 사용자에게 보여주지 않습니다.
      // 이슈 결과가 없다면 - (패스워드 문제없음!), 부모 객체에게 Event 발송 
      let myEventOnChange:MyEvent =
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public key:string
        this.myEventService.KEY_USER_PASSWORD,
        // public value:string
        this.password,
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        this.myChecker
      );
      this.emitter.emit(myEventOnChange);

    } else if(!this.isLogin) {

      // 회원 가입 창일경우, 패스워드 검사 결과를 사용자에게 보여줍니다.
      if(null != issueMsg && "" != issueMsg) {
        // 패스워드의 문제를 발견했습니다.
        this.showTooltipHeadFailWarning(issueMsg, true);

      } else {
        // 패스워드가 정상입니다. 
        this.isWarningPassword = false;
        if(this.checkRepassword(elementNext)) {
          // 패스워드 재입력 검사가 완료, 탭으로 다른 입력창으로 이동하는 경우.
        } else {
          // 회원 가입 창일 경우, 입력 성공을 유저에게 알립니다.
          this.showTooltipHeadSuccess(this.tooltipHeadAllowed);

          // this.hideTooltipHead(2);
        } // end if
      } // end if
    } // end if

  } // end method

  hideTooltipHead(sec:number) :void {
    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipHeadMsg = null;
      _self.isShowTooltipPassword = false;
    }, 1000 * sec);        

  }

  hideTooltipTail(sec:number) :void {
    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipTailMsg = null;
      _self.isShowTooltipRepassword = false;
    }, 1000 * sec);        

  }  

  onKeydownTabShiftPassword(event, elementPassword) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onKeydownTabShiftPassword / init");

    if(isDebug) console.log("password / onKeydownTabShiftPassword / event : ",event);

    // 위쪽 탭 이동, 포커싱을 잃습니다.
    this.isFocusPassword = false;

  }

  onKeydownTabPassword(event, elementPassword) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onKeydownTabPassword / init");

    if(null == elementPassword) {
      if(isDebug) console.log("password / onKeydownTabPassword / 중단 / null == elementPassword");
      return;
    }

    // 아래쪽 탭 이동. 패스워드 재입력 창으로 이동합니다.
    this.lastKeyupTypeP = this.KeyupTypeTab;

    if(isDebug) console.log("password / onKeydownTabPassword / 아래로 탭 이동.");
    if(null == elementPassword.value || "" == elementPassword.value) {
      // 패스워드가 입력되지 않은 상태라면, 패스워드 재입력 창으로 넘어가면 안됩니다.
      event.stopPropagation();
      event.preventDefault();

      console.log("패스워드가 입력되지 않은 상태라면, 패스워드 재입력 창으로 넘어가면 안됩니다.");

      if(isDebug) console.log("password / onKeydownTabPassword / 패스워드가 입력되지 않은 상태라면, 패스워드 재입력 창으로 넘어가면 안됩니다.");

      // 메시지 노출.
      this.tooltipHeadMsg = this.tooltipHeadPasswordNeeds;
      this.isShowTooltipPassword = true;
      this.isWarningPassword = true;

    } // end if
  }

  onKeyupEnter(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onKeyupEnter / init");

    event.stopPropagation();
    event.preventDefault();

    // 패스워드가 유효한 경우에만 이벤트를 발송합니다.
    let issueMsg:string = this.getPasswordIssue(this.passwordPrev);
    if(isDebug) console.log("password / onKeyupEnter / issueMsg : ",issueMsg);
    if(null != issueMsg && "" != issueMsg) {
      if(isDebug) console.log("password / onKeyupEnter / 중단 / 패스워드에 문제가 있습니다.");

      if(this.isCheckCurPW) {
        if(isDebug) console.log("password / onKeyupEnter / 경고 메시지 노출 / issueMsg : ",issueMsg);

        this.showTooltipHeadFailWarning(issueMsg, false);
      }
      return;
    }  

    // 패스워드가 유효합니다.
    let eventKey:string = this.myEventService.KEY_USER_PASSWORD;
    if(this.isCheckCurPW) {
      eventKey = this.myEventService.KEY_USER_CUR_PASSWORD
    }
    this.emitEventOnSubmitPW(eventKey);
  } 

  private emitEventOnSubmitPW(eventKey:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / emitEventOnSubmitPW / init");

    // 사용자가 input 영역에서 enter를 누르는 이벤트를 부모 객체로 전달합니다.
    let myEventOnChange:MyEvent = 
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_SUBMIT,
      // public key:string
      eventKey,
      // public value:string
      this.passwordPrev,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

  }

  private emitEventOnChangePW(eventKey:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / emitEventOnChangePW / init");

    // 사용자가 input 영역에서 enter를 누르는 이벤트를 부모 객체로 전달합니다.
    let myEventOnChange:MyEvent = 
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      eventKey,
      // public value:string
      "",
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

  }   

  onKeyupPassword(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onKeyupPassword / init");

    // shift, tab
    if(event.key == "Tab" || event.key == "Shift") {
      if(isDebug) console.log("password / onKeyupPassword / 중단 / 탭 이동");
      return;
    }
    this.lastKeyupTypeP = this.KeyupTypeChar;

    if(null == this.myCheckerService) {
      return;
    }

    // 입력 글자수가 최대글자수를 넘지 않았는지 검사합니다.
    // 모든 영문을 소문자로 고정 변경.
    this.password = element.value.toLowerCase();

    // 비어있는 문자열이라면 검사하지 않습니다.
    if(null == this.password || "" == this.password) {
      if(isDebug) console.log("password / onKeyupPassword / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return;
    }

    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.passwordPrev === this.password) {
      if(isDebug) console.log("password / onKeyupPassword / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }  
    this.passwordPrev = this.password;  

    // 패스워드를 검사합니다.
    if(isDebug) console.log("password / onKeyupPassword / this.password : ",this.password);
    let regExpNotAllowed:RegExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]/gi;
    let matchArr:RegExpMatchArray = this.password.match(regExpNotAllowed);
    if(null != matchArr && 0 < matchArr.length) {
      // 한글 및 공백 입력시 삭제 처리.
      for (var i = 0; i < matchArr.length; ++i) {
        let match:string = matchArr[i];
        if(null == match || "" == match) {
          continue;
        }

        element.value = this.passwordPrev = this.password = this.password.replace(match, "");
      }

      // 1-1-2. 삭제 안내 메시지를 노출합니다.
      this.showTooltipHeadFailWarning("한글 및 공백을 사용할 수 없어요.", true);

      if(isDebug) console.log("password / onKeyupPassword / 한글 및 공백 입력시 삭제 처리. / matchArr : ",matchArr);

    } else {

      // 1. 사용자가 입력한 패스워드를 검사합니다.
      let isOK:boolean = this.isOK(this.password);

      if(!isOK) {
        // 패스워드에 문제가 있습니다.
        // 원인을 찾아봅니다.
        let history = this.myCheckerService.getLastHistory();

        if( null != history && 
            null != history.key && 
            null != history.msg && 
            null != history.value) {

          if("max" === history.key) {
            // 최대 문자 갯수보다 많은 경우.
            this.tooltipHeadMsg = history.msg;
            this.isShowTooltipPassword = true;
            // 글자수를 줄여줍니다.
            let max:number = history.value;
            element.value = this.passwordPrev = this.password = this.password.slice(0, max);
          }
        }
        
        this.isFocusPassword = true;
        element.focus();

      } else {

        // 패스워드에 문제가 없습니다.
        // 경고 메시지 등을 내립니다.
        // wonder.jung
        this.hideTooltipHeadFailWarning();

      } // end inner if
    } // end if
  }  // end method

  // @ Desc : 실패 툴팁을 가립니다.
  hideTooltipHeadFailWarning() :void {
    this.isFocusPassword = false;
    this.isValidPassword = true;
    this.isShowTooltipPassword = false;
    this.tooltipHeadMsg = null;
  }
  // @ Desc : 실패 툴팁을 보여줍니다.
  showTooltipHeadFailWarning(warningMsg:string, isTimeout:boolean) :void {
    this.isFocusPassword = true;
    this.isValidPassword = false;
    this.isShowTooltipPassword = true;
    this.tooltipHeadMsg = warningMsg;

    if(null != isTimeout && isTimeout) {
      this.hideTooltipHead(2);
    }
  }
  // @ Desc : 성공 툴팁을 보여줍니다.
  public showTooltipHeadSuccess(msg:string) :void {
    this.isFocusPassword = false;
    this.isValidPassword = true;
    this.isShowTooltipPassword = true;
    this.tooltipHeadMsg = msg;
    this.hideTooltipHead(2);
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

  private returnToPassword(elementPassword) :void{
    // 패스워드가 완료되지 않은 경우는 중단.
    // 강제로 패스워드를 먼저 완료하도록 합니다.
    this.isFocusRepassword = false;

    this.isFocusPassword = true;
    this.isWarningPassword = true;
    this.isShowTooltipPassword = true;
    elementPassword.focus();

    if(null == this.tooltipHeadMsg || "" === this.tooltipHeadMsg) {
      this.tooltipHeadMsg = this.tooltipHeadPasswordNeeds;
      this.hideTooltipHead(2);
    }
  }

  onClickRepassword(event, element, elementPassword) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onClickRepassword / init");

    event.stopPropagation();
    event.preventDefault();

    if(this.hasNotDonePassword(elementPassword)) {
      if(isDebug) console.log("password / onClickRepassword / this.hasNotDonePassword(elementPassword)");
      this.returnToPassword(elementPassword);
      return;
    }

    if(!this.isFocusRepassword) {
      if(isDebug) console.log("password / onClickRepassword / !this.isFocusRepassword");
      this.isFocusRepassword = true;      
    } // end if

    this.repassword = element.value;

    if(isDebug) console.log("password / onClickRepassword / done!");
  } // end method

  private hasPassword(elementPassword) :boolean {

    // password가 입력되지 않았다면, 패스워드 입력을 먼저 하도록 합니다.
    // password 입력창으로 포커스를 이동시킵니다.
    return (null != elementPassword.value && "" != elementPassword.value)?true:false;
  }

  onFocusRepassword(event, element, elementPassword) :void {

    event.stopPropagation();
    event.preventDefault();

    if(this.hasNotDonePassword(elementPassword)) {
      // 패스워드에 문제가 있습니다. 중단합니다.
      return;
    }

    // 패스워드에 문제가 없다면 패스워드 재입력의 포커싱 UI를 보여줍니다.
    this.isFocusRepassword = true;
  }

  // 사용자가 마지막으로 입력한 키가 문자입력인지 확인. 문자입력이 아니라면 탭이동.
  isKeyupP() :boolean {
    return (this.lastKeyupTypeP === this.KeyupTypeChar)?true:false;
  }

  // 사용자가 마지막으로 입력한 키가 문자입력인지 확인. 문자입력이 아니라면 탭이동.
  isKeyupRP() :boolean {
    return (this.lastKeyupTypeRP === this.KeyupTypeChar)?true:false;
  }

  onKeydownTabRepassword(event, element) :void {

    let isKeyup:boolean = this.isKeyupRP();
    this.lastKeyupTypeRP = this.KeyupTypeTab;

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onKeydownTabRepassword / init");

    if(this.checkRepassword(element)) {
      if(isDebug) console.log("password / onKeydownTabRepassword / 패스워드 재입력 성공!");
      this.updateViewRepasswordSuccess(isKeyup);
      this.isFocusRepassword = false;
    } else {
      if(isDebug) console.log("password / onKeydownTabRepassword / 패스워드 재입력 실패");
      this.updateViewRepasswordFailed(element);
    }

  }

  private repasswordPrev:string="";
  onKeyupRepassword(event, element) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;  

    if(isDebug) console.log("password / onKeyupRepassword / init");

    event.stopPropagation();
    event.preventDefault();

    // shift, tab
    if(event.key == "Tab" || event.key == "Shift") {
      if(isDebug) console.log("password / 중단 / 문자 입력이 아닌 탭,시프트이동.");
      return;
    }

    this.lastKeyupTypeRP = this.KeyupTypeChar;


    if(null == this.myCheckerService) {
      return;
    }

    // 입력 글자수가 최대글자수를 넘지 않았는지 검사합니다.
    // 모든 영문을 소문자로 고정 변경.
    this.repassword = element.value.toLowerCase();

    // 비어있는 문자열이라면 검사하지 않습니다.
    if(null == this.repassword || "" == this.repassword) {
      if(isDebug) console.log("password / onKeyupRepassword / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return;
    }

    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.repasswordPrev === this.repassword) {
      if(isDebug) console.log("password / onKeyupRepassword / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }    

    // 패스워드를 검사합니다.
    if(isDebug) console.log("password / onKeyupRepassword / this.repassword : ",this.repassword);
    let regExpNotAllowed:RegExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]/gi;
    let matchArr:RegExpMatchArray = this.repassword.match(regExpNotAllowed);
    if(null != matchArr && 0 < matchArr.length) {
      // 한글 및 공백 입력시 삭제 처리.
      for (var i = 0; i < matchArr.length; ++i) {
        let match:string = matchArr[i];
        if(null == match || "" == match) {
          continue;
        }

        element.value = this.repassword = this.repassword.replace(match, "");
      }

      // 1-1-2. 삭제 안내 메시지를 노출합니다.
      this.tooltipTailMsg = "한글 및 공백을 사용할 수 없어요.";
      this.isValidPassword = false;
      this.isWarningPassword = true;
      this.isShowTooltipRepassword = true;
      this.hideTooltipTail(2);

      if(isDebug) console.log("password / onKeyupRepassword / 한글 및 공백 입력시 삭제 처리. / matchArr : ",matchArr);

    } else {

      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
      let isOK:boolean = this.isOK(this.repassword);

      if(!isOK) {
        // 패스워드에 문제가 있습니다.
        // 원인을 찾아봅니다.
        let history = this.myCheckerService.getLastHistory();

        if( null != history && 
            null != history.key && 
            null != history.msg && 
            null != history.value) {

          if("max" === history.key) {
            console.log("password / onKeyupRepassword / history : ",history);
            // 최대 문자 갯수보다 많은 경우.
            this.tooltipTailMsg = history.msg;
            this.isShowTooltipRepassword = true;
            // 글자수를 줄여줍니다.
            let max:number = history.value;
            element.value = this.repasswordPrev = this.repassword = this.repassword.slice(0, max);
          }
        }
        
        this.isFocusRepassword = true;
        element.focus();

      } else {

        // 정상적인 패스워드입니다.
        // 부모에게 이벤트를 발송합니다.

        // wonder.jung
        this.emitEventOnChangePW(this.myEventService.KEY_USER_RE_PASSWORD);

      } // end inner if



    } // end if
  }  // end method  

  onBlurRepassword(event, element, elementPassword) :void {

    event.stopPropagation();
    event.preventDefault();

    if(!this.hasPassword(elementPassword) || this.isWarningPassword) {
      // 패스워드가 아직 완료되지 않았습니다. 중단합니다.
      return;
    }

    if(this.checkRepassword(element)) {
      this.updateViewRepasswordSuccess(this.isKeyupRP());
      this.isFocusRepassword = false;
    } else {
      this.updateViewRepasswordFailed(element);
    }

  } // end method

  updateViewRepasswordSuccess(isKeyup:boolean) :void {

    // 패스워드 재입력 성공!
    if(isKeyup) {
      this.tooltipTailMsg = this.tooltipTailMatched;
      this.isShowTooltipRepassword = true;
      this.hideTooltipTail(2);

      // 부모 객체에게 정상적인 이메일 주소를 전달합니다.
      // 부모 객체에게 Event 발송 
      let myEventOnChange:MyEvent =
      this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public key:string
        this.myEventService.KEY_USER_PASSWORD,
        // public value:string
        this.password,
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        this.myChecker
      );
      this.emitter.emit(myEventOnChange);
              
    }
    this.isValidRepassword = true;
    this.isWarningPassword = false;
    this.isWarningRepassword = false;

  }

  updateViewRepasswordFailed(element) :void {
    // 패스워드 재입력 실패!
    // this.showRepassword(element, this.tooltipTailNotMatch);

    // 메시지 노출
    this.tooltipTailMsg = this.tooltipTailNotMatch;

    this.isFocusRepassword = false;
    this.isValidRepassword = false;
    this.isWarningRepassword = true;
    this.isShowTooltipRepassword = true;
  }

  checkRepassword(element) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / checkRepassword / init");

    if(null == element) {
      if(isDebug) console.log("password / checkRepassword / 중단 / null == element");
      return false;
    }

    // 입력창에 있는 재입력 패스워드를 변수로 옮김.
    this.repassword = element.value;

    // 비어있는 문자열이라면 검사하지 않습니다.
    if(null == this.repassword || "" == this.repassword) {
      if(isDebug) console.log("password / checkRepassword / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return false;
    }

    // 기존 패스워드와 재입력 패스워드가 둘다 유효해야만 비교 작업을 진행합니다.
    if( null != this.password && 
        "" != this.password &&
        null != this.repassword && 
        "" != this.repassword ) {

      if(isDebug) console.log("password / checkRepassword / this.password : ",this.password);
      if(isDebug) console.log("password / checkRepassword / this.repassword : ",this.repassword);

      return (this.password === this.repassword)?true:false;
    } // end if

    return false;
  }

  // @ Desc : 지금의 자신의 패스워드를 확인하는 모드로 바꿉니다.
  public openCheckCurPWMode() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / openCheckCurPWMode / init");

    this.initPassword();
    this.initRepassword();
    this.hideTooltipHeadFailWarning();
    this.isCheckCurPW = true;

  }
  // @ Desc : 지금의 자신의 패스워드를 확인하는 모드를 해제합니다.
  private closeCheckCurPWMode() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / releaseUpdateMode / init");

    this.isCheckCurPW = false;
  }
  ngModelPW:string;
  private initPassword() :void {
    this.ngModelPW="";
    this.passwordPrev="";
    this.password="";
  }
  public getPassword() :string {
    return this.ngModelPW;
  }
  ngModelRePW:string;
  private initRepassword() :void {
    this.ngModelRePW="";
    this.repasswordPrev="";
    this.repassword="";
  }
  public getRepassword() :string {
    return this.ngModelRePW;
  }
  // @ Desc : 새로운 패스워드를 입력하는 버튼을 노출합니다.
  isNewPW:boolean=false;
  public showBtnConfirmNewPW() :void {
    this.isNewPW = true;
  }
  onClickNewPasswordConfirm(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / onClickNewPasswordConfirm / init");

    event.stopPropagation();
    event.preventDefault();

    this.emitEventOnSubmitPW(this.myEventService.KEY_USER_NEW_PASSWORD);

  }
  public openNewPasswordMode() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password / openNewPasswordMode / init");

    this.closeCheckCurPWMode();
    this.initPassword();
    this.setTitleHead("새로운 비밀번호");
    this.setPlaceHolderHead("새로운 비밀번호를 입력해주세요");

    if(isDebug) console.log("password / openNewPasswordMode / this.ngModelPW : ",this.ngModelPW);
  }

  public setTitleHead(title:string) :void {
    this.titleHead = title;
  }  
  public setPlaceHolderHead(placeholderHead:string) :void {
    this.placeholderHead = placeholderHead;
  }  

}
