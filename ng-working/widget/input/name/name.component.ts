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

// @ Deprecated - Remove me
@Component({
  moduleId: module.id,
  selector: 'name',
  templateUrl: 'name.component.html',
  styleUrls: [ 'name.component.css' ]
})
export class NameComponent {
/*
  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  ngModelInput:string;
  private inputStrPrev:string="";
  private tooltipMsg:string=null;
  private isShowTooltip:boolean=false;
  private isFocus:boolean=false;
  private isValid:boolean=false;
  private myChecker:MyChecker;

  // @ User Custom
  @Input() eventKey:string="";
  @Input() checkerKey:string="";
  @Input() isDisabled:boolean=false;
  tooltipMsgNotAllowed:string="이름에 문제가 있습니다.";
  tooltipMsgRemoved:string="한글만 입력 가능해요.";
  tooltipMsgEmpties:string="빈칸을 2칸 이상 입력할 수 없습니다.";
  tooltipMsgAllowed:string="성공! 멋진 이름이네요.";

  constructor(  private myLoggerService:MyLoggerService, 
                private myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService  ) {

    this.eventKey = this.myEventService.KEY_USER_NAME;
    this.checkerKey = "user_name";

  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("name / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("name / ngAfterViewInit");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("name / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("name / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("name / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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
    if(isDebug) console.log("name / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker(this.checkerKey);
      if(isDebug) console.log("name / setMyChecker / this.myChecker : ",this.myChecker);
    }
  }
  private init() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("name / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // checker를 설정합니다.
    this.setMyChecker();
  }
  public isOK(input:string) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("name / isOK / 시작");

    if(null == this.myCheckerService) {
      if(isDebug) console.log("name / isOK / 중단 / null == this.myCheckerService");
      return false;
    }

    let isOK:boolean = this.myCheckerService.isOK(this.myChecker, input);
    if(isDebug) console.log("name / isOK / isOK : ",isOK);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("name / isOK / history : ",history);
    }

    return isOK;
  }
  // @ Common --> setInput(input:string) :void {
  setName(name:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("name / setName / 시작");
    if(isDebug) console.log("name / setName / name : ",name);

    if(this.isOK(name)) {
      if(isDebug) console.log("name / setName / updated!");
      this.inputStrPrev = name;
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
    let isOK:boolean = this.isOK(this.inputStrPrev);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      console.log("name / history : ",history);
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

    event.stopPropagation();
    event.preventDefault();

    if(null == this.myCheckerService) {
      return;
    }

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    // wonder.jung - 입력된 
    let inputStr:string = elementInput.value;

    this.onCheckInputValid(inputStr);

  } // end method

  private emitEventOnChange(value:string) :void {

    if(isDebug) console.log("name / emitEventOnChange / 시작");
    if(null == value) {
      if(isDebug) console.log("name / emitEventOnChange / 중단 / value is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      this.eventKey,
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

  private emitEventOnChangeNotValid(value:string, metaObj) :void {

    if(isDebug) console.log("name / emitEventOnChangeNotValid / 시작");
    if(null == value) {
      if(isDebug) console.log("name / emitEventOnChangeNotValid / 중단 / value is not valid!");
      return;
    }
    if(null == metaObj) {
      if(isDebug) console.log("name / emitEventOnChangeNotValid / 중단 / metaObj is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE_NOT_VALID,
      // public key:string
      this.eventKey,
      // public value:string
      value,
      // public metaObj:any
      metaObj,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("name / emitEventOnChangeNotValid / Done!");

  }  

  // @ Desc : 실패 툴팁을 보여줍니다.
  private showTooltipFailWarning(msg:string, isTimeout:Boolean) :void {

    if(isDebug) console.log("name / showTooltipFailWarning / init");
    if(isDebug) console.log("name / showTooltipFailWarning / msg : ",msg);

    this.isShowTooltip = true;
    this.isFocus = true;
    this.isValid = false;
    this.tooltipMsg = msg;

    if(isDebug) console.log("name / showTooltipFailWarning / this.isShowTooltip : ",this.isShowTooltip);

    if(null != isTimeout && isTimeout) {
      if(isDebug) console.log("name / showTooltipFailWarning / this.hideTooltipHead(2)");
      this.hideTooltip(2);
    } // end if

  }
  private hideWarningTooptip() :void {
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

  // @ Desc : 새로 입력받은 값이 문제가 없는지 확인합니다.
  // 입력받은 모든 값은 문자열입니다.
  private onCheckInputValid(input:string) :void {

    if(isDebug) console.log("name / onCheckInputValid / init");

    // 여기서 유저가 설정한 조건이 필요합니다.

    // 비어있는 문자열이라면 검사하지 않습니다.
    if(null == input || "" == input) {
      if(isDebug) console.log("name / onCheckInputValid / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
      return;
    }

    // 바뀌지 않았다면 검사하지 않습니다.
    if(this.inputStrPrev === input) {
      if(isDebug) console.log("name / onCheckInputValid / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
      return;
    }

    // MyChecker로 검사, 예외 사항에 대한 처리.
    let isOK:boolean = this.isOK(input);
    if(!isOK) {

      // 원인을 찾아봅니다.
      let history = this.myCheckerService.getLastHistory();
      if(null != history && null != history.key && null != history.msg) {

        // 문제 원인 별로 처리해줍니다.
        if("max" === history.key) {

          // 최대 문자 갯수보다 많은 경우.
          if(isDebug) console.log("name / onCheckInputValid / 최대 문자 갯수보다 많은 경우.");
          this.showTooltipFailWarning(history.msg, false);

          // 넘는 문자열은 지웁니다.
          input = input.slice(0, history.value);
          this.isValid = false;

          if(isDebug) console.log("name / onCheckInputValid / 최대 문자 갯수보다 많은 경우. / history : ",history);

        } else if("min" === history.key) {

          // 최소 문자 갯수보다 적은 경우.
          if(isDebug) console.log("name / onCheckInputValid / 최소 문자 갯수보다 적은 경우.");

          // 사용자의 입력을 기다려야 하므로 해야하는 일이 없습니다.

        } // end if


        // 모든 예외 사항에 대해 부모 객체에 전달합니다.
        let metaObj = {
          view:this,
          history:history
        }

        this.emitEventOnChangeNotValid(
          // value:string
          input, 
          // metaObj
          metaObj
        );

      } // end if      

    } else {

      // 정상적인 값입니다. 
      // 부모 객체에 전파합니다.
      this.emitEventOnChange(input);

    } // end if

  } // end method

  
  onKeyup(event, elementInput) :void {

    if(isDebug) console.log("name / onKeyup / init");

    event.stopPropagation();
    event.preventDefault();    

    let inputStr:string = elementInput.value;

    this.onCheckInputValid(inputStr);


  }
*/


  // REMOVE ME
  /*
  // topWarning:number=-1000;
  // leftWarning:number=0;
  // errorMsgArr: string[]=[];
  // private redirectUrl:string="/class-center";

  isFocusInfo:boolean=false;
  isWarning:boolean=false;
  isShowPopover:boolean=false;  

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
  // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
  public showWarning() :void {
    this.isFocus = true;
    this.isWarning = true;
    this.isValid = false;
    this.tooltipMsg = this.tooltipMsgNotAllowed;
  }
  */

}
