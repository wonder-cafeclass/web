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
var widget_module_1 = require('../widget/widget.module');
var klass_detail_component_1 = require('./klass-detail.component');
var klass_detail_nav_list_component_1 = require('./klass-detail-nav-list.component');
var klass_detail_routing_1 = require('./klass-detail.routing');
var klass_service_1 = require('../widget/klass/service/klass.service');
var klass_radiobtn_service_1 = require('../widget/klass/service/klass-radiobtn.service');
var klass_checkbox_service_1 = require('../widget/klass/service/klass-checkbox.service');
var klass_color_service_1 = require('../widget/klass/service/klass-color.service');
var klass_comment_service_1 = require('../widget/klass/service/klass-comment.service');
var klass_teacher_component_1 = require('../widget/klass/klass-teacher.component');
var klass_venue_search_list_component_1 = require('../widget/klass/klass-venue-search-list.component');
var klass_price_calculator_component_1 = require('../widget/klass/klass-price-calculator.component');
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
                widget_module_1.WidgetModule,
                klass_detail_routing_1.klassDetailRouting
            ],
            declarations: [
                klass_detail_component_1.KlassDetailComponent,
                klass_detail_nav_list_component_1.KlassDetailNavListComponent,
                klass_venue_search_list_component_1.KlassVenueSearchListComponent,
                klass_teacher_component_1.KlassTeacherComponent,
                klass_price_calculator_component_1.KlassPriceCalculatorComponent
            ],
            providers: [
                klass_service_1.KlassService,
                klass_radiobtn_service_1.KlassRadioBtnService,
                klass_checkbox_service_1.KlassCheckBoxService,
                klass_color_service_1.KlassColorService,
                my_ruler_service_1.MyRulerService,
                my_checker_service_1.MyCheckerService,
                klass_comment_service_1.KlassCommentService,
                image_service_1.ImageService,
                teacher_service_1.TeacherService,
                upload_service_1.UploadService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], KlassDetailModule);
    return KlassDetailModule;
}());
exports.KlassDetailModule = KlassDetailModule;
//# sourceMappingURL=klass-detail.module.js.map