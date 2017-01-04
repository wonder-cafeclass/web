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
var router_1 = require('@angular/router');
var admin_service_1 = require('./service/admin.service');
var teacher_1 = require('../teachers/model/teacher');
var default_meta_1 = require('../widget/input/default/model/default-meta');
var default_type_1 = require('../widget/input/default/model/default-type');
var pagination_1 = require('../widget/pagination/model/pagination');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_is_1 = require('../util/helper/my-is');
var my_array_1 = require('../util/helper/my-array');
var my_format_1 = require('../util/helper/my-format');
var ManageTeachersComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function ManageTeachersComponent(adminService, myEventService, watchTower, router) {
        this.adminService = adminService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.checkBoxList = [];
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.defaultType = new default_type_1.DefaultType();
        this.defaultMetaTeacherStatus = this.getMetaSelectTeacherStatus();
        this.pagination = new pagination_1.Pagination();
        this.subscribeLoginUser();
        this.subscribeEventPack();
    }
    ManageTeachersComponent.prototype.ngOnInit = function () {
    };
    ManageTeachersComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    ManageTeachersComponent.prototype.getMetaSelectTeacherStatus = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "선생님 상태", 
        // public placeholder:string
        "선생님 상태를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_TEACHER_STATUS, 
        // public checkerKey:string
        "teacher_status", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageTeachersComponent.prototype.subscribeLoginUser = function () {
        if (this.isDebug())
            console.log("manage-teachers / subscribeLoginUser / init");
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser || !this.loginUser.isAdminUser()) {
            this.goHome();
        } // end if
        this.init();
    }; // end method
    ManageTeachersComponent.prototype.goHome = function () {
        if (this.isDebug())
            console.log("manage-teachers / goHome / init");
        this.router.navigate(["/"]);
    };
    ManageTeachersComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("manage-teachers / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("manage-teachers / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            this.init();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("manage-teachers / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                _this.init();
            }); // end subscribe
        } // end if
    }; // end method
    ManageTeachersComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("manage-teachers / init / 시작");
        // 1. 운영자 유저의 pagination을 가져옵니다.
        this.fetchTeachersPagination();
        // 2. 선생님 유저의 pagination을 가져옵니다.
        // 3. 학생 유저의 pagination을 가져옵니다.
    };
    ManageTeachersComponent.prototype.getDefaultOptionTeacherListStatus = function (teacher) {
        if (this.isDebug())
            console.log("manage-teachers / getDefaultOptionTeacherListStatus / 시작");
        if (null == teacher) {
            if (this.isDebug())
                console.log("manage-teachers / getDefaultOptionTeacherListStatus / 중단 / null == teacher");
            return;
        }
        var keyList = [];
        var valueList = [];
        var teacherStatusList = this.watchTower.getMyConst().getList("teacher_status_list");
        var teacherStatusKorList = this.watchTower.getMyConst().getList("teacher_status_kor_list");
        for (var i = 0; i < teacherStatusList.length; ++i) {
            var teacherStatusKor = teacherStatusKorList[i];
            var teacherStatus = teacherStatusList[i];
            keyList.push(teacherStatusKor);
            valueList.push(teacherStatus);
        }
        return this.watchTower.getDefaultOptionListWithMeta(keyList, valueList, teacher.status, teacher);
    }; // end method
    // @ Desc : 운영자 유저리스트의 페이지 네이션을 가져옵니다.
    ManageTeachersComponent.prototype.fetchTeachersPagination = function () {
        var _this = this;
        if (this.isDebug())
            console.log("manage-teachers / fetchTeachersPagination / 시작");
        this.adminService
            .fetchTeachersPagination(this.watchTower.getApiKey())
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-teachers / fetchTeachersPagination / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("pagination")) {
                if (_this.isDebug())
                    console.log("manage-teachers / fetchTeachersPagination / success");
                // 1. 페이지네이션 데이터를 저장합니다. 가져온 데이터로 페이지네이션을 표시.
                var json = myResponse.getDataProp("pagination");
                _this.pagination.setJSON(json);
                // 2. 선생님 리스트를 가져옵니다. 
                _this.fetchTeacherList(_this.pagination["PAGE_NUM"], _this.pagination["PAGE_RANGE"]);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-teachers / fetchTeachersPagination / failed");
                _this.watchTower.logAPIError("fetchTeachersPagination has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service    
    };
    ManageTeachersComponent.prototype.updateTeacherList = function (teacherJSONList) {
        if (this.isDebug())
            console.log("manage-teachers / updateTeacherList / 시작");
        if (this.myArray.isNotOK(teacherJSONList)) {
            if (this.isDebug())
                console.log("manage-teachers / updateTeacherList / 중단 / this.myArray.isNotOK(teacherJSONList)");
            return;
        }
        var teacherList = [];
        for (var i = 0; i < teacherJSONList.length; ++i) {
            var teacherJSON = teacherJSONList[i];
            var teacher = new teacher_1.Teacher().setJSON(teacherJSON);
            var defaultOptionListStatus = this.getDefaultOptionTeacherListStatus(teacher);
            teacher["selectOptionListStatus"] = defaultOptionListStatus;
            // 성별을 보기 쉽게 변경 
            var genderReadable = this.watchTower
                .getMyConst()
                .getValue(
            // srcKey:string, 
            "user_gender_list", 
            // srcValue:string, 
            teacher.gender, 
            // targetKey:string
            "user_gender_kor_list");
            if (this.isDebug())
                console.log("manage-teachers / updateTeacherList / genderReadable : ", genderReadable);
            teacher.gender_readable = genderReadable;
            teacherList.push(teacher);
        } // end for
        if (this.isDebug())
            console.log("manage-teachers / updateTeacherList / teacherList : ", teacherList);
        this.teacherList = teacherList;
    };
    // @ Desc : 운영자 유저 리스트를 가져옵니다.
    ManageTeachersComponent.prototype.fetchTeacherList = function (pageNum, pageSize) {
        // 유저 리스트는 아래 카테고리별로 나누어 가져옵니다.
        // a. 운영자
        // b. 선생님
        // c. 학생
        var _this = this;
        this.adminService
            .fetchTeacherList(this.watchTower.getApiKey(), pageNum, pageSize)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-teachers / fetchTeacherList / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("teacher_list")) {
                var teacherJSONList = myResponse.getDataProp("teacher_list");
                if (_this.isDebug())
                    console.log("manage-teachers / fetchTeacherList / teacherJSONList : ", teacherJSONList);
                _this.updateTeacherList(teacherJSONList);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-teachers / fetchTeacherList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");
                _this.watchTower.logAPIError("fetchTeacherList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    ManageTeachersComponent.prototype.updateCheckBoxes = function (checked) {
        if (this.isDebug())
            console.log("manage-teachers / updateCheckBoxes / 시작");
        if (this.isDebug())
            console.log("manage-teachers / updateCheckBoxes / this.checkBoxList : ", this.checkBoxList);
        if (this.isDebug())
            console.log("manage-teachers / updateCheckBoxes / checked : ", checked);
        for (var i = 0; i < this.checkBoxList.length; ++i) {
            var checkBox = this.checkBoxList[i];
            checkBox.setIsChecked(checked);
        } // end for
    }; // end method
    ManageTeachersComponent.prototype.updateTeacherStatus = function (value, teacher) {
        var _this = this;
        if (this.isDebug())
            console.log("manage-teachers / updateTeacherStatus / 시작");
        if (null == value || "" === value) {
            if (this.isDebug())
                console.log("manage-teachers / updateTeacherStatus / 중단 / value is not valid!");
            return;
        }
        if (null == teacher) {
            if (this.isDebug())
                console.log("manage-teachers / updateTeacherStatus / 중단 / teacher is not valid!");
            return;
        }
        if (this.isDebug())
            console.log("manage-teachers / updateTeacherStatus / value : ", value);
        if (this.isDebug())
            console.log("manage-teachers / updateTeacherStatus / teacher : ", teacher);
        this.adminService
            .updateTeacher(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userIdAdmin:number, 
        this.loginUser.id, 
        // teacherId:number, 
        teacher.id, 
        // teacherStatus:string 
        value)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-teachers / updateTeacherStatus / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                if (_this.isDebug())
                    console.log("manage-teachers / updateTeacherStatus / success");
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-teachers / updateTeacherStatus / failed");
                _this.watchTower.logAPIError("updateTeacherStatus has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    };
    ManageTeachersComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("manage-teachers / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (this.isDebug())
                console.log("manage-teachers / onChangedFromChild / 중단 / null == myEvent");
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
            }
            else if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX)) {
                this.checkBoxList.push(myEvent.metaObj);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
                var isChecked = ("true" == "" + myEvent.value) ? true : false;
                this.updateCheckBoxes(isChecked);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_STATUS)) {
                this.updateTeacherStatus(myEvent.value, myEvent.metaObj);
            } // end if
        } // end if
    }; // end method
    ManageTeachersComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'manage-teachers',
            templateUrl: 'manage-teachers.component.html',
            styleUrls: ['manage-teachers.component.css']
        }), 
        __metadata('design:paramtypes', [admin_service_1.AdminService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], ManageTeachersComponent);
    return ManageTeachersComponent;
}());
exports.ManageTeachersComponent = ManageTeachersComponent; // end class
//# sourceMappingURL=manage-teachers.component.js.map