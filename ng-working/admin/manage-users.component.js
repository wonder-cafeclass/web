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
var user_1 = require('../users/model/user');
var pagination_1 = require('../widget/pagination/model/pagination');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_is_1 = require('../util/helper/my-is');
var my_array_1 = require('../util/helper/my-array');
var my_format_1 = require('../util/helper/my-format');
var ManageUsersComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function ManageUsersComponent(adminService, myEventService, watchTower, router) {
        this.adminService = adminService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.checkBoxList = [];
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.pagination = new pagination_1.Pagination();
        this.subscribeLoginUser();
        this.subscribeEventPack();
    }
    ManageUsersComponent.prototype.ngOnInit = function () {
    };
    ManageUsersComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    ManageUsersComponent.prototype.subscribeLoginUser = function () {
        if (this.isDebug())
            console.log("manage-users / subscribeLoginUser / init");
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser || !this.loginUser.isAdminUser()) {
            this.goHome();
        } // end if
        this.init();
    }; // end method
    ManageUsersComponent.prototype.goHome = function () {
        if (this.isDebug())
            console.log("manage-users / goHome / init");
        this.router.navigate(["/"]);
    };
    ManageUsersComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("manage-users / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("manage-users / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            this.init();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("manage-users / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                _this.init();
            }); // end subscribe
        } // end if
    }; // end method
    ManageUsersComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("manage-users / init / 시작");
        // 1. 운영자 유저의 pagination을 가져옵니다.
        this.fetchUsersAdminPagination();
        // 2. 선생님 유저의 pagination을 가져옵니다.
        // 3. 학생 유저의 pagination을 가져옵니다.
    };
    // @ Desc : 운영자 유저리스트의 페이지 네이션을 가져옵니다.
    ManageUsersComponent.prototype.fetchUsersAdminPagination = function () {
        var _this = this;
        if (this.isDebug())
            console.log("manage-users / fetchUsersAdminPagination / 시작");
        this.adminService
            .fetchUsersAdminPagination(this.watchTower.getApiKey())
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-users / fetchUsersAdminPagination / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("pagination")) {
                if (_this.isDebug())
                    console.log("manage-users / fetchUsersAdminPagination / success");
                // 1. 페이지네이션 데이터를 저장합니다. 가져온 데이터로 페이지네이션을 표시.
                var json = myResponse.getDataProp("pagination");
                _this.pagination.setJSON(json);
                // 2. 유저 리스트를 가져옵니다. 
                _this.fetchUserAdminList(_this.pagination["PAGE_NUM"], _this.pagination["PAGE_RANGE"]);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-users / fetchUsersAdminPagination / failed");
                _this.watchTower.logAPIError("fetchUsersAdminPagination has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service    
    };
    // @ Desc : 운영자 유저 리스트를 가져옵니다.
    ManageUsersComponent.prototype.fetchUserAdminList = function (pageNum, pageSize) {
        // 유저 리스트는 아래 카테고리별로 나누어 가져옵니다.
        // a. 운영자
        // b. 선생님
        // c. 학생
        var _this = this;
        this.adminService
            .fetchUsersAdmin(this.watchTower.getApiKey(), pageNum, pageSize)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-users / fetchUserAdminList / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("admin_user_list")) {
                var userJSONList = myResponse.getDataProp("admin_user_list");
                if (_this.isDebug())
                    console.log("manage-users / fetchUserAdminList / userJSONList : ", userJSONList);
                var userList = [];
                for (var i = 0; i < userJSONList.length; ++i) {
                    var userJSON = userJSONList[i];
                    var user = new user_1.User().setJSON(userJSON);
                    userList.push(user);
                } // end for
                if (_this.isDebug())
                    console.log("manage-users / fetchUserAdminList / userList : ", userList);
                _this.userList = userList;
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-users / fetchUserAdminList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");
                _this.watchTower.logAPIError("fetchUserAdminList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    ManageUsersComponent.prototype.updateCheckBoxes = function (checked) {
        if (this.isDebug())
            console.log("manage-users / updateCheckBoxes / 시작");
        if (this.isDebug())
            console.log("manage-users / updateCheckBoxes / this.checkBoxList : ", this.checkBoxList);
        if (this.isDebug())
            console.log("manage-users / updateCheckBoxes / checked : ", checked);
        for (var i = 0; i < this.checkBoxList.length; ++i) {
            var checkBox = this.checkBoxList[i];
            checkBox.setIsChecked(checked);
        } // end for
    }; // end method
    ManageUsersComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("manage-users / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (this.isDebug())
                console.log("manage-users / onChangedFromChild / 중단 / null == myEvent");
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
            }
            else if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX)) {
                this.checkBoxList.push(myEvent.metaObj);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
                var isChecked = ("true" === myEvent.value) ? true : false;
                this.updateCheckBoxes(isChecked);
            } // end if
        } // end if
    }; // end method
    ManageUsersComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'manage-users',
            templateUrl: 'manage-users.component.html',
            styleUrls: ['manage-users.component.css']
        }), 
        __metadata('design:paramtypes', [admin_service_1.AdminService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], ManageUsersComponent);
    return ManageUsersComponent;
}());
exports.ManageUsersComponent = ManageUsersComponent; // end class
//# sourceMappingURL=manage-users.component.js.map