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
var default_meta_1 = require('../widget/input/default/model/default-meta');
var default_type_1 = require('../widget/input/default/model/default-type');
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
        this.searchQuery = "";
        this.userStatus = "";
        this.userPermission = "";
        this.pageNum = 1;
        this.pageRange = 5;
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.defaultType = new default_type_1.DefaultType();
        this.defaultMetaUserStatus = this.getMetaSelectUserStatus();
        this.defaultMetaUserStatusForSearch = this.getMetaSelectUserStatusForSearch();
        this.defaultMetaUserPermission = this.getMetaSelectUserPermission();
        this.defaultMetaUserPermissionForSearch = this.getMetaSelectUserPermissionForSearch();
        this.defaultMetaSearchQuery = this.getMetaSearchInput();
        this.pagination = new pagination_1.Pagination();
        this.selectOptionListUserStatus = this.getDefaultOptionUserListStatusForSearch();
        this.selectOptionListUserPermission = this.getDefaultOptionUserListPermissionForSearch();
        this.subscribeLoginUser();
        this.subscribeEventPack();
    } // end constructor
    ManageUsersComponent.prototype.ngOnInit = function () {
    };
    ManageUsersComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    ManageUsersComponent.prototype.getMetaSelectUserStatus = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "사용자 상태", 
        // public placeholder:string
        "사용자 상태를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_USER_STATUS, 
        // public checkerKey:string
        "user_status", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageUsersComponent.prototype.getMetaSelectUserStatusForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 사용자 상태", 
        // public placeholder:string
        "검색 조건 - 사용자 상태를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_USER_STATUS_FOR_SEARCH, 
        // public checkerKey:string
        "user_status", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageUsersComponent.prototype.getMetaSelectUserPermission = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "사용자 권한", 
        // public placeholder:string
        "사용자 권한를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_USER_PERMISSION, 
        // public checkerKey:string
        "user_permission", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageUsersComponent.prototype.getMetaSelectUserPermissionForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 사용자 권한", 
        // public placeholder:string
        "검색 조건 - 사용자 권한를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_USER_PERMISSION_FOR_SEARCH, 
        // public checkerKey:string
        "user_permission", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageUsersComponent.prototype.getMetaSearchInput = function () {
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
        this.fetchUserList(
        // pageNum:number, 
        this.pageNum, 
        // pageSize:number, 
        this.pageRange, 
        // searchQuery:string, 
        this.searchQuery, 
        // userStatus:string, 
        this.userStatus, 
        // userPermission:string      
        this.userPermission);
    }; // end method
    ManageUsersComponent.prototype.getDefaultOptionUserListStatus = function (user) {
        if (this.isDebug())
            console.log("manage-users / getDefaultOptionUserListStatus / 시작");
        var defaultOptionList = this.watchTower.getDefaultOptionListWithMetaByKeys(
        // keyListName:string,
        "user_status_kor_list", 
        // valueListName:string,
        "user_status_list", 
        // valueFocus:string,
        user.status, 
        // metaObj:any
        user);
        if (this.myArray.isOK(defaultOptionList)) {
            // "모든 상태" - 기본값 을 제거함.
            defaultOptionList.shift();
        }
        if (this.isDebug())
            console.log("manage-users / getDefaultOptionUserListStatus / defaultOptionList : ", defaultOptionList);
        return defaultOptionList;
    }; // end method
    // @ Desc : 검색을 위한 유저 상태 default option list - select box 
    ManageUsersComponent.prototype.getDefaultOptionUserListStatusForSearch = function () {
        if (this.isDebug())
            console.log("manage-users / getDefaultOptionUserListStatusForSearch / 시작");
        return this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "user_status_kor_list", 
        // valueListName:string,
        "user_status_list", 
        // valueFocus:string
        "");
    }; // end method
    // @ Desc : 검색을 위한 유저 권한 default option list - select box 
    ManageUsersComponent.prototype.getDefaultOptionUserListPermissionForSearch = function () {
        if (this.isDebug())
            console.log("manage-users / getDefaultOptionUserListPermissionForSearch / 시작");
        return this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "user_permission_kor_list", 
        // valueListName:string,
        "user_permission_list", 
        // valueFocus:string
        "");
    }; // end method
    ManageUsersComponent.prototype.getDefaultOptionUserListPermission = function (user) {
        if (this.isDebug())
            console.log("manage-users / getDefaultOptionUserListPermission / 시작");
        if (null == user) {
            if (this.isDebug())
                console.log("manage-users / getDefaultOptionUserListPermission / 중단 / null == user");
            return;
        }
        var defaultOptionList = this.watchTower.getDefaultOptionListWithMetaByKeys(
        // keyListName:string,
        "user_permission_kor_list", 
        // valueListName:string,
        "user_permission_list", 
        // valueFocus:string,
        user.permission, 
        // metaObj:any
        user);
        if (this.myArray.isOK(defaultOptionList)) {
            // "모든 권한" - 기본값 을 제거함.
            defaultOptionList.shift();
        } // end if
        if (this.isDebug())
            console.log("manage-users / getDefaultOptionUserListPermission / defaultOptionList : ", defaultOptionList);
        return defaultOptionList;
    }; // end method    
    ManageUsersComponent.prototype.updatePagination = function (jsonPagination) {
        if (this.isDebug())
            console.log("manage-users / updatePagination / 시작");
        if (this.isDebug())
            console.log("manage-users / updatePagination / jsonPagination : ", jsonPagination);
        if (null == jsonPagination) {
            this.pagination = null;
        }
        else {
            this.pagination = new pagination_1.Pagination().setJSON(jsonPagination);
        }
    };
    ManageUsersComponent.prototype.updateUserList = function (jsonUserList) {
        if (this.isDebug())
            console.log("manage-users / updateUserList / 시작");
        if (this.myArray.isNotOK(jsonUserList)) {
            // 검색 결과가 없습니다.
            this.userList = null;
        }
        else {
            var userList = [];
            for (var i = 0; i < jsonUserList.length; ++i) {
                var userJSON = jsonUserList[i];
                var user = new user_1.User().setJSON(userJSON);
                var defaultOptionListStatus = this.getDefaultOptionUserListStatus(user);
                user["selectOptionListStatus"] = defaultOptionListStatus;
                var defaultOptionListPermission = this.getDefaultOptionUserListPermission(user);
                user["selectOptionListPermission"] = defaultOptionListPermission;
                // 자신의 데이터인지 확인한다.
                if (this.loginUser.id === user.id) {
                    user.isMe = true;
                }
                // 성별을 보기 쉽게 변경 
                var genderReadable = this.watchTower
                    .getMyConst()
                    .getValue(
                // srcKey:string, 
                "user_gender_list", 
                // srcValue:string, 
                user.gender, 
                // targetKey:string
                "user_gender_kor_list");
                if (this.isDebug())
                    console.log("manage-users / updateUserList / genderReadable : ", genderReadable);
                user.gender_readable = genderReadable;
                userList.push(user);
            } // end for
            if (this.isDebug())
                console.log("manage-users / updateUserList / userList : ", userList);
            this.userList = userList;
        } // end if
    }; // end method
    // @ Desc : 저장된 변수 값들로 유저 리스트를 가져옵니다.
    ManageUsersComponent.prototype.doFetchUserList = function () {
        if (null == this.pagination) {
            this.fetchUserList(
            // pageNum:number, 
            this.pageNum, 
            // pageSize:number, 
            this.pageRange, 
            // searchQuery:string, 
            this.searchQuery, 
            // userStatus:string, 
            this.userStatus, 
            // userPermission:string      
            this.userPermission);
        }
        else {
            this.fetchUserList(
            // pageNum:number, 
            this.pagination.pageNum, 
            // pageSize:number, 
            this.pagination.pageRange, 
            // searchQuery:string, 
            this.searchQuery, 
            // userStatus:string, 
            this.userStatus, 
            // userPermission:string      
            this.userPermission);
        }
    }; // end method
    // @ Desc : 유저 리스트를 가져옵니다.
    ManageUsersComponent.prototype.fetchUserList = function (pageNum, pageSize, searchQuery, userStatus, userPermission) {
        var _this = this;
        this.adminService
            .fetchUserListV2(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // pageNum:number, 
        pageNum, 
        // pageSize:number, 
        pageSize, 
        // searchQuery:string, 
        searchQuery, 
        // userStatus:string, 
        userStatus, 
        // userPermission:string
        userPermission)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-users / fetchUserList / myResponse : ", myResponse);
            if (myResponse.isSuccess() &&
                myResponse.hasDataProp("pagination") &&
                myResponse.hasDataProp("user_list")) {
                // 1. Pagination 재설정
                var jsonPagination = myResponse.getDataProp("pagination");
                if (_this.isDebug())
                    console.log("manage-users / fetchUserList / jsonPagination : ", jsonPagination);
                _this.updatePagination(jsonPagination);
                // 2. User List 재설정 
                var userJSONList = myResponse.getDataProp("user_list");
                if (_this.isDebug())
                    console.log("manage-users / fetchUserList / userJSONList : ", userJSONList);
                _this.updateUserList(userJSONList);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-users / fetchUserList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");
                _this.watchTower.logAPIError("fetchUserList has been failed!");
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
    ManageUsersComponent.prototype.updateUserStatus = function (value, user) {
        var _this = this;
        if (this.isDebug())
            console.log("manage-users / updateUserStatus / 시작");
        if (null == value || "" === value) {
            if (this.isDebug())
                console.log("manage-users / updateUserStatus / 중단 / value is not valid!");
            return;
        }
        if (null == user) {
            if (this.isDebug())
                console.log("manage-users / updateUserStatus / 중단 / user is not valid!");
            return;
        }
        if (this.isDebug())
            console.log("manage-users / updateUserStatus / value : ", value);
        if (this.isDebug())
            console.log("manage-users / updateUserStatus / user : ", user);
        this.adminService
            .updateUser(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userIdAdmin:number, 
        this.loginUser.id, 
        // userId:number, 
        user.id, 
        // userStatus:string, 
        value, 
        // userPermission:string      
        user.permission)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-users / updateUserStatus / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                if (_this.isDebug())
                    console.log("manage-users / updateUserStatus / success");
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-users / updateUserStatus / failed");
                _this.watchTower.logAPIError("updateUserStatus has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    };
    ManageUsersComponent.prototype.updateUserPermission = function (value, user) {
        var _this = this;
        if (this.isDebug())
            console.log("manage-users / updateUserPermission / 시작");
        if (null == value || "" === value) {
            if (this.isDebug())
                console.log("manage-users / updateUserPermission / 중단 / value is not valid!");
            return;
        }
        if (null == user) {
            if (this.isDebug())
                console.log("manage-users / updateUserPermission / 중단 / user is not valid!");
            return;
        }
        if (this.isDebug())
            console.log("manage-users / updateUserPermission / value : ", value);
        if (this.isDebug())
            console.log("manage-users / updateUserPermission / user : ", user);
        this.adminService
            .updateUser(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userIdAdmin:number, 
        this.loginUser.id, 
        // userId:number, 
        user.id, 
        // userStatus:string, 
        user.status, 
        // userPermission:string      
        value)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-users / updateUserPermission / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                if (_this.isDebug())
                    console.log("manage-users / updateUserPermission / success");
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-users / updateUserPermission / failed");
                _this.watchTower.logAPIError("updateUserPermission has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    ManageUsersComponent.prototype.onClickSearch = function (event) {
        if (this.isDebug())
            console.log("manage-users / onClickSearch / 시작");
        event.stopPropagation();
        event.preventDefault();
        // 새로운 검색어라면 첫 검색 결과 페이지 노출
        // pagination 내의 이동이라면, 검색어와 pageNum, pageRange를 모두 사용한다.
        // this.searchUser(this.searchQuery, 1, this.pagination.pageRange);
        this.fetchUserList(
        // pageNum:number,
        1, 
        // pageSize:number,
        this.pagination.pageRange, 
        // searchQuery:string,
        this.searchQuery, 
        // userStatus:string, 
        "", 
        // userPermission:string
        this.userPermission);
    }; // end method
    ManageUsersComponent.prototype.isDefaultStatus = function (status) {
        if (null == status || "" === status) {
            return false;
        }
        if (this.myArray.isNotOK(this.selectOptionListUserStatus)) {
            return false;
        } // end if
        var defaultOption = this.selectOptionListUserStatus[0];
        if (null == defaultOption) {
            return false;
        } // end if
        return (defaultOption.value === status) ? true : false;
    };
    ManageUsersComponent.prototype.isDefaultPermission = function (permission) {
        if (null == permission || "" === permission) {
            return false;
        }
        if (this.myArray.isNotOK(this.selectOptionListUserPermission)) {
            return false;
        } // end if
        var defaultOption = this.selectOptionListUserPermission[0];
        if (null == defaultOption) {
            return false;
        } // end if
        return (defaultOption.value === permission) ? true : false;
    };
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
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
                var isChecked = ("true" == "" + myEvent.value) ? true : false;
                this.updateCheckBoxes(isChecked);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_STATUS)) {
                this.updateUserStatus(myEvent.value, myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_PERMISSION)) {
                this.updateUserPermission(myEvent.value, myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {
                this.pagination.pageNum = +myEvent.value;
                this.doFetchUserList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_SEARCH_QUERY)) {
                this.searchQuery = myEvent.value;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_STATUS_FOR_SEARCH)) {
                if (this.isDefaultStatus(myEvent.value)) {
                    this.userStatus = "";
                }
                else {
                    this.userStatus = myEvent.value;
                } // end if
                this.doFetchUserList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_USER_PERMISSION_FOR_SEARCH)) {
                if (this.isDefaultPermission(myEvent.value)) {
                    this.userPermission = "";
                }
                else {
                    this.userPermission = myEvent.value;
                } // end if
                this.doFetchUserList();
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