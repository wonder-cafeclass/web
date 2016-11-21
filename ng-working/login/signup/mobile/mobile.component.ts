import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyLoggerService }      from '../../../util/service/my-logger.service';
import { MyChecker }            from '../../../util/model/my-checker';

@Component({
  moduleId: module.id,
  selector: 'mobile',
  templateUrl: 'mobile.component.html',
  styleUrls: [ 'mobile.component.css' ]
})
export class MobileComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() myCheckerService:MyCheckerService = null;

  isSuccessHeadInput:boolean=false;
  isSuccessBodyInput:boolean=false;
  isSuccessTailInput:boolean=false;

  tooltipHeadMsg:string=null;
  tooltipBodyMsg:string=null;
  tooltipTailMsg:string=null;

  tooltipHeadNotAllowed:string="전화번호에 문제가 있습니다.";
  tooltipHeadAllowed:string="성공! 전화번호에 문제가 없습니다.";

  myCheckerMobileHead:MyChecker;
  myCheckerMobileBody:MyChecker;
  myCheckerMobileTail:MyChecker;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isFocusMobileHead:boolean=false;
  isFocusMobileBody:boolean=false;
  isFocusMobileTail:boolean=false;
  isFocusMobileInfo:boolean=false;  

  constructor(private myLoggerService:MyLoggerService) {}

  ngOnInit(): void {}

  private setMyChecker() :void {
    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myCheckerMobileHead) {
      this.myCheckerMobileHead = this.myCheckerService.getMyChecker("user_mobile_kor_head");
      console.log("mobile / this.myCheckerMobileHead : ",this.myCheckerMobileHead);
    }
    if(null == this.myCheckerMobileBody) {
      this.myCheckerMobileBody = this.myCheckerService.getMyChecker("user_mobile_kor_body");
      console.log("mobile / this.myCheckerMobileBody : ",this.myCheckerMobileBody);
    }
    if(null == this.myCheckerMobileTail) {
      this.myCheckerMobileTail = this.myCheckerService.getMyChecker("user_mobile_kor_tail");
      console.log("mobile / this.myCheckerMobileTail : ",this.myCheckerMobileTail);
    }    
  }
  isOKHead(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerMobileHead, input);
  }
  isOKBody(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerMobileBody, input);
  }
  isOKTail(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myCheckerMobileTail, input);
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

  onClickMobileHead(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusMobileHead) {
      this.isFocusMobileHead = true;      
    } // end if

    this.setMyChecker();
  }

  onKeyupHead(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      return;
    } 
    
    // 숫자가 아닌 글자들은 모두 삭제해준다.
    element.value = inputStr.replace(/[^0-9]/gi,"");

    // 툴팁을 보여줍니다.
    if(element.value != inputStr) {
      this.tooltipHeadMsg = "숫자만 가능합니다.";
      this.isFocusMobileHead = true;
      this.isSuccessHeadInput = false;
      element.focus();
      this.hideTooltipHead(2, element);
    }    
  }

  onBlurMobileHead(event, element, elementNext) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusMobileHead) {
      this.isFocusMobileHead = false;
    } // end if

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      return;
    }

    let isOK:boolean = this.isOKHead(inputStr);
    if(!isOK) {

      // 조건에 맞지 않습니다.
      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();

      if( null != history && 
          null != history.key && 
          null != history.msg ) {

        history.value;

        if("regexInclude" === history.key) {

            let regExpStr:string = history.value + "";
            let regExpStrInputStrRange:string =  /^01[0-9]$/g + "";

            if(regExpStr == regExpStrInputStrRange) {
              this.tooltipHeadMsg = "휴대전화 번호를 다시 확인해주세요.";
              this.isFocusMobileHead = true;
              this.isSuccessHeadInput = false;
              element.focus();

              // 숫자가 아닌 글자들은 모두 삭제해준다.
              element.value = inputStr = inputStr.replace(/[^0-9]/gi,"");              
            }
        }

      } // end inner if
    } else {
      // 성공! 정상적인 입력입니다.

      this.tooltipHeadMsg = this.tooltipHeadAllowed;
      this.isFocusMobileHead = false;
      this.isSuccessHeadInput = true;

      this.hideTooltipHead(2, element);



      if(null != elementNext && !this.isSuccessBodyInput) {
        elementNext.focus();
      }

    }// end if

  } 

  hideTooltipHead(sec:number, element) :void {

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

  hideTooltipBody(sec:number, element) :void {

    if(null == element) {
      return;
    }

    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipBodyMsg = null;
    }, 1000 * sec);        

  }   

  hideTooltipTail(sec:number, element) :void {

    if(null == element) {
      return;
    }

    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipTailMsg = null;
    }, 1000 * sec);        

  }   

  onClickMobileBody(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusMobileBody) {
      this.isFocusMobileBody = true;      
    } // end if

    this.setMyChecker();
  }

  onKeyupBody(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      return;
    } 
    
    // 숫자가 아닌 글자들은 모두 삭제해준다.
    element.value = inputStr.replace(/[^0-9]/gi,"");

    // 툴팁을 보여줍니다.
    if(element.value != inputStr) {
      this.tooltipBodyMsg = "숫자만 가능합니다.";
      this.isFocusMobileBody = true;
      this.isSuccessBodyInput = false;
      element.focus();
      this.hideTooltipBody(2, element);
    }

  }   

  onBlurMobileBody(event, element, elementNext) :void {

    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusMobileBody) {
      this.isFocusMobileBody = false;
    } // end if

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      return;
    }

    let isOK:boolean = this.isOKBody(inputStr);

    if(!isOK) {

      // 조건에 맞지 않습니다.
      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();

      if( null != history && 
          null != history.key && 
          null != history.msg ) {

        //min
        if("min" === history.key) {

          this.tooltipBodyMsg = history.msg;
          this.isFocusMobileBody = true;
          this.isSuccessBodyInput = false;
          element.focus();

        } else if("max" === history.key) {

          this.tooltipBodyMsg = history.msg;
          this.isFocusMobileBody = true;
          this.isSuccessBodyInput = false;
          element.focus();


        } else if("regexInclude" === history.key) {

          let regExpStr:string = history.value + "";
          let regExpStrInputStrRange:string = /^[0-9]{3,4}$/g + "";

          if(regExpStr == regExpStrInputStrRange) {
            this.tooltipBodyMsg = "휴대전화 번호를 다시 확인해주세요.";
            this.isFocusMobileBody = true;
            this.isSuccessBodyInput = false;
            element.focus();

            // 숫자가 아닌 글자들은 모두 삭제해준다.
            element.value = inputStr = inputStr.replace(/[^0-9]/gi,"");

          }
        }

      } // end inner if
    } else {
      // 성공! 정상적인 입력입니다.

      console.log("TEST / 성공! 정상적인 입력입니다.");

      this.tooltipBodyMsg = this.tooltipHeadAllowed;
      this.isFocusMobileBody = false;
      this.isSuccessBodyInput = true;

      this.hideTooltipBody(2, element);

      if(null != elementNext && !this.isSuccessTailInput) {
        elementNext.focus();
      }


    }// end if   

  }  

  onClickMobileTail(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusMobileTail) {
      this.isFocusMobileTail = true;      
    } // end if

    this.setMyChecker();
  }

  onKeyupTail(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      return;
    } 
    
    // 숫자가 아닌 글자들은 모두 삭제해준다.
    element.value = inputStr.replace(/[^0-9]/gi,"");

    // 툴팁을 보여줍니다.
    if(element.value != inputStr) {
      this.tooltipTailMsg = "숫자만 가능합니다.";
      this.isFocusMobileTail = true;
      this.isSuccessTailInput = false;
      element.focus();
      this.hideTooltipTail(2, element);
    }
  }   

  onBlurMobileTail(event, element, elementNext) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusMobileTail) {
      this.isFocusMobileTail = false;
    } // end if

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      return;
    }

    let isOK:boolean = this.isOKTail(inputStr);
    if(!isOK) {

      // 조건에 맞지 않습니다.
      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();

      if( null != history && 
          null != history.key && 
          null != history.msg ) {

        //min
        if("min" === history.key) {

          this.tooltipTailMsg = history.msg;
          this.isFocusMobileTail = true;
          this.isSuccessTailInput = false;
          element.focus();

        } else if("max" === history.key) {

          this.tooltipTailMsg = history.msg;
          this.isFocusMobileTail = true;
          this.isSuccessTailInput = false;
          element.focus();


        } else if("regexInclude" === history.key) {

          let regExpStr:string = history.value + "";
          let regExpStrInputStrRange:string = /^[0-9]{3,4}$/g + "";

          if(regExpStr == regExpStrInputStrRange) {
            this.tooltipTailMsg = "휴대전화 번호를 다시 확인해주세요.";
            this.isFocusMobileTail = true;
            this.isSuccessTailInput = false;
            element.focus();

            // 숫자가 아닌 글자들은 모두 삭제해준다.
            element.value = inputStr = inputStr.replace(/[^0-9]/gi,"");

          }
        }

      } // end inner if
    } else {
      // 성공! 정상적인 입력입니다.
      this.tooltipTailMsg = this.tooltipHeadAllowed;
      this.isFocusMobileTail = false;
      this.isSuccessTailInput = true;

      this.hideTooltipTail(2, element);

      if(null != elementNext) {
        elementNext.focus();
      } // end if
    } // end if 
  } // end method
} // end class
