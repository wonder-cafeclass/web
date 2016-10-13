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
var CClassDetailResolve = (function () {
    function CClassDetailResolve(cs, router) {
        this.cs = cs;
        this.router = router;
    }
    CClassDetailResolve.prototype.resolve = function (route) {
        var _this = this;
        var id = +route.params['id'];
        return this.cs.getCClass(id).then(function (cclass) {
            if (cclass) {
                return cclass;
            }
            else {
                _this.router.navigate(['/cclass-center']);
                return false;
            }
        });
    };
    CClassDetailResolve = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [cclass_service_1.CClassService, router_1.Router])
    ], CClassDetailResolve);
    return CClassDetailResolve;
}());
exports.CClassDetailResolve = CClassDetailResolve;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=cclass-detail-resolve.service.js.map