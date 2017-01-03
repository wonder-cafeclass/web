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
var default_service_1 = require('./input/default/service/default.service');
var default_component_1 = require('./input/default/default.component');
var email_component_1 = require('./input/email/email.component');
var profile_img_upload_component_1 = require('./input/profile-img-upload/profile-img-upload.component');
var img_uploader_component_1 = require('./input/img-uploader/img-uploader.component');
var hidden_uploader_component_1 = require('./input/img-uploader/hidden-uploader.component');
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
var debug_btn_component_1 = require('./debug/debug-btn.component');
var checkbox_component_1 = require('./checkbox/checkbox.component');
var footer_component_1 = require('./footer/footer.component');
var safe_html_pipe_1 = require('../util/pipe/safe-html-pipe');
// @ Desc : Shared module.
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
                debug_btn_component_1.DebugBtnComponent,
                checkbox_component_1.CheckBoxComponent,
                my_title_component_1.MyTitleComponent,
                hidden_uploader_component_1.HiddenUploaderComponent,
                password_component_1.PasswordComponent,
                password_single_component_1.PasswordSingleComponent,
                passwords_triplet_component_1.PasswordsTripletComponent,
                mobile_component_1.MobileComponent,
                name_component_1.NameComponent,
                gender_component_1.GenderComponent,
                birthday_component_1.BirthdayComponent,
                nickname_component_1.NicknameComponent,
                tooltip_component_1.TooltipComponent,
                footer_component_1.FooterComponent,
                safe_html_pipe_1.SafeHtmlPipe
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
                debug_btn_component_1.DebugBtnComponent,
                checkbox_component_1.CheckBoxComponent,
                my_title_component_1.MyTitleComponent,
                hidden_uploader_component_1.HiddenUploaderComponent,
                password_component_1.PasswordComponent,
                password_single_component_1.PasswordSingleComponent,
                passwords_triplet_component_1.PasswordsTripletComponent,
                mobile_component_1.MobileComponent,
                name_component_1.NameComponent,
                gender_component_1.GenderComponent,
                birthday_component_1.BirthdayComponent,
                nickname_component_1.NicknameComponent,
                tooltip_component_1.TooltipComponent,
                footer_component_1.FooterComponent,
                safe_html_pipe_1.SafeHtmlPipe
            ],
            providers: [
                default_service_1.DefaultService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], WidgetModule);
    return WidgetModule;
}());
exports.WidgetModule = WidgetModule;
//# sourceMappingURL=widget.module.js.map