"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
var klass_venue_1 = require('../model/klass-venue');
var klass_service_1 = require('../service/klass.service');
var my_event_watchtower_service_1 = require('../../util/service/my-event-watchtower.service');
var my_event_service_1 = require('../../util/service/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var my_is_1 = require('../../util/helper/my-is');
var my_time_1 = require('../../util/helper/my-time');
var my_array_1 = require('../../util/helper/my-array');
var KlassVenueSearchListComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function KlassVenueSearchListComponent(myEventService, klassService, watchTower, zone) {
        this.myEventService = myEventService;
        this.klassService = klassService;
        this.watchTower = watchTower;
        this.zone = zone;
        this.cageWidth = -1;
        this.cageWidthNaverMap = -1;
        this.cageWidthVenueInfo = -1;
        this.cageHeight = -1;
        this.inputWidth = -1;
        this.isHideKlassVenue = false;
        this.searchTermsNaverLocal = new Subject_1.Subject();
        this.searchTermsNaverMap = new Subject_1.Subject();
        // 이벤트를 부모에게 전달
        this.emitter = new core_1.EventEmitter();
        this.isOverSearchResult = false;
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
        this.myArray = new my_array_1.HelperMyArray();
        this.initIFrame();
    }
    KlassVenueSearchListComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    KlassVenueSearchListComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("k-v-s-l / ngOnInit / init");
        this.initLayout();
        this.initIFrameAfterOnInit();
        // 맵 정보가 없는 경우, 기본 맵 정보를 만듭니다.
        if (null == this.klassVenue) {
            this.klassVenue = this.getDefaultVenue();
        }
        this.initVenueSearch();
        this.subscribeEventPack();
    };
    KlassVenueSearchListComponent.prototype.getDefaultVenue = function () {
        return new klass_venue_1.KlassVenue().set(
        // public title:string
        "<b>스타벅스</b> 갤러리아팰리스점", 
        // public telephone:string
        "02-758-8118", 
        // public address:string
        "서울특별시 송파구 잠실동 40", 
        // public roadAddress:string
        "서울특별시 송파구 올림픽로 212 갤러리아팰리스", 
        // public latitude:number
        37.5111896, 
        // public longitude:number
        127.0939713);
    };
    KlassVenueSearchListComponent.prototype.initIFrame = function () {
        var _this = this;
        if (this.isDebug())
            console.log("k-v-s-l / constructor / init");
        // set function reference out of app. ( ex)iframe )
        window["angularMySL"] = {
            zone: this.zone,
            componentFn: function (value) { return _this.callFromOutside(value); },
            component: this
        };
    };
    KlassVenueSearchListComponent.prototype.initLayout = function () {
        if (this.isDebug())
            console.log("k-v-s-l / initLayout / init");
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
            this.cageWidthNaverMap = Math.round(this.cageWidth * (2 / 3));
            this.cageWidthNaverMapStr = this.cageWidthNaverMap + "px";
            this.cageWidthVenueInfo = this.cageWidth - this.cageWidthNaverMap;
            this.cageWidthVenueInfoStr = this.cageWidthVenueInfo + "px";
        }
        else {
            this.cageWidthStr = "100%";
            this.cageWidthNaverMapStr = "80%";
            this.cageWidthVenueInfoStr = "20%";
        } // end if
        if (0 < this.cageHeight) {
            this.cageHeightStr = this.cageHeight + "px";
        }
        else {
            this.cageHeightStr = "100%";
        } // end if
        var inputPadding = 60;
        this.inputWidth = this.cageWidthNaverMap - inputPadding;
        if (0 < this.inputWidth && 0 < this.cageWidthNaverMap) {
            this.inputWidthStr = this.inputWidth + "px";
        }
        else {
            this.inputWidthStr = "90%";
        } // end if
    };
    // @ Desc : 지도에 표시할 정보를 외부로 부터 받습니다.
    KlassVenueSearchListComponent.prototype.setVenue = function (klassVenue) {
        if (this.isDebug())
            console.log("k-v-s-l / setVenue / init");
        if (null == klassVenue || null == klassVenue.title || "" == klassVenue.title) {
            if (this.isDebug())
                console.log("k-v-s-l / setVenue / 중단 / klassVenue is not valid!");
            return;
        }
        this.klassVenue = this.klassVenuesNaverMap = klassVenue;
        if (this.isDebug())
            console.log("k-v-s-l / setVenue / this.klassVenuesNaverMap : ", this.klassVenuesNaverMap);
    };
    KlassVenueSearchListComponent.prototype.initIFrameAfterOnInit = function () {
        // Javascript, ifarme 통신 
        // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
        this.childContentWindow = this.iframe.nativeElement.contentWindow;
    };
    KlassVenueSearchListComponent.prototype.callFromOutside = function (myEvent) {
        if (null == myEvent || null == myEvent.key) {
            return;
        }
        if ("ready_to_init" === myEvent.key) {
            // iframe의 너비, 높이를 변경합니다.
            if (null != this.childContentWindow.setSize) {
                this.childContentWindow.setSize(this.cageWidthNaverMap, this.cageHeight);
            }
            // iframe에 지도 좌표 - 위도/경도 정보를 전해줍니다.
            if (null != this.klassVenue && null != this.childContentWindow.init) {
                this.childContentWindow.init(this.klassVenue);
            }
            // iframe을 시작합니다.
            // 부모 객체에게 Ready Event 발송 
            var myEvent_1 = this.watchTower.getEventOnReady(
            // eventKey:string, 
            this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_VENUE_MAP, 
            // component
            this);
            this.emitter.emit(myEvent_1);
        }
        else if ("update" === myEvent.key) {
        }
    }; // end method  
    KlassVenueSearchListComponent.prototype.initVenueSearch = function () {
        var _this = this;
        if (this.isDebug())
            console.log("k-v-s-l / initVenueSearch / init");
        this.klassVenues =
            this.searchTermsNaverLocal
                .debounceTime(300) // wait for 300ms pause in events
                .distinctUntilChanged() // ignore if next search term is same as previous
                .switchMap(function (term) {
                if (_this.isDebug())
                    console.log("k-v-s-l / initVenueSearch / switchMap / term : ", term);
                if (null == term || "" === term || term.length < 3) {
                    // 유효하지 않은 검색어는 중단합니다.
                    // 2글자 이상이어야 합니다.
                    return Observable_1.Observable.of([]);
                }
                // 새로운 입력이 들어온다면 검색 결과리스트를 노출합니다.
                _this.isHideKlassVenue = false;
                // switch to new observable each time
                // return the http search observable
                // or the observable of empty heroes if no search term
                return (null != term) ? _this.klassService.searchKlassVenue(term) : Observable_1.Observable.of([]);
            })
                .catch(function (error) {
                // TODO: real error handling
                console.log(error);
                return Observable_1.Observable.of([]);
            });
    }; // end method 
    KlassVenueSearchListComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("k-v-s-l / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("k-v-s-l / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            // 1. 이미 EventPack 로딩이 완료된 경우
            // 부모 객체에게 component가 준비된 것을 알립니다.
            this.emitEventOnReady();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("k-v-s-l / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                // 이벤트 관련 정보가 준비되었습니다.
                // 부모 객체에게 component가 준비된 것을 알립니다.
                _this.emitEventOnReady();
            }); // end subscribe
        } // end if
    }; // end method
    KlassVenueSearchListComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("k-v-s-l / emitEventOnReady / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (this.isDebug())
                console.log("k-v-s-l / emitEventOnReady / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_VENUE_MAP, 
        // component
        this);
        if (this.isDebug())
            console.log("k-v-s-l / emitEventOnReady / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (this.isDebug())
            console.log("k-v-s-l / emitEventOnReady / Done!");
    };
    KlassVenueSearchListComponent.prototype.emitEventOnChangeMeta = function (value, meta) {
        if (this.isDebug())
            console.log("k-v-s-l / emitEventOnChangeMeta / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (this.isDebug())
                console.log("k-v-s-l / emitEventOnChangeMeta / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnChangeMeta(
        // eventKey:string, 
        this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_VENUE_MAP, 
        // value:string, 
        value, 
        // myChecker:MyChecker
        this.watchTower.getMyCheckerService().getFreePassChecker(), 
        // 
        meta);
        if (this.isDebug())
            console.log("k-v-s-l / emitEventOnChangeMeta / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (this.isDebug())
            console.log("k-v-s-l / emitEventOnChangeMeta / Done!");
    };
    KlassVenueSearchListComponent.prototype.onChangeInputText = function (value) {
        // 사용자가 내용을 변경한 뒤에 부모에게 내용이 변경되었다고 이벤트 발송.
        var myEventReturn = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.myEventService.KEY_SEARCH_LIST, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        null);
        this.emitter.emit(myEventReturn);
    };
    KlassVenueSearchListComponent.prototype.onKeyupEnterSearch = function (term) {
        this.searchTermsNaverLocal.next(term);
    };
    KlassVenueSearchListComponent.prototype.onKeyupSearchInput = function (term) {
        this.searchTermsNaverLocal.next(term);
    };
    KlassVenueSearchListComponent.prototype.onMouseenterKlassVenue = function (klassVenue) {
        if (null != klassVenue && !klassVenue.isFocus) {
            klassVenue.isFocus = true;
        }
    };
    KlassVenueSearchListComponent.prototype.onMouseleaveKlassVenue = function (klassVenue) {
        if (null != klassVenue && klassVenue.isFocus) {
            klassVenue.isFocus = false;
        }
    };
    KlassVenueSearchListComponent.prototype.onClickKlassVenue = function (klassVenue) {
        var _this = this;
        if (this.isDebug())
            console.log("klass-venue-search-list / onClickKlassVenue / 시작");
        if (this.isDebug())
            console.log("klass-venue-search-list / onClickKlassVenue / klassVenue : ", klassVenue);
        this.klassVenuesNaverMap = klassVenue;
        this.klassService.searchKlassMap(
        // q:string
        klassVenue.address).then(function (myReponse) {
            if (_this.isDebug())
                console.log("klass-venue-search-list / onClickKlassVenue / myReponse : ", myReponse);
            klassVenue = _this.klassService.setLatLon(myReponse.data, klassVenue);
            _this.klassVenuesNaverMap.latitude = klassVenue.latitude;
            _this.klassVenuesNaverMap.longitude = klassVenue.longitude;
            // iframe에 위치 업데이트
            if (null != _this.childContentWindow.init) {
                _this.childContentWindow.init(_this.klassVenuesNaverMap);
                // (Do not!)검색 리스트 삭제를 하게되면 Observable 이 작동하지 않습니다.
                // this.klassVenues = null;
                // 선택한 업체 이름을 화면에 표시합니다.
                _this.searchBoxText = _this.removeHTMLTags(_this.klassVenuesNaverMap.title);
                // 결과 라스트는 화면에서 가립니다.
                _this.isHideKlassVenue = true;
                _this.emitEventOnChangeMeta(
                // value:string, 
                klassVenue.title, 
                // meta:any
                klassVenue);
            }
        });
    };
    KlassVenueSearchListComponent.prototype.removeHTMLTags = function (targetStr) {
        return targetStr.replace(/\<[a-zA-Z\/]+\>/gi, "");
    };
    __decorate([
        core_1.ViewChild('iframe'), 
        __metadata('design:type', core_1.ElementRef)
    ], KlassVenueSearchListComponent.prototype, "iframe", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassVenueSearchListComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassVenueSearchListComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], KlassVenueSearchListComponent.prototype, "myEvent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassVenueSearchListComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassVenueSearchListComponent.prototype, "cageWidthNaverMap", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassVenueSearchListComponent.prototype, "cageWidthVenueInfo", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassVenueSearchListComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', klass_venue_1.KlassVenue)
    ], KlassVenueSearchListComponent.prototype, "klassVenue", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassVenueSearchListComponent.prototype, "emitter", void 0);
    KlassVenueSearchListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-venue-search-list',
            templateUrl: 'klass-venue-search-list.component.html',
            styleUrls: ['klass-venue-search-list.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, klass_service_1.KlassService, my_event_watchtower_service_1.MyEventWatchTowerService, core_1.NgZone])
    ], KlassVenueSearchListComponent);
    return KlassVenueSearchListComponent;
}());
exports.KlassVenueSearchListComponent = KlassVenueSearchListComponent;
//# sourceMappingURL=klass-venue-search-list.component.js.map