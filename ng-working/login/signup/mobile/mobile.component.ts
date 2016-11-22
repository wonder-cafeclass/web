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

  private mobileHeadPrev:string = "";
  onClickMobileHead(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusMobileHead) {
      this.isFocusMobileHead = true;      
    } // end if

    this.setMyChecker();

    let inputStr:string = element.value;
    this.mobileHeadPrev = inputStr;
  }

  onFocusMobileHead(event, element) :void {
    this.isFocusMobileHead = true;
    this.setMyChecker();
  }
  onKeydownTabMobileHead(event, element) :void {
    this.isFocusMobileHead = true;
  }
  onKeydownTabShiftMobileHead(event, element) :void {
    this.isFocusMobileHead = true;
  }
  
  onKeyupHead(event, element, elementNext) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;  

    if(isDebug) console.log("mobile / onKeyupHead / init");  

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      if(isDebug) console.log("mobile / onKeyupHead / 중단 / 입력된 내용이 없습니다.");
      return;
    } 

    if(this.mobileHeadPrev === inputStr) {
      // 방향키로 움직이는 경우를 방어
      if(isDebug) console.log("mobile / onKeyupHead / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }

    // 숫자가 아닌 글자들은 모두 삭제해준다.
    let inputStrFiltered:string = inputStr.replace(/[^0-9]/gi,"");
    if(element.value != inputStrFiltered) {
      // 툴팁을 보여줍니다.
      this.tooltipHeadMsg = "숫자만 가능합니다.";
      this.isFocusMobileHead = true;
      this.isSuccessHeadInput = false;
      element.focus();
      this.hideTooltipHead(2);

      if(isDebug) console.log("mobile / onKeyupHead / 숫자가 아닌 글자들은 모두 삭제해준다.");

      inputStr = inputStrFiltered;
    }

    let max:number = this.myCheckerMobileHead.max;
    let isOK:boolean = true;
    if(0 < max && max < inputStr.length) {
      isOK = false;
    }
    if(isDebug) console.log("mobile / onKeyupHead / isOK : ",isOK);
    if(isDebug) console.log("mobile / onKeyupHead / max : ",max);

    if(!isOK) {
      // 최대 길이보다 깁니다.
      this.tooltipHeadMsg = "숫자 3자리를 입력해주세요.";
      this.isFocusMobileHead = true;
      this.isSuccessHeadInput = false;
      element.focus();
      this.hideTooltipHead(2);

      // 마지막으로 입력한 문자를 지웁니다.
      inputStr = inputStr.slice(0, (inputStr.length - 1));

      if(isDebug) console.log("mobile / onKeyupHead / 마지막으로 입력한 문자를 지웁니다.");

    } // end if

    // 전체 필터 검사를 진행합니다.
    isOK = this.isOKHead(inputStr);
    if(!isOK) {

      // 조건에 맞지 않습니다.
      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();

      if( null != history && 
          null != history.key && 
          null != history.msg ) {

        if(isDebug) console.log("mobile / onKeyupHead / 전체 필터 검사 / history : ",history);
        if(isDebug) console.log("mobile / onKeyupHead / 전체 필터 검사 / this.mobileHeadPrev : ",this.mobileHeadPrev);

        if("regexInclude" === history.key) {

            let regExpStr:string = history.value + "";
            let regExpStrInputStrRange:string =  /^01[0-9]$/g + "";

            if(regExpStr == regExpStrInputStrRange) {
              this.tooltipHeadMsg = "휴대전화 형식이 맞지 않습니다.";
              this.isFocusMobileHead = true;
              this.isSuccessHeadInput = false;
              element.focus();

              this.hideTooltipHead(2);

              // 직전 내용으로 롤백.
              inputStr = this.mobileHeadPrev;
              
            }
        }

      } // end inner if
    } else {
      // 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.
      if(isDebug) console.log("mobile / onKeyupHead / 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.");

      this.tooltipHeadMsg = this.tooltipHeadAllowed;
      this.isFocusMobileHead = false;
      this.isSuccessHeadInput = true;

      this.hideTooltipHead(2);

      if(null != elementNext && !this.isSuccessBodyInput) {
        elementNext.focus();
      }


    }



    this.mobileHeadPrev = element.value = inputStr;
  } // end method

  
  onBlurMobileHead(event, element, elementNext) :void {
    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;

    if(isDebug) console.log("mobile / onBlurMobileHead / init");


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

      this.hideTooltipHead(2);

      if(null != elementNext && !this.isSuccessBodyInput) {
        elementNext.focus();
      }

    }// end if

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

  hideTooltipBody(sec:number) :void {

    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 3초 뒤에 화면에서 지웁니다.
      _self.tooltipBodyMsg = null;
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

  private mobileBodyPrev:string = "";
  onClickMobileBody(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusMobileBody) {
      this.isFocusMobileBody = true;      
    } // end if

    this.setMyChecker();

    this.mobileBodyPrev = element.value;
  }

  onFocusMobileBody(event, element) :void {
    this.isFocusMobileBody = true;
    this.setMyChecker();
  }
  onKeydownTabMobileBody(event, element) :void {
    this.isFocusMobileBody = true;
  }
  onKeydownTabShiftMobileBody(event, element) :void {
    this.isFocusMobileBody = true;
  }


  onKeyupBody(event, element, elementNext) :void {

    // wonder.jung

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      if(isDebug) console.log("mobile / onKeyupBody / 중단 / inputStr is not valid!");
      return;
    } 

    if(this.mobileBodyPrev === inputStr) {
      // 방향키로 움직이는 경우를 방어
      if(isDebug) console.log("mobile / onKeyupBody / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
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
      this.hideTooltipBody(2);
    }

    let max:number = this.myCheckerMobileBody.max;
    let isOK:boolean = true;
    if(0 < max && max < inputStr.length) {
      isOK = false;
    }
    if(isDebug) console.log("mobile / onKeyupBody / isOK : ",isOK);
    if(isDebug) console.log("mobile / onKeyupBody / max : ",max);

    if(!isOK) {
      // 최대 길이보다 깁니다.
      this.tooltipBodyMsg = "숫자 3자리를 입력해주세요.";
      this.isFocusMobileBody = true;
      this.isSuccessBodyInput = false;
      element.focus();
      this.hideTooltipBody(2);

      // 마지막으로 입력한 문자를 지웁니다.
      inputStr = inputStr.slice(0, (inputStr.length - 1));

      if(isDebug) console.log("mobile / onKeyupBody / 마지막으로 입력한 문자를 지웁니다.");

    } // end if

    // 전체 필터 검사를 진행합니다.
    isOK = this.isOKBody(inputStr);
    if(!isOK) {

      // 조건에 맞지 않습니다.
      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();

      if( null != history && 
          null != history.key && 
          null != history.msg ) {

        if(isDebug) console.log("mobile / onKeyupBody / 전체 필터 검사 / history : ",history);
        if(isDebug) console.log("mobile / onKeyupBody / 전체 필터 검사 / this.mobileBodyPrev : ",this.mobileBodyPrev);

        if("regexInclude" === history.key) {

            let regExpStr:string = history.value + "";
            let regExpStrInputStrRange:string =  /^01[0-9]$/g + "";

            if(regExpStr == regExpStrInputStrRange) {
              this.tooltipBodyMsg = "휴대전화 형식이 맞지 않습니다.";
              this.isFocusMobileBody = true;
              this.isSuccessBodyInput = false;
              element.focus();

              this.hideTooltipBody(2);

              // 직전 내용으로 롤백.
              inputStr = this.mobileBodyPrev;
              
            }
        }

      } // end inner if
    } else if(max === inputStr.length) {
      // 사용자가 입력한 전화번호가 가장 긴 4자리인 경우, 입력은 완료한 것으로 판단합니다.
      // 모든 조건이 맞습니다. 
      if(isDebug) console.log("mobile / onKeyupBody / 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.");

      this.tooltipBodyMsg = this.tooltipHeadAllowed;
      this.isFocusMobileBody = false;
      this.isSuccessBodyInput = true;

      this.hideTooltipBody(2);

      // 다음 번호 입력창으로 넘어갑니다.
      if(null != elementNext && !this.isSuccessTailInput) {
        elementNext.focus();
        this.isFocusMobileTail = true;
      }
    }    


    this.mobileBodyPrev = element.value = inputStr;
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
      this.tooltipBodyMsg = this.tooltipHeadAllowed;
      this.isFocusMobileBody = false;
      this.isSuccessBodyInput = true;

      this.hideTooltipBody(2);

      if(null != elementNext && !this.isSuccessTailInput) {
        elementNext.focus();
      }


    }// end if   

  }  

  private mobileTailPrev:string = "";
  onClickMobileTail(event, element, elementPrev) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;

    if(isDebug) console.log("mobile / onClickMobileTail / init");

    if(!this.isFocusMobileTail) {
      this.isFocusMobileTail = true;      
    } // end if

    this.setMyChecker();

    this.mobileTailPrev = element.value;

    // 중간 전화번호 입력이 안되어 있다면 중간 전화번호 입력으로 먼저 이동합니다.
    if(null != elementPrev && (null == elementPrev.value || "" === elementPrev.value)) {

      if(isDebug) console.log("mobile / onClickMobileTail / 중간 전화번호 입력이 안되어 있다면 중간 전화번호 입력으로 먼저 이동합니다.");

      this.isFocusMobileTail = false;

      // 사용자에게 안내메시지 노출.
      this.tooltipBodyMsg = "휴대전화 번호를 먼저 확인해주세요.";
      this.isFocusMobileBody = true;
      this.isSuccessBodyInput = false;
      elementPrev.focus();

      this.hideTooltipTail(2);
    }
  }

  onFocusMobileTail(event, element) :void {
    this.isFocusMobileTail = true;
    this.setMyChecker();
  }
  onKeydownTabMobileTail(event, element) :void {
    this.isFocusMobileTail = true;
  }
  onKeydownTabShiftMobileTail(event, element) :void {
    this.isFocusMobileTail = true;
  }
  
  

  onKeyupTail(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    // wonder.jung

    // let isDebug:boolean = true;
    let isDebug:boolean = false;    

    let inputStr:string = element.value;
    if(null == inputStr || "" == inputStr) {
      if(isDebug) console.log("mobile / onKeyupTail / 중단 / inputStr is not valid!");
      return;
    } 

    if(this.mobileTailPrev === inputStr) {
      // 방향키로 움직이는 경우를 방어
      if(isDebug) console.log("mobile / onKeyupTail / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
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
      this.hideTooltipTail(2);
    }

    let max:number = this.myCheckerMobileTail.max;
    let isOK:boolean = true;
    if(0 < max && max < inputStr.length) {
      isOK = false;
    }
    if(isDebug) console.log("mobile / onKeyupTail / isOK : ",isOK);
    if(isDebug) console.log("mobile / onKeyupTail / max : ",max);

    if(!isOK) {
      // 최대 길이보다 깁니다.
      this.tooltipTailMsg = "숫자 3자리를 입력해주세요.";
      this.isFocusMobileTail = true;
      this.isSuccessTailInput = false;
      element.focus();
      this.hideTooltipTail(2);

      // 마지막으로 입력한 문자를 지웁니다.
      inputStr = inputStr.slice(0, (inputStr.length - 1));

      if(isDebug) console.log("mobile / onKeyupTail / 마지막으로 입력한 문자를 지웁니다.");

    } // end if

    // 전체 필터 검사를 진행합니다.
    isOK = this.isOKTail(inputStr);
    if(!isOK) {

      // 조건에 맞지 않습니다.
      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();

      if( null != history && 
          null != history.key && 
          null != history.msg ) {

        if(isDebug) console.log("mobile / onKeyupTail / 전체 필터 검사 / history : ",history);
        if(isDebug) console.log("mobile / onKeyupTail / 전체 필터 검사 / this.mobileTailPrev : ",this.mobileTailPrev);

        if("regexInclude" === history.key) {

            let regExpStr:string = history.value + "";
            let regExpStrInputStrRange:string =  /^01[0-9]$/g + "";

            if(regExpStr == regExpStrInputStrRange) {
              this.tooltipTailMsg = "휴대전화 형식이 맞지 않습니다.";
              this.isFocusMobileTail = true;
              this.isSuccessTailInput = false;
              element.focus();

              this.hideTooltipTail(2);

              // 직전 내용으로 롤백.
              inputStr = this.mobileTailPrev;
              
            }
        }

      } // end inner if
    } else if(max === inputStr.length) {
      // 사용자가 입력한 전화번호가 가장 긴 4자리인 경우, 입력은 완료한 것으로 판단합니다.
      // 모든 조건이 맞습니다. 
      if(isDebug) console.log("mobile / onKeyupTail / 모든 조건이 맞습니다. 전화번호 입력을 종료합니다.");

      this.tooltipTailMsg = this.tooltipHeadAllowed;
      this.isFocusMobileTail = false;
      this.isSuccessTailInput = true;

      this.hideTooltipTail(2);

      element.blur();
    }    


    this.mobileBodyPrev = element.value = inputStr;    
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

      this.hideTooltipTail(2);

      if(null != elementNext) {
        elementNext.focus();
      } // end if
    } // end if 
  } // end method
} // end class
