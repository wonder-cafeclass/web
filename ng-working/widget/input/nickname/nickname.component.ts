import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit,
          AfterViewInit }       from '@angular/core';

import { MyLoggerService }      from '../../../util/service/my-logger.service';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';

import { MyEventWatchTowerService } from '../../../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'nickname',
  templateUrl: 'nickname.component.html',
  styleUrls: [ 'nickname.component.css' ]
})
export class NicknameComponent implements OnInit, AfterViewInit {

  @Output() emitter = new EventEmitter<MyEvent>();

  private isShowTooltip:boolean=false;
  private isFocus:boolean=false;
  private isValid:boolean=false;

  tooltipMsg:string=null;
  tooltipMsgNotAllowed:string="닉네임에 문제가 있습니다.";
  tooltipMsgAllowed:string="성공! 근사한 닉네임이네요.";
  tooltipMsgRemoved:string="영문, 숫자, 한글이어야 합니다.";
  tooltipMsgRemovedEmpties:string="빈칸을 2칸 이상 입력할 수 없습니다.";

  myChecker:MyChecker;

  private redirectUrl:string="/class-center";
  private apiKey:string;

  constructor(  private myLoggerService:MyLoggerService,
                private myCheckerService:MyCheckerService, 
                private watchTower:MyEventWatchTowerService, 
                private myEventService:MyEventService) {}

