import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';
import { MyEventService }              from '../../util/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'input-btns-row',
  templateUrl: 'input-btns-row.component.html',
  styleUrls: [ 'input-btns-row.component.css' ]
})
export class InputBtnsRowComponent implements OnInit {

  @Input() myEventList:MyEvent[];
  @Input() myEventKeyEnter:MyEvent;
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
  constructor(private myEventService:MyEventService) {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    this.innerText = this.inputText;

    // Ready Event 발송 
    let myEventReady:MyEvent =
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_READY,
        // public title:string
        "input-btns-row",
        // public key:string
        "ready",
        // public value:string
        "",
        // public metaObj:any
        null
    );
    this.emitter.emit(myEventReady);

    console.log("input-btns-row / placeholder : ",this.placeholder);
  }

  onChange(event, value) :void{

    event.stopPropagation();
    event.preventDefault();

    // input field의 역할이 어떤 것인지 모르므로 부모에게 change 이벤트 및 input field의 값을 전달합니다.
    let myEvent:MyEvent =
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public title:string
        "input-btns-row",
        // public key:string
        "change",
        // public value:string
        value,
        // public metaObj:any
        null
    );
    this.emitter.emit(myEvent);
  }

  callbackSave(value:string, myEvent:MyEvent) {

    if(null == myEvent) {
      return;
    }

    if(null != value && "" != value) {
      myEvent.value = value;
    }

    this.emitter.emit(myEvent);
    this.clearInputField();
  }

  onKeyEnter(event:any, value:string) {

    event.stopPropagation();
    event.preventDefault();

    this.callbackSave(value, this.myEventKeyEnter);

  }  

  onClick(event, value:string, myEvent:MyEvent):void {

    event.stopPropagation();
    event.preventDefault();

    this.callbackSave(value, myEvent);

  }

  clearInputField() :void {
    this.innerText = "";
  }
 
}