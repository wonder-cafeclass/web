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
var klass_service_1 = require('./klass.service');
var klass_level_1 = require('./klass-level');
var klass_station_1 = require('./klass-station');
var klass_day_1 = require('./klass-day');
var klass_time_1 = require('./klass-time');
var klass_selectile_1 = require('./klass-selectile');
var klass_selectile_row_1 = require('./klass-selectile-row');
var KlassFilterTileComponent = (function () {
    function KlassFilterTileComponent(service, location) {
        this.service = service;
        this.location = location;
        // selectileTable: Array<KlassSelectileRow>;
        // 
        this.isFocus = true;
        this.stColCntPerRow = 4; // selectile에 선택지를 열(Row)당 4개씩 노출
    }
    KlassFilterTileComponent.prototype.ngOnInit = function () {
        // TODO - 아래 이미지 주소를 가져오기 위해 5번의 통신이 필요하다. 1번으로 압축~!
        var _this = this;
        // 모든 레벨의 key를 가져온다.
        // 모든 레벨의 이미지 주소를 가져온다.
        // REMOVE ME
        /*
        this.service.getKlassLevel().then(klassLevels => {
          this.klassLevels = klassLevels;
          if(this.klassLevels && !this.klassLevelSelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassLevelSelected = this.klassLevels[0];
            this.klassLevelSelected["parent_list"] = this.klassLevels;
          }
        });
        */
        /*
        // 모든 역의 key를 가져온다.
        // 모든 역의 이미지 주소를 가져온다.
        this.service.getKlassStation().then(klassStations => {
          this.klassStations = klassStations;
          if(this.klassStations && !this.klassStationSelected) {
            // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
            this.klassStationSelected = this.klassStations[0];
            this.klassStationSelected["parent_list"] = this.klassStations;
          }
        });
        */
        // 모든 요일의 key를 가져온다.
        // 모든 요일의 이미지 주소를 가져온다.
        /*
        this.service.getKlassDay().then(klassDays => {
          this.klassDays = klassDays;
          if(this.klassDays && !this.klassDaySelected) {
            // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
            this.klassDaySelected = this.klassDays[0];
            this.klassDaySelected["parent_list"] = this.klassDays;
          }
        });
        */
        // 모든 시간의 key를 가져온다.
        // 모든 시간의 이미지 주소를 가져온다.
        /*
        this.service.getKlassTime().then(klassTimes => {
          this.klassTimes = klassTimes;
          if(this.klassTimes && !this.klassTimeSelected) {
            // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
            this.klassTimeSelected = this.klassTimes[0];
            this.klassTimeSelected["parent_list"] = this.klassTimes;
          }
        });
        */
        this.service.getKlassSelectile().then(function (selectileInfo) {
            _this.setSelectileMask(selectileInfo["selectile_masks"]);
            _this.setLevel(selectileInfo["levels"]);
            _this.setStation(selectileInfo["stations"]);
            _this.setDay(selectileInfo["days"]);
            _this.setTime(selectileInfo["times"]);
            _this.showSelectile(null, null, -1);
        });
    };
    KlassFilterTileComponent.prototype.setTime = function (times) {
        var nextObjList = [];
        for (var i = 0; i < times.length; ++i) {
            var nextObj = times[i];
            var klassTime = new klass_time_1.KlassTime(nextObj.key, nextObj.img_url);
            nextObjList.push(klassTime);
        }
        this.klassTimes = nextObjList;
        if (this.klassTimes && !this.klassTimeSelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassTimeSelected = this.klassTimes[0];
            this.klassTimeSelected["parent_list"] = this.klassTimes;
            this.klassTimeSelected["focus_idx"] = 3;
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
        if (this.klassDays && !this.klassDaySelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassDaySelected = this.klassDays[0];
            this.klassDaySelected["parent_list"] = this.klassDays;
            this.klassDaySelected["focus_idx"] = 2;
        }
    };
    KlassFilterTileComponent.prototype.setStation = function (stations) {
        var nextObjList = [];
        for (var i = 0; i < stations.length; ++i) {
            var nextObj = stations[i];
            var klassStation = new klass_station_1.KlassStation(nextObj.key, nextObj.img_url);
            nextObjList.push(klassStation);
        }
        this.klassStations = nextObjList;
        if (this.klassStations && !this.klassStationSelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassStationSelected = this.klassStations[0];
            this.klassStationSelected["parent_list"] = this.klassStations;
            this.klassStationSelected["focus_idx"] = 1;
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
        if (this.klassLevels && !this.klassLevelSelected) {
            // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
            this.klassLevelSelected = this.klassLevels[0];
            this.klassLevelSelected["parent_list"] = this.klassLevels;
            this.klassLevelSelected["focus_idx"] = 0;
        }
    };
    KlassFilterTileComponent.prototype.setSelectileMask = function (selectile_masks) {
        var nextSelectiles = [];
        for (var i = 0; i < selectile_masks.length; ++i) {
            var selectile_mask = selectile_masks[i];
            var klassSelectile = new klass_selectile_1.KlassSelectile(selectile_mask.key, selectile_mask.img_url);
            nextSelectiles.push(klassSelectile);
        }
        this.klassSelectiles = nextSelectiles;
        var selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "knob");
        if (-1 < selectedIdx) {
            this.ksKnob = this.klassSelectiles[selectedIdx];
            this.ksKnob["class_name"] = "knob";
        }
        else {
            // Error! 로그를 기록합니다.
            console.log("!Error! / knob");
            return;
        }
        selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "center");
        if (-1 < selectedIdx) {
            this.ksCenter = this.klassSelectiles[selectedIdx];
            this.ksCenter["class_name"] = "center";
        }
        else {
            // Error! 로그를 기록합니다.
            console.log("!Error! / center");
            return;
        }
        selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "top_right");
        if (-1 < selectedIdx) {
            this.ksTopRight = this.klassSelectiles[selectedIdx];
            this.ksTopRight["class_name"] = "top-right";
        }
        else {
            // Error! 로그를 기록합니다.
            console.log("!Error! / top_right");
            return;
        }
        selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "top_left");
        if (-1 < selectedIdx) {
            this.ksTopLeft = this.klassSelectiles[selectedIdx];
            this.ksTopLeft["class_name"] = "top-left";
        }
        else {
            // Error! 로그를 기록합니다.
            console.log("!Error! / top_left");
            return;
        }
        selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "bottom_left");
        if (-1 < selectedIdx) {
            this.ksBottomLeft = this.klassSelectiles[selectedIdx];
            this.ksBottomLeft["class_name"] = "bottom-left";
        }
        else {
            // Error! 로그를 기록합니다.
            console.log("!Error! / bottom_left");
            return;
        }
        selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "bottom_right");
        if (-1 < selectedIdx) {
            this.ksBottomRight = this.klassSelectiles[selectedIdx];
            this.ksBottomRight["class_name"] = "bottom-right";
        }
        else {
            // Error! 로그를 기록합니다.
            console.log("!Error! / bottom_right");
            return;
        }
        selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "right_single");
        if (-1 < selectedIdx) {
            this.ksRightSingle = this.klassSelectiles[selectedIdx];
            this.ksRightSingle["class_name"] = "right-single";
        }
        else {
            // Error! 로그를 기록합니다.
            console.log("!Error! / right_single");
            return;
        }
        selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "empty");
        if (-1 < selectedIdx) {
            this.ksEmpty = this.klassSelectiles[selectedIdx];
            this.ksEmpty["class_name"] = "selectile-focus";
        }
        else {
            // Error! 로그를 기록합니다.
            return;
        } // end if
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
    // wonder.jung
    KlassFilterTileComponent.prototype.enterSelectile = function (selectile) {
        console.log(">>> enterSelectile / selectile : ", selectile);
        if (selectile && selectile["parent_list"]) {
            this.showSelectile(selectile["parent_list"], selectile, selectile["focus_idx"]);
        }
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
        row.push(this.klassLevelSelected);
        row.push(this.klassStationSelected);
        row.push(this.klassDaySelected);
        row.push(this.klassTimeSelected);
        nextSelectileTable.push(row);
        if (!targetList) {
            this.selectileTable = nextSelectileTable;
            this.setShadowRows(this.selectileTable);
            return;
        }
        // 현재 표시되는 선택지는 제외합니다.
        var targetListValid = [];
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
        console.log("TEST / XXX / nextSelectileTable ::: ", nextSelectileTable);
        this.selectileTable = nextSelectileTable;
        this.setShadowRows(this.selectileTable);
        // this.showSelectileMask(targetList, focusIdx);
    };
    KlassFilterTileComponent.prototype.setSelectileType = function (targetList, curSelectileIdx) {
        if (!targetList) {
            return;
        }
        console.log("TEST / setSelectileType / targetList ::: ", targetList);
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
    KlassFilterTileComponent.prototype.hideSelectileMask = function () {
        // seletile을 숨깁니다. 
        this.selectileMaskTable = null;
    };
    // @ Deprecated
    KlassFilterTileComponent.prototype.showSelectileMask = function (targetList, curSelectileIdx) {
        if (!targetList) {
            return;
        }
        var elementCnt = targetList.length;
        var rowCnt = Math.ceil(elementCnt / this.stColCntPerRow) + 1;
        var nextSelectileTable = [];
        for (var rowIdx = 0; rowIdx < rowCnt; rowIdx++) {
            var row = new klass_selectile_row_1.KlassSelectileRow();
            for (var colIdx = 0; colIdx < this.stColCntPerRow; colIdx++) {
                if (0 === rowIdx) {
                    // 1. 첫번째 열은 현재 선택한 값을 보여줍니다.
                    if (curSelectileIdx === colIdx) {
                        // 사용자가 mouseover한 선택 카테고리입니다.
                        row.add(this.ksKnob);
                    }
                    else {
                        row.add(this.ksEmpty);
                    }
                }
                else if (rowCnt == 2 && elementCnt <= this.stColCntPerRow) {
                    // 2. 사용자가 선택할 수 있는 항목이 1개의 열(row)에 모두 포함되는 경우.
                    if (colIdx === 0) {
                        // 2-1. 첫번째 컬럼인가?
                        row.add(this.ksBottomLeft);
                    }
                    else if (colIdx === (this.stColCntPerRow - 1)) {
                        // 2-2. 마지막 컬럼인가?
                        row.add(this.ksRightSingle);
                    }
                    else {
                        row.add(this.ksCenter);
                    }
                }
                else {
                    // 3. 사용자가 선택할 수 있는 항목이 2개 이상의 열(row)에 모두 포함되는 경우.
                    if (rowIdx === 1) {
                        // 3-1. 첫번째 선택열인가?
                        if (curSelectileIdx == colIdx && 0 == colIdx) {
                            // 첫번째 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
                            row.add(this.ksCenter);
                        }
                        else if (curSelectileIdx != colIdx && 0 == colIdx) {
                            // 첫번째 컬럼에 knob이 없는 경우, 첫번째 컬럼은 top-left
                            row.add(this.ksTopLeft);
                        }
                        else if (curSelectileIdx == colIdx && colIdx === (this.stColCntPerRow - 1)) {
                            // 마지막 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
                            row.add(this.ksCenter);
                        }
                        else if (colIdx === (this.stColCntPerRow - 1)) {
                            // 2-2. 마지막 컬럼인가?
                            row.add(this.ksTopRight);
                        }
                        else {
                            row.add(this.ksCenter);
                        }
                    }
                    else if (rowIdx === (rowCnt - 1)) {
                        // 3-1. 마지막 열인가?
                        if (colIdx === 0) {
                            // 2-1. 첫번째 컬럼인가?
                            row.add(this.ksBottomLeft);
                        }
                        else if (colIdx === (this.stColCntPerRow - 1)) {
                            // 2-2. 마지막 컬럼인가?
                            row.add(this.ksBottomRight);
                        }
                        else {
                            row.add(this.ksCenter);
                        }
                    }
                    else {
                        // 3-2. 마지막 열보다 이전인가?
                        row.add(this.ksCenter);
                    } // end inner if
                } // end if
            } // end inner for
            nextSelectileTable.push(row);
        } // end outer for
        // TEST
        console.log("TEST / showSelectileMask / nextSelectileTable ::: ", nextSelectileTable);
        this.selectileMaskTable = nextSelectileTable;
    };
    // wonder.jung
    /*
    leaveSelector() :void {
      if(this.hasEnteredselectile) {
        return;
      }
      this.selectileTable = null;
    }
    hasEnteredselectile:boolean=false;
    leaveSelectile() :void {
      this.hasEnteredselectile = false;
      this.leaveSelector();
    }
    outSelectile() :void {
      this.leaveSelectile()
    }
    */
    KlassFilterTileComponent.prototype.nextLevel = function () {
        var selectedIdx = this.getSelectedIdx(this.klassLevels, "key", this.klassLevelSelected.key);
        this.klassLevelSelected = this.getNextElement(this.klassLevels, selectedIdx);
        this.klassLevelSelected["parent_list"] = this.klassLevels;
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 수업 리스트 API Call! - 
        // this.service.getKlassList(this.klassLevelSelected.key, "").then(cclasses => this.cclasses = cclasses);
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overLevel = function () {
        // 관련 selectile을 보여줍니다.
        this.showSelectile(this.klassLevels, null, -1);
        this.showSelectileMask(this.klassLevels, 0);
    };
    KlassFilterTileComponent.prototype.nextStation = function () {
        var selectedIdx = this.getSelectedIdx(this.klassStations, "key", this.klassStationSelected.key);
        this.klassStationSelected = this.getNextElement(this.klassStations, selectedIdx);
        this.klassStationSelected["parent_list"] = this.klassStations;
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 지하철 역이 변경된다.
        // 변경된 지하철 역에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overStation = function () {
        this.showSelectile(this.klassStations, null, -1);
        this.showSelectileMask(this.klassStations, 1);
    };
    KlassFilterTileComponent.prototype.nextDay = function () {
        var selectedIdx = this.getSelectedIdx(this.klassDays, "key", this.klassDaySelected.key);
        this.klassDaySelected = this.getNextElement(this.klassDays, selectedIdx);
        this.klassDaySelected["parent_list"] = this.klassDays;
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 수업 요일이 변경된다.
        // 변경된 수업 요일에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overDay = function () {
        this.showSelectile(this.klassDays, null, -1);
        this.showSelectileMask(this.klassDays, 2);
    };
    KlassFilterTileComponent.prototype.nextTime = function () {
        console.log("TEST / nextTime");
        var selectedIdx = this.getSelectedIdx(this.klassTimes, "key", this.klassTimeSelected.key);
        this.klassTimeSelected = this.getNextElement(this.klassTimes, selectedIdx);
        this.klassTimeSelected["parent_list"] = this.klassTimes;
        // 수업 시간이 변경된다.
        // 변경된 수업 시간에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overTime = function () {
        this.showSelectile(this.klassTimes, null, -1);
        this.showSelectileMask(this.klassTimes, 3);
    };
    KlassFilterTileComponent = __decorate([
        core_1.Component({
            selector: 'klass-filter-tile',
            templateUrl: './ng-working/cclass-center/klass-filter-tile.component.html',
            styleUrls: ['./ng-working/cclass-center/klass-filter-tile.component.css']
        }), 
        __metadata('design:paramtypes', [klass_service_1.KlassService, common_1.Location])
    ], KlassFilterTileComponent);
    return KlassFilterTileComponent;
}());
exports.KlassFilterTileComponent = KlassFilterTileComponent;
//# sourceMappingURL=klass-filter-tile.component.js.map