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
var klass_station_1 = require('./model/klass-station');
var klass_day_1 = require('./model/klass-day');
var klass_time_1 = require('./model/klass-time');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var KlassFilterTileComponent = (function () {
    function KlassFilterTileComponent(myCheckerService, myEventService, watchTower, klassService, location) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.klassService = klassService;
        this.location = location;
        // Observable Selectile 
        this.klassSelectileSubject = new Subject_1.Subject();
        this.emitter = new core_1.EventEmitter();
        // 검색을 가지고 있는 부모 컴포넌트에게 selectile의 값을 전달하기 위한 통신 이벤트객체
        this.emitOnChangedSelectile = new core_1.EventEmitter();
        // 컴포넌트 로딩 완료 이벤트 발사!
        this.emitOnInitKlassList = new core_1.EventEmitter();
        this.stColCntPerRow = 4; // selectile에 선택지를 열(Row)당 4개씩 노출
        this.elementWidth = 50;
        this.elementWidthStr = "";
        this.rowWidthStr = "";
        this.isEnterST = false;
    }
    KlassFilterTileComponent.prototype.ngOnInit = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-filter-tile / ngOnInit / 시작");
        this.klassService
            .getKlassSelectile()
            .then(function (myReponse) {
            if (isDebug)
                console.log("klass-filter-tile / ngOnInit / myReponse : ", myReponse);
            if (myReponse.isSuccess()) {
                _this.setLevel(myReponse.getDataProp("levels"));
                _this.setStation(myReponse.getDataProp("stations"));
                _this.setDay(myReponse.getDataProp("days"));
                _this.setTime(myReponse.getDataProp("times"));
                _this.showSelectile(null, null, -1);
                // @ Recommended
                _this.emitEventOnReady();
                if (isDebug)
                    console.log("TEST - 001");
            } // end if
        }); // end service
        // @ Deprecated
        this.emitOnInitKlassList.emit();
        var _self = this;
        this.klassSelectileSubject.subscribe(function (x) {
            _self.updateShowingSelectile(x);
            if (isDebug)
                console.log("TEST - 002");
        }, function (err) {
            // error report
            console.log('Error: ' + err);
        }, function () {
            console.log('Completed');
        });
        this.elementWidthStr = "100%";
        this.rowWidthStr = "198px";
        if (0 < this.elementWidth) {
            this.elementWidthStr = this.elementWidth + "px";
            var rowWidth = this.elementWidth * this.stColCntPerRow;
            if (isDebug)
                console.log("klass-filter-tile / ngOnInit / rowWidth : ", rowWidth);
            this.rowWidthStr = rowWidth + "px";
        }
        this.subscribeConstMap();
    };
    KlassFilterTileComponent.prototype.subscribeConstMap = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-filter-tile / subscribeConstMap / 시작");
        this.constMap = this.watchTower.getConstMap();
        if (isDebug)
            console.log("klass-filter-tile / subscribeLoginTeacher / this.constMap : ", this.constMap);
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        // Subscribe login user
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("klass-filter-tile / subscribeLoginTeacher / isViewPackReady : ", isViewPackReady);
            // 뷰 패키징 정보가 도착!
            _this.constMap = _this.watchTower.getConstMap();
            if (isDebug)
                console.log("klass-filter-tile / subscribeLoginTeacher / this.constMap : ", _this.constMap);
        }); // end subscribe    
    };
    KlassFilterTileComponent.prototype.setTime = function (times) {
        var nextObjList = [];
        for (var i = 0; i < times.length; ++i) {
            var nextObj = times[i];
            var klassTime = new klass_time_1.KlassTime(nextObj.key, nextObj.name_eng, nextObj.name_kor, nextObj.hh_mm, nextObj.img_url);
            nextObjList.push(klassTime);
        }
        this.klassTimes = nextObjList;
        // 부모 리스트 참조
        for (var i = 0; i < this.klassTimes.length; ++i) {
            var nextObj_1 = this.klassTimes[i];
            nextObj_1.parentList = this.klassTimes;
            nextObj_1["focusIdx"] = 3;
        }
        if (this.klassTimes && !this.klassTimeSelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassTimeSelected = this.klassTimes[0];
        }
    };
    KlassFilterTileComponent.prototype.setDay = function (days) {
        var nextObjList = [];
        for (var i = 0; i < days.length; ++i) {
            var nextObj = days[i];
            var klassDay = new klass_day_1.KlassDay(nextObj.key, nextObj.name_eng, nextObj.name_kor, nextObj.img_url);
            nextObjList.push(klassDay);
        }
        this.klassDays = nextObjList;
        // 부모 리스트 참조
        for (var i = 0; i < this.klassDays.length; ++i) {
            var nextObj_2 = this.klassDays[i];
            nextObj_2.parentList = this.klassDays;
            nextObj_2["focusIdx"] = 2;
        }
        if (this.klassDays && !this.klassDaySelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassDaySelected = this.klassDays[0];
        }
    };
    KlassFilterTileComponent.prototype.setStation = function (stations) {
        var nextObjList = [];
        for (var i = 0; i < stations.length; ++i) {
            var nextObj = stations[i];
            var klassStation = new klass_station_1.KlassStation(nextObj.key, nextObj.name_eng, nextObj.name_kor, nextObj.img_url);
            nextObjList.push(klassStation);
        }
        this.klassStations = nextObjList;
        // 부모 리스트 참조
        for (var i = 0; i < this.klassStations.length; ++i) {
            var nextObj_3 = this.klassStations[i];
            nextObj_3.parentList = this.klassStations;
            nextObj_3["focusIdx"] = 1;
        }
        if (this.klassStations && !this.klassStationSelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassStationSelected = this.klassStations[0];
        }
    };
    KlassFilterTileComponent.prototype.setLevel = function (levels) {
        var nextObjList = [];
        for (var i = 0; i < levels.length; ++i) {
            var nextObj = levels[i];
            var klassLevel = new klass_level_1.KlassLevel(nextObj.key, nextObj.name_eng, nextObj.name_kor, nextObj.img_url);
            nextObjList.push(klassLevel);
        }
        this.klassLevels = nextObjList;
        // 부모 리스트 참조
        for (var i = 0; i < this.klassLevels.length; ++i) {
            var nextObj_4 = this.klassLevels[i];
            nextObj_4.parentList = this.klassLevels;
            nextObj_4["focusIdx"] = 0;
        }
        if (this.klassLevels && !this.klassLevelSelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassLevelSelected = this.klassLevels[0];
        }
    };
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
        if (selectile.class_name !== "empty" || this.isEnterST) {
            return;
        }
        this.isEnterST = true;
        if (selectile && selectile["parentList"]) {
            this.showSelectile(selectile["parentList"], selectile, selectile["focusIdx"]);
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
    KlassFilterTileComponent.prototype.updateShowingSelectilesAll = function (klassLevel, klassStation, klassDay, klassTime) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-filter-tile / updateShowingSelectilesAll / 시작");
        if (null == klassLevel) {
            console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassLevel is not valid!");
            return;
        }
        if (null == klassStation) {
            console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassStation is not valid!");
            return;
        }
        if (null == klassDay) {
            console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassDay is not valid!");
            return;
        }
        if (null == klassTime) {
            console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassTime is not valid!");
            return;
        }
        this.selectileTable;
        console.log("klass-filter-tile / updateShowingSelectilesAll / this.selectileTable : ", this.selectileTable);
        // 선택된 필드들을 검색, 지정한다.
        for (var i = 0; i < this.klassLevels.length; ++i) {
            var klassLevelFromList = this.klassLevels[i];
            if (klassLevelFromList.isSharing("key", klassLevel)) {
                console.log("klass-filter-tile / updateShowingSelectilesAll / klassLevelFromList : ", klassLevelFromList);
                this.klassLevelSelected = klassLevelFromList;
            }
        } // end for
        for (var i = 0; i < this.klassStations.length; ++i) {
            var klassStationFromList = this.klassStations[i];
            if (klassStationFromList.isSharing("key", klassStation)) {
                console.log("klass-filter-tile / updateShowingSelectilesAll / klassStationFromList : ", klassStationFromList);
                this.klassStationSelected = klassStationFromList;
            }
        } // end for
        for (var i = 0; i < this.klassDays.length; ++i) {
            var klassDayFromList = this.klassDays[i];
            if (klassDayFromList.isSharing("key", klassDay)) {
                console.log("klass-filter-tile / updateShowingSelectilesAll / klassDayFromList : ", klassDayFromList);
                this.klassDaySelected = klassDayFromList;
            }
        } // end for
        for (var i = 0; i < this.klassTimes.length; ++i) {
            var klassTimeFromList = this.klassTimes[i];
            if (klassTimeFromList.isSharing("key", klassTime)) {
                console.log("klass-filter-tile / updateShowingSelectilesAll / klassTimeFromList : ", klassTimeFromList);
                this.klassTimeSelected = klassTimeFromList;
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
        else if (selectile instanceof klass_station_1.KlassStation) {
            if (null == this.klassStationSelected || this.klassStationSelected.key !== selectile.key) {
                this.klassStationSelected = selectile;
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-filter-tile / emitEventOnChange / 시작");
        if (null == value) {
            if (isDebug)
                console.log("klass-filter-tile / emitEventOnChange / 중단 / value is not valid!");
            return;
        }
        if (null == metaObj) {
            if (isDebug)
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
        if (isDebug)
            console.log("klass-filter-tile / emitEventOnChange / Done!");
    };
    KlassFilterTileComponent.prototype.emitEventOnReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
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
        if (isDebug)
            console.log("klass-filter-tile / emitEventOnChange / Done!");
    };
    // emitOnChangedSelectile
    KlassFilterTileComponent.prototype.getFocusedSelectiles = function () {
        var selectileMap = {
            level: this.klassLevelSelected,
            station: this.klassStationSelected,
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
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-filter-file / constructor / init");
        if (isDebug)
            console.log("klass-filter-file / constructor / this.klassLevelSelected : ", this.klassLevelSelected);
        if (isDebug)
            console.log("klass-filter-file / constructor / this.klassStationSelected : ", this.klassStationSelected);
        if (isDebug)
            console.log("klass-filter-file / constructor / this.klassDaySelected : ", this.klassDaySelected);
        if (isDebug)
            console.log("klass-filter-file / constructor / this.klassTimeSelected : ", this.klassTimeSelected);
        // 사용자가 선택한 필터를 보여주는 열(Row)
        var nextSelectileTable = [];
        var row = [];
        this.klassLevelSelected["class_name"] = "empty";
        row.push(this.klassLevelSelected);
        this.klassStationSelected["class_name"] = "empty";
        row.push(this.klassStationSelected);
        this.klassDaySelected["class_name"] = "empty";
        row.push(this.klassDaySelected);
        this.klassTimeSelected["class_name"] = "empty";
        row.push(this.klassTimeSelected);
        nextSelectileTable.push(row);
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
        var rowCnt = Math.ceil(elementCnt / this.stColCntPerRow);
        for (var rowIdx = 0; rowIdx < rowCnt; rowIdx++) {
            var row = [];
            for (var colIdx = 0; colIdx < this.stColCntPerRow; colIdx++) {
                var curIdx = this.stColCntPerRow * (rowIdx) + colIdx;
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
        nextSelectileTable = this.setSelectileType(nextSelectileTable, focusIdx);
        this.selectileTable = nextSelectileTable;
        this.setShadowRows(this.selectileTable);
    };
    KlassFilterTileComponent.prototype.setSelectileType = function (targetList, curSelectileIdx) {
        if (!targetList) {
            return;
        }
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
                    else if (colIdx === (this.stColCntPerRow - 1) && curSelectileIdx === colIdx) {
                        // 2-2. 마지막 컬럼이면서 knob이 연결되어 있는가?
                        field["class_name"] = "right-round-knob";
                    }
                    else if (colIdx === (this.stColCntPerRow - 1)) {
                        // 2-3. 마지막 컬럼인가?
                        field["class_name"] = "right-round";
                    }
                    else {
                        // 2-4. 다른 타일에 둘러싸여있는 타일인가?
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
                        else if (curSelectileIdx == colIdx && colIdx === (this.stColCntPerRow - 1)) {
                            // 마지막 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
                            field["class_name"] = "center";
                        }
                        else if (colIdx === (this.stColCntPerRow - 1)) {
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
                        else if (colIdx === (this.stColCntPerRow - 1)) {
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
                        else if (colIdx === (this.stColCntPerRow - 1)) {
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
        // 사용자가 선택한 클래스 레벨 
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
        // selectile에 선택지를 열(Row)당 4개씩 노출
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