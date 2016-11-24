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

@Component({
  moduleId: module.id,
  selector: 'nickname',
  templateUrl: 'nickname.component.html',
  styleUrls: [ 'nickname.component.css' ]
})
export class NicknameComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() myCheckerService:MyCheckerService = null;

  @Output() emitter = new EventEmitter<MyEvent>();

  isWarning:boolean=false;

  isSuccessInput:boolean=false;
  tooltipHeadMsg:string=null;
  tooltipHeadNotAllowed:string="닉네임에 문제가 있습니다.";
  tooltipHeadAllowed:string="성공! 근사한 닉네임이네요.";
  tooltipHeadRemoved:string="영문, 숫자, 한글이어야 합니다.";
  tooltipHeadRemovedEmpties:string="빈칸을 2칸 이상 입력할 수 없습니다.";

  myChecker:MyChecker;  

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isShowPopover:boolean=false;

  constructor(  private myLoggerService:MyLoggerService, 
                private myEventService:MyEventService) {}

  ngOnInit(): void {}

  private setMyChecker() :void {
    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_nickname");
    }
  }
  isOK(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  }

  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {
    return this.isOK(this.inputStrPrev);
  }
  // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
  public showWarning() :void {
    this.isFocus = true;
    this.isWarning = true;
    this.isSuccessInput = false;
    this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
  } 

  onClick(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
  } 

  onFocus(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
  }

  onKeydownTab(event) :void {
    // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
    // 포커싱을 잃습니다.
    this.isFocus = false;
  }

  onKeydownTabShift(event) :void {
    // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
    // 포커싱을 잃습니다.
    this.isFocus = false;
  }

  onBlur(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    let inputStr:string = element.value;

    // 입력한 이름을 검사합니다.
    // 패스워드를 검사합니다.
    if(null != inputStr && "" != inputStr) {
      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
      let isOK:boolean = this.isOK(inputStr);

      if(!isOK) {

        // 원인을 찾아봅니다.
        let history = this.myCheckerService.getLastHistory();
        console.log("password / onBlur / history : ",history);

        if(null != history && null != history.key && null != history.msg) {
          // Do something..
          if("min" === history.key) {

            // 최소 문자 갯수보다 적은 경우.
            this.tooltipHeadMsg = history.msg;

            this.isSuccessInput = false;
            return;


          } else if("max" === history.key) {

            // 최대 문자 갯수보다 많은 경우.
            this.tooltipHeadMsg = history.msg;

            // 넘는 문자열은 지웁니다.
            element.value = inputStr = inputStr.slice(0, history.value);

            this.isSuccessInput = false;
            return;


          } else if("regexExclude" === history.key) {

            // 정규표현식에 포함되지 않는 문자열인 경우.
            this.tooltipHeadMsg = history.msg;

            let regExpStr:string = history.value + "";
            let regExpStrInputStrRange:string =  /[^a-zA-Z가-힣0-9 ]+/g + "";

            if(regExpStr == regExpStrInputStrRange) {
              this.tooltipHeadMsg = "이름에 사용할 수 없는 문자가 있어요.";

              let matchArr:string[] = history.matchArr;
              if(null != matchArr && 0 < matchArr.length) {

                for (var i = 0; i < matchArr.length; ++i) {
                  let keywordNotAllowed:string = matchArr[i];
                  // 사용할 수 없는 문자들을 지웁니다.
                  element.value = inputStr = inputStr.replace(keywordNotAllowed, "");
                } // end for

                this.isSuccessInput = false;
                return;

              } // end if
            } // end if

          } else {
            // 이에 해당되지 않는 예외 실패.
            this.tooltipHeadMsg = this.tooltipHeadNotAllowed;

            this.isSuccessInput = false;
            return;

          } // end if
        } // end if
      } // end if - isOK

      // 비속어, 욕설 검사.
      let inputStrBeforeSanitize:string = inputStr;
      inputStr = this.myCheckerService.sanitizeDirtyWord(inputStr);

      if(inputStrBeforeSanitize != inputStr) {
        // 비속어, 욕설이 제거되었습니다. 
        // 사용자에게 금칙어임을 알립니다.
        this.tooltipHeadMsg = "금칙어는 제외됩니다.";
        element.value = inputStr;

        this.hideTooltip(2);

        // Logger - Spam 행위로 등록.
        this.myLoggerService.logActionDirtyWord(inputStrBeforeSanitize);

        this.isSuccessInput = false;
        return;

      } else {

        this.hideTooltipNow();

        // this.tooltipHeadMsg = this.tooltipHeadAllowed;
        this.isWarning = false;
        this.isSuccessInput = true;

        this.hideTooltip(2);

        // 부모 객체에게 Change Event 발송 
        let myEventOnChange:MyEvent =
        this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_CHANGE,
          // public key:string
          this.myEventService.KEY_USER_NICKNAME,
          // public value:string
          inputStr,
          // public metaObj:any
          null,
          // public myChecker:MyChecker
          this.myChecker
        );
        this.emitter.emit(myEventOnChange);

        return;

      }// end if - dirty word

    } // end if - check inputStr    
  } 

  private inputStrPrev:string="";
  onKeyup(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nickname / onKeyup / init");

    let inputStr:string = element.value;

    if(null == inputStr || "" == inputStr) {
      if(isDebug) console.log("nickname / onKeyup / 중단 / inputStr is not valid!");
      return;
    }
    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.inputStrPrev === inputStr) {
      if(isDebug) console.log("nickname / onKeyup / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }
    this.inputStrPrev = inputStr;

    let regExpNotAllowed:RegExp = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z0-9 ]/gi;

    // 한글이 아닌 문자에 대해서 삭제 처리
    let matchArr:RegExpMatchArray = inputStr.match(regExpNotAllowed);
    if(null != matchArr && 0 < matchArr.length) {
      for (var i = 0; i < matchArr.length; ++i) {
        let match:string = matchArr[i];
        if(null == match || "" == match) {
          continue;
        }

        inputStr = inputStr.replace(match, "");
      } // end for

      // 사용자에게 영문, 숫자, 한글이 아닌 글자에 대해 삭제한 것을 메시지로 노출합니다.
      // wonder.jung
      this.tooltipHeadMsg = this.tooltipHeadRemoved;
      this.hideTooltip(2);

      if(isDebug) console.log("nickname / onKeyup / 한글이 아닌 문자에 대해서 삭제 처리 / matchArr : ",matchArr);
    } // end if

    // 2칸 이상 공백에 대해 1칸으로 줄임.
    let regExpEmptySpaces:RegExp = /[\s]{2,10}/gi;
    let matchArrEmptySpaces:RegExpMatchArray = inputStr.match(regExpEmptySpaces);
    if(null != matchArrEmptySpaces && 0 < matchArrEmptySpaces.length) {
      
      for (var i = 0; i < matchArrEmptySpaces.length; ++i) {
        let match:string = matchArrEmptySpaces[i];
        if(null == match || "" == match) {
          continue;
        }

        inputStr = inputStr.replace(match, " ");
      }      

      // 공백 삭제에 대해 사용자에게 메시지로 알려줍니다.
      // wonder.jung
      this.tooltipHeadMsg = this.tooltipHeadRemovedEmpties;
      this.hideTooltip(2);
    }    

    // 최대 길이 제한 검사
    let isOK:boolean = this.isOK(inputStr);
    if(!isOK) {

      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();
      if(null != history && null != history.key && null != history.msg) {
        // Do something..
        if("max" === history.key) {

          // 최대 문자 갯수보다 많은 경우.
          this.tooltipHeadMsg = history.msg;
          this.hideTooltip(2);

          // 넘는 문자열은 지웁니다.
          element.value = inputStr = inputStr.slice(0, history.value);
          this.isSuccessInput = false;

          if(isDebug) console.log("nickname / onKeyup / 최대 문자 갯수보다 많은 경우. / history : ",history);
        } // end if
      } // end if
    } // end if

    element.value = this.inputStrPrev = inputStr;
  }   

  hideTooltip(sec:number) :void {

    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipHeadMsg = null;
    }, 1000 * sec);        

  }

  hideTooltipNow() :void {
    this.tooltipHeadMsg = null;
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