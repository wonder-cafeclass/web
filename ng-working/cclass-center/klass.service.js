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
var KlassService = (function () {
    // REMOVE ME
    // static nextCClassId = 100;
    // New - XHR
    // promise-based
    function KlassService(location, http) {
        this.location = location;
        this.http = http;
        this.classesUrl = '/CI/index.php/api/klass/list';
        this.klassSelectileUrl = '/CI/index.php/api/klass/selectile';
        this.klassSearchUrl = '/CI/index.php/api/klass/search';
        this.baseHref = "";
        this.baseHref = this.location._baseHref;
    }
    KlassService.prototype.searchKlassList = function (level, station, day, time, q) {
        var qEncoded = encodeURIComponent(q);
        var req_url = "" + this.baseHref + this.klassSearchUrl + "?level=" + level + "&station=" + station + "&day=" + day + "&time=" + time + "&q=" + qEncoded;
        console.log("TEST / req_url ::: ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    KlassService.prototype.getCClasses = function () {
        return this.http.get(this.baseHref + this.classesUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    KlassService.prototype.getKlassSelectile = function () {
        return this.http.get(this.baseHref + this.klassSelectileUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    KlassService.prototype.extractData = function (res) {
        var body = res.json();
        console.log("KlassService / extractData / body ::: ", body);
        // TODO - 데이터 검증 프로세스.
        if (null == body.data || !body.success) {
            return null;
        }
        return body.data;
    };
    // New - XHR
    // promise-based
    KlassService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    };
    KlassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [common_1.Location, http_1.Http])
    ], KlassService);
    return KlassService;
}());
exports.KlassService = KlassService;
//# sourceMappingURL=klass.service.js.map