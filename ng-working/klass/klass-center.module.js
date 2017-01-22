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
var klass_center_routing_1 = require('./klass-center.routing');
var klass_center_component_1 = require('./klass-center.component');
var klass_list_component_1 = require('./klass-list.component');
var klass_filter_tile_component_1 = require('./klass-filter-tile.component');
var klass_simple_service_1 = require('../widget/klass/service/klass-simple.service');
// import { KlassService }              from './service/klass.service';
// import { KlassRadioBtnService }      from './service/klass-radiobtn.service';
// import { KlassCheckBoxService }      from './service/klass-checkbox.service';
// import { KlassColorService }         from './service/klass-color.service';
// import { KlassCommentService }       from './service/klass-comment.service';
// import { KlassDetailResolve }        from './klass-detail-resolve.service';
// import { KlassDetailComponent }              from './klass-detail.component';
// import { KlassCenterHomeComponent }          from './klass-center-home.component';
// import { KlassDetailNavListComponent }       from './klass-detail-nav-list.component';
// import { KlassTeacherComponent }             from './widget/klass-teacher.component';
// import { KlassVenueSearchListComponent }     from './widget/klass-venue-search-list.component';
// import { KlassPriceCalculatorComponent }     from './widget/klass-price-calculator.component';
// import { ClockBoardComponent }       from '../widget/clock/clock-board.component';
// import { ClockDigitalComponent }     from '../widget/clock/clock-digital.component';
// import { ClockComponent }            from '../widget/clock/clock.component';
// import { CalendarComponent }         from '../widget/calendar/calendar.component';
// import { MiniCalendarComponent }     from '../widget/calendar/mini-calendar.component';
// import { PriceTagComponent }         from '../widget/pricetag/pricetag.component';
// import { PriceTagHComponent }        from '../widget/pricetag/pricetag-h.component';
// import { ButterflyComponent }        from '../widget/butterfly/butterfly.component';
// import { ImageGridComponent }        from '../widget/image-grid/image-grid.component';
// import { RadioBtnLinearComponent }   from '../widget/radiobtn/radiobtn-linear.component';
// import { InputViewComponent }        from '../widget/input-view/input-view.component';
// import { InputViewHListComponent }   from '../widget/input-view/input-view-h-list.component';
// import { InputViewUpdownComponent }  from '../widget/input-view/input-view-updown.component';
// import { InputViewTableComponent }   from '../widget/input-view-table/input-view-table.component';
// import { SingleInputViewComponent }  from '../widget/input-view/single-input-view.component';
// import { RadioBtnHListComponent }    from '../widget/radiobtn/radiobtn-h-list.component';
// import { CheckBoxHListComponent }    from '../widget/checkbox/checkbox-h-list.component';
// import { SmartEditorComponent }      from '../widget/smart-editor/smart-editor.component';
// import { CommentListComponent }      from '../widget/comment/comment-list.component';
// import { CommentService }            from '../widget/comment/service/comment.service';
// import { InputRowComponent }         from '../widget/input-row/input-row.component';
// import { MyRulerService }            from '../util/service/my-ruler.service';
// import { MyCheckerService }          from '../util/service/my-checker.service';
// import { ImageService }              from '../util/image.service';
// import { TeacherService }            from '../teachers/service/teacher.service';
var KlassCenterModule = (function () {
    function KlassCenterModule() {
    }
    KlassCenterModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                shared_module_1.SharedModule,
                klass_center_routing_1.klassCenterRouting
            ],
            declarations: [
                klass_center_component_1.KlassCenterComponent,
                klass_list_component_1.KlassListComponent,
                klass_filter_tile_component_1.KlassFilterTileComponent,
            ],
            providers: [
                klass_simple_service_1.KlassSimpleService,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], KlassCenterModule);
    return KlassCenterModule;
}());
exports.KlassCenterModule = KlassCenterModule;
//# sourceMappingURL=klass-center.module.js.map