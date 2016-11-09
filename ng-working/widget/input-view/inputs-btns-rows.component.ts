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
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyChecker }                   from '../../util/model/my-checker';
import { MyButton }                    from '../../util/model/my-button';

@Component({
  moduleId: module.id,
  selector: 'inputs-btns-rows',
  templateUrl: 'inputs-btns-rows.component.html',
  styleUrls: [ 'inputs-btns-rows.component.css' ]
})
export class InputsBtnsRowsComponent implements OnInit {

  @Input() key:string;
  @Input() rowType:string;
  @Input() maxRowCnt:number=3;
  @Input() myEventList:MyEvent[];
  myEventListCopy:MyEvent[];
  @Input() placeholderForNewRow:string;
  isDisabledSave:boolean=true;

  myAddBtnList:MyButton[];
  myRemovableBtnList:MyButton[];


  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(private myEventService:MyEventService, private myCheckerService:MyCheckerService) {}

  ngOnInit(): void {

    if(null == this.myEventList || 0 === this.myEventList.length) {
      console.log("!Error! / inputs-btns-rows / this.myEventList is not valid!");
      return;
    }
    console.log("inputs-btns-rows / key : ",this.key);

    // 원본 비교를 위한 copy list 만들기
    this.myEventListCopy = 
    this.myEventService.getCopyEventList(this.myEventList);

    // 열을 추가할 수 있는 기능을 하는 input group 만들기
    let myChecker:MyChecker = this.myCheckerService.getTitleChecker();
    let myEvent:MyEvent = this.myEventList[0];
    this.myAddBtnList = [
      new MyButton (
        "추가하기",
        this.myEventService.ON_ADD_ROW,
        myChecker,
        myEvent
      )
    ];

    this.myRemovableBtnList = [];
    for (var i = 0; i < this.myEventList.length; ++i) {

      let curMyEvent:MyEvent = this.myEventList[i];
      let myButtonNext:MyButton = 
      new MyButton (
        "빼기",
        this.myEventService.ON_REMOVE_ROW,
        myChecker,
        curMyEvent
      )

      this.myRemovableBtnList.push(myButtonNext);

    }

    // Ready Event 발송 
    let myEventReady:MyEvent =
    this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY,
        // public key:string
        this.myEventService.KEY_INPUTS_BTNS_ROWS,
        // public value:string
        "",
        // public metaObj:any
        null,
        // public myChecker:MyChecker
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

    console.log("inputs-btns-rows / onChangeFromChild / myEvent : ",myEvent);

    if(null == myEvent && null != myEvent.value) {
      return;
    }

    if(this.myEventService.ON_CHANGE === myEvent.eventName) {

      // 변수 전파가 즉시 되지 않으므로 동일한 객체라면 직접 업데이트 해줍니다.
      this.myEventList = this.myEventService.setEventValue(myEvent, this.myEventList);

      let hasChanged:boolean = this.hasChanged();
      this.isDisabledSave = (hasChanged)?false:true;
      this.emitter.emit(myEvent);

    } else if(this.myEventService.ON_ADD_ROW === myEvent.eventName) {

      // 공백 문자열도 허용합니다.
      this.myEventList.push(myEvent);

      // MyButton 객체를 만들어 열울 추가합니다.
      let myChecker:MyChecker = this.myCheckerService.getTitleChecker();
      let myButtonNew:MyButton =
      new MyButton (
        "빼기",
        this.myEventService.ON_REMOVE_ROW,
        myChecker,
        myEvent
      );
      this.myRemovableBtnList.push(myButtonNew);

      // 저장 관련 작업을 할 수 없으므로 부모에게 이벤트 전달.
      let hasChanged:boolean = this.hasChanged();
      this.isDisabledSave = (hasChanged)?false:true;
      this.emitter.emit(myEvent);

    } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {

      let listLengthPrev:number = this.myEventList.length;

      // console.log("BEFORE / this.myEventList : ",this.myEventList);

      let myEventListNext:MyEvent[] = [];
      for (var i = 0; i < this.myEventList.length; ++i) {
        let myEventNext:MyEvent = this.myEventList[i];
        if(myEventNext.isSame(myEvent)) {
          // 지울 이벤트를 찾았습니다. 리스트에서 제외합니다.
          continue;
        }
        myEventListNext.push(myEventNext);
      } // end for
      this.myEventList = myEventListNext;

      let myRemovableBtnListNext:MyButton[] = [];
      for (var i = 0; i < this.myRemovableBtnList.length; ++i) {
        let myBtnNext:MyButton = this.myRemovableBtnList[i];
        let myEventNext:MyEvent = myBtnNext.myEvent;
        if(myEventNext.isSame(myEvent)) {
          // 지울 이벤트를 찾았습니다. 리스트에서 제외합니다.
          continue;
        }
        myRemovableBtnListNext.push(myBtnNext);
      } // end for
      this.myRemovableBtnList = myRemovableBtnListNext;

      let listLengthAfter:number = this.myEventList.length;
      // console.log("AFTER / listLengthAfter : ",listLengthAfter);

      if(listLengthPrev === (listLengthAfter + 1)) {
        // 리스트가 1개가 줄어야 부모에게 이벤트를 발송할 있다.
        let hasChanged:boolean = this.hasChanged();
        this.isDisabledSave = (hasChanged)?false:true;
        this.emitter.emit(myEvent);
      } else {
        console.log("!Error! / Target Not Found!");
        console.log("listLengthPrev : ",listLengthPrev);
        console.log("listLengthAfter : ",listLengthAfter);
      } // end inner if

    } // end if

  } // end method

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
      // wonder.jung
      myEventReturn =
      this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN,
          // public key:string
          firstMyEvent.key,
          // public value:string
          "",
          // public metaObj:any
          this.myEventList,
          // public myChecker:MyChecker
          null    
      );

    } else {

      // 저장하지 않습니다. 이전 값으로 돌려놓습니다.
      myEventReturn =
      this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_SHUTDOWN_N_ROLLBACK,
          // public key:string
          firstMyEvent.key,
          // public value:string
          "",
          // public metaObj:any
          this.myEventListCopy,
          // public myChecker:MyChecker
          null    
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

    console.log("inputs-btns-rows / save / 00 / this.isDisabledSave : ",this.isDisabledSave);

    if(null == this.myEventList || 0 == this.myEventList.length) {
      return;
    }

    // 1. 리스트를 비교해서 변경내역이 있는지 확인합니다.
    let hasChanged:boolean = this.hasChanged();

    console.log("inputs-btns-rows / save / 01 / hasChanged : ",hasChanged);

    if(hasChanged) {
      this.isDisabledSave = false;
    } else {
      this.isDisabledSave = true;
    }

    if(this.isDisabledSave) {
      return;
    }

    // 저장이 완료됨. Event 데이터를 copy와 원본을 동일하게 덮어쓰기.
    this.overwriteMyEventList();

    console.log("inputs-btns-rows / save / 02 / 저장이 완료됨. Event 데이터를 copy와 원본을 동일하게 덮어쓰기.");

    // 부모 객체에게 전달할 이벤트 객체 만들기.
    // wonder.jung
    let myEventReturn:MyEvent = 
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_SAVE,
      // public key:string
      this.key,
      // public value:string
      "",
      // public metaObj:any
      "",
      // public myChecker:MyChecker
      this.myCheckerService.getTitleChecker()
    );    

    console.log("inputs-btns-rows / save / 010 / myEventReturn : ",myEventReturn);

    this.emitter.emit(myEventReturn);

  } 

  hasChanged() :boolean {

    let hasChanged:boolean = 
    this.myEventService.hasChangedList(
      this.myEventList, 
      this.myEventListCopy
    );

    console.log("inputs-btns-rows / hasChanged / this.myEventList : ",this.myEventList);
    console.log("inputs-btns-rows / hasChanged / this.myEventListCopy : ",this.myEventListCopy);

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

    // 원본과 복사본이 동일. '저장'버튼을 비활성화.
    this.isDisabledSave = true;

    console.log("overwriteMyEventList / this.isDisabledSave : ",this.isDisabledSave);
  }
  rollbackMyEventListCopies() :void {
    this.myEventList = this.myEventListCopy;
    this.overwriteMyEventList();
  }  
}