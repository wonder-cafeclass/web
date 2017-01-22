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
var shared_module_1 = require('../shared/shared.module');
var klass_detail_routing_1 = require('./klass-detail.routing');
var klass_service_1 = require('../widget/klass/service/klass.service');
var klass_radiobtn_service_1 = require('../widget/klass/service/klass-radiobtn.service');
var klass_checkbox_service_1 = require('../widget/klass/service/klass-checkbox.service');
var klass_color_service_1 = require('../widget/klass/service/klass-color.service');
var klass_comment_service_1 = require('../widget/klass/service/klass-comment.service');
var klass_detail_component_1 = require('./klass-detail.component');
var klass_detail_nav_list_component_1 = require('./klass-detail-nav-list.component');
var klass_teacher_component_1 = require('../widget/klass/klass-teacher.component');
var klass_venue_search_list_component_1 = require('../widget/klass/klass-venue-search-list.component');
var klass_price_calculator_component_1 = require('../widget/klass/klass-price-calculator.component');
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
var radiobtn_h_list_component_1 = require('../widget/radiobtn/radiobtn-h-list.component');
var checkbox_h_list_component_1 = require('../widget/checkbox/checkbox-h-list.component');
var smart_editor_component_1 = require('../widget/smart-editor/smart-editor.component');
var comment_list_component_1 = require('../widget/comment/comment-list.component');
var comment_service_1 = require('../widget/comment/service/comment.service');
var input_row_component_1 = require('../widget/input-row/input-row.component');
var hidden_uploader_component_1 = require('../widget/input/img-uploader/hidden-uploader.component');
var default_component_1 = require('../widget/input/default/default.component');
var default_service_1 = require('../widget/input/default/service/default.service');
var my_title_component_1 = require('../widget/input/title/my-title.component');
var image_grid_v2_component_1 = require('../widget/image-grid/image-grid-v2.component');
var image_entry_component_1 = require('../widget/image-grid/image-entry.component');
var import_component_1 = require('../widget/payment/import.component');
var payment_service_1 = require('../widget/payment/service/payment.service');
var nav_tabs_component_1 = require('../widget/nav-tabs/nav-tabs.component');
var inputs_btns_rows_component_1 = require('../widget/input-view/inputs-btns-rows.component');
var input_btns_row_component_1 = require('../widget/input-view/input-btns-row.component');
var tooltip_component_1 = require('../widget/input/tooltip/tooltip.component');
var my_ruler_service_1 = require('../util/service/my-ruler.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var upload_service_1 = require('../util/service/upload.service');
var image_service_1 = require('../util/image.service');
var teacher_service_1 = require('../teachers/service/teacher.service');
var KlassDetailModule = (function () {
    function KlassDetailModule() {
    }
    KlassDetailModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                shared_module_1.SharedModule,
                klass_detail_routing_1.klassDetailRouting
            ],
            declarations: [
                klass_detail_component_1.KlassDetailComponent,
                klass_detail_nav_list_component_1.KlassDetailNavListComponent,
                klass_venue_search_list_component_1.KlassVenueSearchListComponent,
                klass_teacher_component_1.KlassTeacherComponent,
                klass_price_calculator_component_1.KlassPriceCalculatorComponent,
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
                single_input_view_component_1.SingleInputViewComponent,
                radiobtn_h_list_component_1.RadioBtnHListComponent,
                checkbox_h_list_component_1.CheckBoxHListComponent,
                smart_editor_component_1.SmartEditorComponent,
                comment_list_component_1.CommentListComponent,
                input_row_component_1.InputRowComponent,
                hidden_uploader_component_1.HiddenUploaderComponent,
                default_component_1.DefaultComponent,
                my_title_component_1.MyTitleComponent,
                image_grid_v2_component_1.ImageGridV2Component,
                image_entry_component_1.ImageEntryComponent,
                import_component_1.ImportComponent,
                nav_tabs_component_1.NavTabsComponent,
                inputs_btns_rows_component_1.InputsBtnsRowsComponent,
                input_btns_row_component_1.InputBtnsRowComponent,
                tooltip_component_1.TooltipComponent
            ],
            providers: [
                klass_service_1.KlassService,
                klass_radiobtn_service_1.KlassRadioBtnService,
                klass_checkbox_service_1.KlassCheckBoxService,
                klass_color_service_1.KlassColorService,
                my_ruler_service_1.MyRulerService,
                my_checker_service_1.MyCheckerService,
                klass_comment_service_1.KlassCommentService,
                comment_service_1.CommentService,
                image_service_1.ImageService,
                teacher_service_1.TeacherService,
                payment_service_1.PaymentService,
                default_service_1.DefaultService,
                upload_service_1.UploadService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], KlassDetailModule);
    return KlassDetailModule;
}());
exports.KlassDetailModule = KlassDetailModule;
//# sourceMappingURL=klass-detail.module.js.map