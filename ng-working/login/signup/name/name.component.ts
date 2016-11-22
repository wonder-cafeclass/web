import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyLoggerService }     from '../../../util/service/my-logger.service';
import { MyChecker }            from '../../../util/model/my-checker';

@Component({
  moduleId: module.id,
  selector: 'name',
  templateUrl: 'name.component.html',
  styleUrls: [ 'name.component.css' ]
})
export class NameComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() myCheckerService:MyCheckerService = null;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isSuccessInput:boolean=false;
  tooltipHeadMsg:string=null;
  tooltipHeadNotAllowed:string="이름에 문제가 있습니다.";
  tooltipHeadAllowed:string="성공! 멋진 이름이네요.";

  myChecker:MyChecker;

  constructor(private myLoggerService:MyLoggerService) {}

  ngOnInit(): void {}

  private setMyChecker() :void {
    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_name");

      console.log("name / this.myChecker : ",this.myChecker);
    }
  }
  isOK(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
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
    if(!this.isFocus) {
      this.isFocus = true;
    } // end if
  }

  onKeydownTab(event) :void {
    // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
    // 포커싱을 잃습니다.
    this.isFocus = false;
  }  

  onBlur(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    if(null == this.myCheckerService) {
      return;
    }

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    let name:string = element.value;

    // 입력한 이름을 검사합니다.
    // 패스워드를 검사합니다.
    if(null != name && "" != name) {
      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
      let isOK:boolean = this.isOK(name);

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
            element.value = name = name.slice(0, history.value);

            this.isSuccessInput = false;
            return;

          } else if("regexExclude" === history.key) {

            // 정규표현식에 포함되지 않는 문자열인 경우.
            this.tooltipHeadMsg = history.msg;

            let regExpStr:string = history.value + "";
            let regExpStrNameRange:string =  /[^a-zA-Z가-힣0-9 ]+/g + "";

            if(regExpStr == regExpStrNameRange) {
              this.tooltipHeadMsg = "이름에 사용할 수 없는 문자가 있어요.";

              let matchArr:string[] = history.matchArr;
              if(null != matchArr && 0 < matchArr.length) {
                for (var i = 0; i < matchArr.length; ++i) {
                  let keywordNotAllowed:string = matchArr[i];
                  // 사용할 수 없는 문자들을 지웁니다.
                  element.value = name = name.replace(keywordNotAllowed, "");
                } // end for
              } // end if

              this.isSuccessInput = false;
              return;

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
      let nameBeforeSanitize:string = name;
      name = this.myCheckerService.sanitizeDirtyWord(name);

      if(nameBeforeSanitize != name) {
        // 비속어, 욕설이 제거되었습니다. 
        // 사용자에게 금칙어임을 알립니다.
        this.tooltipHeadMsg = "금칙어는 제외됩니다.";
        this.isSuccessInput = false;
        element.value = name;

        this.hideTooltip(2, element);
        element.focus();

        // Logger - Spam 행위로 등록.
        this.myLoggerService.logActionDirtyWord(nameBeforeSanitize);

        return;

      } else {

        // 성공! 비속어가 포함되지 않았습니다.
        this.tooltipHeadMsg = this.tooltipHeadAllowed;
        this.isSuccessInput = true;
        element.value = name;

        this.hideTooltip(2, element);

      } // end if - dirty word

      // 마지막 공백 입력이 있다면 공백을 제거해줍니다.
      let regExpLastEmptySpace:RegExp = /[\s]+$/gi;
      element.value = name = name.replace(regExpLastEmptySpace, "");

    } // end if - check Name
  } // end method

  private inputStrPrev:string="";
  onKeyup(event, element) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;

    if(isDebug) console.log("name / onKeyup / init");

    event.stopPropagation();
    event.preventDefault();    

    let inputStr:string = element.value;

    // 비어있는 문자열이라면 검사하지 않습니다.
    if(null == inputStr || "" == inputStr) {
      if(isDebug) console.log("name / onKeyup / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return;
    }

    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.inputStrPrev === inputStr) {
      if(isDebug) console.log("name / onKeyup / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }

    // 한글이 아닌 문자에 대해서 삭제 처리
    let regExpNotAllowed:RegExp = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]/gi;
    let matchArr:RegExpMatchArray = inputStr.match(regExpNotAllowed);
    if(null != matchArr && 0 < matchArr.length) {
      for (var i = 0; i < matchArr.length; ++i) {
        let match:string = matchArr[i];
        if(null == match || "" == match) {
          continue;
        }

        inputStr = inputStr.replace(match, "");
      }
    }

    // 2칸 이상 공백에 대해 1칸으로 줄임.
    let regExpEmptySpaces:RegExp = /[\s]{2,10}/gi;
    let matchArrEmptySpaces:RegExpMatchArray = inputStr.match(regExpEmptySpaces);
    if(null != matchArrEmptySpaces && 0 < matchArrEmptySpaces.length) {
      console.log("TEST / matchArrEmptySpaces : ",matchArrEmptySpaces);
      for (var i = 0; i < matchArrEmptySpaces.length; ++i) {
        let match:string = matchArrEmptySpaces[i];
        if(null == match || "" == match) {
          continue;
        }

        inputStr = inputStr.replace(match, " ");
      }      
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

          // 넘는 문자열은 지웁니다.
          element.value = this.inputStrPrev = inputStr = inputStr.slice(0, history.value);
          this.isSuccessInput = false;

          if(isDebug) console.log("name / onKeyup / 최대 문자 갯수보다 많은 경우. / history : ",history);
        } // end if
      } // end if
    } // end if    

    element.value = this.inputStrPrev = inputStr;
  }

  hideTooltip(sec:number, element) :void {

    if(null == element) {
      return;
    }

    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipHeadMsg = null;
    }, 1000 * sec);        

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
