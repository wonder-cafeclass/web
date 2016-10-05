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
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var class_list_component_1 = require('./class-list.component');
var class_detail_component_1 = require('./class-detail.component');
var class_service_1 = require('./class.service');
var class_center_routing_1 = require('./class-center.routing');
var class_detail_resolve_service_1 = require('./class-detail-resolve.service');
var ClassCenterModule = (function () {
    function ClassCenterModule() {
    }
    ClassCenterModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                class_center_routing_1.classCenterRouting
            ],
            declarations: [
                class_list_component_1.ClassListComponent,
                class_detail_component_1.ClassDetailComponent
            ],
            providers: [
                class_service_1.ClassService,
                class_detail_resolve_service_1.ClassDetailResolve
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ClassCenterModule);
    return ClassCenterModule;
}());
exports.ClassCenterModule = ClassCenterModule;
//# sourceMappingURL=class-center.module.js.map