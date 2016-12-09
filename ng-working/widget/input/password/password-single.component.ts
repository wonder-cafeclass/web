import {  Component, 
          Input, 
          Output,
          ViewChild,
          ElementRef,
          EventEmitter,
          OnInit,
          AfterViewInit,
          AfterViewChecked }          from '@angular/core';
import { Router }                     from '@angular/router';

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';
import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyLoggerService }            from '../../../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../../util/model/my-response';


@Component({
  moduleId: module.id,
  selector: 'password-single',
  templateUrl: 'password-single.component.html',
  styleUrls: [ 'password-single.component.css' ]
})
export class PasswordSingleComponent implements OnInit, AfterViewInit {

  @Input() width:number=380;
  @Input() eventKey:string="";
  @Input() isShowGuide:boolean=false;
  @Input() titleHead:string="비밀번호";
  @Input() placeholderHead:string="비밀번호를 입력해주세요";

  @Output() emitter = new EventEmitter<MyEvent>();

  isFocus:boolean=false;
  isShowTooltip:boolean=false;

  password:string="";
  
  isValid:boolean = false;
  isWarning:boolean = false;

  tooltipMsg:string=null;
  tooltipPasswordNeeds:string="패스워드를 먼저 입력해주세요.";
  tooltipNotAllowed:string="앗! 패스워드에 문제가 있습니다.";
  tooltipAllowed:string="성공! 패스워드가 완벽합니다.";

  KeyupTypeTab:string="tab";
  KeyupTypeChar:string="char";
  // 마지막에 사용자가 누른 키의 타입을 추적, 탭 이동시 패스워드 중복 성공 표시를 하지 않도록 합니다.
  lastKeyupTypeP:string="";

  // 마지막에 사용자가 누른 키의 타입을 추적, 탭 이동시 패스워드 중복 성공 표시를 하지 않도록 합니다.
  lastKeyupTypeRP:string="";

  // 패스워드 입력 기준 (네이버)
  // 6~16 characters with letters(a-z), numbers, and special letters.

  myChecker:MyChecker;

  isAdmin:boolean=false;

  constructor(  private myEventService:MyEventService,
                private myLoggerService:MyLoggerService,
                private watchTower:MyEventWatchTowerService,
                private myCheckerService:MyCheckerService ) {}

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / ngAfterViewInit");

