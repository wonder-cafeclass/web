import { Component, 
         OnInit, 
         Input, 
         Output, 
         NgZone,   
         ElementRef,
         ViewChild,
         EventEmitter }                from '@angular/core';
import { Observable }                  from 'rxjs/Observable';
import { Subject }                     from 'rxjs/Subject';

import { KlassVenue }                  from '../model/klass-venue';
import { KlassService }                from '../service/klass.service';

import { CheckBoxOption }              from '../../widget/checkbox/model/checkbox-option';

import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';
import { MyEventService }              from '../../util/service/my-event.service';

import { MyEvent }                     from '../../util/model/my-event';
import { MyResponse }                  from '../../util/model/my-response';

import { HelperMyIs }                  from '../../util/helper/my-is';
import { HelperMyTime }                from '../../util/helper/my-time';
import { HelperMyArray }               from '../../util/helper/my-array';

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
  isHideKlassVenue:boolean=false;
  searchBoxText:string;

  // 네이버 지역 검색 결과
  searchResultList: CheckBoxOption[];
  klassVenues: Observable<KlassVenue[]>;
  private searchTermsNaverLocal = new Subject<string>();

  // 네이버 지도 검색 결과
  klassVenuesNaverMap:KlassVenue;
  private searchTermsNaverMap = new Subject<string>();

  private myIs:HelperMyIs;
  private myTime:HelperMyTime;
  private myArray:HelperMyArray;

  // 이벤트를 부모에게 전달
  @Output() emitter = new EventEmitter<any>();

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private myEventService:MyEventService, 
                private klassService:KlassService, 
                private watchTower:MyEventWatchTowerService,
                private zone:NgZone  ) {

    this.myIs = new HelperMyIs();
    this.myTime = new HelperMyTime();
    this.myArray = new HelperMyArray();

    this.initIFrame();

  }

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-v-s-l / ngOnInit / init");

    this.initLayout();

    this.initIFrameAfterOnInit();

    // 맵 정보가 없는 경우, 기본 맵 정보를 만듭니다.
    if(null == this.klassVenue) {
      this.klassVenue = this.getDefaultVenue();

    }

    this.initVenueSearch();

    this.subscribeEventPack();

  }

  private getDefaultVenue():KlassVenue {
    return new KlassVenue(
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

  private initIFrame(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-v-s-l / constructor / init");

    // set function reference out of app. ( ex)iframe )
    window["angularMySL"] = {
      zone: this.zone, 
      componentFn: (value) => this.callFromOutside(value), 
      component: this
    };

  }

  private initLayout() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-v-s-l / initLayout / init");

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

    } // end if

    if(0 < this.cageHeight) {
      this.cageHeightStr=`${this.cageHeight}px`;
    } else {
      this.cageHeightStr="100%";
    } // end if

    let inputPadding:number = 60;
    this.inputWidth = this.cageWidthNaverMap - inputPadding;
    if(0 < this.inputWidth && 0 < this.cageWidthNaverMap) {
      this.inputWidthStr=`${this.inputWidth}px`;
    } else {
      this.inputWidthStr="90%";
    } // end if

  }

  private initIFrameAfterOnInit() :void {
    // Javascript, ifarme 통신 
    // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
    this.childContentWindow = this.iframe.nativeElement.contentWindow;
  }  

  callFromOutside(myEvent) {

    if(null == myEvent || null == myEvent.key) {
      return;
    }

    if("ready_to_init" === myEvent.key) {

      // iframe의 너비, 높이를 변경합니다.
      if(null != this.childContentWindow.setSize) {
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

  } // end method  

  private initVenueSearch():void {

    this.klassVenues = 
    this.searchTermsNaverLocal
    .debounceTime(300)        // wait for 300ms pause in events
    .distinctUntilChanged()   // ignore if next search term is same as previous
    .switchMap(term => {

      // 새로운 입력이 들어온다면 검색 결과리스트를 노출합니다.
      this.isHideKlassVenue = false;

      // switch to new observable each time
      // return the http search observable
      // or the observable of empty heroes if no search term
      return (null!=term)?this.klassService.searchKlassVenue(term):Observable.of<KlassVenue[]>([]);
    })
    .catch(error => {
      // TODO: real error handling
      console.log(error);
      return Observable.of<KlassVenue[]>([]);
    }); 
    
  } // end method 

  private subscribeEventPack() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-v-s-l / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(isDebug) console.log("k-v-s-l / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      // 1. 이미 EventPack 로딩이 완료된 경우

      // 부모 객체에게 component가 준비된 것을 알립니다.
      this.emitEventOnReady();

    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(isDebug) console.log("k-v-s-l / subscribeEventPack / isEventPackReady : ",isEventPackReady);

        // 이벤트 관련 정보가 준비되었습니다.

        // 부모 객체에게 component가 준비된 것을 알립니다.
        this.emitEventOnReady();

      }); // end subscribe

    } // end if

  } // end method


  private emitEventOnReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-v-s-l / emitEventOnReady / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("k-v-s-l / emitEventOnReady / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_VENUE_MAP,
      // component
      this
    );

    if(isDebug) console.log("k-v-s-l / emitEventOnReady / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("k-v-s-l / emitEventOnReady / Done!");

  }   

  private emitEventOnChangeMeta(value:string, meta:any) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("k-v-s-l / emitEventOnChangeMeta / init");

    if(!this.watchTower.getIsEventPackReady()) {
      if(isDebug) console.log("k-v-s-l / emitEventOnChangeMeta / 중단 / EventPack is not valid!");    
      return;
    }

    let myEventOnReady:MyEvent = 
    this.watchTower.getEventOnChangeMeta(
      // eventKey:string, 
      this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_VENUE_MAP,
      // value:string, 
      value,
      // myChecker:MyChecker
      this.watchTower.getMyCheckerService().getFreePassChecker(),
      // 
      meta
    );

    if(isDebug) console.log("k-v-s-l / emitEventOnChangeMeta / myEventOnReady : ",myEventOnReady);

    this.emitter.emit(myEventOnReady);

    if(isDebug) console.log("k-v-s-l / emitEventOnChangeMeta / Done!");

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-venue-search-list / onClickKlassVenue / 시작");

    this.klassVenuesNaverMap = klassVenue;

    this.klassService.searchKlassMap(
      // q:string
      klassVenue.address
    ).then((myReponse:MyResponse) => {

      if(isDebug) console.log("klass-venue-search-list / onClickKlassVenue / myReponse : ",myReponse);

      this.klassVenuesNaverMap.latitude = klassVenue.latitude;
      this.klassVenuesNaverMap.longitude = klassVenue.longitude;

      // iframe에 위치 업데이트
      if(null != this.childContentWindow.init) {
        this.childContentWindow.init(this.klassVenuesNaverMap);

        // (Do not!)검색 리스트 삭제를 하게되면 Observable 이 작동하지 않습니다.
        // this.klassVenues = null;

        // 선택한 업체 이름을 화면에 표시합니다.
        this.searchBoxText = this.removeHTMLTags(this.klassVenuesNaverMap.title);

        // 결과 라스트는 화면에서 가립니다.
        this.isHideKlassVenue = true;

        // DB UPDATE!
        console.log("DB UPDATE!");

        this.emitEventOnChangeMeta(
          // value:string, 
          klassVenue.title,
          // meta:any
          klassVenue
        );
      }
    });
  }
  removeHTMLTags(targetStr:string) :string {
    return targetStr.replace(/\<[a-zA-Z\/]+\>/gi,"");
  }


}