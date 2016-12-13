import {  Component, 
          Input, 
          Output,
          EventEmitter,          
          OnInit,
          AfterViewInit }       from '@angular/core';

import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';

import { DefaultMeta }              from '../../../widget/input/default/model/default-meta';

import { MyEventWatchTowerService } from '../../../util/service/my-event-watchtower.service';


@Component({
  moduleId: module.id,
  selector: 'widget-input-default',
  templateUrl: 'default.component.html',
  styleUrls: [ 'default.component.css' ]
})
export class DefaultComponent implements OnInit, AfterViewInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  ngModelInput:string;
  private inputStrPrev:string="";
  private tooltipMsg:string=null;
  private isShowTooltip:boolean=false;
  private isFocus:boolean=false;
  private isValid:boolean=true;
  private myChecker:MyChecker;

  // @ User Custom
  @Input() meta:DefaultMeta;
  @Input() isDisabled:boolean=false;

  constructor(  private myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService  ) {

    // set default meta
    this.meta = 
    new DefaultMeta(
      // public title:string
      "No Title",
      // public placeholder:string
      "No PlaceHolder",
      // public eventKey:string
      "",
      // public checkerKey:string
      "",
      // public type:string
      ""
    );
  } // end constructor

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / ngAfterViewInit");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("default / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("default / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker(this.meta.checkerKey);
      if(isDebug) console.log("default / setMyChecker / this.myChecker : ",this.myChecker);
    }
  }
  private init() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // checker를 설정합니다.
    this.setMyChecker();
  }
  public isNotOK(input:string) :boolean {
    return !this.isOK(input);
  }
  public isOK(input:string) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / isOK / 시작");

    if(null == this.myCheckerService) {
      if(isDebug) console.log("default / isOK / 중단 / null == this.myCheckerService");
      return false;
    }

    let isOK:boolean = this.myCheckerService.isOK(this.myChecker, input);
    if(isDebug) console.log("default / isOK / isOK : ",isOK);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("default / isOK / history : ",history);
    }

    return isOK;
  }
  public getLastHistory() :any {
    if(null == this.myCheckerService) {
      return null;
    }
    return this.myCheckerService.getLastHistory();
  }
  public getErrorMsg() :string {
    if(null == this.myCheckerService) {
      return null;
    }
    let history = this.myCheckerService.getLastHistory();
    if(null != history && null != history["msg"]) {
      return history["msg"];
    }
    return "";
  }
  setInput(input:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / setInput / 시작");
    if(isDebug) console.log("default / setInput / input : ",input);

    if(this.isOK(input)) {
      if(isDebug) console.log("default / setInput / updated!");
      this.ngModelInput = this.inputStrPrev = input;
    }
  }
  public initInput() :void {
    this.ngModelInput="";
    this.inputStrPrev="";
  }
  public getInput() :string {
    return this.ngModelInput;
  }  
  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / hasDone / 시작");
    if(isDebug) console.log("default / hasDone / this.inputStrPrev : ",this.inputStrPrev);
    if(isDebug) console.log("default / hasDone / this.ngModelInput : ",this.ngModelInput);

    let isOK:boolean = this.isOK(this.inputStrPrev);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("default / hasDone / history : ",history);
    }

    return isOK;
  }

  onClick(event, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;
    } // end if
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

  onBlur(event, elementInput) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / onBlur / 시작");

    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    let inputStr:string = elementInput.value;

    let isValidInput:boolean = this.onCheckInputValid(inputStr, true);
    if(isDebug) console.log("default / onBlur / isValidInput : ",isValidInput);

    if(isValidInput) {
      if(isDebug) console.log("default / onBlur / 입력이 문제없습니다.");
      this.hideWarningTooptip();
    } else {
      // 포커싱을 잃었으므로 사용자가 입력을 완료했다고 판단합니다. 
      // 그 결과에 문제가 있으므로 부모 객체에게 실패원인을 전달합니다.
      // 이벤트 키는 SUBMIT입니다.

    }

  } // end method

  private emitEventOnSubmit(value:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / emitEventOnChange / 시작");
    if(null == value) {
      if(isDebug) console.log("default / emitEventOnChange / 중단 / value is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_SUBMIT,
      // public key:string
      this.meta.eventKey,
      // public value:string
      value,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("default / emitEventOnChange / Done!");

  }  

  private emitEventOnChange(value:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / emitEventOnChange / 시작");
    if(null == value) {
      if(isDebug) console.log("default / emitEventOnChange / 중단 / value is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      this.meta.eventKey,
      // public value:string
      value,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("default / emitEventOnChange / Done!");

  }

  private emitEventOnChangeNotValid(value:string, metaObj) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / emitEventOnChangeNotValid / 시작");
    if(null == value) {
      if(isDebug) console.log("default / emitEventOnChangeNotValid / 중단 / value is not valid!");
      return;
    }
    if(null == metaObj) {
      if(isDebug) console.log("default / emitEventOnChangeNotValid / 중단 / metaObj is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE_NOT_VALID,
      // public key:string
      this.meta.eventKey,
      // public value:string
      value,
      // public metaObj:any
      metaObj,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("default / emitEventOnChangeNotValid / Done!");

  }  

  // @ Desc : 실패 툴팁을 보여줍니다.
  public showTooltipFailWarning(msg:string, isTimeout:Boolean) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;    
    if(isDebug) console.log("default / showTooltipFailWarning / init");
    if(isDebug) console.log("default / showTooltipFailWarning / msg : ",msg);

    this.isShowTooltip = true;
    this.isFocus = true;
    this.isValid = false;
    this.tooltipMsg = msg;

    if(isDebug) console.log("default / showTooltipFailWarning / this.isShowTooltip : ",this.isShowTooltip);

    if(null != isTimeout && isTimeout) {
      if(isDebug) console.log("default / showTooltipFailWarning / this.hideTooltipHead(2)");
      this.hideTooltip(2);
    } // end if

  }
  private hideWarningTooptip() :void {
    this.tooltipMsg = null;
    this.isValid = true;
    this.isFocus = false;
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

  // @ Desc : 새로 입력받은 값이 문제가 없는지 확인합니다.
  // 입력받은 모든 값은 문자열입니다.
  private onCheckInputValid(input:string, isBlur:boolean) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / onCheckInputValid / init");
    if(isDebug) console.log("default / onCheckInputValid / input : ",input);

    // 여기서 유저가 설정한 조건이 필요합니다.

    // Blur가 아니라면, 비어있는 문자열이라면 검사하지 않습니다.
    if(!isBlur && (null == input || "" == input)) {
      if(isDebug) console.log("default / onCheckInputValid / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return true;
    }

    // MyChecker로 검사, 예외 사항에 대한 처리.
    let isNotOK:boolean = this.isNotOK(input);
    if(isNotOK) {

      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();
      if( null != history && 
          null != history.key && 
          null != history.msg ) {

        // 문제가 있습니다!

        // 문제 원인 별로 처리해줍니다.
        if("max" === history.key) {

          // 최대 문자 갯수보다 많은 경우.
          if(isDebug) console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우.");
          this.showTooltipFailWarning(history.msg, false);

          // 넘는 문자열은 지웁니다.
          this.inputStrPrev = input = input.slice(0, history.value);

          if(isDebug) console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우. / history : ",history);

        } else if("min" === history.key) {

          // 최소 문자 갯수보다 적은 경우.
          if(isDebug) console.log("default / onCheckInputValid / 최소 문자 갯수보다 적은 경우.");

          if(isBlur) {

            // Blur 모드에서는 사용자가 입력을 완료했다고 판단합니다
            // 그러므로 최소 글자수보다 작으면 경고를 표시해야 합니다.
            this.showTooltipFailWarning(history.msg, false);

          } else {
            // 사용자의 입력을 기다려야 하므로 해야하는 일이 없습니다.
            // 예외적으로 true 반환.
            return true;
          }

        } // end if

        // 모든 예외 사항에 대해 부모 객체에 전달합니다.
        let metaObj = {
          view:this,
          history:history
        }

        if(isDebug) console.log("default / onCheckInputValid / 모든 예외 사항에 대해 부모 객체에 전달합니다.");
        this.emitEventOnChangeNotValid(
          // value:string
          input, 
          // metaObj
          metaObj
        );

      } else {

        // TODO - 문제는 있으나 원인을 발견하지 못했습니다.
        // 내부에서 처리할 수 없으므로 부모에게 전달, 조치합니다.
        if(isDebug) console.log("default / onCheckInputValid / 문제는 있으나 원인을 발견하지 못했습니다.");
        this.emitEventOnChangeNotValid(
          // value:string
          input, 
          // metaObj
          null
        );

      } // end if 
      return false;

    } else {

      // 정상적인 값입니다. 
      // 부모 객체에 전파합니다.
      if(isDebug) console.log("default / onCheckInputValid / 정상적인 값입니다.");
      this.hideWarningTooptip();
      this.emitEventOnChange(input);
      return true;

    } // end if

  } // end method

  
  onKeyup(event, elementInput) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / onKeyup / init");

    event.stopPropagation();
    event.preventDefault();    

    let inputStr:string = elementInput.value;

    if(inputStr == this.inputStrPrev) {
      if(isDebug) console.log("default / onKeyup / 중단 / 동일한 내용이라면 중단합니다.");
      return;
    }

    // 입력이 완료되는 onBlur에서만 검사해야 하는 항목들은 제외합니다.
    if(this.myEventService.KEY_USER_EMAIL === this.meta.eventKey) {
      if(isDebug) console.log("default / onKeyup / 중단 / 입력이 완료되는 onBlur에서만 검사해야 하는 항목들은 제외합니다.");
      this.inputStrPrev = inputStr;
      return;
    }

    let isValidInput:boolean = this.onCheckInputValid(inputStr, false);
    if(isDebug) console.log("default / onKeyup / isValidInput : ",isValidInput);

    if(isValidInput) {
      if(isDebug) console.log("default / onKeyup / 입력이 문제없습니다. 저장합니다.");
      this.inputStrPrev = inputStr;
      this.hideWarningTooptip();
    } else {
      if(isDebug) console.log("default / onKeyup / 입력이 유효하지 않습니다. 이전으로 되돌립니다.");
      this.ngModelInput = this.inputStrPrev;
      if(isDebug) console.log("default / onKeyup / 입력이 유효하지 않습니다. 이전으로 되돌립니다. / Done");
    }

  } // end method - keyup

  getEventKey() :string {
    if(this.meta.hasEventKey()) {
      return this.meta.eventKey;
    }
    return "";
  }
  hasEventKey(eventKey:string) :boolean {

    if(null == eventKey || "" === eventKey) {
      return false;
    }

    if(eventKey === this.getEventKey()) {
      return true;
    }

    return false;
  }

} // end class

// TODO - Dirty word list 검수 과정 필요!