  ngOnInit(): void {
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nickname / ngOnInit / init");
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nickname / ngAfterViewInit");

    this.asyncViewPack();

  }
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nickname / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("nickname / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("nickname / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
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
    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_nickname");
    }
  }   

  private init() :void {
    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    this.setMyChecker();
  }

  isOK(input:string) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nickname / isOK / 시작");
    if(isDebug) console.log("nickname / isOK / input : ",input);

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  }
  public setNickname(nickname:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nickname / setNickname / 시작");
    if(isDebug) console.log("nickname / setNickname / nickname : ",nickname);

    if(this.isOK(nickname)) {
      this.inputStrPrev = nickname;
    } else {
      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("nickname / setNickname / history : ",history);
    }
  }

  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {
    return this.isOK(this.inputStrPrev);
  }

  onClick(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

  } 

  onFocus(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nickname / onBlur / 시작");

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
        if(isDebug) console.log("nickname / onBlur / history : ",history);

        if(null != history && null != history.key && null != history.msg) {
          // Do something..
          if("min" === history.key) {

            // 최소 문자 갯수보다 적은 경우.
            this.showTooltipFailWarning(
              // warningMsg:string
              history.msg,
              // isTimeout:boolean
              true
            );

            // REMOVE ME
            // this.tooltipMsg = history.msg;
            // this.isValid = false;

            // 최소 문자 갯수보다 적으므로 부모 객체에게 유효하지 않음을 알립니다.
            // 부모객체는 공백 문자로 업데이트합니다.
            this.emitEventOnChange("");
            return;

          } else if("max" === history.key) {

            // 최대 문자 갯수보다 많은 경우.
            this.showTooltipFailWarning(
              // warningMsg:string
              history.msg,
              // isTimeout:boolean
              true
            );

            // REMOVE ME
            // this.tooltipMsg = history.msg;
            // this.isValid = false;

            // 넘는 문자열은 지웁니다.
            element.value = inputStr = inputStr.slice(0, history.value);


            // 부모객체는 유효한 문자로 업데이트합니다.
            this.emitEventOnChange(inputStr);
            return;

          } else if("regexExclude" === history.key) {

            // 정규표현식에 포함되지 않는 문자열인 경우.
            this.tooltipMsg = history.msg;

            let regExpStr:string = history.value + "";
            let regExpStrInputStrRange:string =  /[^a-zA-Z가-힣0-9 ]+/g + "";

            if(regExpStr == regExpStrInputStrRange) {

              this.showTooltipFailWarning(
                // warningMsg:string
                "이름에 사용할 수 없는 문자가 있어요.",
                // isTimeout:boolean
                true
              );

              // REMOVE ME
              // this.tooltipMsg = "이름에 사용할 수 없는 문자가 있어요.";
              // this.isValid = false;

              let matchArr:string[] = history.matchArr;
              if(null != matchArr && 0 < matchArr.length) {

                for (var i = 0; i < matchArr.length; ++i) {
                  let keywordNotAllowed:string = matchArr[i];
                  // 사용할 수 없는 문자들을 지웁니다.
                  element.value = inputStr = inputStr.replace(keywordNotAllowed, "");
                } // end for


              } // end if

              // 부모객체는 유효한 문자로 업데이트합니다.
              this.emitEventOnChange(inputStr);
              return;

            } // end if

          } else {

            // 이에 해당되지 않는 예외 실패.
            this.showTooltipFailWarning(
              // warningMsg:string
              this.tooltipMsgNotAllowed,
              // isTimeout:boolean
              true
            );

            // REMOVE ME
            // this.tooltipMsg = this.tooltipMsgNotAllowed;
            // this.isValid = false;

            // 부모객체는 공백 문자로 업데이트합니다.
            this.emitEventOnChange("");
            return;

          } // end if
        } // end if
      } // end if - isOK

      // 비속어, 욕설 검사.
      let inputStrAfterSanitize:string = this.sanitizeDirtyWord(inputStr);
      if(null != inputStrAfterSanitize) {

        // 비속어, 욕설이 제거되었습니다. 
        // 사용자에게 금칙어임을 알립니다.

        this.showTooltipFailWarning(
          // warningMsg:string
          "금칙어는 제외됩니다.",
          // isTimeout:boolean
          true
        );
        element.value = inputStr = inputStrAfterSanitize;

        // REMOVE ME
        // this.tooltipMsg = "금칙어는 제외됩니다.";
        // element.value = inputStr;
        // this.hideTooltip(2);
        // this.isValid = false;

        // Logger - Spam 행위로 등록.
        this.myLoggerService.logActionDirtyWord(
          // apiKey:string
          this.watchTower.getApiKey(),
          // dirtyWord:string
          inputStr
        );

        return;

      }

      // 입력한 문자열에 문제가 없습니다.
      // 경고창을 가립니다.
      this.hideWarningTooptip();

      // 부모 객체에게 Change Event 발송 
      this.emitEventOnChange(inputStr);

      // REMOVE ME
      /*
      let inputStrBeforeSanitize:string = inputStr;
      inputStr = this.myCheckerService.sanitizeDirtyWord(inputStr);

      if(inputStrBeforeSanitize != inputStr) {

      } else {

        this.hideWarningTooptip();

        // 부모 객체에게 Change Event 발송 
        this.emitEventOnChange(
          // eventKey:string
          this.myEventService.KEY_USER_NICKNAME,
          // value:string
          name
        );

        return;

      }// end if - dirty word
      */

    } // end if - check inputStr    
  }
  private sanitizeDirtyWord(inputStrBeforeSanitize:string):string {

    if(null == inputStrBeforeSanitize ||"" === inputStrBeforeSanitize) {
      return null;
    }

    let inputStrAfterSanitize:string = this.myCheckerService.sanitizeDirtyWord(inputStrBeforeSanitize);

    if(inputStrBeforeSanitize != inputStrAfterSanitize) {
      return inputStrAfterSanitize;
    } // end if - dirty word

    return null;
  } 

  public inputStrPrev:string="";
  onKeyup(event, element) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
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
      this.showTooltipFailWarning(
        // warningMsg:string
        this.tooltipMsgRemoved,
        // isTimeout:boolean
        true
      );

      if(isDebug) console.log("nickname / onKeyup / 한글이 아닌 문자에 대해서 삭제 처리 / matchArr : ",matchArr);

      element.value = this.inputStrPrev = inputStr;

      // 부모 객체에게 Change Event 발송 
      this.emitEventOnChange(inputStr);

      return;
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
      this.showTooltipFailWarning(
        // warningMsg:string
        this.tooltipMsgRemovedEmpties,
        // isTimeout:boolean
        true
      );

      element.value = this.inputStrPrev = inputStr;

      // 부모 객체에게 Change Event 발송 
      this.emitEventOnChange(inputStr);
      return;
    }    

    // 최대 길이 제한 검사
    let isOK:boolean = this.isOK(inputStr);
    if(!isOK) {

      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();
      if(null != history && null != history.key && null != history.msg) {
        // Do something..
        if("max" === history.key) {

          if(isDebug) console.log("nickname / onKeyup / 최대 문자 갯수보다 많은 경우. / history : ",history);

          // 최대 문자 갯수보다 많은 경우, 사용자에게 알림.
          this.showTooltipFailWarning(
            // warningMsg:string
            history.msg,
            // isTimeout:boolean
            true
          );

          // 넘는 문자열은 지웁니다.
          element.value = inputStr = inputStr.slice(0, history.value);

          // 부모 객체에게 Change Event 발송 
          this.emitEventOnChange(inputStr);
          return;
          
        } // end if
      } // end if
    } else {

      // 입력된 문자열에 문제가 없습니다. 경고창을 띄웠다면 내립니다.
      if(isDebug) console.log("nickname / onKeyup / 입력된 문자열에 문제가 없습니다. 경고창을 띄웠다면 내립니다.");
      this.hideWarningTooptip();

      // 변경된 문자열을 업데이트합니다.
      element.value = this.inputStrPrev = inputStr;

      // 부모 객체에게 안전한 이름 문자열을 전달합니다.
      this.emitEventOnChange(inputStr);

      return;

    } // end if
    
  } // end method - onKeyup

  private emitEventOnChange(value:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("name / emitEventOnChange / 시작");

    if("" != value && !this.isOK(value)) {
      // 공백 문자는 허용됩니다.
      // 공백이 아닌 나머지 문자열에 대해서 유효하지 않으면 공백 문자열로 바꿉니다.
      value = "";
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      this.myEventService.KEY_USER_NICKNAME,
      // public value:string
      value,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("name / emitEventOnChange / Done!");

  }  
  
  // @ Desc : 실패 툴팁을 보여줍니다.
  showTooltipFailWarning(warningMsg:string, isTimeout:boolean) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;    
    if(isDebug) console.log("nickname / showTooltipFailWarning / init");
    if(isDebug) console.log("nickname / showTooltipFailWarning / warningMsg : ",warningMsg);

    this.isShowTooltip = true;
    this.isFocus = true;
    this.isValid = false;
    this.tooltipMsg = warningMsg;

    if(isDebug) console.log("nickname / showTooltipFailWarning / this.isShowTooltip : ",this.isShowTooltip);

    if(null != isTimeout && isTimeout) {
      if(isDebug) console.log("nickname / showTooltipFailWarning / this.hideTooltipHead(2)");
      this.hideTooltip(2);
    } // end if
  }  
  hideWarningTooptip() :void {
    this.tooltipMsg = null;
    this.isShowTooltip = false;
  }
  private hideTooltip(sec:number) :void {

    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 지정된 시간 뒤에 화면에서 지웁니다.
      _self.hideWarningTooptip();
    }, 1000 * sec);        

  }  

  // REMOVE ME

  // REMOVE ME
  // @Input() top:number=-1;
  // @Input() left:number=-1;
  // @Input() topWarning:number=-1;
  // @Input() leftWarning:number=-1;
  // isWarning:boolean=false;

  /*
  // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
  public showWarning() :void {
    this.isFocus = true;
    this.isValid = false;
    this.tooltipMsg = this.tooltipMsgNotAllowed;
  } 
  hideTooltipNow() :void {
    this.isShowTooltip = false;
  }  
  */
}