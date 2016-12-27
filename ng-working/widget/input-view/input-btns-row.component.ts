import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';
import { MyEventService }              from '../../util/service/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyChecker }                   from '../../util/model/my-checker';
import { MyButton }                   from '../../util/model/my-button';

@Component({
  moduleId: module.id,
  selector: 'input-btns-row',
  templateUrl: 'input-btns-row.component.html',
  styleUrls: [ 'input-btns-row.component.css' ]
})
export class InputBtnsRowComponent implements OnInit {

  @Input() myButtonList:MyButton[];
  @Input() myButton:MyButton;
  @Input() myEventKeyEnterCallback:MyEvent;
  @Input() cageWidth:number=-1;
  @Input() type:string;
  @Input() placeholder:string;
  @Input() inputText:string;

  innerText:string;

  myValue:string;
  cageWidthStr:string;

  isDisabledSave:boolean=true;

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private myEventService:MyEventService, 
                private myCheckerService:MyCheckerService  ) {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    if(null != this.inputText && "" != this.inputText) {
      this.innerText = this.inputText;
    }

    // Ready Event 발송 
    let myEventReady:MyEvent =
    this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY,
        // public key:string
        this.myEventService.KEY_INPUT_BTNS_ROW,
        // public value:string
        "",
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        null    
    );

    this.emitter.emit(myEventReady);
  }

  onBlur(event, value, inputTextEl) :void{

    event.stopPropagation();
    event.preventDefault();

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("input-btns-row / onBlur / init");

    if(isDebug) console.log("input-btns-row / onBlur / this.myEventKeyEnterCallback : ",this.myEventKeyEnterCallback);

    let myChecker:MyChecker = null;
    let myEventCopy:MyEvent = null;
    if(null != this.myEventKeyEnterCallback) {
      myEventCopy = this.myEventKeyEnterCallback.copy();
      myEventCopy.eventName = this.myEventService.ON_CHANGE;
      myEventCopy.value = value;
      myChecker = myEventCopy.myChecker;
    }

    // input field의 역할이 어떤 것인지 모르므로 부모에게 change 이벤트 및 input field의 값을 전달합니다.
    if(null != myChecker && null != myEventCopy) {
      let isOK = this.myCheckerService.isOK(myChecker, value);
      if(isOK) {
        this.emitter.emit(myEventCopy);
        return;
      }

      let history = this.myCheckerService.getLastHistory();
      if(isDebug) console.log("input-btns-row / onBlur / history : ",history);

      // 유효한 문자열이 아닙니다.
      // 유저에게 알립니다.
      let msg:string = myEventCopy.myChecker.msg;
      if(null != msg && "" != msg) {
        alert(msg);
        // inputTextEl.focus();
      } // end if
    }

  }

  onChange(value, inputTextEl) :void{

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("input-btns-row / onChange / init");

    if(isDebug) console.log("input-btns-row / onChange / this.myEventKeyEnterCallback : ",this.myEventKeyEnterCallback);

    /*
    let myChecker:MyChecker = null;
    let myEventCopy:MyEvent = null;
    if(null != this.myEventKeyEnterCallback) {
      myEventCopy = this.myEventKeyEnterCallback.copy();
      myEventCopy.eventName = this.myEventService.ON_CHANGE;
      myEventCopy.value = value;
      myChecker = myEventCopy.myChecker;
    }

    // input field의 역할이 어떤 것인지 모르므로 부모에게 change 이벤트 및 input field의 값을 전달합니다.
    if(null != myChecker && null != myEventCopy) {
      let isOK = this.myCheckerService.isOK(myChecker, value);
      if(isOK) {
        this.emitter.emit(myEventCopy);
        return;
      }

      let history = this.myCheckerService.getLastHistory();
      // console.log(">>> onChange / history : ",history);

      // 유효한 문자열이 아닙니다.
      // 유저에게 알립니다.
      let msg:string = myEventCopy.myChecker.msg;
      if(null != msg && "" != msg) {
        alert(msg);
        inputTextEl.focus();
      } // end if
    }
    */
  }

  callbackSave(value:string, myEventCallback:MyEvent) {

    if(null == myEventCallback) {
      console.log("!Error! / input-btns-row / callbackSave / null == myEventCallback");
      return;
    }

    // 새로 추가하는 경우라면, 새로운 이벤트 객체를 만들어 돌려줍니다.
    let myEventReturn:MyEvent;
    if(this.myEventService.ON_ADD_ROW === myEventCallback.eventName) {

      myEventReturn = 
      this.myEventService.getMyEvent(
        // eventName:string
        myEventCallback.eventName,
        // key:string
        myEventCallback.key,
        // value:string
        myEventCallback.value,
        // metaObj:any
        myEventCallback.metaObj,
        // myChecker:MyChecker
        myEventCallback.myChecker
      );

      this.clearInputField();

    } else {

      myEventReturn = myEventCallback;

    }

    this.emitter.emit(myEventReturn);
  }

  onKeyEnter(event:any, value:string) {

    event.stopPropagation();
    event.preventDefault();

    this.callbackSave(value, this.myEventKeyEnterCallback);

  }  

  onClick(event, value:string, myButton:MyButton):void {

    event.stopPropagation();
    event.preventDefault();

    if(null == myButton) {
      console.log("!Error! / input-btns-row / onClick / null == myButton");
      return;
    }

    console.log("input-btns-row / onClick / myButton : ",myButton);

    let myEventCopy:MyEvent = myButton.myEvent.copy();
    myEventCopy.eventName = myButton.eventName;

    if(null != value && "" != value) {
      myEventCopy.value = value;
    } else if(null == value || "" == value) {
      myEventCopy.value = "";
    }
    this.callbackSave(value, myEventCopy);

  }

  clearInputField() :void {
    this.innerText = "";
  }
 
}