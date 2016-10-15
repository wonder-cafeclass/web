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
require('./rxjs-extensions');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var common_1 = require('@angular/common');
var klass_service_1 = require('./klass.service');
var cclass_search_service_1 = require('./cclass-search.service');
var cclass_detail_resolve_service_1 = require('./cclass-detail-resolve.service');
var cclass_center_component_1 = require('./cclass-center.component');
var cclass_list_component_1 = require('./cclass-list.component');
var cclass_center_home_component_1 = require('./cclass-center-home.component');
var cclass_detail_component_1 = require('./cclass-detail.component');
var cclass_center_routing_1 = require('./cclass-center.routing');
var CClassCenterModule = (function () {
    function CClassCenterModule() {
    }
    CClassCenterModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                cclass_center_routing_1.cclassCenterRouting
            ],
            declarations: [
                cclass_center_component_1.CClassCenterComponent,
                cclass_list_component_1.CClassListComponent,
                cclass_center_home_component_1.CClassCenterHomeComponent,
                cclass_detail_component_1.CClassDetailComponent
            ],
            providers: [
                klass_service_1.KlassService,
                cclass_search_service_1.CClassSearchService,
                cclass_detail_resolve_service_1.CClassDetailResolve
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], CClassCenterModule);
    return CClassCenterModule;
}());
exports.CClassCenterModule = CClassCenterModule;
//# sourceMappingURL=cclass-center.module.js.map