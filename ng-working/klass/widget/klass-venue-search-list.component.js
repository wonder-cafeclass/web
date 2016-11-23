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
var my_event_service_1 = require('../../util/service/my-event.service');
var klass_service_1 = require('../klass.service');
var my_event_1 = require('../../util/model/my-event');
var klass_venue_1 = require('../model/klass-venue');
var KlassVenueSearchListComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function KlassVenueSearchListComponent(myEventService, klassService, zone) {
        var _this = this;
        this.myEventService = myEventService;
        this.klassService = klassService;
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
        // set function reference out of app. ( ex)iframe )
        window["angularMySL"] = {
            zone: this.zone,
            componentFn: function (value) { return _this.callFromOutside(value); },
            component: this
        };
    }
    KlassVenueSearchListComponent.prototype.ngOnInit = function () {
        var _this = this;
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
        }
        if (0 < this.cageHeight) {
            this.cageHeightStr = this.cageHeight + "px";
        }
        else {
            this.cageHeightStr = "100%";
        }
        var inputPadding = 60;
        this.inputWidth = this.cageWidthNaverMap - inputPadding;
        if (0 < this.inputWidth && 0 < this.cageWidthNaverMap) {
            this.inputWidthStr = this.inputWidth + "px";
        }
        else {
            this.inputWidthStr = "90%";
        }
        // Javascript, ifarme 통신 
        // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
        this.childContentWindow = this.iframe.nativeElement.contentWindow;
        // 맵 정보가 없는 경우, 기본 맵 정보를 만듭니다.
        if (null == this.klassVenue) {
            this.klassVenue = new klass_venue_1.KlassVenue(
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
            127.0939713);
        }
        this.klassVenues =
            this.searchTermsNaverLocal
                .debounceTime(300) // wait for 300ms pause in events
                .distinctUntilChanged() // ignore if next search term is same as previous
                .switchMap(function (term) {
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
            var myEventReady = this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_READY, 
            // public key:string
            this.myEventService.KEY_SEARCH_LIST, 
            // public value:string
            "", 
            // public metaObj:any
            null, 
            // public myChecker:MyChecker
            null);
            this.emitter.emit(myEventReady);
        }
        else if ("update" === myEvent.key) {
        }
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
        this.klassVenuesNaverMap = klassVenue;
        this.klassService.searchKlassMap(
        // q:string
        klassVenue.address).then(function (klassVenue) {
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
                // DB UPDATE!
                console.log("DB UPDATE!");
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
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, klass_service_1.KlassService, core_1.NgZone])
    ], KlassVenueSearchListComponent);
    return KlassVenueSearchListComponent;
}());
exports.KlassVenueSearchListComponent = KlassVenueSearchListComponent;
//# sourceMappingURL=klass-venue-search-list.component.js.map