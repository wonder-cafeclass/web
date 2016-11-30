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

import { UserService }          from '../../../users/service/user.service';

@Component({
  moduleId: module.id,
  selector: 'email',
  templateUrl: 'email.component.html',
  styleUrls: [ 'email.component.css' ]
})
export class EmailComponent implements OnInit {

  @Input() width:number=380;

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() isCheckUnique:boolean=true;

  @Input() myCheckerService:MyCheckerService = null;

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

  constructor(  private myEventService:MyEventService, 
                private userService:UserService) {}

  ngOnInit(): void {
    console.log("email / top : ",this.top);
    console.log("email / left : ",this.left);

  }

  private setMyChecker() :void {

    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_email");
    }
    
  }

  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {
    this.setMyChecker();
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

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
  }

  private inputStrPrevOnBlur:string="";
  onBlur(event, email, element) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;

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

      if(isOK && this.isCheckUnique) {
        // 회원 가입시, 유일한 이메일인지 검사.
        this.userService
        .getUserByEmail(email)
        .then(result => {

          if( null != result &&
              null != result.user ) {

            // 이미 등록된 유저가 있습니다.
            isOK = false;
          }
          if(isOK) {
            this.emailSuccess(email);
          } else {
            this.emailFailed(this.tooltipMsgEmailNotUnique);
          }
        });
      } else if(isOK) {
        // 로그인 시에는 이메일이 유일한지 검사하지 않습니다.
        this.emailSuccess(email);
      } else {
        this.emailFailed(this.tooltipMsgEmailNotValid);
      }

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
      
    // REMOVE ME
    // release lock
    // this.lockFocus = null;
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

    this.setMyChecker();

    let isOK:boolean = false;

    if(null == this.myCheckerService) {
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
