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
var klass_color_service_1 = require('./service/klass-color.service');
var KlassDetailNavListComponent = (function () {
    function KlassDetailNavListComponent(klassColorService) {
        this.klassColorService = klassColorService;
        this.cageWidth = -1;
    }
    KlassDetailNavListComponent.prototype.ngOnInit = function () {
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        } // end if
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassDetailNavListComponent.prototype, "radiobtnOptionListNavTabs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassDetailNavListComponent.prototype, "cageWidth", void 0);
    KlassDetailNavListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-detail-nav-list',
            templateUrl: 'klass-detail-nav-list.component.html',
            styleUrls: ['klass-detail-nav-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService])
    ], KlassDetailNavListComponent);
    return KlassDetailNavListComponent;
}());
exports.KlassDetailNavListComponent = KlassDetailNavListComponent;
//# sourceMappingURL=klass-detail-nav-list.component.js.map