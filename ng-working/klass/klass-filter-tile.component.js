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
var common_1 = require('@angular/common');
var Subject_1 = require('rxjs/Subject');
var klass_service_1 = require('./service/klass.service');
var klass_level_1 = require('./model/klass-level');
// import { KlassStation }         from './model/klass-station';
var klass_subway_line_1 = require('./model/klass-subway-line');
var klass_subway_station_1 = require('./model/klass-subway-station');
var klass_day_1 = require('./model/klass-day');
var klass_time_1 = require('./model/klass-time');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_array_1 = require('../util/helper/my-array');
var KlassFilterTileComponent = (function () {
    // REMOVE ME
    // private constMap:any;
    function KlassFilterTileComponent(myCheckerService, myEventService, watchTower, klassService, location) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.klassService = klassService;
        this.location = location;
        // Observable Selectile 
        this.klassSelectileSubject = new Subject_1.Subject();
        this.focusIdxKlassLevel = 0;
        this.focusIdxKlassSubwayLine = 1;
        this.focusIdxKlassSubwayStation = 2;
        this.focusIdxKlassDay = 3;
        this.focusIdxKlassTime = 4;
        this.emitter = new core_1.EventEmitter();
        // 검색을 가지고 있는 부모 컴포넌트에게 selectile의 값을 전달하기 위한 통신 이벤트객체
        this.emitOnChangedSelectile = new core_1.EventEmitter();
        // 컴포넌트 로딩 완료 이벤트 발사!
        this.emitOnInitKlassList = new core_1.EventEmitter();
        this.elementWidth = 50;
        this.elementWidthStr = "";
        this.rowWidthStr = "";
        this.isEnterST = false;
        this.myArray = new my_array_1.HelperMyArray();
    }
    KlassFilterTileComponent.prototype.isDebug = function () {
        return true;
        // return this.watchTower.this.isDebug();
    };
    KlassFilterTileComponent.prototype.setSelectileProps = function () {
        if (this.isDebug())
            console.log("klass-filter-tile / setSelectileProps / 시작");
        // watchTower에서 checker의 정보를 가져옵니다.
        this.setLevel();
        this.setDay();
        this.setTime();
        this.setSubwayLine();
        this.setSubwayStation("");
        this.showSelectile(null, null, -1);
    };
    KlassFilterTileComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.isDebug())
            console.log("klass-filter-tile / ngOnInit / 시작");
        if (this.watchTower.getIsViewPackReady()) {
            this.setSelectileProps();
        }
        else {
            this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
                if (_this.isDebug())
                    console.log("klass-filter-tile / ngOnInit / subscribe / isViewPackReady : ", isViewPackReady);
                _this.setSelectileProps();
            }); // end subscribe       
        } // end if
        // @ Deprecated
        this.emitOnInitKlassList.emit();
        var _self = this;
        this.klassSelectileSubject.subscribe(function (x) {
            _self.updateShowingSelectile(x);
            if (this.isDebug())
                console.log("TEST - 002");
        }, function (err) {
            // error report
            console.log('Error: ' + err);
        }, function () {
            console.log('Completed');
        });
    }; // end method
    KlassFilterTileComponent.prototype.updateLayout = function (stColCntPerRow) {
        if (!(0 < stColCntPerRow)) {
            return;
        }
        this.elementWidthStr = "100%";
        this.rowWidthStr = "198px";
        if (0 < this.elementWidth) {
            this.elementWidthStr = this.elementWidth + "px";
            var rowWidth = this.elementWidth * stColCntPerRow;
            if (this.isDebug())
                console.log("klass-filter-tile / ngOnInit / rowWidth : ", rowWidth);
            this.rowWidthStr = rowWidth + "px";
        }
    };
    KlassFilterTileComponent.prototype.setLevel = function () {
        if (this.isDebug())
            console.log("klass-filter-tile / setLevel / 시작");
        if (!this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-filter-tile / setLevel / 중단 / !IsViewPackReady() : ", !this.watchTower.getIsViewPackReady());
            return;
        }
        // klass Level
        var klassLevelList = this.watchTower.getMyConst().getList("class_level_list");
        var klassLevelEngList = this.watchTower.getMyConst().getList("class_level_eng_list");
        var klassLevelKorList = this.watchTower.getMyConst().getList("class_level_kor_list");
        var klassLevelImgList = this.watchTower.getMyConst().getList("class_level_img_url_list");
        var klassLevelObjList = [];
        for (var i = 0; i < klassLevelList.length; ++i) {
            // code...
            var key = klassLevelList[i];
            var name_eng = klassLevelEngList[i];
            var name_kor = klassLevelKorList[i];
            var img_url = klassLevelImgList[i];
            var klassLevel = new klass_level_1.KlassLevel(key, name_eng, name_kor, img_url);
            klassLevelObjList.push(klassLevel);
        }
        this.klassLevels = klassLevelObjList;
        if (this.myArray.isOK(this.klassLevels)) {
            // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
            for (var i = 0; i < this.klassLevels.length; ++i) {
                var nextObj = this.klassLevels[i];
                nextObj.selectableList = this.klassLevels;
                nextObj.focusIdx = this.focusIdxKlassLevel;
            }
            this.klassLevelSelected = this.klassLevels[0];
        }
    };
    KlassFilterTileComponent.prototype.setSubwayLine = function () {
        if (this.isDebug())
            console.log("klass-filter-tile / setSubwayLine / 시작");
        if (!this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-filter-tile / setSubwayLine / 중단 / !IsViewPackReady() : ", !this.watchTower.getIsViewPackReady());
            return;
        }
        // klass Subway Line
        var klassSubwayLineList = this.watchTower.getMyConst().getList("subway_line_list");
        var klassSubwayLineEngList = this.watchTower.getMyConst().getList("subway_line_eng_list");
        var klassSubwayLineKorList = this.watchTower.getMyConst().getList("subway_line_kor_list");
        var klassSubwayLineImgList = this.watchTower.getMyConst().getList("subway_line_img_list");
        var klassSubwayLineObjList = [];
        for (var i = 0; i < klassSubwayLineList.length; ++i) {
            // code...
            var key = klassSubwayLineList[i];
            var name_eng = klassSubwayLineEngList[i];
            var name_kor = klassSubwayLineKorList[i];
            var img_url = klassSubwayLineImgList[i];
            // 해당 노선에 역이 등록되어 있지 않다면 선택 리스트에 노출되지 않습니다.
            var subwayStationList = this.watchTower.getMyConst().getNestedChildList(
            // parentKey:string, 
            "subway_line_list", 
            // parentValue:string, 
            key, 
            // childKey:string
            "subway_station_list");
            if (this.myArray.isNotOK(subwayStationList)) {
                continue;
            } // end if
            var klassSubwayLine = new klass_subway_line_1.KlassSubwayLine(key, name_eng, name_kor, img_url);
            klassSubwayLineObjList.push(klassSubwayLine);
        }
        this.klassSubwayLines = klassSubwayLineObjList;
        if (this.myArray.isOK(this.klassSubwayLines)) {
            // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
            for (var i = 0; i < this.klassSubwayLines.length; ++i) {
                var nextObj = this.klassSubwayLines[i];
                nextObj.selectableList = this.klassSubwayLines;
                nextObj.focusIdx = this.focusIdxKlassSubwayLine;
            }
            this.klassSubwayLineSelected = this.klassSubwayLines[0];
        } // end if
    }; // end method
    KlassFilterTileComponent.prototype.setSubwayStation = function (subwayLineNameSelected) {
        if (this.isDebug())
            console.log("klass-filter-tile / setSubwayStation / 시작");
        if (!this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-filter-tile / setSubwayStation / 중단 / !IsViewPackReady() : ", !this.watchTower.getIsViewPackReady());
            return;
        } // end if
        // Klass Subway Station
        if (null == subwayLineNameSelected || "" === subwayLineNameSelected) {
            // 지하철 노선이 선택되지 않았다면 지하철 역도 선택되지 않음.
            var subwayLineSelected = this.klassSubwayLines[0];
            subwayLineNameSelected = subwayLineSelected.key;
        } // end if
        if (this.isDebug())
            console.log("klass-filter-tile / setSubwayStation / subwayLineSelected : ", subwayLineSelected);
        if (this.isDebug())
            console.log("klass-filter-tile / setSubwayStation / subwayLineNameSelected : ", subwayLineNameSelected);
        var subwayStationList = this.watchTower.getMyConst().getNestedChildList(
        // parentKey:string, 
        "subway_line_list", 
        // parentValue:string, 
        subwayLineNameSelected, 
        // childKey:string
        "subway_station_list");
        if (this.isDebug())
            console.log("klass-filter-tile / setSubwayStation / subwayStationList : ", subwayStationList);
        var subwayStationEngList = this.watchTower.getMyConst().getNestedChildList(
        // parentKey:string, 
        "subway_line_list", 
        // parentValue:string, 
        subwayLineNameSelected, 
        // childKey:string
        "subway_station_eng_list");
        var subwayStationKorList = this.watchTower.getMyConst().getNestedChildList(
        // parentKey:string, 
        "subway_line_list", 
        // parentValue:string, 
        subwayLineNameSelected, 
        // childKey:string
        "subway_station_kor_list");
        var subwayStationImgList = this.watchTower.getMyConst().getNestedChildList(
        // parentKey:string, 
        "subway_line_list", 
        // parentValue:string, 
        subwayLineNameSelected, 
        // childKey:string
        "subway_station_img_list");
        var klassSubwayStationObjList = [];
        for (var i = 0; i < subwayStationList.length; ++i) {
            // code...
            var key = subwayStationList[i];
            var name_eng = subwayStationEngList[i];
            var name_kor = subwayStationKorList[i];
            var img_url = subwayStationImgList[i];
            var klassSubwayStation = new klass_subway_station_1.KlassSubwayStation(key, name_eng, name_kor, img_url);
            klassSubwayStationObjList.push(klassSubwayStation);
        }
        this.klassSubwayStations = klassSubwayStationObjList;
        if (this.isDebug())
            console.log("klass-filter-tile / setSubwayStation / this.klassSubwayStations : ", this.klassSubwayStations);
        if (this.myArray.isOK(this.klassSubwayStations)) {
            // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
            for (var i = 0; i < this.klassSubwayStations.length; ++i) {
                var nextObj = this.klassSubwayStations[i];
                nextObj.selectableList = this.klassSubwayStations;
                nextObj.focusIdx = this.focusIdxKlassSubwayStation;
            } // end for      
            this.klassSubwayStationSelected = this.klassSubwayStations[0];
        }
    };
    KlassFilterTileComponent.prototype.setDay = function () {
        if (this.isDebug())
            console.log("klass-filter-tile / setDay / 시작");
        if (!this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-filter-tile / setDay / 중단 / !IsViewPackReady() : ", !this.watchTower.getIsViewPackReady());
            return;
        }
        // klass Day
        var klassDayList = this.watchTower.getMyConst().getList("class_days_list");
        var klassDayEngList = this.watchTower.getMyConst().getList("class_days_eng_list");
        var klassDayKorList = this.watchTower.getMyConst().getList("class_days_kor_list");
        var klassDayImgList = this.watchTower.getMyConst().getList("class_days_img_url_list");
        var klassDayObjList = [];
        for (var i = 0; i < klassDayList.length; ++i) {
            // code...
            var key = klassDayList[i];
            var name_eng = klassDayEngList[i];
            var name_kor = klassDayKorList[i];
            var img_url = klassDayImgList[i];
            var klassDay = new klass_day_1.KlassDay(key, name_eng, name_kor, img_url);
            klassDayObjList.push(klassDay);
        }
        this.klassDays = klassDayObjList;
        if (this.myArray.isOK(this.klassDays)) {
            // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
            for (var i = 0; i < this.klassDays.length; ++i) {
                var nextObj = this.klassDays[i];
                nextObj.selectableList = this.klassDays;
                nextObj.focusIdx = this.focusIdxKlassDay;
            }
            this.klassDaySelected = this.klassDays[0];
        }
    }; // end method
    KlassFilterTileComponent.prototype.setTime = function () {
        if (this.isDebug())
            console.log("klass-filter-tile / setTime / 시작");
        if (!this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("klass-filter-tile / setTime / 중단 / !IsViewPackReady() : ", !this.watchTower.getIsViewPackReady());
            return;
        }
        // klass Time
        var klassTimeList = this.watchTower.getMyConst().getList("class_times_list");
        var klassTimeEngList = this.watchTower.getMyConst().getList("class_times_eng_list");
        var klassTimeKorList = this.watchTower.getMyConst().getList("class_times_kor_list");
        var klassTimeHHMMList = this.watchTower.getMyConst().getList("class_times_hh_mm_list");
        var klassTimeImgList = this.watchTower.getMyConst().getList("class_times_img_url_list");
        var klassTimeObjList = [];
        for (var i = 0; i < klassTimeList.length; ++i) {
            // code...
            var key = klassTimeList[i];
            var name_eng = klassTimeEngList[i];
            var name_kor = klassTimeKorList[i];
            var hh_mm = klassTimeHHMMList[i];
            var img_url = klassTimeImgList[i];
            var klassTime = new klass_time_1.KlassTime(key, name_eng, name_kor, hh_mm, img_url);
            klassTimeObjList.push(klassTime);
        }
        this.klassTimes = klassTimeObjList;
        if (this.myArray.isOK(this.klassTimes)) {
            // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
            for (var i = 0; i < this.klassTimes.length; ++i) {
                var nextObj = this.klassTimes[i];
                nextObj.selectableList = this.klassTimes;
                nextObj.focusIdx = this.focusIdxKlassTime;
            }
            this.klassTimeSelected = this.klassTimes[0];
        } // end if
    }; // end method
    KlassFilterTileComponent.prototype.getSelectedIdx = function (targetList, key, value) {
        var selectedIdx = -1;
        for (var i = 0; i < targetList.length; i++) {
            var element = targetList[i];
            if (element[key] === value) {
                selectedIdx = i;
                break;
            }
        }
        return selectedIdx;
    };
    KlassFilterTileComponent.prototype.getNextElement = function (targetList, prevIdx) {
        var nextElement = null;
        if (prevIdx === (targetList.length - 1)) {
            nextElement = targetList[0];
        }
        else {
            nextElement = targetList[prevIdx + 1];
        }
        return nextElement;
    };
    KlassFilterTileComponent.prototype.enterSelectile = function (selectile) {
        if (this.isDebug())
            console.log("klass-filter-tile / enterSelectile / 시작");
        if (selectile.class_name !== "empty") {
            if (this.isDebug())
                console.log("klass-filter-tile / enterSelectile / 중단 / selectile.class_name !== \"empty\"");
            return;
        }
        if (this.isEnterST) {
            if (this.isDebug())
                console.log("klass-filter-tile / enterSelectile / 중단 / 이미 selectile에 들어왔습니다.");
            return;
        }
        var selectableList = selectile["selectableList"];
        if (this.myArray.isNotOK(selectableList)) {
            if (this.isDebug())
                console.log("klass-filter-tile / enterSelectile / 중단 / this.myArray.isNotOK(selectableList)");
            this.leaveTable();
            return;
        }
        if (selectableList.length < 2) {
            if (this.isDebug())
                console.log("klass-filter-tile / enterSelectile / 중단 / selectableList.length < 2");
            this.leaveTable();
            return;
        }
        if (selectile instanceof klass_subway_line_1.KlassSubwayLine) {
            if (this.isDebug())
                console.log("klass-filter-tile / enterSelectile / 지하철 노선도가 변경되었다면, 지하철 역 리스트도 변경되어야 합니다.");
            this.setSubwayStation(selectile.key);
        } // end if
        if (this.isDebug())
            console.log("klass-filter-tile / enterSelectile / selectile : ", selectile);
        if (this.isDebug())
            console.log("klass-filter-tile / enterSelectile / selectableList : ", selectableList);
        this.isEnterST = true;
        if (selectile && selectableList) {
            this.showSelectile(selectile["selectableList"], selectile, selectile["focusIdx"]);
        }
    };
    KlassFilterTileComponent.prototype.leaveSelectile = function (selectile) {
        // selectile 내부의 버튼에 mouseover시 leave로 판정. 이것을 막는 방법은?
        if (selectile.class_name !== "knob") {
            return;
        }
        this.isEnterST = false;
    };
    KlassFilterTileComponent.prototype.leaveTable = function () {
        this.isEnterST = false;
        this.showSelectile(null, null, -1);
    };
    KlassFilterTileComponent.prototype.clickSelectile = function (event, selectile) {
        event.stopPropagation();
        if (null == selectile) {
            // error report
            return;
        }
        this.updateShowingSelectile(selectile);
    };
    // REFACTOR ME - widget으로 옮겨져야 할 엘리먼트.
    KlassFilterTileComponent.prototype.updateShowingSelectilesAll = function (klassLevel, klassSubwayLine, klassSubwayStation, klassDay, klassTime) {
        if (this.isDebug())
            console.log("klass-filter-tile / updateShowingSelectilesAll / 시작");
        if (null == klassLevel) {
            if (this.isDebug())
                console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassLevel is not valid!");
            return;
        }
        if (null == klassSubwayLine) {
            if (this.isDebug())
                console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassSubwayLine is not valid!");
            return;
        }
        if (null == klassSubwayStation) {
            if (this.isDebug())
                console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassSubwayStation is not valid!");
            return;
        }
        if (null == klassDay) {
            if (this.isDebug())
                console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassDay is not valid!");
            return;
        }
        if (null == klassTime) {
            if (this.isDebug())
                console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassTime is not valid!");
            return;
        }
        this.selectileTable;
        // 선택된 필드들을 검색, 지정한다.
        for (var i = 0; i < this.klassLevels.length; ++i) {
            var target = this.klassLevels[i];
            if (target.isSharing("key", klassLevel)) {
                if (this.isDebug())
                    console.log("klass-filter-tile / updateShowingSelectilesAll / target : ", target);
                this.klassLevelSelected = target;
            }
        } // end for
        for (var i = 0; i < this.klassSubwayLines.length; ++i) {
            var target = this.klassSubwayLines[i];
            if (target.isSharing("key", klassSubwayLine)) {
                if (this.isDebug())
                    console.log("klass-filter-tile / updateShowingSelectilesAll / target : ", target);
                this.klassSubwayLineSelected = target;
            }
        } // end for
        for (var i = 0; i < this.klassSubwayStations.length; ++i) {
            var target = this.klassSubwayStations[i];
            if (target.isSharing("key", klassSubwayStation)) {
                if (this.isDebug())
                    console.log("klass-filter-tile / updateShowingSelectilesAll / target : ", target);
                this.klassSubwayStationSelected = target;
            }
        } // end for
        for (var i = 0; i < this.klassDays.length; ++i) {
            var target = this.klassDays[i];
            if (target.isSharing("key", klassDay)) {
                if (this.isDebug())
                    console.log("klass-filter-tile / updateShowingSelectilesAll / target : ", target);
                this.klassDaySelected = target;
            }
        } // end for
        for (var i = 0; i < this.klassTimes.length; ++i) {
            var target = this.klassTimes[i];
            if (target.isSharing("key", klassTime)) {
                if (this.isDebug())
                    console.log("klass-filter-tile / updateShowingSelectilesAll / klassTimeFromList : ", target);
                this.klassTimeSelected = target;
            }
        } // end for
        this.leaveTable();
    };
    KlassFilterTileComponent.prototype.updateShowingSelectile = function (selectile) {
        if (null == selectile) {
            // error report
            return;
        }
        var hasChanged = false;
        if (selectile instanceof klass_level_1.KlassLevel) {
            if (null == this.klassLevelSelected || this.klassLevelSelected.key !== selectile.key) {
                this.klassLevelSelected = selectile;
                hasChanged = true;
            }
        }
        else if (selectile instanceof klass_subway_line_1.KlassSubwayLine) {
            if (null == this.klassSubwayLineSelected || this.klassSubwayLineSelected.key !== selectile.key) {
                this.klassSubwayLineSelected = selectile;
                hasChanged = true;
            }
        }
        else if (selectile instanceof klass_subway_station_1.KlassSubwayStation) {
            if (null == this.klassSubwayStationSelected || this.klassSubwayStationSelected.key !== selectile.key) {
                this.klassSubwayStationSelected = selectile;
                hasChanged = true;
            }
        }
        else if (selectile instanceof klass_day_1.KlassDay) {
            if (null == this.klassDaySelected || this.klassDaySelected.key !== selectile.key) {
                this.klassDaySelected = selectile;
                hasChanged = true;
            }
        }
        else if (selectile instanceof klass_time_1.KlassTime) {
            if (null == this.klassTimeSelected || this.klassTimeSelected.key !== selectile.key) {
                this.klassTimeSelected = selectile;
                hasChanged = true;
            }
        }
        this.leaveTable();
        if (hasChanged) {
            // 이전과 다른 값을 선택한 경우에만 리스트를 조회한다.
            this.emitChangedSelectile();
        }
    };
    KlassFilterTileComponent.prototype.emitChangedSelectile = function () {
        // 변경된 selectile의 값을 전달한다.
        var selectileMap = this.getFocusedSelectiles();
        this.emitOnChangedSelectile.emit(selectileMap);
        this.emitEventOnChange(
        // value:string, 
        "", 
        // metaObj:any   
        selectileMap);
    };
    KlassFilterTileComponent.prototype.emitEventOnChange = function (value, metaObj) {
        if (this.isDebug())
            console.log("klass-filter-tile / emitEventOnChange / 시작");
        if (null == value) {
            if (this.isDebug())
                console.log("klass-filter-tile / emitEventOnChange / 중단 / value is not valid!");
            return;
        }
        if (null == metaObj) {
            if (this.isDebug())
                console.log("klass-filter-tile / emitEventOnChange / 중단 / metaObj is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.myEventService.KEY_KLASS_SELECTILE, 
        // public value:string
        value, 
        // public metaObj:any
        metaObj, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("klass-filter-tile / emitEventOnChange / Done!");
    };
    KlassFilterTileComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("klass-filter-tile / emitEventOnReady / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.myEventService.KEY_KLASS_SELECTILE, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("klass-filter-tile / emitEventOnChange / Done!");
    };
    // emitOnChangedSelectile
    KlassFilterTileComponent.prototype.getFocusedSelectiles = function () {
        var selectileMap = {
            level: this.klassLevelSelected,
            subwayLine: this.klassSubwayLineSelected,
            subwayStation: this.klassSubwayStationSelected,
            day: this.klassDaySelected,
            time: this.klassTimeSelected
        };
        return selectileMap;
    };
    KlassFilterTileComponent.prototype.setShadowRows = function (targetList) {
        if (1 < targetList.length) {
            this.selectileShadowRows = targetList.slice(1, targetList.length);
        }
        else {
            this.selectileShadowRows = null;
        }
    };
    KlassFilterTileComponent.prototype.showSelectile = function (targetList, targetObj, focusIdx) {
        if (this.isDebug())
            console.log("klass-filter-file / constructor / init");
        if (this.isDebug())
            console.log("klass-filter-file / constructor / this.klassLevelSelected : ", this.klassLevelSelected);
        if (this.isDebug())
            console.log("klass-filter-file / constructor / this.klassSubwayLineSelected : ", this.klassSubwayLineSelected);
        if (this.isDebug())
            console.log("klass-filter-file / constructor / this.klassSubwayStationSelected : ", this.klassSubwayStationSelected);
        if (this.isDebug())
            console.log("klass-filter-file / constructor / this.klassDaySelected : ", this.klassDaySelected);
        if (this.isDebug())
            console.log("klass-filter-file / constructor / this.klassTimeSelected : ", this.klassTimeSelected);
        // 사용자가 선택한 필터를 보여주는 열(Row)
        var nextSelectileTable = [];
        var row = [];
        this.klassLevelSelected["class_name"] = "empty";
        row.push(this.klassLevelSelected);
        this.klassSubwayLineSelected["class_name"] = "empty";
        row.push(this.klassSubwayLineSelected);
        this.klassSubwayStationSelected["class_name"] = "empty";
        row.push(this.klassSubwayStationSelected);
        this.klassDaySelected["class_name"] = "empty";
        row.push(this.klassDaySelected);
        this.klassTimeSelected["class_name"] = "empty";
        row.push(this.klassTimeSelected);
        nextSelectileTable.push(row);
        // 화면에 보여줄 column 갯수를 결정
        var stColCntPerRow = row.length;
        if (!(0 < stColCntPerRow)) {
            if (this.isDebug())
                console.log("klass-filter-file / constructor / 중단 / !(0 < stColCntPerRow)");
            return;
        }
        if (this.isDebug())
            console.log("klass-filter-file / constructor / stColCntPerRow : ", stColCntPerRow);
        this.updateLayout(stColCntPerRow);
        if (!targetList || null == targetObj || !(-1 < focusIdx)) {
            this.selectileTable = nextSelectileTable;
            this.setShadowRows(this.selectileTable);
            return;
        }
        var targetListValid = [];
        // 현재 표시되는 선택지는 제외합니다.
        for (var i = 0; i < targetList.length; i++) {
            var curObj = targetList[i];
            if (targetObj.key && curObj.key && (targetObj.key === curObj.key)) {
                continue;
            }
            targetListValid.push(curObj);
        }
        // 사용자가 선택할 수 있는 필터를 보여주는 열(Row)
        var elementCnt = targetListValid.length;
        var rowCnt = Math.ceil(elementCnt / stColCntPerRow);
        for (var rowIdx = 0; rowIdx < rowCnt; rowIdx++) {
            var row = [];
            for (var colIdx = 0; colIdx < stColCntPerRow; colIdx++) {
                var curIdx = stColCntPerRow * (rowIdx) + colIdx;
                if ((targetListValid.length - 1) < curIdx) {
                    // 표시할 수 있는 선택지가 더 이상 없습니다. Empty 영역을 표시할 객체들로 채워줍니다.
                    row.push({});
                    continue;
                }
                var curObj = targetListValid[curIdx];
                if (curObj.img_url) {
                    row.push(curObj);
                }
            } // end inner for
            nextSelectileTable.push(row);
        } // end outer for
        nextSelectileTable = this.setSelectileType(nextSelectileTable, focusIdx, stColCntPerRow);
        this.selectileTable = nextSelectileTable;
        this.setShadowRows(this.selectileTable);
    };
    KlassFilterTileComponent.prototype.setSelectileType = function (targetList, curSelectileIdx, stColCntPerRow) {
        if (this.isDebug())
            console.log("klass-filter-file / setSelectileType / 시작");
        if (!targetList) {
            if (this.isDebug())
                console.log("klass-filter-file / setSelectileType / 중단 / !targetList");
            return;
        }
        if (!(0 < stColCntPerRow)) {
            if (this.isDebug())
                console.log("klass-filter-file / setSelectileType / 중단 / !(0 < stColCntPerRow)");
            return;
        }
        if (this.isDebug())
            console.log("klass-filter-file / setSelectileType / curSelectileIdx : ", curSelectileIdx);
        if (this.isDebug())
            console.log("klass-filter-file / setSelectileType / stColCntPerRow : ", stColCntPerRow);
        var rowCnt = targetList.length;
        for (var rowIdx = 0; rowIdx < targetList.length; rowIdx++) {
            var row = targetList[rowIdx];
            for (var colIdx = 0; colIdx < row.length; colIdx++) {
                var field = row[colIdx];
                if (0 === rowIdx) {
                    // 1. 첫번째 열은 현재 선택한 값을 보여줍니다.
                    if (curSelectileIdx === colIdx) {
                        // 사용자가 mouseover한 선택 카테고리입니다.
                        field["class_name"] = "knob";
                    }
                    else {
                        field["class_name"] = "empty";
                    }
                }
                else if (rowCnt == 2) {
                    // 2. 사용자가 선택할 수 있는 항목이 1개의 열(row)에 모두 포함되는 경우.
                    if (colIdx === 0 && curSelectileIdx === colIdx) {
                        // 2-0. 첫번째 컬럼이면서 knob이 연결되어 있는가?
                        field["class_name"] = "left-round-knob";
                    }
                    else if (colIdx === 0) {
                        // 2-1. 첫번째 컬럼인가?
                        field["class_name"] = "left-round";
                    }
                    else if (colIdx === (stColCntPerRow - 1) && curSelectileIdx === colIdx) {
                        // 2-2. 마지막 컬럼이면서 knob이 연결되어 있는가?
                        field["class_name"] = "right-round-knob";
                    }
                    else if (colIdx === (stColCntPerRow - 1)) {
                        // 2-3. 마지막 컬럼인가?
                        field["class_name"] = "right-round";
                    }
                    else if (curSelectileIdx === colIdx) {
                        // 2-3. 첫번째와 마지막 컬럼이 아니지만 knob과 연결되어 있는가?
                        field["class_name"] = "top-knob";
                    }
                    else {
                        // 2-5. 다른 타일에 둘러싸여있는 타일인가?
                        field["class_name"] = "center-round";
                    }
                }
                else {
                    // 3. 사용자가 선택할 수 있는 항목이 2개 이상의 열(row)에 모두 포함되는 경우.
                    if (rowIdx === 1) {
                        // 3-1. 첫번째 선택열인가?
                        if (curSelectileIdx == colIdx && 0 == colIdx) {
                            // 첫번째 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
                            field["class_name"] = "left-single";
                        }
                        else if (curSelectileIdx == colIdx && 0 < colIdx) {
                            // 두번째 이상 컬럼에 knob이 있는 경우 
                            field["class_name"] = "top-knob";
                        }
                        else if (curSelectileIdx != colIdx && 0 == colIdx) {
                            // 첫번째 컬럼에 knob이 없는 경우, 첫번째 컬럼은 top-left
                            field["class_name"] = "top-left";
                        }
                        else if (curSelectileIdx == colIdx && colIdx === (stColCntPerRow - 1)) {
                            // 마지막 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
                            field["class_name"] = "center";
                        }
                        else if (colIdx === (stColCntPerRow - 1)) {
                            // 2-2. 마지막 컬럼인가?
                            field["class_name"] = "top-right";
                        }
                        else {
                            field["class_name"] = "top";
                        }
                    }
                    else if (rowIdx === (rowCnt - 1)) {
                        // 3-1. 마지막 열인가?
                        if (colIdx === 0) {
                            // 2-1. 첫번째 컬럼인가?
                            field["class_name"] = "bottom-left";
                        }
                        else if (colIdx === (stColCntPerRow - 1)) {
                            // 2-2. 마지막 컬럼인가?
                            field["class_name"] = "bottom-right";
                        }
                        else {
                            field["class_name"] = "bottom";
                        }
                    }
                    else {
                        // 첫번재 열인경우.
                        if (0 == colIdx) {
                            field["class_name"] = "left-single";
                        }
                        else if (colIdx === (stColCntPerRow - 1)) {
                            field["class_name"] = "right-single";
                        }
                        else {
                            // 3-2. 마지막 열보다 이전인가?
                            field["class_name"] = "center";
                        } // end inner if
                    } // end inner if
                } // end if        
            } // end inner for
        } // end outer for
        return targetList;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassFilterTileComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassFilterTileComponent.prototype, "emitOnChangedSelectile", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassFilterTileComponent.prototype, "emitOnInitKlassList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassFilterTileComponent.prototype, "elementWidth", void 0);
    KlassFilterTileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-filter-tile',
            templateUrl: 'klass-filter-tile.component.html',
            styleUrls: ['klass-filter-tile.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, klass_service_1.KlassService, common_1.Location])
    ], KlassFilterTileComponent);
    return KlassFilterTileComponent;
}());
exports.KlassFilterTileComponent = KlassFilterTileComponent;
//# sourceMappingURL=klass-filter-tile.component.js.map