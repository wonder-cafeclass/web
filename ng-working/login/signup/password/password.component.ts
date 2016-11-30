import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';


@Component({
  moduleId: module.id,
  selector: 'password',
  templateUrl: 'password.component.html',
  styleUrls: [ 'password.component.css' ]
})
export class PasswordComponent implements OnInit {

  @Input() width:number=380;

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  // 비밀번호만 입력을 받을 때 사용합니다.
  @Input() isLogin:boolean=false;

  @Input() myCheckerService:MyCheckerService = null;

  @Output() emitter = new EventEmitter<MyEvent>();

  isFocusPassword:boolean=false;
  isFocusInfo:boolean=false;

  isFocusRepassword:boolean=false;

  password:string="";
  repassword:string="";

  isValidPassword:boolean = false;
  isWarningPassword:boolean = false;
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

  constructor(private myEventService:MyEventService) {}

  ngOnInit(): void {}

  private setMyChecker() :void {

    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_password");
    }
  }
  isOK(input:string) :boolean {

    this.setMyChecker();

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

    console.log(">>> showWarningRP");

    this.isFocusRepassword = true;
    this.isWarningRepassword = true;
    this.isValidRepassword = false;

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

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
  } 

  onFocusPassword(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;    

    this.isFocusPassword = true;

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
  }

  private getPasswordIssue(password:string) :string {

    let msg:string = "";
    if(null == password || "" === password) {
      return msg;
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

    let isDebug:boolean = true;
    // let isDebug:boolean = false;    
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

    let isseuMsg:string = this.getPasswordIssue(this.password);
    if(this.isLogin && (null == isseuMsg || "" == isseuMsg)) {

      // 로그인 창은 패스워드 검사 결과를 사용자에게 보여주지 않습니다.
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

    } else if(!this.isLogin) {

      // 회원 가입 창일경우, 패스워드 검사 결과를 사용자에게 보여줍니다.
      if(null != isseuMsg && "" != isseuMsg) {
        // 패스워드의 문제를 발견했습니다.
        // 패스워드 경고 메시지 ON
        this.tooltipHeadMsg = isseuMsg;
        // 패스워드 경고 표시 ON
        this.isWarningPassword = true;
      } else {
        // 패스워드가 정상입니다. 
        this.isWarningPassword = false;
        if(this.checkRepassword(elementNext)) {
          // 패스워드 재입력 검사가 완료, 탭으로 다른 입력창으로 이동하는 경우.
        } else {
          // 회원 가입 창일 경우, 입력 성공을 유저에게 알립니다.
          this.tooltipHeadMsg = this.tooltipHeadAllowed;
          this.isValidPassword = true;
          this.isWarningPassword = false;

          this.hideTooltipHead(2);
        } // end if
      } // end if

    } // end if
    
  }

  hideTooltipHead(sec:number) :void {
    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipHeadMsg = null;
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

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
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
      this.isWarningPassword = true;

    } // end if
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
      this.tooltipHeadMsg = "한글 및 공백을 사용할 수 없어요.";
      this.isValidPassword = false;
      this.isWarningPassword = true;
      this.hideTooltipHead(2);

      if(isDebug) console.log("password / onKeyupPassword / 한글 및 공백 입력시 삭제 처리. / matchArr : ",matchArr);

    } else {

      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
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
            // 글자수를 줄여줍니다.
            let max:number = history.value;
            element.value = this.passwordPrev = this.password = this.password.slice(0, max);
          }
        }
        
        this.isFocusPassword = true;
        element.focus();
      } // end inner if
    } // end if
  }  // end method

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

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
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

    event.stopPropagation();
    event.preventDefault();

    // shift, tab
    if(event.key == "Tab" || event.key == "Shift") {
      return;
    }

    this.lastKeyupTypeRP = this.KeyupTypeChar;

    // let isDebug:boolean = true;
    let isDebug:boolean = false;    

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
            // 글자수를 줄여줍니다.
            let max:number = history.value;
            element.value = this.repasswordPrev = this.repassword = this.repassword.slice(0, max);
          }
        }
        
        this.isFocusRepassword = true;
        element.focus();
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
}
