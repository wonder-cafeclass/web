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
        this.searchQuery = "";
        this.teacherStatus = "";
        this.pageNum = 1;
        this.pageRowCnt = 5;
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.defaultType = new default_type_1.DefaultType();
        this.defaultMetaTeacherStatus = this.getMetaSelectTeacherStatus();
        this.defaultMetaTeacherStatusForSearch = this.getMetaSelectTeacherStatusForSearch();
        this.defaultMetaSearchQuery = this.getMetaSearchInput();
        this.pagination = new pagination_1.Pagination();
        this.selectOptionListTeacherStatus = this.getDefaultOptionTeacherListStatusForSearch();
        this.subscribeLoginUser();
        this.subscribeEventPack();
    } // end constructor
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
    ManageTeachersComponent.prototype.getMetaSelectTeacherStatusForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 선생님 상태", 
        // public placeholder:string
        "검색 조건 - 선생님 상태를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_TEACHER_STATUS_FOR_SEARCH, 
        // public checkerKey:string
        "teacher_status", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageTeachersComponent.prototype.getMetaSearchInput = function () {
        return new default_meta_1.DefaultMeta(// 2
        // public title:string
        "검색", 
        // public placeholder:string
        "검색어를 입력해주세요", 
        // public eventKey:string
        this.myEventService.KEY_SEARCH_QUERY, 
        // public checkerKey:string
        "search_query", 
        // public type:string
        this.defaultType.TYPE_INPUT);
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
        this.fetchTeacherList(
        // pageNum:number, 
        this.pageNum, 
        // pageRowCnt:number, 
        this.pageRowCnt, 
        // searchQuery:string, 
        this.searchQuery, 
        // teacherStatus:string, 
        this.teacherStatus);
    }; // end method
    ManageTeachersComponent.prototype.getDefaultOptionTeacherListStatus = function (teacher) {
        if (this.isDebug())
            console.log("manage-teachers / getDefaultOptionTeacherListStatus / 시작");
        var defaultOptionList = this.watchTower.getDefaultOptionListWithMetaByKeys(
        // keyListName:string,
        "teacher_status_kor_list", 
        // valueListName:string,
        "teacher_status_list", 
        // valueFocus:string,
        teacher.status, 
        // metaObj:any
        teacher);
        if (this.myArray.isOK(defaultOptionList)) {
            // "모든 상태" - 기본값 을 제거함.
            defaultOptionList.shift();
        }
        if (this.isDebug())
            console.log("manage-teachers / getDefaultOptionTeacherListStatus / defaultOptionList : ", defaultOptionList);
        return defaultOptionList;
    }; // end method
    // @ Desc : 검색을 위한 유저 상태 default option list - select box 
    ManageTeachersComponent.prototype.getDefaultOptionTeacherListStatusForSearch = function () {
        if (this.isDebug())
            console.log("manage-teachers / getDefaultOptionTeacherListStatusForSearch / 시작");
        return this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "teacher_status_kor_list", 
        // valueListName:string,
        "teacher_status_list", 
        // valueFocus:string
        "");
    }; // end method
    ManageTeachersComponent.prototype.updatePagination = function (jsonPagination) {
        if (this.isDebug())
            console.log("manage-teachers / updatePagination / 시작");
        if (this.isDebug())
            console.log("manage-teachers / updatePagination / jsonPagination : ", jsonPagination);
        if (null == jsonPagination) {
            this.pagination = null;
        }
        else {
            this.pagination = new pagination_1.Pagination().setJSON(jsonPagination);
        }
    };
    ManageTeachersComponent.prototype.updateTeacherList = function (jsonTeacherList) {
        if (this.isDebug())
            console.log("manage-teachers / updateTeacherList / 시작");
        if (this.myArray.isNotOK(jsonTeacherList)) {
            // 검색 결과가 없습니다.
            this.teacherList = null;
        }
        else {
            var teacherList = [];
            for (var i = 0; i < jsonTeacherList.length; ++i) {
                var teacherJSON = jsonTeacherList[i];
                var teacher = new teacher_1.Teacher().setJSON(teacherJSON);
                var defaultOptionListStatus = this.getDefaultOptionTeacherListStatus(teacher);
                teacher["selectOptionListStatus"] = defaultOptionListStatus;
                // 자신의 데이터인지 확인한다.
                if (this.loginUser.id === teacher.user_id) {
                    teacher.isMe = true;
                }
                // 성별을 보기 쉽게 변경 
                var genderReadable = this.watchTower
                    .getMyConst()
                    .getValue(
                // srcKey:string, 
                "teacher_gender_list", 
                // srcValue:string, 
                teacher.gender, 
                // targetKey:string
                "teacher_gender_kor_list");
                if (this.isDebug())
                    console.log("manage-teachers / updateTeacherList / genderReadable : ", genderReadable);
                teacher.gender_readable = genderReadable;
                teacherList.push(teacher);
            } // end for
            if (this.isDebug())
                console.log("manage-teachers / updateTeacherList / teacherList : ", teacherList);
            this.teacherList = teacherList;
        } // end if
    }; // end method
    // @ Desc : 저장된 변수 값들로 유저 리스트를 가져옵니다.
    ManageTeachersComponent.prototype.dofetchTeacherList = function () {
        if (null == this.pagination) {
            this.fetchTeacherList(
            // pageNum:number, 
            this.pageNum, 
            // pageRowCnt:number, 
            this.pageRowCnt, 
            // searchQuery:string, 
            this.searchQuery, 
            // teacherStatus:string, 
            this.teacherStatus);
        }
        else {
            this.fetchTeacherList(
            // pageNum:number, 
            this.pagination.pageNum, 
            // pageRowCnt:number, 
            this.pagination.pageRowCnt, 
            // searchQuery:string, 
            this.searchQuery, 
            // teacherStatus:string, 
            this.teacherStatus);
        }
    }; // end method
    // @ Desc : 유저 리스트를 가져옵니다.
    ManageTeachersComponent.prototype.fetchTeacherList = function (pageNum, pageRowCnt, searchQuery, teacherStatus) {
        var _this = this;
        this.adminService
            .fetchTeacherListV2(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // pageNum:number, 
        pageNum, 
        // pageRowCnt:number, 
        pageRowCnt, 
        // searchQuery:string, 
        searchQuery, 
        // teacherStatus:string, 
        teacherStatus)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-teachers / fetchTeacherList / myResponse : ", myResponse);
            if (myResponse.isSuccess() &&
                myResponse.hasDataProp("pagination") &&
                myResponse.hasDataProp("teacher_list")) {
                // 1. Pagination 재설정
                var jsonPagination = myResponse.getDataProp("pagination");
                if (_this.isDebug())
                    console.log("manage-teachers / fetchTeacherList / jsonPagination : ", jsonPagination);
                _this.updatePagination(jsonPagination);
                // 2. Teacher List 재설정 
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
    ManageTeachersComponent.prototype.updateteacherStatus = function (value, teacher) {
        var _this = this;
        if (this.isDebug())
            console.log("manage-teachers / updateteacherStatus / 시작");
        if (null == value || "" === value) {
            if (this.isDebug())
                console.log("manage-teachers / updateteacherStatus / 중단 / value is not valid!");
            return;
        }
        if (null == teacher) {
            if (this.isDebug())
                console.log("manage-teachers / updateteacherStatus / 중단 / teacher is not valid!");
            return;
        }
        if (this.isDebug())
            console.log("manage-teachers / updateteacherStatus / value : ", value);
        if (this.isDebug())
            console.log("manage-teachers / updateteacherStatus / teacher : ", teacher);
        this.adminService
            .updateTeacher(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userIdAdmin:number, 
        this.loginUser.id, 
        // teacherId:number, 
        teacher.id, 
        // teacherStatus:string, 
        value)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-teachers / updateteacherStatus / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                if (_this.isDebug())
                    console.log("manage-teachers / updateteacherStatus / success");
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-teachers / updateteacherStatus / failed");
                _this.watchTower.logAPIError("updateteacherStatus has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    };
    ManageTeachersComponent.prototype.onClickSearch = function (event) {
        if (this.isDebug())
            console.log("manage-teachers / onClickSearch / 시작");
        event.stopPropagation();
        event.preventDefault();
        this.fetchTeacherList(
        // pageNum:number,
        1, 
        // pageRowCnt:number,
        this.pagination.pageRowCnt, 
        // searchQuery:string,
        this.searchQuery, 
        // teacherStatus:string, 
        "");
    }; // end method
    ManageTeachersComponent.prototype.isDefaultStatus = function (status) {
        if (null == status || "" === status) {
            return false;
        }
        if (this.myArray.isNotOK(this.selectOptionListTeacherStatus)) {
            return false;
        } // end if
        var defaultOption = this.selectOptionListTeacherStatus[0];
        if (null == defaultOption) {
            return false;
        } // end if
        return (defaultOption.value === status) ? true : false;
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
                this.updateteacherStatus(myEvent.value, myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {
                this.pagination.pageNum = +myEvent.value;
                this.dofetchTeacherList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_SEARCH_QUERY)) {
                this.searchQuery = myEvent.value;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_TEACHER_STATUS_FOR_SEARCH)) {
                if (this.isDefaultStatus(myEvent.value)) {
                    this.teacherStatus = "";
                }
                else {
                    this.teacherStatus = myEvent.value;
                } // end if
                this.dofetchTeacherList();
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