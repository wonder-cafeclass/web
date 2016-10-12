// import 'rxjs/add/operator/toPromise';
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
var CClassService = (function () {
    // New - XHR
    // promise-based
    function CClassService(location, http) {
        this.location = location;
        this.http = http;
        this.classesUrl = '/CI/index.php/api/classes/list';
    }
    CClassService.prototype.getCClasses = function () {
        return this.http.get(this.location._baseHref + this.classesUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CClassService.prototype.extractData = function (res) {
        var body = res.json();
        console.log("CClassService / extractData / body ::: ", body);
        // console.log("extractData / body.data ::: ",body.data);
        return body.data || {};
    };
    // New - XHR
    // promise-based
    CClassService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    };
    CClassService.prototype.getCClass = function (id) {
        return this.getCClasses().then(function (cclasses) { return cclasses.find(function (cclass) { return cclass.id === +id; }); });
    };
    CClassService.prototype.addCClass = function (title) {
        title = title.trim();
        if (title) {
        }
    };
    CClassService.nextCClassId = 100;
    CClassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [common_1.Location, http_1.Http])
    ], CClassService);
    return CClassService;
}());
exports.CClassService = CClassService;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=cclass.service.js.map