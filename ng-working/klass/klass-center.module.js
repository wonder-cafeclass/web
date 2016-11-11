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
var klass_radiobtn_service_1 = require('./service/klass-radiobtn.service');
var klass_checkbox_service_1 = require('./service/klass-checkbox.service');
var klass_color_service_1 = require('./service/klass-color.service');
var my_ruler_service_1 = require('../util/service/my-ruler.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var safe_html_pipe_1 = require('../util/pipe/safe-html-pipe');
var klass_detail_resolve_service_1 = require('./klass-detail-resolve.service');
var klass_center_component_1 = require('./klass-center.component');
var klass_list_component_1 = require('./klass-list.component');
var klass_center_home_component_1 = require('./klass-center-home.component');
var klass_detail_component_1 = require('./klass-detail.component');
var klass_detail_nav_list_component_1 = require('./klass-detail-nav-list.component');
var klass_filter_tile_component_1 = require('./klass-filter-tile.component');
var klass_center_routing_1 = require('./klass-center.routing');
var clock_board_component_1 = require('../widget/clock/clock-board.component');
var clock_digital_component_1 = require('../widget/clock/clock-digital.component');
var clock_component_1 = require('../widget/clock/clock.component');
var calendar_component_1 = require('../widget/calendar/calendar.component');
var mini_calendar_component_1 = require('../widget/calendar/mini-calendar.component');
var pricetag_component_1 = require('../widget/pricetag/pricetag.component');
var pricetag_h_component_1 = require('../widget/pricetag/pricetag-h.component');
var butterfly_component_1 = require('../widget/butterfly/butterfly.component');
var image_grid_component_1 = require('../widget/image-grid/image-grid.component');
var radiobtn_linear_component_1 = require('../widget/radiobtn/radiobtn-linear.component');
var input_view_component_1 = require('../widget/input-view/input-view.component');
var input_view_h_list_component_1 = require('../widget/input-view/input-view-h-list.component');
var input_view_updown_component_1 = require('../widget/input-view/input-view-updown.component');
var input_view_table_component_1 = require('../widget/input-view-table/input-view-table.component');
var single_input_view_component_1 = require('../widget/input-view/single-input-view.component');
var input_btns_row_component_1 = require('../widget/input-view/input-btns-row.component');
var inputs_btns_rows_component_1 = require('../widget/input-view/inputs-btns-rows.component');
var radiobtn_h_list_component_1 = require('../widget/radiobtn/radiobtn-h-list.component');
var checkbox_h_list_component_1 = require('../widget/checkbox/checkbox-h-list.component');
var nav_tabs_component_1 = require('../widget/nav-tabs/nav-tabs.component');
var smart_editor_component_1 = require('../widget/smart-editor/smart-editor.component');
var search_list_component_1 = require('../widget/search-list/search-list.component');
// @ Deprecated
var dron_list_component_1 = require('../widget/dron-list/dron-list.component');
var input_row_component_1 = require('../widget/input-row/input-row.component');
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
                klass_detail_nav_list_component_1.KlassDetailNavListComponent,
                klass_filter_tile_component_1.KlassFilterTileComponent,
                clock_board_component_1.ClockBoardComponent,
                clock_digital_component_1.ClockDigitalComponent,
                clock_component_1.ClockComponent,
                calendar_component_1.CalendarComponent,
                mini_calendar_component_1.MiniCalendarComponent,
                pricetag_component_1.PriceTagComponent,
                pricetag_h_component_1.PriceTagHComponent,
                butterfly_component_1.ButterflyComponent,
                image_grid_component_1.ImageGridComponent,
                radiobtn_linear_component_1.RadioBtnLinearComponent,
                input_view_component_1.InputViewComponent,
                input_view_h_list_component_1.InputViewHListComponent,
                input_view_table_component_1.InputViewTableComponent,
                input_view_updown_component_1.InputViewUpdownComponent,
                input_btns_row_component_1.InputBtnsRowComponent,
                inputs_btns_rows_component_1.InputsBtnsRowsComponent,
                single_input_view_component_1.SingleInputViewComponent,
                radiobtn_h_list_component_1.RadioBtnHListComponent,
                checkbox_h_list_component_1.CheckBoxHListComponent,
                nav_tabs_component_1.NavTabsComponent,
                smart_editor_component_1.SmartEditorComponent,
                search_list_component_1.SearchListComponent,
                dron_list_component_1.DronListComponent,
                input_row_component_1.InputRowComponent,
                safe_html_pipe_1.SafeHtmlPipe
            ],
            providers: [
                klass_service_1.KlassService,
                klass_radiobtn_service_1.KlassRadioBtnService,
                klass_checkbox_service_1.KlassCheckBoxService,
                klass_detail_resolve_service_1.KlassDetailResolve,
                klass_color_service_1.KlassColorService,
                my_ruler_service_1.MyRulerService,
                my_checker_service_1.MyCheckerService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], KlassCenterModule);
    return KlassCenterModule;
}());
exports.KlassCenterModule = KlassCenterModule;
//# sourceMappingURL=klass-center.module.js.map