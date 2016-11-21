import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyLoggerService }     from '../../../util/service/my-logger.service';
import { MyChecker }            from '../../../util/model/my-checker';


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

  isSuccessInput:boolean=false;
  tooltipHeadMsg:string=null;
  tooltipHeadNotAllowed:string="닉네임에 문제가 있습니다.";
  tooltipHeadAllowed:string="성공! 근사한 닉네임이네요.";

  myChecker:MyChecker;  

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

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
        // console.log("password / onBlur / history : ",history);

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

        this.hideTooltop(3, element);

        // Logger - Spam 행위로 등록.
        this.myLoggerService.logActionDirtyWord(inputStrBeforeSanitize);

        this.isSuccessInput = false;
        return;

      } else {

        this.tooltipHeadMsg = this.tooltipHeadAllowed;
        this.isSuccessInput = true;

        this.hideTooltop(3, element);

        return;

      }// end if - dirty word

    } // end if - check inputStr    
  }  

  hideTooltop(sec:number, element) :void {

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
      element.focus();
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
