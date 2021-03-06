import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter }                       from '@angular/core';

import { InputViewUpdown }             from './model/input-view-updown';

import { RadioBtnLinearComponent }     from './../radiobtn/radiobtn-linear.component';
import { RadioBtnOption }              from './../radiobtn/model/radiobtn-option';

import { MyEventService }              from '../../util/service/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyChecker }                   from '../../util/model/my-checker';
import { MyButton }                    from '../../util/model/my-button';

import { HelperMyArray }               from '../../util/helper/my-array';

import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'inputs-btns-rows',
  templateUrl: 'inputs-btns-rows.component.html',
  styleUrls: [ 'inputs-btns-rows.component.css' ]
})
export class InputsBtnsRowsComponent implements OnInit {

  @Input() eventKey:string;
  @Input() hasButton:boolean=true;
  @Input() isShowTitle:boolean=false;
  @Input() title:string;
  @Input() rowType:string;
  @Input() maxRowCnt:number=3;
  @Input() myEventList:MyEvent[];
  myEventListCopy:MyEvent[];
  @Input() placeholderForNewRow:string;
  isDisabledSave:boolean=true;

  myAddBtnList:MyButton[];
  myRemovableBtnList:MyButton[];

  private myArray:HelperMyArray;


  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private myEventService:MyEventService, 
                private watchTower:MyEventWatchTowerService,
                private myCheckerService:MyCheckerService) {
    this.myArray = new HelperMyArray();
  }

  ngOnInit(): void {
    this.asyncViewPack();
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("inputs-btns-rows / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("inputs-btns-rows / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("inputs-btns-rows / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  } // end method


  init() :void {

    if(this.isDebug()) console.log("inputs-btns-rows / init / 시작");

    this.emitEventOnReady();

  } // end method

  emitEventOnReady():void {

    if(this.isDebug()) console.log("inputs-btns-rows / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

  } // end method  

  setMyEventList(myEventList:MyEvent[]):void {

    if(this.isDebug()) console.log("inputs-btns-rows / setMyEventList / 시작");

    if(this.myArray.isNotOK(myEventList)) {
      if(this.isDebug())console.log("inputs-btns-rows / setMyEventList / 중단 / this.myArray.isNotOK(myEventList)");
      return;
    } // end if

    this.myEventList = myEventList;
    // 원본 비교를 위한 copy list 만들기
    this.myEventListCopy = this.myEventService.getCopyEventList(this.myEventList);

    if(this.isDebug())console.log("inputs-btns-rows / setMyEventList / this.myEventList : ",this.myEventList);

    // 열을 추가할 수 있는 기능을 하는 input group 만들기
    let myEvent:MyEvent = this.myEventList[0];
    this.myAddBtnList = [
      new MyButton (
        "추가하기",
        this.myEventService.ON_ADD_ROW,
        myEvent.myChecker,
        myEvent
      )
    ]; 

    this.updateMyRemovableBtnList();   

  } // end method

  private updateMyRemovableBtnList() :void {

    if(this.isDebug()) console.log("inputs-btns-rows / updateMyRemovableBtnList / 시작");

    let myRemovableBtnListNext:MyButton[] = [];

    for (var i = 0; i < this.myEventList.length; ++i) {

      let curMyEvent:MyEvent = this.myEventList[i];
      let myButtonNext:MyButton = 
      new MyButton (
        "빼기",
        this.myEventService.ON_REMOVE_ROW,
        curMyEvent.myChecker,
        curMyEvent
      )

      myRemovableBtnListNext.push(myButtonNext);

    }

    if(this.isDebug()) console.log("inputs-btns-rows / updateMyRemovableBtnList / myRemovableBtnListNext : ",myRemovableBtnListNext);

    this.myRemovableBtnList = myRemovableBtnListNext;
  } // end method

  getCopyEventList(myEventList:MyEvent[]) :MyEvent[] {

    if(this.isDebug()) console.log("inputs-btns-rows / getCopyEventList / 시작");

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

  private getInputTextList() :string[] {
    let inputTextList:string[] = [];

    if(null != this.myEventList && 0 < this.myEventList.length) {
      for (var i = 0; i < this.myEventList.length; ++i) {
        let myEvent:MyEvent = this.myEventList[i];
        if(null != myEvent) {
          inputTextList.push(myEvent.value);
        } // end if
      } // end for
    } // end if

    return inputTextList;
  }

  onChangeFromChild(myEvent:MyEvent) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(this.isDebug()) console.log("inputs-btns-rows / onChangeFromChild / init");

    if(this.isDebug()) console.log("inputs-btns-rows / onChangeFromChild / myEvent : ",myEvent);

    if(null == myEvent && null != myEvent.value) {
      return;
    }

    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(this.isDebug()) console.log("inputs-btns-rows / onChangeFromChild / isOK : ",isOK);
    if(!isOK) {
      let history:any = this.myCheckerService.getLastHistory();
      if(this.isDebug()) console.log("inputs-btns-rows / onChangeFromChild / history : ",history);
    }

    if(this.myEventService.ON_CHANGE === myEvent.eventName) {

      // 변수 전파가 즉시 되지 않으므로 동일한 객체라면 직접 업데이트 해줍니다.
      this.myEventList = this.myEventService.setEventValue(myEvent, this.myEventList);

      let hasChanged:boolean = this.hasChanged();
      this.isDisabledSave = (hasChanged)?false:true;

      // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
      let inputTextList:string[] = this.getInputTextList();
      myEvent.metaObj = inputTextList;

      this.emitter.emit(myEvent);

    } else if(this.myEventService.ON_ADD_ROW === myEvent.eventName) {

      // 공백 문자열도 허용합니다.
      this.myEventList.push(myEvent);

      // MyButton 객체를 만들어 열울 추가합니다.
      let myButtonNew:MyButton =
      new MyButton (
        "빼기",
        this.myEventService.ON_REMOVE_ROW,
        myEvent.myChecker,
        myEvent
      );
      this.myRemovableBtnList.push(myButtonNew);

      // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
      let inputTextList:string[] = this.getInputTextList();
      myEvent.metaObj = inputTextList;

      // 저장 관련 작업을 할 수 없으므로 부모에게 이벤트 전달.
      let hasChanged:boolean = this.hasChanged();
      this.isDisabledSave = (hasChanged)?false:true;
      this.emitter.emit(myEvent);

    } else if(this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {

      let listLengthPrev:number = this.myEventList.length;

      // console.log("BEFORE / this.myEventList : ",this.myEventList);

      // Update my-event!
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

      // Update my-button!
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

        // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
        let inputTextList:string[] = this.getInputTextList();
        myEvent.metaObj = inputTextList;

        myEvent.parentEventList = this.myEventList;
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
          this.myEventList[0].myChecker
      );
      myEventReturn.parentEventList = this.myEventList;

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
          this.myEventList[0].myChecker
      );
      this.rollbackMyEventListCopies();
      myEventReturn.parentEventList = this.myEventList;

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
      this.eventKey,
      // public value:string
      "",
      // public metaObj:any
      "",
      // public myChecker:MyChecker
      this.myEventList[0].myChecker
    );    

    console.log("inputs-btns-rows / save / 010 / myEventReturn : ",myEventReturn);

    // 부모 객체에게는 현재 각 이벤트 객체가 가지고 있는 문자열들을 문자배열로 만들어 metaObj로 전달합니다.
    let inputTextList:string[] = this.getInputTextList();
    myEventReturn.metaObj = inputTextList;

    this.emitter.emit(myEventReturn);

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

    // 원본과 복사본이 동일. '저장'버튼을 비활성화.
    this.isDisabledSave = true;

    // 이벤트 리스트가 바뀌었으므로 버튼 리스트도 바꿔줍니다.
    this.updateMyRemovableBtnList();
  }
  rollbackMyEventListCopies() :void {
    this.myEventList = this.myEventListCopy;
    this.overwriteMyEventList();
  }  
}