    this.asyncViewPack();
    // this.measure();
  }

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("password-single / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("password-single / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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
    if(isDebug) console.log("password-single / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_password");
    } // end if
  }

  private init() :void {
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    this.setMyChecker();
  }

  isOK(input:string) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / isOK / 시작");

    if(null == this.myCheckerService) {
      return;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  }

  onClickPassword(event, element) :void {

    // 락 해제
    // this.lockAfterOnBlur=null;

    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

    this.password = element.value;
  } 

  onFocusPassword(event, element) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / onFocusPassword / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.isFocus = true;
  }

  onChangeTooltip(event, elementTooltip) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / onChangeTooltip / 시작");

    if(isDebug) console.log("password-single / onChangeTooltip / elementTooltip : ",elementTooltip);

    event.stopPropagation();
    event.preventDefault();

  }

  private getPasswordIssue(password:string) :string {

    let msg:string = "";
    if(null == password || "" === password) {
      return this.tooltipPasswordNeeds;
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
      msg = this.tooltipNotAllowed;
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

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    // 패스워드의 유효성과 관계없이, 포커싱은 제거합니다.
    this.isFocus = false;

    if(null == this.password || "" == this.password) {
      if(isDebug) console.log("password / onBlurPassword / 중단 / 패스워드가 없다면 검사를 중단합니다.");
      return;
    }

    let issueMsg:string = this.getPasswordIssue(this.password);
    if(null == issueMsg || "" == issueMsg) {

      // 이전에 노출했던 모든 경고창을 내립니다.
      this.hideTooltipWarning();

      // 로그인 창은 패스워드 검사 결과를 사용자에게 보여주지 않습니다.
      // 이슈 결과가 없다면 - (패스워드 문제없음!), 부모 객체에게 Event 발송 
      this.emitOnChange(
        // eventKey:string
        this.eventKey,
        // value:string
        element.value
      );
      // REMOVE ME
      // this.lockAfterOnBlur={};
      // 

    } else {

      // 회원 가입 창일경우, 패스워드 검사 결과를 사용자에게 보여줍니다.
      if(null != issueMsg && "" != issueMsg) {

        if(isDebug) console.log("password / onBlurPassword / 중단 / 패스워드의 문제를 발견했습니다.");
        this.showTooltipFailWarning(issueMsg, false);

      } else {

        if(isDebug) console.log("password / onBlurPassword / 중단 / 패스워드가 정상입니다.");
        this.showTooltipSuccess(this.tooltipAllowed);

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
      _self.tooltipMsg = null;
      _self.isShowTooltip = false;
    }, 1000 * sec);        

  }

  onKeydownTabShiftPassword(event, elementPassword) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / onKeydownTabShiftPassword / init");

    if(isDebug) console.log("password-single / onKeydownTabShiftPassword / event : ",event);

    // 위쪽 탭 이동, 포커싱을 잃습니다.
    this.isFocus = false;

  }

  onKeydownTabPassword(event, elementPassword) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / onKeydownTabPassword / init");

    if(null == elementPassword) {
      if(isDebug) console.log("password-single / onKeydownTabPassword / 중단 / null == elementPassword");
      return;
    }

    // 아래쪽 탭 이동. 패스워드 재입력 창으로 이동합니다.
    this.lastKeyupTypeP = this.KeyupTypeTab;

    if(isDebug) console.log("password-single / onKeydownTabPassword / 아래로 탭 이동.");
    if(null == elementPassword.value || "" == elementPassword.value) {
      // 패스워드가 입력되지 않은 상태라면, 패스워드 재입력 창으로 넘어가면 안됩니다.
      event.stopPropagation();
      event.preventDefault();

      console.log("패스워드가 입력되지 않은 상태라면, 패스워드 재입력 창으로 넘어가면 안됩니다.");

      if(isDebug) console.log("password-single / onKeydownTabPassword / 패스워드가 입력되지 않은 상태라면, 패스워드 재입력 창으로 넘어가면 안됩니다.");

      // 메시지 노출.
      this.tooltipMsg = this.tooltipPasswordNeeds;
      this.isWarning = true;

    } // end if
  }

  onKeyupEnter(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / onKeyupEnter / init");

    event.stopPropagation();
    event.preventDefault();

    // 패스워드가 유효한 경우에만 이벤트를 발송합니다.
    let issueMsg:string = this.getPasswordIssue(this.passwordPrev);
    if(isDebug) console.log("password-single / onKeyupEnter / issueMsg : ",issueMsg);
    if(null != issueMsg && "" != issueMsg) {
      if(isDebug) console.log("password-single / onKeyupEnter / 중단 / 패스워드에 문제가 있습니다.");
      return;
    }  

    // 패스워드가 유효합니다.
    this.emitOnSubmit(this.eventKey);
  } 

  private emitOnSubmit(eventKey:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / emitOnSubmit / init");

    if(null == eventKey || "" === eventKey) {
      if(isDebug) console.log("password-single / emitOnSubmit / 중단 / eventKey is not valid!");
      return;
    }

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

  private emitOnChange(eventKey:string, value:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / emitOnChange / init");

    if(null == eventKey || "" === eventKey) {
      if(isDebug) console.log("password-single / emitOnSubmit / 중단 / eventKey is not valid!");
      return;
    }

    // 사용자가 input 영역에서 enter를 누르는 이벤트를 부모 객체로 전달합니다.
    let myEventOnChange:MyEvent = 
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      eventKey,
      // public value:string
      value,
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
    if(isDebug) console.log("password-single / onKeyupPassword / init");

    // shift, tab
    if(event.key == "Tab" || event.key == "Shift") {
      if(isDebug) console.log("password-single / onKeyupPassword / 중단 / 탭 이동");
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
      if(isDebug) console.log("password-single / onKeyupPassword / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return;
    }

    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.passwordPrev === this.password) {
      if(isDebug) console.log("password-single / onKeyupPassword / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
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
      this.showTooltipFailWarning("한글 및 공백을 사용할 수 없어요.", true);

      if(isDebug) console.log("password-single / onKeyupPassword / 한글 및 공백 입력시 삭제 처리. / matchArr : ",matchArr);

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
            this.tooltipMsg = history.msg;
            // 글자수를 줄여줍니다.
            let max:number = history.value;
            element.value = this.passwordPrev = this.password = this.password.slice(0, max);
          }
        }
        
        this.isFocus = true;
        element.focus();

      } else {

        // 패스워드에 문제가 없습니다.
        // 경고 메시지 등을 내립니다.
        this.hideTooltipWarning();

      } // end inner if
    } // end if
  }  // end method

  // 블러 이후에는 이벤트 적용을 하지 않습니다.
  // lockAfterOnBlur=null;

  // @ Desc : 실패 툴팁을 가립니다.
  hideTooltipWarning() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("password-single / hideTooltipWarning / init");
    // if(isDebug) console.log("password-single / hideTooltipWarning / init / this.lockAfterOnBlur : ",this.lockAfterOnBlur);

    // if(this.lockAfterOnBlur) {
    //   if(isDebug) console.log("password-single / hideTooltipWarning / 중단 / this.lockAfterOnBlur");
    //   return;
    // }

    this.isShowTooltip = false;
    this.isWarning = false;
    this.isFocus = false;
    this.isValid = true;
    this.tooltipMsg = null;

    if(isDebug) console.log("password-single / hideTooltipWarning / Done!");

  }
  // @ Desc : 실패 툴팁을 보여줍니다.
  showTooltipFailWarning(warningMsg:string, isTimeout:boolean) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;    
    if(isDebug) console.log("password-single / showTooltipFailWarning / init");
    if(isDebug) console.log("password-single / showTooltipFailWarning / warningMsg : ",warningMsg);

    this.isShowTooltip = true;
    this.isWarning = true;
    this.isFocus = true;
    this.isValid = false;
    this.tooltipMsg = warningMsg;

    if(isDebug) console.log("password-single / showTooltipFailWarning / this.isShowTooltip : ",this.isShowTooltip);

    if(null != isTimeout && isTimeout) {
      if(isDebug) console.log("password-single / showTooltipFailWarning / this.hideTooltipHead(2)");
      this.hideTooltipHead(2);
    }

  }
  // @ Desc : 성공 툴팁을 보여줍니다.
  public showTooltipSuccess(msg:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;    
    if(isDebug) console.log("password-single / showTooltipSuccess / init");
    if(isDebug) console.log("password-single / showTooltipSuccess / msg : ",msg);

    this.isShowTooltip = true;
    this.isWarning = false;
    this.isFocus = false;
    this.isValid = true;
    this.tooltipMsg = msg;
    this.hideTooltipHead(2);

  }

  // 사용자가 마지막으로 입력한 키가 문자입력인지 확인. 문자입력이 아니라면 탭이동.
  isKeyupP() :boolean {
    return (this.lastKeyupTypeP === this.KeyupTypeChar)?true:false;
  }

  // 사용자가 마지막으로 입력한 키가 문자입력인지 확인. 문자입력이 아니라면 탭이동.
  isKeyupRP() :boolean {
    return (this.lastKeyupTypeRP === this.KeyupTypeChar)?true:false;
  }

  ngModelPW:string;
  public initPassword() :void {
    this.ngModelPW="";
    this.passwordPrev="";
    this.password="";
  }
  public getPassword() :string {
    return this.ngModelPW;
  }
  // @ Desc : 새로운 패스워드를 입력하는 버튼을 노출합니다.
  isNewPW:boolean=false;
  public showBtnConfirmNewPW() :void {
    this.isNewPW = true;
  }
  onClickNewPasswordConfirm(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("password-single / onClickNewPasswordConfirm / init");

    event.stopPropagation();
    event.preventDefault();

    this.emitOnSubmit(this.eventKey);

  }
  public setTitleHead(title:string) :void {
    this.titleHead = title;
  }  
  public setPlaceHolderHead(placeholderHead:string) :void {
    this.placeholderHead = placeholderHead;
  }  

}
