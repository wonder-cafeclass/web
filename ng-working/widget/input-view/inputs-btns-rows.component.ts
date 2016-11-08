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
  selector: 'inputs-btns-rows',
  templateUrl: 'inputs-btns-rows.component.html',
  styleUrls: [ 'inputs-btns-rows.component.css' ]
})
export class InputsBtnsRowsComponent implements OnInit {

  @Input() myEventList:MyEvent[];
  myEventListCopy:MyEvent[];
  @Input() cageWidth:number=-1;
  @Input() placeholderForNewRow:string;
  cageWidthStr:string;
  isDisabledSave:boolean=true;
  myEvenListBtnsForAddingRow:MyEvent[];

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

    // 원본 비교를 위한 copy list 만들기
    this.myEventListCopy = this.getCopyEventList(this.myEventList);

    // 열을 추가할 수 있는 기능을 하는 input group 만들기
    this.myEvenListBtnsForAddingRow = [
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_ADD_ROW,
          // public title:string
          "추가하기",
          // public key:string
          "add-row",
          // public value:string
          "",
          // public metaObj:any
          null
      )
    ];

    // Ready Event 발송 
    let myEventReady:MyEvent =
    new MyEvent(
        // public eventName:string
        this.myEventService.ON_READY,
        // public title:string
        "inputs-btns-rows",
        // public key:string
        "inputs-btns-rows",
        // public value:string
        "",
        // public metaObj:any
        null
    );
    this.emitter.emit(myEventReady);
  }

  getCopyEventList(myEventList:MyEvent[]) :MyEvent[] {

    let copyList:MyEvent[] = [];
    for (var i = 0; i < myEventList.length; ++i) {
      let myEvent = myEventList[i];
      let myEventCopy = myEvent.copy();

      copyList.push(myEventCopy);
    }

    return copyList;
  }

  isSameEventLists(firstList:MyEvent[],secondList:MyEvent[]) :boolean {

    if(null == firstList || 0 === firstList.length) {
      return false;
    }
    if(null == secondList || 0 === secondList.length) {
      return false;
    }
    if(firstList.length !== secondList.length) {
      return false;
    }

    for (var i = 0; i < firstList.length; ++i) {
      let firstMyEvent:MyEvent = firstList[i];
      let secondMyEvent:MyEvent = secondList[i];

      let isSame = firstMyEvent.isSame(secondMyEvent);
      if(!isSame) {
        return false;
      }
    }

    return true;
  }

  onChangeFromChild(myEvent:MyEvent) :void {

    if(null == myEvent) {
      return;
    }

    console.log("inputs-btns-rows / onChangeFromChild / myEvent : ",myEvent);

    if(this.myEventService.ON_ADD_ROW === myEvent.eventName) {
      if(null != myEvent.value && "" != myEvent.value) {
        // 열을 추가합니다.
        let newMyEvent:MyEvent = 
        new MyEvent(
          // public eventName:string
          this.myEventService.ON_CHANGE,
          // public title:string
          "single-input-view",
          // public key:string
          "single-input-view",
          // public value:string
          myEvent.value,
          // public metaObj:any
          null
        );
        this.myEventList.push(newMyEvent);
      }
    } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
      // 삭제 관련 유효성 검증을 할 수 없으므로 부모에게 이벤트 전달.
      this.emitter.emit(myEvent);
    }
  }

  getMyEvent() :MyEvent {
    return null;
  }

  onClickDismiss(event) :void {
    event.stopPropagation();
    event.preventDefault();
    this.dismiss();
  }

  dismiss() :void {

    console.log("inputs-btns-rows / dismiss");

    let hasChanged:boolean = !this.isSameEventLists(this.myEventList, this.myEventListCopy);
    let firstMyEvent:MyEvent = this.myEventList[0];

    // 사용자에게 변경된 사항이 있다면 저장할 것인지 물어봅니다.
    let wannaSave:boolean = false;
    if(hasChanged && confirm("변경된 사항이 있습니다. 저장하시겠습니까?")) {
      wannaSave = true;
    }

    let myEventReturn:MyEvent = null;
    if(wannaSave) {
      this.save();

      myEventReturn = 
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN,
          // public title:string
          "inputs-btns-rows",
          // public key:string
          firstMyEvent.key,
          // public value:string
          "",
          // public metaObj:any
          this.myEventList
      );

    } else {
      // 저장하지 않습니다. 이전 값으로 돌려놓습니다. - wonder.jung 이전 값으로 돌려놓는 방법은?
      myEventReturn = 
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN_N_ROLLBACK,
          // public title:string
          "inputs-btns-rows",
          // public key:string
          firstMyEvent.key,
          // public value:string
          "",
          // public metaObj:any
          this.myEventListCopy
      );
    }

    this.emitter.emit(myEventReturn);
  }

  onClickSave(event) :void {
    event.stopPropagation();
    event.preventDefault();
    this.save();
  }

  save() :void {

    if(this.isDisabledSave) {
      return;
    }
    if(null == this.myEventList || 0 == this.myEventList.length) {
      return;
    }

    // 1. 리스트를 비교해서 변경내역이 있는지 확인합니다.
    let isSameEventLists = this.isSameEventLists(this.myEventList, this.myEventListCopy);
    let firstMyEvent:MyEvent = this.myEventList[0];
    let myEventReturn:MyEvent = null;
    if(isSameEventLists) {

      // 1-1. 변경 내역이 없다면, 버튼이 비활성화 상태. 아무것도 하지 않습니다.

    } else {

      // 1-2. 변경 내역이 있다면, 저장을 진행합니다.
      let myEventReturn:MyEvent = 
      new MyEvent(
          // public eventName:string
          this.myEventService.ON_SAVE,
          // public title:string
          "inputs-btns-rows",
          // public key:string
          firstMyEvent.key,
          // public value:string
          "",
          // public metaObj:any
          this.myEventList
      );

      
    }
    this.emitter.emit(myEventReturn);      

    // this.myEventListCopy = this.getCopyEventList(this.myEventList);


    // 부모 컴포넌트에게 MyEvent 객체를 전달, 사용자가 수정 및 입력을 완료했음을 알립니다.
    /*
    */
  }  
}