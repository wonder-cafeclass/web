import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';
import { RadioBtnLinearComponent }     from './../radiobtn/radiobtn-linear.component';
import { RadioBtnOption }              from './../radiobtn/model/radiobtn-option';
import { InputViewUpdown }             from './model/input-view-updown';
import { MyEventService }              from '../../util/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'single-input-view',
  templateUrl: 'single-input-view.component.html',
  styleUrls: [ 'single-input-view.component.css' ]
})
export class SingleInputViewComponent implements OnInit {

  @Input() myEvent:MyEvent;
  @Input() cageWidth:number=-1;
  @Input() type:string;
  myValue:string;
  cageWidthStr:string;
  myEvenListBtns:MyEvent[];
  myEventKeyEnter:MyEvent;

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(private myEventService:MyEventService) {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    this.myValue = this.myEvent.value;

    if("removableRow" === this.type) {
      let myEventRemove:MyEvent =
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_REMOVE_ROW,
          // public title:string
          "빼기",
          // public key:string
          "remove",
          // public value:string
          "",
          // public metaObj:any
          this.myEvent
      );      
      this.myEvenListBtns = [myEventRemove];
      this.myEventKeyEnter = myEventRemove;
    }

    // Ready Event 발송 
    let myEventReady:MyEvent =
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_READY,
        // public title:string
        "single-input-view",
        // public key:string
        "ready",
        // public value:string
        "",
        // public metaObj:any
        null
    );
    this.emitter.emit(myEventReady);
  }

  onChangeInputText(value) :void {
    console.log("onChangeInputText / value : ",value);

    // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.
    let myEventReturn:MyEvent = 
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public title:string
        "single-input-view",
        // public key:string
        this.myEvent.key,
        // public value:string
        value,
        // public metaObj:any
        null
    );

    this.emitter.emit(myEventReturn);

  }

  onChangeFromChild(myEvent:MyEvent) :void {
    console.log("single-input-view / onChangeFromChild / event : ",event);

    if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
      // 열을 지웁니다.
      let myEventTarget:MyEvent = null;
      if(null != myEvent.metaObj) {
        myEventTarget = myEvent.metaObj;
        myEventTarget.eventName = this.myEventService.ON_REMOVE_ROW;
      } else {
        myEventTarget = myEvent;
      }
      this.emitter.emit(myEventTarget);
    }
  }

  getMyEvent() :MyEvent {
    return this.myEvent;
  }

  onChange(event, value) :void{

    event.stopPropagation();
    event.preventDefault();

    console.log("single-input-view / onChange / value : ",value);

    if(null == this.myEvent) {
      return;
    }

    this.myEvent.valueNext = value;
    this.emitter.emit(this.myEvent);
  }
}