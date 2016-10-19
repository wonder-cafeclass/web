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
var CClassListComponent = (function () {
    function CClassListComponent(cclassSearchService, service, route, router) {
        this.cclassSearchService = cclassSearchService;
        this.service = service;
        this.route = route;
        this.router = router;
        // 검색상태 관련
        this.isEnableSearch = false;
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
    };
    CClassListComponent.prototype.onChangedSelectile = function (selectiles) {
        for (var i = 0; i < selectiles.length; ++i) {
            var selectile = selectiles[i];
            if (selectile instanceof klass_level_1.KlassLevel) {
                console.log("HERE! / onChangedSelectile / level / selectile ::: ", selectile);
            }
            else if (selectile instanceof klass_station_1.KlassStation) {
                console.log("HERE! / onChangedSelectile / station / selectile ::: ", selectile);
            }
            else if (selectile instanceof klass_day_1.KlassDay) {
                console.log("HERE! / onChangedSelectile / day / selectile ::: ", selectile);
            }
            else if (selectile instanceof klass_time_1.KlassTime) {
                console.log("HERE! / onChangedSelectile / time / selectile ::: ", selectile);
            }
        }
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
            moduleId: module.id,
            styleUrls: ['cclass-list.component.css'],
            templateUrl: 'cclass-list.component.html',
            providers: [cclass_search_service_1.CClassSearchService]
        }), 
        __metadata('design:paramtypes', [cclass_search_service_1.CClassSearchService, klass_service_1.KlassService, router_1.ActivatedRoute, router_1.Router])
    ], CClassListComponent);
    return CClassListComponent;
}());
exports.CClassListComponent = CClassListComponent;
//# sourceMappingURL=cclass-list.component.js.map