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
require('../rxjs-extensions');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var common_1 = require('@angular/common');
var klass_service_1 = require('./klass.service');
var klass_detail_resolve_service_1 = require('./klass-detail-resolve.service');
var klass_center_component_1 = require('./klass-center.component');
var klass_list_component_1 = require('./klass-list.component');
var klass_center_home_component_1 = require('./klass-center-home.component');
var klass_detail_component_1 = require('./klass-detail.component');
var klass_filter_tile_component_1 = require('./klass-filter-tile.component');
var klass_center_routing_1 = require('./klass-center.routing');
var clock_board_component_1 = require('../widget/clock/clock-board.component');
var clock_digital_component_1 = require('../widget/clock/clock-digital.component');
var clock_component_1 = require('../widget/clock/clock.component');
var calendar_component_1 = require('../widget/calendar/calendar.component');
var pricetag_component_1 = require('../widget/pricetag/pricetag.component');
var image_grid_component_1 = require('../widget/image-grid/image-grid.component');
var KlassCenterModule = (function () {
    function KlassCenterModule() {
    }
    KlassCenterModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                klass_center_routing_1.klassCenterRouting
            ],
            declarations: [
                klass_center_component_1.KlassCenterComponent,
                klass_list_component_1.KlassListComponent,
                klass_center_home_component_1.KlassCenterHomeComponent,
                klass_detail_component_1.KlassDetailComponent,
                klass_filter_tile_component_1.KlassFilterTileComponent,
                clock_board_component_1.ClockBoardComponent,
                clock_digital_component_1.ClockDigitalComponent,
                clock_component_1.ClockComponent,
                calendar_component_1.CalendarComponent,
                pricetag_component_1.PriceTagComponent,
                image_grid_component_1.ImageGridComponent
            ],
            providers: [
                klass_service_1.KlassService,
                klass_detail_resolve_service_1.KlassDetailResolve
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], KlassCenterModule);
    return KlassCenterModule;
}());
exports.KlassCenterModule = KlassCenterModule;
//# sourceMappingURL=klass-center.module.js.map