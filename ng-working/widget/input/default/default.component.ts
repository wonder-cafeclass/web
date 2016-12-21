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

import { DefaultMeta }              from './model/default-meta';
import { DefaultType }              from './model/default-type';
import { DefaultOption }            from './model/default-option';

import { MyEventWatchTowerService } from '../../../util/service/my-event-watchtower.service';
import { HelperMyTime }             from '../../../util/helper/my-time';


@Component({
  moduleId: module.id,
  selector: 'widget-input-default',
  templateUrl: 'default.component.html',
  styleUrls: [ 'default.component.css' ]
})
export class DefaultComponent implements OnInit, AfterViewInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  @Input() ngModelInput:string;
  private inputStrPrev:string="";
  private tooltipMsg:string=null;
  private isShowTooltip:boolean=false;
  private isFocus:boolean=false;
  private isValid:boolean=true;
  private myChecker:MyChecker;
  defaultType:DefaultType;

  // @ User Custom
  @Input() meta:DefaultMeta;
  @Input() isDisabled:boolean=false;
  @Input() isNoSpace:boolean=false;
  @Input() isShowTitle:boolean=true;
  @Input() width:number=-1;
  @Input() numUnit:number=-1; // 숫자 변경시 최소 변경 단위.
  @Input() minutesUnit:number=-1; // 시간 변경시 최소 변경 분 단위.
  widthStr:string="";

  private myTime:HelperMyTime;

  selectOptionList:DefaultOption[];   // 셀렉 박스 선택 정보로 사용.
  checkOptionTable:DefaultOption[][]; // 바둑판 형태의 checkbox 테이블 데이터로 사용

  constructor(  private myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService  ) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / constructor / init");

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

    if(isDebug) console.log("default / constructor / meta : ",this.meta);
    if(isDebug) console.log("default / constructor / this.width : ",this.width);


    this.defaultType = new DefaultType();
    this.myTime = new HelperMyTime();

  } // end constructor

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / ngOnInit / init");

    if(isDebug) console.log("default / ngOnInit / meta : ",this.meta);
    if(isDebug) console.log("default / ngOnInit / this.width : ",this.width);

    if(0 < this.width) {
      this.widthStr = this.width + "px";
    } else {
      this.widthStr = "100%";
    }

    this.asyncViewPack();

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / ngAfterViewInit");

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
    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();
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
    } else {
      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("default / setInput / history : ",history);
    }
  }
  setSelectOption(selectOptionList:DefaultOption[]) :void {

    if(null == selectOptionList) {
      return;
    }

    this.selectOptionList = selectOptionList;

  }
  setCheckOption(checkOptionTable:DefaultOption[][]) :void {

    if(null == checkOptionTable || 0 == checkOptionTable.length) {
      return;
    }

    this.checkOptionTable = checkOptionTable;

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

  onClickIncreaseNumber(event) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / onClickIncreaseNumber / 시작");

    if(0 < this.numUnit) {
      this.updateInputNum(this.numUnit);
    }

  }

  onClickDecreaseNumber(event) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / onClickDecreaseNumber / 시작");

    if(0 < this.numUnit) {
      this.updateInputNum(-1 * this.numUnit);
    }

  }

  private updateInputNum(numAmountChanged:number):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / updateInputNum / 시작");
    if(isDebug) console.log("default / updateInputNum / numAmountChanged : ",numAmountChanged);

    let curNum:number = parseInt(this.ngModelInput);
    let nextNum:number = curNum + numAmountChanged;

    let error = null;
    if(!this.isOK("" + nextNum)) {
      if(isDebug) console.log("default / updateInputNum / 중단 / nextNum is not valid!");
      error = this.myCheckerService.getLastHistory();
    }
    if(null != error) {
      if(isDebug) console.log("default / updateInputNum / error : ",error);
      this.showTooltipFailWarning(error.msg, false);
      return;
    }
    this.hideWarningTooptip();

    // 반드시 0 이상이어야 합니다.
    if(0 <= nextNum) {
      this.ngModelInput = this.inputStrPrev = "" + nextNum;
      this.emitEventOnChange(this.ngModelInput);
    } // end if
  } // end method

  onClickIncreaseHHMM(event) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / onClickIncreaseHHMM / 시작");

    if(0 < this.minutesUnit) {
      this.updateInputHHMM(this.minutesUnit);
    }

  }

  onClickDecreaseHHMM(event) :void {

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / onClickDecreaseHHMM / 시작");

    if(0 < this.minutesUnit) {
      this.updateInputHHMM(-1 * this.minutesUnit);
    }

  }

  private updateInputHHMM(minutesChanged:number):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / updateInputHHMM / 시작");
    if(isDebug) console.log("default / updateInputHHMM / minutesChanged : ",minutesChanged);

    // wonder.jung

    let nextHHMM:string = this.myTime.addMinutesHHMM(this.ngModelInput, minutesChanged);

    let error = null;
    if(!this.isOK(nextHHMM)) {
      if(isDebug) console.log("default / updateInputHHMM / 중단 / nextNum is not valid!");
      error = this.myCheckerService.getLastHistory();
    }
    if(null != error) {
      if(isDebug) console.log("default / updateInputHHMM / error : ",error);
      this.showTooltipFailWarning(error.msg, false);
      return;
    }
    this.hideWarningTooptip();

    // UPDATE!
    this.ngModelInput = this.inputStrPrev = nextHHMM;
    this.emitEventOnChange(this.ngModelInput);
  } // end method  

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
      this.emitEventOnSubmit(inputStr);
    } else {
      // 포커싱을 잃었으므로 사용자가 입력을 완료했다고 판단합니다. 
      // 그 결과에 문제가 있으므로 부모 객체에게 실패원인을 전달합니다.
      // 이벤트 키는 SUBMIT입니다.
    }

  } // end method

  onCheck(event, selectedValue, isChecked:boolean) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("default / onCheck / 시작");
    if(isDebug) console.log("default / onCheck / selectedValue : ",selectedValue);
    if(isDebug) console.log("default / onCheck / isChecked : ",isChecked);

    let selectedOption:DefaultOption = this.getCheckOptionFromTable(selectedValue);
    selectedOption.isFocus = isChecked;

    this.emitEventOnChangeWithMeta(
      // value:string
      selectedValue,
      // metaObj:any  
      selectedOption    
    );

  }

  getCheckOptionFromTable(value:string):DefaultOption {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / getCheckOptionFromTable / 시작");

    if(null == value || "" === value) {
      return null;
    }

    for (var i = 0; i < this.checkOptionTable.length; ++i) {
      let row = this.checkOptionTable[i];
      if(null == row) {
        continue;
      }

      for (var j = 0; j < row.length; ++j) {
        let option:DefaultOption = row[j];
        if(null == option) {
          continue;
        }

        if(isDebug) console.log("default / getCheckOptionFromTable / option : ",option);

        if(option.value === value) {
          return option;
        } // end if
      } // end for
    } // end for

    return null;

  } // end method

  onSelect(event, selectedValue) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("default / onSelect / 시작");
    if(isDebug) console.log("default / onSelect / selectedValue : ",selectedValue);

    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    let isValidInput:boolean = this.onCheckInputValid(selectedValue, true);
    if(isDebug) console.log("default / onSelect / isValidInput : ",isValidInput);

    if(isValidInput) {
      if(isDebug) console.log("default / onSelect / 입력이 문제없습니다.");
      this.hideWarningTooptip();
      this.emitEventOnChange(selectedValue);
    } else {
      // 포커싱을 잃었으므로 사용자가 입력을 완료했다고 판단합니다. 
      // 그 결과에 문제가 있으므로 부모 객체에게 실패원인을 전달합니다.
      // 이벤트 키는 SUBMIT입니다.
    }

  } // end method 

  getKeyFromSelect(value:string) :string {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("default / getKeyFromSelect / 시작");
    if(isDebug) console.log("default / getKeyFromSelect / value : ",value);


    if( null == value || "" === value ) {
      return "";
    }

    if( null == this.selectOptionList || 0 === this.selectOptionList.length ) {
      return "";
    }

    for (var i = 0; i < this.selectOptionList.length; ++i) {
      let defaultOption:DefaultOption = this.selectOptionList[i];
      if(null == defaultOption) {
        continue;
      }

      if(defaultOption.value === value) {
        return defaultOption.key;
      }
    }

    return "";
  } 

  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / emitEventOnReady / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_READY,
      // public key:string
      this.meta.eventKey,
      // public value:string
      "",
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("default / emitEventOnReady / Done!");

  }  

  private emitEventOnSubmit(value:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / emitEventOnSubmit / 시작");
    if(null == value) {
      if(isDebug) console.log("default / emitEventOnSubmit / 중단 / value is not valid!");
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

    if(isDebug) console.log("default / emitEventOnSubmit / Done!");

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

  private emitEventOnChangeWithMeta(value:string, metaObj:any) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("default / emitEventOnChangeWithMeta / 시작");
    if(null == value) {
      if(isDebug) console.log("default / emitEventOnChangeWithMeta / 중단 / value is not valid!");
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
      metaObj,
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
    if(isDebug) console.log("default / showTooltipFailWarning / isTimeout : ",isTimeout);

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

    // wonder.jung

    // 1. 숫자 입력

    // 2. 문자 입력 

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