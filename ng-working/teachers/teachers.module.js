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
var widget_module_1 = require('../widget/widget.module');
var teachers_routing_1 = require('./teachers.routing');
var apply_teacher_component_1 = require('./apply-teacher.component');
var apply_teacher_term_component_1 = require('./view/apply-teacher-term.component');
var teacher_my_nav_list_component_1 = require('./view/teacher-my-nav-list.component');
var teacher_info_v2_component_1 = require('./view/teacher-my-nav-list/teacher-info-v2.component');
var teacher_info_dashboard_component_1 = require('./view/teacher-my-nav-list/teacher-info-dashboard.component');
var teacher_info_question_component_1 = require('./view/teacher-my-nav-list/teacher-info-question.component');
var teacher_info_review_component_1 = require('./view/teacher-my-nav-list/teacher-info-review.component');
var teacher_info_income_component_1 = require('./view/teacher-my-nav-list/teacher-info-income.component');
var teacher_info_klass_component_1 = require('./view/teacher-my-nav-list/teacher-info-klass.component');
var login_service_1 = require('../login/service/login.service');
var user_service_1 = require('../users/service/user.service');
var teacher_service_1 = require('./service/teacher.service');
var klass_radiobtn_service_1 = require('../widget/klass/service/klass-radiobtn.service');
var klass_color_service_1 = require('../widget/klass/service/klass-color.service');
var upload_service_1 = require('../util/service/upload.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_birthday_service_1 = require('../util/service/my-birthday.service');
var TeachersModule = (function () {
    function TeachersModule() {
    }
    TeachersModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                widget_module_1.WidgetModule,
                teachers_routing_1.teachersRouting
            ],
            declarations: [
                apply_teacher_component_1.ApplyTeacherComponent,
                apply_teacher_term_component_1.ApplyTeacherTermComponent,
                teacher_my_nav_list_component_1.TeacherMyNavListComponent,
                teacher_info_v2_component_1.TeacherInfoV2Component,
                teacher_info_dashboard_component_1.TeacherInfoDashboardComponent,
                teacher_info_question_component_1.TeacherInfoQuestionComponent,
                teacher_info_review_component_1.TeacherInfoReviewComponent,
                teacher_info_income_component_1.TeacherInfoIncomeComponent,
                teacher_info_klass_component_1.TeacherInfoKlassComponent
            ],
            providers: [
                login_service_1.LoginService,
                user_service_1.UserService,
                teacher_service_1.TeacherService,
                my_checker_service_1.MyCheckerService,
                my_birthday_service_1.MyBirthdayService,
                klass_color_service_1.KlassColorService,
                klass_radiobtn_service_1.KlassRadioBtnService,
                upload_service_1.UploadService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], TeachersModule);
    return TeachersModule;
}());
exports.TeachersModule = TeachersModule;
//# sourceMappingURL=teachers.module.js.map