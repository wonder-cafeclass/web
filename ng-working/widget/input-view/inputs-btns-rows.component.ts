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

  @Input() myEvent:MyEvent;
  myEventForAddRow:MyEvent;
  @Input() myEventList:MyEvent[];
  myEventListCopy:MyEvent[];
  @Input() cageWidth:number=-1;
  @Input() placeholderForNewRow:string;
  cageWidthStr:string;
  isDisabledSave:boolean=true;
  myEvenListBtnsForAddingRow:MyEvent[];
  myEvenListBtnsForRemovingRow:MyEvent[];

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
    this.myEventListCopy = 
    this.myEventService.getCopyEventList(this.myEventList);

    let myEventCopy:MyEvent = this.myEvent.copy();
    myEventCopy.eventName = this.myEventService.ON_ADD_ROW;
    this.myEventForAddRow = myEventCopy;

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
          this.myEvent
      )
    ];

    this.myEvenListBtnsForRemovingRow = [
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

    if(null == myEvent && null != this.myEvent && null != myEvent.value) {
      return;
    }

    console.log("inputs-btns-rows / onChangeFromChild / myEvent : ",myEvent);

    if(this.myEventService.ON_CHANGE === myEvent.eventName) {

      // 변수 전파가 즉시 되지 않으므로 동일한 객체라면 직접 업데이트 해줍니다.
      this.myEventList = this.myEventService.setEventValue(myEvent, this.myEventList);

      let hasChanged:boolean = this.hasChanged();
      this.isDisabledSave = (hasChanged)?false:true;

      console.log("inputs-btns-rows / onChangeFromChild / ON_CHANGE / hasChanged : ",hasChanged);
      console.log("inputs-btns-rows / onChangeFromChild / ON_CHANGE / this.isDisabledSave : ",this.isDisabledSave);
      console.log("inputs-btns-rows / onChangeFromChild / ON_CHANGE / this.myEventList : ",this.myEventList);
      console.log("inputs-btns-rows / onChangeFromChild / ON_CHANGE / this.myEventListCopy : ",this.myEventListCopy);

      this.emitter.emit(myEvent);

    } else if(this.myEventService.ON_ADD_ROW === myEvent.eventName) {

      // 공백 문자열도 허용합니다.
      let myEventCopy:MyEvent = this.myEvent.copy();
      myEventCopy.metaObj["idx"] = this.myEventList.length;
      myEventCopy.value = myEvent.value;

      this.myEventList.push(myEventCopy);

      // 저장 관련 작업을 할 수 없으므로 부모에게 이벤트 전달.
      let myEventCopyToParent:MyEvent = myEventCopy.copy();
      myEventCopyToParent.eventName = this.myEventService.ON_ADD_ROW;
      this.emitter.emit(myEventCopyToParent);

    } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {

      let myEventListNext:MyEvent[] = [];
      for (var i = 0; i < this.myEventList.length; ++i) {
        let myEventNext:MyEvent = this.myEventList[i];
        if(myEventNext.isSame(myEvent)) {
          // 지울 이벤트를 찾았습니다. 리스트에서 제외합니다.
          continue;
        }
        myEventListNext.push(myEventNext);
      }
      this.myEventList = myEventListNext;

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

    let hasChanged:boolean = this.hasChanged();
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

    if(null == this.myEventList || 0 == this.myEventList.length) {
      return;
    }

    // 1. 리스트를 비교해서 변경내역이 있는지 확인합니다.
    let hasChanged:boolean = this.hasChanged();
    console.log("inputs-btns-rows / save / hasChanged : ",hasChanged);
    console.log("inputs-btns-rows / save / this.myEventList : ",this.myEventList);

    if(hasChanged) {
      this.isDisabledSave = false;
    } else {
      this.isDisabledSave = true;
    }

    if(this.isDisabledSave) {
      return;
    }

    let myEventChanged:MyEvent = this.getChanged();
    if(null == myEventChanged) {
      return;
    }

    let myEventReturn:MyEvent = myEventChanged.copy();
    myEventReturn.eventName = this.myEventService.ON_SAVE;

    console.log("inputs-btns-rows / save / myEventReturn : ",myEventReturn);

    this.emitter.emit(myEventReturn);

    // 저장이 완료됨. Event 데이터를 copy와 원본을 동일하게 덮어쓰기.
    this.overwriteMyEventList();
  } 

  hasChanged() :boolean {

    let hasChanged:boolean = 
    this.myEventService.hasChangedList(
      this.myEventList, 
      this.myEventListCopy
    );

    return hasChanged;

  }

  getChanged() :MyEvent {

    let myEventChangedList:MyEvent[] = 
    this.myEventService.getChangedFromList(
      this.myEventList, 
      this.myEventListCopy
    );

    if( null != myEventChangedList && 
        0 != myEventChangedList.length) {
      // 첫번째 Event가 서비스중인 데이터.
      return myEventChangedList[0];

    }

    return null;
  }

  overwriteMyEventList() :void {
    this.myEventListCopy = 
    this.myEventService.getCopyEventList(
      this.myEventList
    );

    let hasChanged:boolean = this.hasChanged();
    this.isDisabledSave = !hasChanged;

    console.log("overwriteMyEventList / this.isDisabledSave : ",this.isDisabledSave);
  }
  rollbackMyEventListCopies() :void {
    this.myEventList = this.myEventListCopy;
    this.overwriteMyEventList();
  }  
}