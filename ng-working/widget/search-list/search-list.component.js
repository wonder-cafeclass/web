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
var my_event_service_1 = require('../../util/my-event.service');
var my_event_1 = require('../../util/model/my-event');
var location_1 = require('./model/location');
var SearchListComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function SearchListComponent(myEventService, zone) {
        var _this = this;
        this.myEventService = myEventService;
        this.zone = zone;
        this.cageWidth = -1;
        this.cageHeight = -1;
        this.inputWidth = -1;
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
    SearchListComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        }
        if (0 < this.cageHeight) {
            this.cageHeightStr = this.cageHeight + "px";
        }
        else {
            this.cageHeightStr = "100%";
        }
        var inputPadding = 60;
        this.inputWidth = this.cageWidth - inputPadding;
        if (0 < this.inputWidth) {
            this.inputWidthStr = this.inputWidth + "px";
        }
        else {
            this.inputWidthStr = "90%";
        }
        // Javascript, ifarme 통신 
        // https://plnkr.co/edit/e77JkHmO7n5FYoKSXnIL?p=preview
        this.childContentWindow = this.iframe.nativeElement.contentWindow;
        // 맵 정보가 없는 경우, 기본 맵 정보를 만듭니다.
        if (null == this.location) {
            this.location = new location_1.Location(
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
    };
    SearchListComponent.prototype.callFromOutside = function (myEvent) {
        if (null == myEvent || null == myEvent.key) {
            return;
        }
        if ("ready_to_init" === myEvent.key) {
            // iframe의 너비, 높이를 변경합니다.
            if (null != this.childContentWindow.setSize) {
                this.childContentWindow.setSize(this.cageWidth, this.cageHeight);
            }
            // iframe에 지도 좌표 - 위도/경도 정보를 전해줍니다.
            if (null != this.location && null != this.childContentWindow.init) {
                this.childContentWindow.init(this.location);
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
    SearchListComponent.prototype.onChangeInputText = function (value) {
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
    SearchListComponent.prototype.onKeyupEnterSearch = function (value) {
        console.log("search-list / onKeyupEnterSearch / value : ", value);
    };
    SearchListComponent.prototype.onKeyupSearchInput = function (value) {
        console.log("search-list / onKeyupSearchInput / value : ", value);
    };
    SearchListComponent.prototype.onMouseenterSearchResult = function (searchResult) {
        if (null != searchResult && !searchResult.isFocus) {
            searchResult.isFocus = true;
        }
    };
    SearchListComponent.prototype.onMouseleaveSearchResult = function (searchResult) {
        if (null != searchResult && searchResult.isFocus) {
            searchResult.isFocus = false;
        }
    };
    SearchListComponent.prototype.onClickSearchResult = function (searchResult) {
        console.log("onClickSearchResult / searchResult : ", searchResult);
    };
    __decorate([
        core_1.ViewChild('iframe'), 
        __metadata('design:type', core_1.ElementRef)
    ], SearchListComponent.prototype, "iframe", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SearchListComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SearchListComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_event_1.MyEvent)
    ], SearchListComponent.prototype, "myEvent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SearchListComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SearchListComponent.prototype, "cageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', location_1.Location)
    ], SearchListComponent.prototype, "location", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SearchListComponent.prototype, "emitter", void 0);
    SearchListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'search-list',
            templateUrl: 'search-list.component.html',
            styleUrls: ['search-list.component.css']
        }), 
        __metadata('design:paramtypes', [my_event_service_1.MyEventService, core_1.NgZone])
    ], SearchListComponent);
    return SearchListComponent;
}());
exports.SearchListComponent = SearchListComponent;
//# sourceMappingURL=search-list.component.js.map