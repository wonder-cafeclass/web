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
var klass_selectile_row_1 = require('./klass-selectile-row');
var KlassFilterTileComponent = (function () {
    function KlassFilterTileComponent(service, location) {
        this.service = service;
        this.location = location;
        this.selectileColumnCnt = 4; // selectile에 선택지를 열(Row)당 4개씩 노출
        this.hasEnteredSeletile = false;
    }
    KlassFilterTileComponent.prototype.ngOnInit = function () {
        // TODO - 아래 이미지 주소를 가져오기 위해 5번의 통신이 필요하다. 1번으로 압축~!
        var _this = this;
        // 모든 레벨의 key를 가져온다.
        // 모든 레벨의 이미지 주소를 가져온다.
        this.service.getKlassLevel().then(function (klassLevels) {
            _this.klassLevels = klassLevels;
            if (!_this.klassLevelSelected) {
                // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
                _this.klassLevelSelected = _this.klassLevels[0];
            }
        });
        // 모든 역의 key를 가져온다.
        // 모든 역의 이미지 주소를 가져온다.
        this.service.getKlassStation().then(function (klassStations) {
            _this.klassStations = klassStations;
            if (!_this.klassStationSelected) {
                // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
                _this.klassStationSelected = _this.klassStations[0];
            }
        });
        // 모든 요일의 key를 가져온다.
        // 모든 요일의 이미지 주소를 가져온다.
        this.service.getKlassDay().then(function (klassDays) {
            _this.klassDays = klassDays;
            if (!_this.klassDaySelected) {
                // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
                _this.klassDaySelected = _this.klassDays[0];
            }
        });
        // 모든 시간의 key를 가져온다.
        // 모든 시간의 이미지 주소를 가져온다.
        this.service.getKlassTime().then(function (klassTimes) {
            _this.klassTimes = klassTimes;
            if (!_this.klassTimeSelected) {
                // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
                _this.klassTimeSelected = _this.klassTimes[0];
            }
        });
        this.service.getKlassSelectile().then(function (klassSelectiles) {
            _this.klassSelectiles = klassSelectiles;
            var selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "knob");
            if (-1 < selectedIdx) {
                _this.ksKnob = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "center");
            if (-1 < selectedIdx) {
                _this.ksCenter = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "top_right");
            if (-1 < selectedIdx) {
                _this.ksTopRight = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "top_left");
            if (-1 < selectedIdx) {
                _this.ksTopLeft = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "bottom_left");
            if (-1 < selectedIdx) {
                _this.ksBottomLeft = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "bottom_right");
            if (-1 < selectedIdx) {
                _this.ksBottomRight = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "right_single");
            if (-1 < selectedIdx) {
                _this.ksRightSingle = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            selectedIdx = _this.getSelectedIdx(_this.klassSelectiles, "key", "empty");
            if (-1 < selectedIdx) {
                _this.ksEmpty = _this.klassSelectiles[selectedIdx];
            }
            else {
                // Error! 로그를 기록합니다.
                return;
            }
            _this.hideSeletile();
        });
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
    KlassFilterTileComponent.prototype.hideSeletile = function () {
        // seletile을 숨깁니다. 
        // 현재 선택한 필터만 노출합니다.
    };
    KlassFilterTileComponent.prototype.showSeletile = function (targetList, curSelectileIdx) {
        if (!targetList) {
            return;
        }
        var elementCnt = targetList.length;
        var rowCnt = Math.ceil(elementCnt / this.selectileColumnCnt) + 1;
        var nextSelectileTable = [];
        for (var rowIdx = 0; rowIdx < rowCnt; rowIdx++) {
            // wonder.jung
            var row = new klass_selectile_row_1.KlassSelectileRow();
            for (var colIdx = 0; colIdx < this.selectileColumnCnt; colIdx++) {
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
                else if (rowCnt == 2 && elementCnt <= this.selectileColumnCnt) {
                    // 2. 사용자가 선택할 수 있는 항목이 1개의 열(row)에 모두 포함되는 경우.
                    if (colIdx === 0) {
                        // 2-1. 첫번째 컬럼인가?
                        row.add(this.ksBottomLeft);
                    }
                    else if (colIdx === (this.selectileColumnCnt - 1)) {
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
                        else if (curSelectileIdx == colIdx && colIdx === (this.selectileColumnCnt - 1)) {
                            // 마지막 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
                            row.add(this.ksCenter);
                        }
                        else if (colIdx === (this.selectileColumnCnt - 1)) {
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
                        else if (colIdx === (this.selectileColumnCnt - 1)) {
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
        this.selectileTable = nextSelectileTable;
        this.hasEnteredSeletile = true;
    };
    KlassFilterTileComponent.prototype.leaveSelector = function () {
        if (this.hasEnteredSeletile) {
            return;
        }
        this.selectileTable = null;
    };
    KlassFilterTileComponent.prototype.leaveSelectile = function () {
        this.hasEnteredSeletile = false;
        this.leaveSelector();
    };
    KlassFilterTileComponent.prototype.outSelectile = function () {
        this.leaveSelectile();
    };
    KlassFilterTileComponent.prototype.nextLevel = function () {
        var selectedIdx = this.getSelectedIdx(this.klassLevels, "key", this.klassLevelSelected.key);
        this.klassLevelSelected = this.getNextElement(this.klassLevels, selectedIdx);
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 수업 리스트 API Call! - 
        // this.service.getKlassList(this.klassLevelSelected.key, "").then(cclasses => this.cclasses = cclasses);
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overLevel = function () {
        // 관련 selectile을 보여줍니다.
        this.showSeletile(this.klassLevels, 0);
    };
    KlassFilterTileComponent.prototype.nextStation = function () {
        var selectedIdx = this.getSelectedIdx(this.klassStations, "key", this.klassStationSelected.key);
        this.klassStationSelected = this.getNextElement(this.klassStations, selectedIdx);
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 지하철 역이 변경된다.
        // 변경된 지하철 역에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overStation = function () {
        this.showSeletile(this.klassStations, 1);
        // this.showSeletile(this.klassLevels, 1);
    };
    KlassFilterTileComponent.prototype.nextDay = function () {
        var selectedIdx = this.getSelectedIdx(this.klassDays, "key", this.klassDaySelected.key);
        this.klassDaySelected = this.getNextElement(this.klassDays, selectedIdx);
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 수업 요일이 변경된다.
        // 변경된 수업 요일에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overDay = function () {
        this.showSeletile(this.klassDays, 2);
        // this.showSeletile(this.klassLevels, 2);
    };
    KlassFilterTileComponent.prototype.nextTime = function () {
        console.log("TEST / nextTime");
        var selectedIdx = this.getSelectedIdx(this.klassTimes, "key", this.klassTimeSelected.key);
        this.klassTimeSelected = this.getNextElement(this.klassTimes, selectedIdx);
        // 수업 시간이 변경된다.
        // 변경된 수업 시간에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
        // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
    };
    KlassFilterTileComponent.prototype.overTime = function () {
        this.showSeletile(this.klassTimes, 3);
        // this.showSeletile(this.klassLevels, 3);
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