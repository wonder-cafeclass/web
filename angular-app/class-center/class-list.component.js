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
var class_service_1 = require('./class.service');
var ClassListComponent = (function () {
    function ClassListComponent(service, route, router) {
        this.service = service;
        this.route = route;
        this.router = router;
    }
    ClassListComponent.prototype.isSelected = function (_class) {
        return _class.id === this.selectedId;
    };
    ClassListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.selectedId = params['id'];
            _this.service.getCrises()
                .then(function (crises) { return _this.crises = crises; });
        });
    };
    ClassListComponent.prototype.onSelect = function (_class) {
        this.selectedId = _class.id;
        // Navigate with relative link
        this.router.navigate([_class.id], { relativeTo: this.route });
    };
    ClassListComponent = __decorate([
        core_1.Component({
            template: "\n    <ul class=\"items\">\n      <li *ngFor=\"let _class of crises\"\n        [_class.selected]=\"isSelected(_class)\"\n        (click)=\"onSelect(_class)\">\n        <span class=\"badge\">{{_class.id}}</span> {{_class.name}}\n      </li>\n    </ul>\n    <router-outlet></router-outlet>\n  "
        }), 
        __metadata('design:paramtypes', [class_service_1.ClassService, router_1.ActivatedRoute, router_1.Router])
    ], ClassListComponent);
    return ClassListComponent;
}());
exports.ClassListComponent = ClassListComponent;
//# sourceMappingURL=class-list.component.js.map