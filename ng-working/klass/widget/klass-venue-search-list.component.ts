import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  NgZone,   
  ElementRef,
  ViewChild,
  EventEmitter }                       from '@angular/core';
import { Observable }                  from 'rxjs/Observable';
import { Subject }                     from 'rxjs/Subject';

import { MyEventService }              from '../../util/my-event.service';
import { KlassService }                from '../klass.service';
import { MyEvent }                     from '../../util/model/my-event';
import { KlassVenue }                  from '../model/klass-venue';
import { CheckBoxOption }              from '../../widget/checkbox/model/checkbox-option';

@Component({
  moduleId: module.id,
  selector: 'klass-venue-search-list',
  templateUrl: 'klass-venue-search-list.component.html',
  styleUrls: [ 'klass-venue-search-list.component.css' ]
})
export class KlassVenueSearchListComponent implements OnInit {

  @ViewChild('iframe') iframe:ElementRef;
  private childContentWindow;

  @Input() isAdmin:Boolean;
  @Input() key:string;
  @Input() myEvent:MyEvent;

  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() cageWidthNaverMap:number=-1;
  cageWidthNaverMapStr:string;
  @Input() cageWidthVenueInfo:number=-1;
  cageWidthVenueInfoStr:string;

  @Input() cageHeight:number=-1;
  cageHeightStr:string;
  inputWidth:number=-1;
  inputWidthStr:string;
  myEventCallback:MyEvent;
  @Input() klassVenue:KlassVenue;
  searchBoxText:string;

  // 네이버 지역 검색 결과
  searchResultList: CheckBoxOption[];
  klassVenues: Observable<KlassVenue[]>;
  private searchTermsNaverLocal = new Subject<string>();

  // 네이버 지도 검색 결과
  klassVenuesNaverMap:KlassVenue;
  private searchTermsNaverMap = new Subject<string>();


  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>(); 

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private myEventService:MyEventService, 
                private klassService:KlassService, 
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

      this.cageWidthNaverMap = Math.round(this.cageWidth*(2/3));
      this.cageWidthNaverMapStr = `${this.cageWidthNaverMap}px`;
      this.cageWidthVenueInfo = this.cageWidth - this.cageWidthNaverMap;
      this.cageWidthVenueInfoStr = `${this.cageWidthVenueInfo}px`;

    } else {

      this.cageWidthStr="100%";
      this.cageWidthNaverMapStr="80%";
      this.cageWidthVenueInfoStr="20%";

    }

    if(0 < this.cageHeight) {
      this.cageHeightStr=`${this.cageHeight}px`;
    } else {
      this.cageHeightStr="100%";
    }

    let inputPadding:number = 60;
    this.inputWidth = this.cageWidthNaverMap - inputPadding;
    if(0 < this.inputWidth && 0 < this.cageWidthNaverMap) {
      this.inputWidthStr=`${this.inputWidth}px`;
    } else {
      this.inputWidthStr="90%";
    }

    // Javascript, ifarme 통신 
    // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
    this.childContentWindow = this.iframe.nativeElement.contentWindow;

    // 맵 정보가 없는 경우, 기본 맵 정보를 만듭니다.
    if(null == this.klassVenue) {
      this.klassVenue = new KlassVenue(
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

    this.klassVenues = 
    this.searchTermsNaverLocal
    .debounceTime(300)        // wait for 300ms pause in events
    .distinctUntilChanged()   // ignore if next search term is same as previous
    .switchMap(term => term   // switch to new observable each time
      // return the http search observable
      ? this.klassService.searchKlassVenue(term)
      // or the observable of empty heroes if no search term
      : Observable.of<KlassVenue[]>([]))
    .catch(error => {
      // TODO: real error handling
      console.log(error);
      return Observable.of<KlassVenue[]>([]);
    });    

  }

  callFromOutside(myEvent) {

    if(null == myEvent || null == myEvent.key) {
      return;
    }

    if("ready_to_init" === myEvent.key) {

      // iframe의 너비, 높이를 변경합니다.
      if(null != this.childContentWindow.setSize) {

        console.log("klass-venue-search-list / callFromOutside / setSize / this.cageWidthNaverMap : ",this.cageWidthNaverMap);

        this.childContentWindow.setSize(this.cageWidthNaverMap, this.cageHeight);
      }

      // iframe에 지도 좌표 - 위도/경도 정보를 전해줍니다.
      if(null != this.klassVenue && null != this.childContentWindow.init) {
        this.childContentWindow.init(this.klassVenue);
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

  onKeyupEnterSearch(term) :void {
    this.searchTermsNaverLocal.next(term);    
  }

  onKeyupSearchInput(term) :void {
    this.searchTermsNaverLocal.next(term);
  }

  private isOverSearchResult: boolean=false;
  onMouseenterKlassVenue(klassVenue:KlassVenue) {
    if(null != klassVenue && !klassVenue.isFocus) {
      klassVenue.isFocus = true;
    }
  }
  onMouseleaveKlassVenue(klassVenue:KlassVenue) {
    if(null != klassVenue && klassVenue.isFocus) {
      klassVenue.isFocus = false;
    }
  }
  onClickKlassVenue(klassVenue:KlassVenue) :void {

    this.klassVenuesNaverMap = klassVenue;

    this.klassService.searchKlassMap(
      // q:string
      klassVenue.address
    ).then(klassVenue => {
      this.klassVenuesNaverMap.latitude = klassVenue.latitude;
      this.klassVenuesNaverMap.longitude = klassVenue.longitude;

      // iframe에 위치 업데이트
      if(null != this.childContentWindow.init) {
        this.childContentWindow.init(this.klassVenuesNaverMap);
        // 검색 리스트 삭제.
        this.klassVenues = null;
        this.searchBoxText = this.removeHTMLTags(this.klassVenuesNaverMap.title);
        // DB UPDATE!
        console.log("DB UPDATE!");
      }
    });    
  }
  removeHTMLTags(targetStr:string) :string {
    return targetStr.replace(/\<[a-zA-Z\/]+\>/gi,"");
  }


}