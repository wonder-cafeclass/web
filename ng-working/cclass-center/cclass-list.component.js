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
var router_1 = require('@angular/router');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
var klass_service_1 = require('./klass.service');
var cclass_search_service_1 = require('./cclass-search.service');
var CClassListComponent = (function () {
    function CClassListComponent(cclassSearchService, service, route, router) {
        this.cclassSearchService = cclassSearchService;
        this.service = service;
        this.route = route;
        this.router = router;
        this.searchTerms = new Subject_1.Subject();
    }
    CClassListComponent.prototype.isSelected = function (cclass) {
        return cclass.id === this.selectedId;
    };
    CClassListComponent.prototype.search = function (term) {
        console.log("TEST / search / term :: ", term);
        this.searchTerms.next(term);
    };
    CClassListComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get class list
        this.route.params.forEach(function (params) {
            _this.selectedId = params['id'];
            _this.service.getCClasses().then(function (cclasses) { return _this.cclasses = cclasses; });
        });
        // search class with keyword
        // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
        this.klassKeywords =
            this.searchTerms
                .debounceTime(300)
                .distinctUntilChanged()
                .switchMap(function (term) { return term ? _this.cclassSearchService.search(term) : Observable_1.Observable.of([]); })
                .catch(function (error) {
                // TODO: real error handling
                console.log(error);
                return Observable_1.Observable.of([]);
            });
        // 요걸 한번에 해결하는 API를 호출하자!
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
    };
    // TODO 수업을 입력하는 방법을 제공해야 함. 첫번째 칸은 수업 입력칸으로 둠.(서비스 페이지에서는 노출되지 않음.)
    CClassListComponent.prototype.getSelectedIdx = function (targetList, key, value) {
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
    CClassListComponent.prototype.getNextElement = function (targetList, prevIdx) {
        var nextElement = null;
        if (prevIdx === (targetList.length - 1)) {
            nextElement = targetList[0];
        }
        else {
            nextElement = targetList[prevIdx + 1];
        }
        return nextElement;
    };
    CClassListComponent.prototype.nextLevel = function () {
        var selectedIdx = this.getSelectedIdx(this.klassLevels, "key", this.klassLevelSelected.key);
        this.klassLevelSelected = this.getNextElement(this.klassLevels, selectedIdx);
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 수업 리스트 API Call! - 
        // this.service.getKlassList(this.klassLevelSelected.key, "").then(cclasses => this.cclasses = cclasses);
    };
    CClassListComponent.prototype.nextStation = function () {
        var selectedIdx = this.getSelectedIdx(this.klassStations, "key", this.klassStationSelected.key);
        this.klassStationSelected = this.getNextElement(this.klassStations, selectedIdx);
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 지하철 역이 변경된다.
        // 변경된 지하철 역에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
    };
    CClassListComponent.prototype.nextDay = function () {
        var selectedIdx = this.getSelectedIdx(this.klassDays, "key", this.klassDaySelected.key);
        this.klassDaySelected = this.getNextElement(this.klassDays, selectedIdx);
        // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.
        // 수업 요일이 변경된다.
        // 변경된 수업 요일에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
    };
    CClassListComponent.prototype.nextTime = function () {
        console.log("TEST / nextTime");
        var selectedIdx = this.getSelectedIdx(this.klassTimes, "key", this.klassTimeSelected.key);
        this.klassTimeSelected = this.getNextElement(this.klassTimes, selectedIdx);
        // 수업 시간이 변경된다.
        // 변경된 수업 시간에 따라 수업 리스트가 달라져야 한다.
        // 수업 리스트 API Call!
    };
    CClassListComponent.prototype.onSelectKlass = function (cclass) {
        // 유저가 수업을 선택했습니다.
        // 수업 상세 페이지로 이동해야 합니다.
        console.log("TEST / onSelectKlass / cclass :: ", cclass);
        // Navigate with relative link
        // this.router.navigate([cclass.id], { relativeTo: this.route });
    };
    CClassListComponent = __decorate([
        core_1.Component({
            styleUrls: ['./ng-working/cclass-center/cclass-list.component.css'],
            templateUrl: './ng-working/cclass-center/cclass-list.component.html',
            providers: [cclass_search_service_1.CClassSearchService]
        }), 
        __metadata('design:paramtypes', [cclass_search_service_1.CClassSearchService, klass_service_1.KlassService, router_1.ActivatedRoute, router_1.Router])
    ], CClassListComponent);
    return CClassListComponent;
}());
exports.CClassListComponent = CClassListComponent;
//# sourceMappingURL=cclass-list.component.js.map