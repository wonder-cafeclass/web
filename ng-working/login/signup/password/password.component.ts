import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';

@Component({
  moduleId: module.id,
  selector: 'password',
  templateUrl: 'password.component.html',
  styleUrls: [ 'password.component.css' ]
})
export class PasswordComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() myCheckerService:MyCheckerService = null;

  isFocusPassword:boolean=false;
  isFocusInfo:boolean=false;

  isFocusRepassword:boolean=false;

  password:string="";
  repassword:string="";

  isValidPassword:boolean = false;
  tooltipHeadMsg:string=null;
  tooltipHeadNotAllowed:string="패스워드에 문제가 있습니다.";
  tooltipHeadAllowed:string="성공! 패스워드가 완벽합니다.";

  isValidRepassword:boolean = false;
  tooltipTailMsg:string=null;
  tooltipTailInit:string="입력한 패스워드를 확인해볼께요.";
  tooltipTailNotMatch:string="패스워드가 일치하지 않습니다!";
  tooltipTailMatched:string="성공! 패스워드가 정확히 일치합니다.";

  // 패스워드 입력 기준 (네이버)
  // 6~16 characters with letters(a-z), numbers, and special letters.

  myChecker:MyChecker;

  constructor() {}

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

    if(null == this.myCheckerService) {
      return;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
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

  private passwordPrev:string="";
  onBlurPassword(event, element, elementNext) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;    

    if(null == this.myCheckerService) {
      if(isDebug) console.log("password / onBlurPassword / 중단 / null == this.myCheckerService");
      return;
    }

    this.password = element.value;

    // REMOVE ME
    // 내용이 동일하다면 중단합니다.
    /*
    if(null != this.passwordPrev && this.passwordPrev === this.password) {
      if(isDebug) console.log("password / onBlurPassword / 중단 / 내용이 동일하다면 중단합니다.");
      this.isFocusPassword = false;
      return;
    }
    this.passwordPrev = this.password;
    */

    if(this.isFocusPassword) {
      this.isFocusPassword = false;
    } // end if

    // 패스워드를 검사합니다.
    if(null != this.password && "" != this.password) {
      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
      let isOK:boolean = this.isOK(this.password);

      if(!isOK) {
        // 패스워드에 문제가 있습니다.
        // 원인을 찾아봅니다.
        let history = this.myCheckerService.getLastHistory();
        if(isDebug) console.log("password / onBlurPassword / history : ",history);

        if(null != history && null != history.key && null != history.msg) {
          if("min" === history.key) {
            // 최소 문자 갯수보다 적은 경우.
            this.tooltipHeadMsg = history.msg;
          } else if("max" === history.key) {
            // 최대 문자 갯수보다 많은 경우.
            this.tooltipHeadMsg = history.msg;
          } else if("regexInclude" === history.key) {
            // 정규표현식에 포함되지 않는 문자열인 경우.
            this.tooltipHeadMsg = history.msg;

            let regExpStr:string = history.value + "";
            let regExpStrSpecialChar:string = /[!@#\\$%\^\&*\)\(+=._-]+/g + "";
            let regExpStrNumbers:string = /[0-9]+/g + "";
            let regExpAlphabet:string = /[a-z]+/g + "";

            if(regExpStr == regExpStrSpecialChar) {
              this.tooltipHeadMsg = "특수문자가 최소 1글자가 있어야 해요.";
            } else if(regExpStr == regExpStrNumbers) {
              this.tooltipHeadMsg = "숫자가 최소 1개 있어야 해요.";
            } else if(regExpStr == regExpAlphabet) {
              this.tooltipHeadMsg = "알파벳 소문자가 최소 1개 있어야 해요.";
            }

          } else {
            // 이에 해당되지 않는 예외 실패.
            this.tooltipHeadMsg = this.tooltipHeadNotAllowed;
          }
        }
        
        this.isFocusPassword = true;
        element.focus();

      } else {
        // 패스워드가 정상입니다. 재입력 창으로 안내합니다.
        // 패스워드 재입력을 알려줘야 합니다.
        this.showRepassword(elementNext, this.tooltipTailInit);

        // 입력 성공을 유저에게 알립니다.
        this.tooltipHeadMsg = this.tooltipHeadAllowed;
        this.isValidPassword = true;
        this.isFocusPassword = false;

        this.hideTooltipHead(2);

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
      _self.isValidPassword = false;
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
      _self.isValidRepassword = false;
    }, 1000 * sec);        

  }      

  onKeyupPassword(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;    

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
            console.log("password / onKeyupPassword / history : ",history);
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

  showRepassword(element, msgWarning:string) {

    if(null == element) {
      return;
    }

    element.focus();
    this.isFocusRepassword = true;
    this.tooltipTailMsg = msgWarning;
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

  onClickRepassword(event, element, elementPassword) :void {

    event.stopPropagation();
    event.preventDefault();

    // password가 입력되지 않았다면, 패스워드 입력을 먼저 하도록 합니다.
    // password 입력창으로 포커스를 이동시킵니다.
    if(null == this.password || "" == this.password) {
      if(null != element) {
        // 패스워드 재입력 창도 공백이 되어야 합니다.
        element.value = "";
        // 패스워드 재입력 창의 포커싱을 지웁니다.
        element.blur();
      }
      if(null != elementPassword) {
        // 패스워드 입력창에 포커싱을 줍니다.
        elementPassword.focus();
        this.isFocusPassword = true;
      }

      // 패스워드를 먼저 입력해야 한다고 유저에게 알립니다.
      this.tooltipHeadMsg = "먼저 비밀번호를 입력해주세요.";
      this.isValidPassword = false;

      this.hideTooltipHead(2);

      return;
    }

    if(!this.isFocusRepassword) {
      this.isFocusRepassword = true;      
    } // end if

    this.repassword = element.value;
  } 

  private repasswordPrev:string="";
  onKeyupRepassword(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

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

  onBlurRepassword(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    this.repassword = element.value;

    // let isDebug:boolean = true;
    let isDebug:boolean = false;    

    // 비어있는 문자열이라면 검사하지 않습니다.
    if(null == this.repassword || "" == this.repassword) {
      if(isDebug) console.log("repassword / onKeyup / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return;
    }

    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.repasswordPrev === this.repassword) {
      if(isDebug) console.log("repassword / onKeyup / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }

    if(this.isFocusRepassword) {
      this.isFocusRepassword = false;
    } // end if

    if( null != this.password && 
        "" != this.password &&
        null != this.repassword && 
        "" != this.repassword ) {

      // 1. 패스워드와 재입력 패스워드를 비교합니다.
      if(this.password != this.repassword) {

        // 1-1. 처음 입력한 패스워드와 재확인 패스워드가 다를 경우.
        this.showRepassword(element, this.tooltipTailNotMatch);
        this.isValidRepassword = false;

      } else {

        // 1-2. 성공! 똑같은 패스워드를 입력했습니다.
        this.tooltipTailMsg = this.tooltipTailMatched;
        this.isValidRepassword = true;

        this.hideTooltipTail(2);

      }
    } // end if

    // 최종 패스워드 재입력을 업데이트합니다.
    element.value = this.repasswordPrev = this.repassword;

  } // end method

}
