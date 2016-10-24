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
var klass_service_1 = require('./klass.service');
var klass_level_1 = require('./klass-level');
var klass_station_1 = require('./klass-station');
var klass_day_1 = require('./klass-day');
var klass_time_1 = require('./klass-time');
var KlassFilterTileComponent = (function () {
    function KlassFilterTileComponent(service, location) {
        this.service = service;
        this.location = location;
        // Observable Selectile 
        this.klassSelectileSubject = new Subject_1.Subject();
        // 검색을 가지고 있는 부모 컴포넌트에게 selectile의 값을 전달하기 위한 통신 이벤트객체
        this.emitOnChangedSelectile = new core_1.EventEmitter();
        // 컴포넌트 로딩 완료 이벤트 발사!
        this.emitOnInitKlassList = new core_1.EventEmitter();
        this.stColCntPerRow = 4; // selectile에 선택지를 열(Row)당 4개씩 노출
        this.isEnterST = false;
    }
    KlassFilterTileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getKlassSelectile().then(function (selectileInfo) {
            if (null === selectileInfo) {
                // TODO - 내려와야 할 데이터가 정상적으로 내려오지 않은 상황. 어떤 처리를 해주면 좋을까?
                return;
            }
            _this.setLevel(selectileInfo["levels"]);
            _this.setStation(selectileInfo["stations"]);
            _this.setDay(selectileInfo["days"]);
            _this.setTime(selectileInfo["times"]);
            _this.showSelectile(null, null, -1);
        });
        this.emitOnInitKlassList.emit();
        var _self = this;
        this.klassSelectileSubject.subscribe(function (x) {
            _self.updateShowingSelectile(x);
        }, function (err) {
            // error report
            console.log('Error: ' + err);
        }, function () {
            console.log('Completed');
        });
    };
    KlassFilterTileComponent.prototype.setTime = function (times) {
        var nextObjList = [];
        for (var i = 0; i < times.length; ++i) {
            var nextObj = times[i];
            var klassTime = new klass_time_1.KlassTime(nextObj.key, nextObj.name_eng, nextObj.name_kor, nextObj.img_url);
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
    KlassFilterTileComponent.prototype.updateShowingSelectile = function (selectile) {
        if (null == selectile) {
            // error report
            return;
        }
        var hasChanged = false;
        if (selectile instanceof klass_level_1.KlassLevel) {
            if (this.klassLevelSelected.key !== selectile.key) {
                this.klassLevelSelected = selectile;
                hasChanged = true;
            }
        }
        else if (selectile instanceof klass_station_1.KlassStation) {
            if (this.klassStationSelected.key !== selectile.key) {
                this.klassStationSelected = selectile;
                hasChanged = true;
            }
        }
        else if (selectile instanceof klass_day_1.KlassDay) {
            if (this.klassDaySelected.key !== selectile.key) {
                this.klassDaySelected = selectile;
                hasChanged = true;
            }
        }
        else if (selectile instanceof klass_time_1.KlassTime) {
            if (this.klassTimeSelected.key !== selectile.key) {
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
    ], KlassFilterTileComponent.prototype, "emitOnChangedSelectile", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassFilterTileComponent.prototype, "emitOnInitKlassList", void 0);
    KlassFilterTileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-filter-tile',
            templateUrl: 'klass-filter-tile.component.html',
            styleUrls: ['klass-filter-tile.component.css']
        }), 
        __metadata('design:paramtypes', [klass_service_1.KlassService, common_1.Location])
    ], KlassFilterTileComponent);
    return KlassFilterTileComponent;
}());
exports.KlassFilterTileComponent = KlassFilterTileComponent;
//# sourceMappingURL=klass-filter-tile.component.js.map