import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  NgZone,   
  ElementRef,
  ViewChild,
  EventEmitter }                       from '@angular/core';
import { MyEventService }              from '../../util/my-event.service';
import { MyEvent }                     from '../../util/model/my-event';
import { Location }                    from './model/location';
import { CheckBoxOption }              from '../checkbox/model/checkbox-option';

@Component({
  moduleId: module.id,
  selector: 'search-list',
  templateUrl: 'search-list.component.html',
  styleUrls: [ 'search-list.component.css' ]
})
export class SearchListComponent implements OnInit {

  @ViewChild('iframe') iframe:ElementRef;
  private childContentWindow;

  @Input() isAdmin:Boolean;
  @Input() key:string;
  @Input() myEvent:MyEvent;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() cageHeight:number=-1;
  cageHeightStr:string;
  inputWidth:number=-1;
  inputWidthStr:string;
  myEventCallback:MyEvent;
  @Input() location:Location;

  // 장소 검색 결과
  searchResultList:CheckBoxOption[];

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private myEventService:MyEventService, 
                private zone:NgZone  ) {

    // set function reference out of app. ( ex)iframe )
    window["angularMySL"] = {
      zone: this.zone, 
      componentFn: (value) => this.callFromOutside(value), 
      component: this
    };
  }

  ngOnInit(): void {

    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    if(0 < this.cageHeight) {
      this.cageHeightStr=`${this.cageHeight}px`;
    } else {
      this.cageHeightStr="100%";
    }

    let inputPadding:number = 60;
    this.inputWidth = this.cageWidth - inputPadding;
    if(0 < this.inputWidth) {
      this.inputWidthStr=`${this.inputWidth}px`;
    } else {
      this.inputWidthStr="90%";
    }

    // Javascript, ifarme 통신 
    // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
    this.childContentWindow = this.iframe.nativeElement.contentWindow;

    // 맵 정보가 없는 경우, 기본 맵 정보를 만듭니다.
    if(null == this.location) {
      this.location = new Location(
        // public title:string
        "&lt;b&gt;스타벅스&lt;/b&gt; 갤러리아팰리스점",
        // public telephone:string
        "02-758-8118",
        // public address:string
        "서울특별시 송파구 잠실동 40",
        // public roadAddress:string
        "서울특별시 송파구 올림픽로 212 갤러리아팰리스",
        // public latitude:number
        37.5111896,
        // public longitude:number
        127.0939713
      );
    }

    // TEST - Search Result
    /*
    this.searchResultList = [];
    this.searchResultList.push(
      new CheckBoxOption(
        // public title:string
        "Result - 1",
        // public isFocus:boolean
        false,
        // public myEvent:MyEvent
        null
      )
    );
    this.searchResultList.push(
      new CheckBoxOption(
        // public title:string
        "Result - 2",
        // public isFocus:boolean
        false,
        // public myEvent:MyEvent
        null
      )
    );
    */

  }

  callFromOutside(myEvent) {

    if(null == myEvent || null == myEvent.key) {
      return;
    }

    if("ready_to_init" === myEvent.key) {

      // iframe의 너비, 높이를 변경합니다.
      if(null != this.childContentWindow.setSize) {
        this.childContentWindow.setSize(this.cageWidth, this.cageHeight);
      }

      // iframe에 지도 좌표 - 위도/경도 정보를 전해줍니다.
      if(null != this.location && null != this.childContentWindow.init) {
        this.childContentWindow.init(this.location);
      }
      
      // iframe을 시작합니다.
      // 부모 객체에게 Ready Event 발송 
      let myEventReady:MyEvent =
      this.myEventService.getMyEvent(
          // public eventName:string
          this.myEventService.ON_READY,
          // public key:string
          this.myEventService.KEY_SEARCH_LIST,
          // public value:string
          "",
          // public metaObj:any
          null,
          // public myChecker:MyChecker
          null    
      );
      this.emitter.emit(myEventReady);

    } else if("update" === myEvent.key) {

      // Do something...
      
    }

  }    

  onChangeInputText(value) :void {

    // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.
    let myEventReturn:MyEvent = 
    this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE,
        // public key:string
        this.myEventService.KEY_SEARCH_LIST,
        // public value:string
        value,
        // public metaObj:any
        null,
        // public myChecker:MyChecker
        null    
    );

    this.emitter.emit(myEventReturn);

  }

  onKeyupEnterSearch(value) :void {
    console.log("search-list / onKeyupEnterSearch / value : ",value);
  }

  onKeyupSearchInput(value) :void {
    console.log("search-list / onKeyupSearchInput / value : ",value);
  }

  private isOverSearchResult: boolean=false;
  onMouseenterSearchResult(searchResult:CheckBoxOption) {
    if(null != searchResult && !searchResult.isFocus) {
      searchResult.isFocus = true;
    }
  }
  onMouseleaveSearchResult(searchResult:CheckBoxOption) {
    if(null != searchResult && searchResult.isFocus) {
      searchResult.isFocus = false;
    }
  }
  onClickSearchResult(searchResult:CheckBoxOption) :void {

    console.log("onClickSearchResult / searchResult : ",searchResult);

  }


  /*
  private isOverMagnifier: boolean=false;
  onMouseenterMagnifier() {
    if(!this.isOverMagnifier) {
      this.isOverMagnifier = true;
    }
  }
  onMouseleaveMagnifier() {
    if(this.isOverMagnifier) {
      this.isOverMagnifier = false;
    }
  }
  */

}