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
require('../rxjs-operators');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var nav_tabs_component_1 = require('./nav-tabs/nav-tabs.component');
var default_component_1 = require('./input/default/default.component');
var email_component_1 = require('./input/email/email.component');
var profile_img_upload_component_1 = require('./input/profile-img-upload/profile-img-upload.component');
var img_uploader_component_1 = require('./input/img-uploader/img-uploader.component');
var password_component_1 = require('./input/password/password.component');
var password_single_component_1 = require('./input/password/password-single.component');
var passwords_triplet_component_1 = require('./input/password/passwords-triplet.component');
var mobile_component_1 = require('./input/mobile/mobile.component');
var name_component_1 = require('./input/name/name.component');
var gender_component_1 = require('./input/gender/gender.component');
var birthday_component_1 = require('./input/birthday/birthday.component');
var nickname_component_1 = require('./input/nickname/nickname.component');
var tooltip_component_1 = require('./input/tooltip/tooltip.component');
var my_title_component_1 = require('./input/title/my-title.component');
var image_entry_component_1 = require('./image-grid/image-entry.component');
var image_grid_v2_component_1 = require('./image-grid/image-grid-v2.component');
var input_btns_row_component_1 = require('./input-view/input-btns-row.component');
var inputs_btns_rows_component_1 = require('./input-view/inputs-btns-rows.component');
var import_component_1 = require('./payment/import.component');
var klass_card_component_1 = require('./klass/klass-card.component');
var klass_n_student_list_component_1 = require('./klass/klass-n-student-list.component');
var klass_info_for_teacher_component_1 = require('./klass/klass-info-for-teacher.component');
var default_service_1 = require('./input/default/service/default.service');
var payment_service_1 = require('./payment/service/payment.service');
var checkbox_component_1 = require('./checkbox/checkbox.component');
var pagination_component_1 = require('./pagination/pagination.component');
var clock_board_component_1 = require('./clock/clock-board.component');
var clock_digital_component_1 = require('./clock/clock-digital.component');
var clock_component_1 = require('./clock/clock.component');
var calendar_component_1 = require('./calendar/calendar.component');
var mini_calendar_component_1 = require('./calendar/mini-calendar.component');
var pricetag_component_1 = require('./pricetag/pricetag.component');
var pricetag_h_component_1 = require('./pricetag/pricetag-h.component');
var butterfly_component_1 = require('./butterfly/butterfly.component');
var image_grid_component_1 = require('./image-grid/image-grid.component');
var radiobtn_linear_component_1 = require('./radiobtn/radiobtn-linear.component');
var input_view_component_1 = require('./input-view/input-view.component');
var input_view_h_list_component_1 = require('./input-view/input-view-h-list.component');
var input_view_updown_component_1 = require('./input-view/input-view-updown.component');
var input_view_table_component_1 = require('./input-view-table/input-view-table.component');
var single_input_view_component_1 = require('./input-view/single-input-view.component');
var radiobtn_h_list_component_1 = require('./radiobtn/radiobtn-h-list.component');
var checkbox_h_list_component_1 = require('./checkbox/checkbox-h-list.component');
var smart_editor_component_1 = require('./smart-editor/smart-editor.component');
var comment_list_component_1 = require('./comment/comment-list.component');
var comment_service_1 = require('../widget/comment/service/comment.service');
var input_row_component_1 = require('../widget/input-row/input-row.component');
var hidden_uploader_component_1 = require('../widget/input/img-uploader/hidden-uploader.component');
var WidgetModule = (function () {
    function WidgetModule() {
    }
    WidgetModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule
            ],
            declarations: [
                nav_tabs_component_1.NavTabsComponent,
                default_component_1.DefaultComponent,
                email_component_1.EmailComponent,
                profile_img_upload_component_1.ProfileImgUploadComponent,
                img_uploader_component_1.ImgUploaderComponent,
                image_entry_component_1.ImageEntryComponent,
                image_grid_v2_component_1.ImageGridV2Component,
                input_btns_row_component_1.InputBtnsRowComponent,
                inputs_btns_rows_component_1.InputsBtnsRowsComponent,
                // DebugBtnComponent,
                import_component_1.ImportComponent,
                klass_card_component_1.KlassCardComponent,
                klass_n_student_list_component_1.KlassNStudentListComponent,
                klass_info_for_teacher_component_1.KlassInfoForTeacherComponent,
                checkbox_component_1.CheckBoxComponent,
                pagination_component_1.PaginationComponent,
                my_title_component_1.MyTitleComponent,
                password_component_1.PasswordComponent,
                password_single_component_1.PasswordSingleComponent,
                passwords_triplet_component_1.PasswordsTripletComponent,
                mobile_component_1.MobileComponent,
                name_component_1.NameComponent,
                gender_component_1.GenderComponent,
                birthday_component_1.BirthdayComponent,
                nickname_component_1.NicknameComponent,
                tooltip_component_1.TooltipComponent,
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
                input_view_updown_component_1.InputViewUpdownComponent,
                input_view_table_component_1.InputViewTableComponent,
                single_input_view_component_1.SingleInputViewComponent,
                radiobtn_h_list_component_1.RadioBtnHListComponent,
                checkbox_h_list_component_1.CheckBoxHListComponent,
                smart_editor_component_1.SmartEditorComponent,
                comment_list_component_1.CommentListComponent,
                input_row_component_1.InputRowComponent,
                hidden_uploader_component_1.HiddenUploaderComponent
            ],
            exports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                nav_tabs_component_1.NavTabsComponent,
                default_component_1.DefaultComponent,
                email_component_1.EmailComponent,
                profile_img_upload_component_1.ProfileImgUploadComponent,
                img_uploader_component_1.ImgUploaderComponent,
                image_entry_component_1.ImageEntryComponent,
                image_grid_v2_component_1.ImageGridV2Component,
                input_btns_row_component_1.InputBtnsRowComponent,
                inputs_btns_rows_component_1.InputsBtnsRowsComponent,
                import_component_1.ImportComponent,
                klass_card_component_1.KlassCardComponent,
                klass_n_student_list_component_1.KlassNStudentListComponent,
                klass_info_for_teacher_component_1.KlassInfoForTeacherComponent,
                checkbox_component_1.CheckBoxComponent,
                pagination_component_1.PaginationComponent,
                my_title_component_1.MyTitleComponent,
                password_component_1.PasswordComponent,
                password_single_component_1.PasswordSingleComponent,
                passwords_triplet_component_1.PasswordsTripletComponent,
                mobile_component_1.MobileComponent,
                name_component_1.NameComponent,
                gender_component_1.GenderComponent,
                birthday_component_1.BirthdayComponent,
                nickname_component_1.NicknameComponent,
                tooltip_component_1.TooltipComponent,
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
                input_view_updown_component_1.InputViewUpdownComponent,
                input_view_table_component_1.InputViewTableComponent,
                single_input_view_component_1.SingleInputViewComponent,
                radiobtn_h_list_component_1.RadioBtnHListComponent,
                checkbox_h_list_component_1.CheckBoxHListComponent,
                smart_editor_component_1.SmartEditorComponent,
                comment_list_component_1.CommentListComponent,
                input_row_component_1.InputRowComponent,
                hidden_uploader_component_1.HiddenUploaderComponent
            ],
            providers: [
                default_service_1.DefaultService,
                payment_service_1.PaymentService,
                comment_service_1.CommentService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], WidgetModule);
    return WidgetModule;
}());
exports.WidgetModule = WidgetModule;
//# sourceMappingURL=widget.module.js.map