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
var cclass_service_1 = require('./cclass.service');
var cclass_search_service_1 = require('./cclass-search.service');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
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
        this.searchTerms.next(term);
    };
    CClassListComponent.prototype.ngOnInit = function () {
        /*
        // get class list
        this.route.params.forEach((params: Params) => {
          this.selectedId = params['id'];
          this.service.getCClasses()
            .then(cclasses => this.cclasses = cclasses);
        });
        */
        var _this = this;
        // search class with keyword
        // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
        this.cclassesObservable =
            this.searchTerms
                .debounceTime(300)
                .distinctUntilChanged()
                .subscribe(
            // TEST
            // value => console.log('Received new subject value: ',value)
            // term => term   
            // // return the http search observable
            // ? this.cclassSearchService.search(term)
            // // or the observable of empty useres if no search term
            // : Observable.of<CClass[]>([])
            function (term) { return term
                ? _this.cclassSearchService.search(term)
                : Observable_1.Observable.of([]); }, function (err) {
                // this.uiStateStore.endBackendAction();
                // handling errors.
            });
        /*
        this.searchTerms
        .debounceTime(300)        // wait for 300ms pause in events
        .distinctUntilChanged()   // ignore if next search term is same as previous
        .switchMap(
          this.test
    
          // // switch to new observable each time
          // term => term
          // // return the http search observable
          // ? this.cclassSearchService.search(term)
          // // or the observable of empty useres if no search term
          // : Observable.of<CClass[]>([])
        )
        .catch(error => {
          // TODO: real error handling
          console.log(error);
          return Observable.of<CClass[]>([]);
        });
        */
    };
    CClassListComponent.prototype.test = function (term, index) {
        console.log("TEST / term ::: ", term);
        console.log("TEST / index ::: ", index);
        return Observable_1.Observable.of([]);
    };
    CClassListComponent = __decorate([
        core_1.Component({
            styleUrls: ['./ng-working/cclass-center/cclass-list.component.css'],
            templateUrl: './ng-working/cclass-center/cclass-list.component.html'
        }), 
        __metadata('design:paramtypes', [cclass_search_service_1.CClassSearchService, cclass_service_1.CClassService, router_1.ActivatedRoute, router_1.Router])
    ], CClassListComponent);
    return CClassListComponent;
}());
exports.CClassListComponent = CClassListComponent;
//# sourceMappingURL=cclass-list.component.js.map