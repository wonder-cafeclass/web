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

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isFocusRepassword:boolean=false;

  password:string="";
  repassword:string="";

  isValidPassword:boolean = false;
  tooltipHeadMsg:string=null;
  tooltipHeadNotAllowed:string="패스워드에 문제가 있습니다.";
  tooltipHeadAllowed:string="성공! 패스워드가 완벽합니다.";

  isSuccessInput:boolean = false;
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

  onClick(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

    this.password = element.value;

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
  } 

  onBlur(event, element, elementNext) :void {

    event.stopPropagation();
    event.preventDefault();

    if(null == this.myCheckerService) {
      return;
    }

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    this.password = element.value;

    // 패스워드를 검사합니다.
    if(null != this.password && "" != this.password) {
      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
      let isOK:boolean = this.isOK(this.password);

      if(!isOK) {
        // 패스워드에 문제가 있습니다.
        // wonder.jung

        // 원인을 찾아봅니다.
        let history = this.myCheckerService.getLastHistory();
        console.log("password / onBlur / history : ",history);

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

            console.log("TEST / history.value : ",history.value);

            let regExpStr:string = history.value + "";
            let regExpStrSpecialChar:string = /[!@#\\$%\^\&*\)\(+=._-]+/ + "";
            let regExpStrNumbers:string = /[0-9]+/ + "";
            let regExpAlphabet:string = /[a-z]+/ + "";

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
        
        this.isFocus = true;
        element.focus();

      } else {
        // 패스워드가 정상입니다. 재입력 창으로 안내합니다.
        // 패스워드 재입력을 알려줘야 합니다.
        this.showRepassword(elementNext, this.tooltipTailInit);

        // 입력 성공을 유저에게 알립니다.
        this.tooltipHeadMsg = this.tooltipHeadAllowed;
        this.isValidPassword = true;

        let _self = this;
        setTimeout(function() {
          // 성공 안내메시지를 3초 뒤에 화면에서 지웁니다.
          _self.tooltipHeadMsg = null;
          _self.isValidPassword = false;
        }, 2500);        

      } // end if
    } // end if
  }  

  onKeyup(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(null == this.myCheckerService) {
      return;
    }

    // 입력 글자수가 최대글자수를 넘지 않았는지 검사합니다.
    // 모든 영문을 소문자로 고정 변경.
    this.password = element.value.toLowerCase();

    // 패스워드를 검사합니다.
    if(null != this.password && "" != this.password) {
      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
      let isOK:boolean = this.isOK(this.password);

      if(!isOK) {
        // 패스워드에 문제가 있습니다.
        // wonder.jung

        // 원인을 찾아봅니다.
        let history = this.myCheckerService.getLastHistory();

        if( null != history && 
            null != history.key && 
            null != history.msg && 
            null != history.value) {

          if("max" === history.key) {
            console.log("password / onKeyup / history : ",history);
            // 최대 문자 갯수보다 많은 경우.
            this.tooltipHeadMsg = history.msg;
            // 글자수를 줄여줍니다.
            let max:number = history.value;
            element.value = this.password = this.password.slice(0, max);
          }
        }
        
        this.isFocus = true;
        element.focus();
      } // end inner if
    } // end outer if
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

  onClickRepassword(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusRepassword) {
      this.isFocusRepassword = true;      
    } // end if

    this.repassword = element.value;
  } 

  onBlurRepassword(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusRepassword) {
      this.isFocusRepassword = false;
    } // end if

    this.repassword = element.value;

    console.log("onBlurRepassword / this.password : ",this.password);
    console.log("onBlurRepassword / this.repassword : ",this.repassword);

    if( null != this.password && 
        "" != this.password &&
        null != this.repassword && 
        "" != this.repassword ) {

      // 1. 패스워드와 재입력 패스워드를 비교합니다.
      if(this.password != this.repassword) {
        // 1-1. 처음 입력한 패스워드와 재확인 패스워드가 다를 경우.

        console.log("TEST / this.tooltipTailNotMatch : ",this.tooltipTailNotMatch);

        this.showRepassword(element, this.tooltipTailNotMatch);
        this.isSuccessInput = false;
      } else {
        // 1-2. 성공! 똑같은 패스워드를 입력했습니다.
        this.tooltipTailMsg = this.tooltipTailMatched;
        this.isSuccessInput = true;
        let _self = this;
        setTimeout(function() {
          // 성공 안내메시지를 3초 뒤에 화면에서 지웁니다.
          _self.tooltipTailMsg = null;
          _self.isSuccessInput = false;
        }, 2500);
      }
    } // end if

  } // end method

}
