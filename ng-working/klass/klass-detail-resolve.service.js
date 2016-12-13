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
var klass_service_1 = require('./klass.service');
var KlassDetailResolve = (function () {
    function KlassDetailResolve(ks, router) {
        this.ks = ks;
        this.router = router;
    }
    KlassDetailResolve.prototype.resolve = function (route) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail-resolve / resolve / 시작");
        var id = +route.params['id'];
        return this.ks.getKlass(id).then(function (myReponse) {
            if (isDebug)
                console.log("klass-detail-resolve / resolve / myReponse : ", myReponse);
            /*
            if (klass) {
              return klass;
            } else { // id not found. return to "class center"
              this.router.navigate(['/class-center']);
              return false;
            }
            */
            return Promise.resolve(null);
        });
    };
    KlassDetailResolve = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [klass_service_1.KlassService, router_1.Router])
    ], KlassDetailResolve);
    return KlassDetailResolve;
}());
exports.KlassDetailResolve = KlassDetailResolve;
//# sourceMappingURL=klass-detail-resolve.service.js.map