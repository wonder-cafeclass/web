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
var cclass_service_1 = require('./cclass.service');
var cclass_search_service_1 = require('./cclass-search.service');
var CClassListComponent = (function () {
    function CClassListComponent(cclassSearchService, service, route, router) {
        this.cclassSearchService = cclassSearchService;
        this.service = service;
        this.route = route;
        this.router = router;
        // klassKeywords: Observable<{}>;
        this.searchTerms = new Subject_1.Subject();
    }
    CClassListComponent.prototype.isSelected = function (cclass) {
        return cclass.id === this.selectedId;
    };
    CClassListComponent.prototype.search = function (term) {
        console.log("TEST / search / term :: ", term);
        this.searchTerms.next(term);
    };
    CClassListComponent.prototype.testSwitchMap = function (term, index) {
        console.log("testSwitchMap / term ::: ", term);
        console.log("testSwitchMap / index ::: ", index);
        return Observable_1.Observable.of([]);
    };
    CClassListComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get class list
        this.route.params.forEach(function (params) {
            _this.selectedId = params['id'];
            _this.service.getCClasses()
                .then(function (cclasses) { return _this.cclasses = cclasses; });
        });
        // search class with keyword
        // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
        this.klassKeywords =
            this.searchTerms
                .debounceTime(300)
                .distinctUntilChanged()
                .switchMap(
            // this.testSwitchMap
            function (term) { return term ? _this.cclassSearchService.search(term) : Observable_1.Observable.of([]); })
                .catch(function (error) {
                // TODO: real error handling
                console.log(error);
                return Observable_1.Observable.of([]);
            });
    };
    CClassListComponent = __decorate([
        core_1.Component({
            styleUrls: ['./ng-working/cclass-center/cclass-list.component.css'],
            templateUrl: './ng-working/cclass-center/cclass-list.component.html',
            providers: [cclass_search_service_1.CClassSearchService]
        }), 
        __metadata('design:paramtypes', [cclass_search_service_1.CClassSearchService, cclass_service_1.CClassService, router_1.ActivatedRoute, router_1.Router])
    ], CClassListComponent);
    return CClassListComponent;
}());
exports.CClassListComponent = CClassListComponent;
//# sourceMappingURL=cclass-list.component.js.map