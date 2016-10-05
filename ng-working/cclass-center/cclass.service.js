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
var CClass = (function () {
    function CClass(id, name) {
        this.id = id;
        this.name = name;
    }
    return CClass;
}());
exports.CClass = CClass;
var CRISES = [
    new CClass(1, 'Dragon Burning Cities'),
    new CClass(2, 'Sky Rains Great White Sharks'),
    new CClass(3, 'Giant Asteroid Heading For Earth'),
    new CClass(4, 'Procrastinators Meeting Delayed Again'),
];
var cclassesPromise = Promise.resolve(CRISES);
var core_1 = require('@angular/core');
var CClassService = (function () {
    function CClassService() {
    }
    CClassService.prototype.getCrises = function () { return cclassesPromise; };
    CClassService.prototype.getCClass = function (id) {
        return cclassesPromise
            .then(function (cclasses) { return cclasses.find(function (cclass) { return cclass.id === +id; }); });
    };
    CClassService.prototype.addCClass = function (name) {
        name = name.trim();
        if (name) {
            var cclass_1 = new CClass(CClassService.nextCClassId++, name);
            cclassesPromise.then(function (cclasses) { return cclasses.push(cclass_1); });
        }
    };
    CClassService.nextCClassId = 100;
    CClassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
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