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
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
var CClassSearchService = (function () {
    function CClassSearchService(location, http) {
        this.location = location;
        this.http = http;
        this.searchUrl = '/CI/index.php/api/classes/search';
    }
    // Legacy
    CClassSearchService.prototype.search = function (term) {
        var req_url = this.location._baseHref + "/CI/index.php/api/classes/search/?q=" + term;
        return this.http
            .get(req_url)
            .map(function (r) {
            // TODO 필터링 및 후처리 작업을 여기서 수행합니다.
            // FIXME - 에러 핸들링은 어떻게?
            return r.json().data;
        });
    };
    CClassSearchService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    };
    CClassSearchService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [common_1.Location, http_1.Http])
    ], CClassSearchService);
    return CClassSearchService;
}());
exports.CClassSearchService = CClassSearchService;
//# sourceMappingURL=cclass-search.service.js.map