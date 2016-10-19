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
var klass_level_1 = require('./klass-level');
var klass_station_1 = require('./klass-station');
var klass_day_1 = require('./klass-day');
var klass_time_1 = require('./klass-time');
var KlassListComponent = (function () {
    function KlassListComponent(cclassSearchService, service, route, router) {
        this.cclassSearchService = cclassSearchService;
        this.service = service;
        this.route = route;
        this.router = router;
        // 검색상태 관련
        this.isSearchEnabled = false;
        this.searchTerms = new Subject_1.Subject();
    }
    KlassListComponent.prototype.isSelected = function (cclass) {
        return cclass.id === this.selectedId;
    };
    KlassListComponent.prototype.ngOnInit = function () {
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
    };
    KlassListComponent.prototype.search = function (selectileList, searchKeyword) {
        if (!this.isSearchEnabled) {
            return;
        }
        // wonder.jung
        console.log("search / selectile :: ", selectile);
        console.log("search / searchKeyword :: ", searchKeyword);
        // this.searchTerms.next(term);
        // 항목별 filter 만들기
        var level = "";
        var station = "";
        var day = "";
        var time = "";
        for (var i = 0; i < selectileList.length; ++i) {
            var selectile = selectileList[i];
            if (selectile instanceof klass_level_1.KlassLevel) {
                level = selectile.key;
            }
            else if (selectile instanceof klass_station_1.KlassStation) {
                station = selectile.key;
            }
            else if (selectile instanceof klass_day_1.KlassDay) {
                day = selectile.key;
            }
            else if (selectile instanceof klass_time_1.KlassTime) {
                time = selectile.key;
            }
        }
        console.log("TEST / level :: ", level);
        // keyword 안전성 검사 및 param 만들기(구분자추가)
        var q = "";
        this.service.searchKlassList(
        // level:string, 
        level, 
        // station:string, 
        station, 
        // day:string, 
        day, 
        // time:string,
        time, 
        // q:string
        q).then(function (cclasses) {
            console.log("cclasses ::: ", cclasses);
            // this.cclasses = cclasses 
        });
    };
    KlassListComponent.prototype.onChangedSelectile = function (selectiles) {
        // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
        this.isSearchEnabled = true;
    };
    KlassListComponent.prototype.onKeyupSearch = function (keyword) {
        if (null === keyword || "" === keyword) {
            return;
        }
        // 2글자 이상이어야 유효한 단어
        // 최소 한단어 이상이어야 함.
        // 1. 단어 분할로 제목 검색.
        // 사용자가 입력한 단어를 공백 단위로 분할.
        // 2. 제목과 설명은 최대 3개 단어 조합으로 검색. 그 이상은 무리가 있음.
        // 검색 결과가 많을 경우, 스크롤로 더 보여줄 수 있어야 함. 
        // 검색 결과는 최초 10개만 보여줌.
        console.log("onKeyupSearch / keyword ::: ", keyword);
        // 유저가 검색어를 입력한 상태. 유효한 키워드라면, 검색 버튼을 활성화 해줍니다.
        if (!this.isSearchEnabled) {
            this.isSearchEnabled = true;
        }
    };
    KlassListComponent.prototype.onSelectKlass = function (cclass) {
        // 유저가 수업을 선택했습니다.
        // 수업 상세 페이지로 이동해야 합니다.
        console.log("TEST / onSelectKlass / cclass :: ", cclass);
        // Navigate with relative link
        // this.router.navigate([cclass.id], { relativeTo: this.route });
    };
    KlassListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-list.component.css'],
            templateUrl: 'klass-list.component.html',
            providers: [cclass_search_service_1.CClassSearchService]
        }), 
        __metadata('design:paramtypes', [cclass_search_service_1.CClassSearchService, klass_service_1.KlassService, router_1.ActivatedRoute, router_1.Router])
    ], KlassListComponent);
    return KlassListComponent;
}());
exports.KlassListComponent = KlassListComponent;
//# sourceMappingURL=klass-list.component.js.map