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
var klass_1 = require('../klass/model/klass');
var default_meta_1 = require('../widget/input/default/model/default-meta');
var default_type_1 = require('../widget/input/default/model/default-type');
var pagination_1 = require('../widget/pagination/model/pagination');
var my_event_service_1 = require('../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_is_1 = require('../util/helper/my-is');
var my_array_1 = require('../util/helper/my-array');
var my_format_1 = require('../util/helper/my-format');
var ManageKlassesComponent = (function () {
    // 자신의 자식 객체에서 이벤트를 받는다.
    function ManageKlassesComponent(adminService, myEventService, watchTower, router) {
        this.adminService = adminService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.router = router;
        this.checkBoxList = [];
        this.searchQuery = "";
        this.klassStatus = "";
        this.klassLevel = "";
        this.klassSubwayLine = "";
        this.klassDays = "";
        this.klassTime = "";
        // @ Immutable
        this.pageNum = 1;
        // @ Immutable
        this.pageRange = 5;
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
        this.myFormat = new my_format_1.HelperMyFormat();
        this.defaultType = new default_type_1.DefaultType();
        this.defaultMetaSearchQuery = this.getMetaSearchInput();
        this.pagination = new pagination_1.Pagination();
        this.defaultMetaStatus = this.getMetaSelectKlassStatus();
        this.defaultMetaStatusForSearch = this.getMetaStatusForSearch();
        this.defaultMetaLevelForSearch = this.getMetaLevelForSearch();
        this.defaultMetaSubwayLineForSearch = this.getMetaSubwayLineForSearch();
        this.defaultMetaSubwayStationForSearch = this.getMetaSubwayStationForSearch();
        this.defaultMetaDaysForSearch = this.getMetaDaysForSearch();
        this.defaultMetaTimeForSearch = this.getMetaTimeForSearch();
        this.selectOptionListStatus = this.getDefaultOptionStatusForSearch();
        this.selectOptionListLevel = this.getDefaultOptionLevelForSearch();
        this.selectOptionListSubwayLine = this.getDefaultOptionSubwayLineForSearch();
        this.checkOptionTableDays = this.getDefaultOptionDaysForSearch();
        this.selectOptionListTime = this.getDefaultOptionTimeForSearch();
        this.subscribeLoginUser();
        this.subscribeEventPack();
    } // end constructor
    ManageKlassesComponent.prototype.ngOnInit = function () {
    };
    ManageKlassesComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    };
    ManageKlassesComponent.prototype.getMetaSelectKlassStatus = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "수업 상태", 
        // public placeholder:string
        "수업 상태를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_KLASS_STATUS, 
        // public checkerKey:string
        "klass_status", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageKlassesComponent.prototype.getMetaSearchInput = function () {
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
    ManageKlassesComponent.prototype.getMetaStatusForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 수업 상태", 
        // public placeholder:string
        "검색 조건 - 수업 상태를 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_KLASS_STATUS_FOR_SEARCH, 
        // public checkerKey:string
        "klass_status", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageKlassesComponent.prototype.getMetaLevelForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 수업 레벨", 
        // public placeholder:string
        "검색 조건 - 수업 레벨을 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_KLASS_LEVEL_FOR_SEARCH, 
        // public checkerKey:string
        "klass_level_for_search", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageKlassesComponent.prototype.getMetaSubwayLineForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 지하철 노선", 
        // public placeholder:string
        "검색 조건 - 지하철 노선을 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_KLASS_SUBWAY_LINE_FOR_SEARCH, 
        // public checkerKey:string
        "klass_subway_line", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageKlassesComponent.prototype.getMetaSubwayStationForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 지하철 역", 
        // public placeholder:string
        "검색 조건 - 지하철 역을 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_KLASS_SUBWAY_STATION_FOR_SEARCH, 
        // public checkerKey:string
        "klass_subway_station", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageKlassesComponent.prototype.getMetaDaysForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 요일", 
        // public placeholder:string
        "검색 조건 - 요일을 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_KLASS_DAYS_FOR_SEARCH, 
        // public checkerKey:string
        "klass_subway_station", 
        // public type:string
        this.defaultType.TYPE_CHECKBOX);
    };
    ManageKlassesComponent.prototype.getMetaTimeForSearch = function () {
        return new default_meta_1.DefaultMeta(// 5
        // public title:string
        "검색 조건 - 시간", 
        // public placeholder:string
        "검색 조건 - 시간을 선택해주세요", 
        // public eventKey:string
        this.myEventService.KEY_KLASS_TIME_FOR_SEARCH, 
        // public checkerKey:string
        "klass_subway_station", 
        // public type:string
        this.defaultType.TYPE_SELECT);
    };
    ManageKlassesComponent.prototype.subscribeLoginUser = function () {
        if (this.isDebug())
            console.log("manage-klasses / subscribeLoginUser / init");
        this.loginUser = this.watchTower.getLoginUser();
        if (null == this.loginUser || !this.loginUser.isAdminUser()) {
            this.goHome();
        } // end if
        this.init();
    }; // end method
    ManageKlassesComponent.prototype.goHome = function () {
        if (this.isDebug())
            console.log("manage-klasses / goHome / init");
        this.router.navigate(["/"]);
    };
    ManageKlassesComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("manage-klasses / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (this.isDebug())
            console.log("manage-klasses / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            this.init();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (_this.isDebug())
                    console.log("manage-klasses / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                _this.init();
            }); // end subscribe
        } // end if
    }; // end method
    ManageKlassesComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("manage-klasses / init / 시작");
        this.doFetchKlassList();
    }; // end method
    ManageKlassesComponent.prototype.getDefaultOptionKlassListStatus = function (klass) {
        if (this.isDebug())
            console.log("manage-klasses / getDefaultOptionKlassListStatus / 시작");
        var defaultOptionList = this.watchTower.getDefaultOptionListWithMetaByKeys(
        // keyListName:string,
        "class_status_kor_list", 
        // valueListName:string,
        "class_status_list", 
        // valueFocus:string,
        klass.status, 
        // metaObj:any
        klass);
        if (this.myArray.isOK(defaultOptionList)) {
            // "모든 상태" - 기본값 을 제거함.
            defaultOptionList.shift();
        }
        if (this.isDebug())
            console.log("manage-klasses / getDefaultOptionKlassListStatus / defaultOptionList : ", defaultOptionList);
        return defaultOptionList;
    }; // end method
    // @ Desc : 검색을 위한 유저 상태 default option list - select box 
    ManageKlassesComponent.prototype.getDefaultOptionStatusForSearch = function () {
        if (this.isDebug())
            console.log("manage-klasses / getDefaultOptionStatusForSearch / 시작");
        return this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "class_status_kor_list", 
        // valueListName:string,
        "class_status_list", 
        // valueFocus:string
        "");
    }; // end method
    ManageKlassesComponent.prototype.getDefaultOptionLevelForSearch = function () {
        if (this.isDebug())
            console.log("manage-klasses / getDefaultOptionLevelForSearch / 시작");
        return this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "class_level_kor_list", 
        // valueListName:string,
        "class_level_list", 
        // valueFocus:string
        "");
    }; // end method
    ManageKlassesComponent.prototype.getDefaultOptionSubwayLineForSearch = function () {
        if (this.isDebug())
            console.log("manage-klasses / getDefaultOptionSubwayLineForSearch / 시작");
        return this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "subway_line_kor_list", 
        // valueListName:string,
        "subway_line_list", 
        // valueFocus:string
        "");
    }; // end method
    ManageKlassesComponent.prototype.getDefaultOptionDaysForSearch = function () {
        if (this.isDebug())
            console.log("manage-klasses / getDefaultOptionDaysForSearch / 시작");
        var optionList = this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "class_days_kor_list", 
        // valueListName:string,
        "class_days_list", 
        // valueFocus:string
        "");
        if (this.myArray.isOK(optionList)) {
            optionList.shift();
        }
        // 기본 값은 모든 요일을 조회. 모두 선택되도록 변경.
        for (var i = 0; i < optionList.length; ++i) {
            var option = optionList[i];
            option.isFocus = true;
        }
        return [optionList];
    }; // end method
    ManageKlassesComponent.prototype.getDefaultOptionTimeForSearch = function () {
        if (this.isDebug())
            console.log("manage-klasses / getDefaultOptionDaysForSearch / 시작");
        return this.watchTower.getDefaultOptionListByKeys(
        // keyListName:string,
        "class_times_kor_list", 
        // valueListName:string,
        "class_times_list", 
        // valueFocus:string
        "");
    }; // end method
    ManageKlassesComponent.prototype.updatePagination = function (jsonPagination) {
        if (this.isDebug())
            console.log("manage-klasses / updatePagination / 시작");
        if (this.isDebug())
            console.log("manage-klasses / updatePagination / jsonPagination : ", jsonPagination);
        if (null == jsonPagination) {
            this.pagination = null;
        }
        else {
            this.pagination = new pagination_1.Pagination().setJSON(jsonPagination);
        }
    };
    ManageKlassesComponent.prototype.updateKlassList = function (jsonKlassList) {
        if (this.isDebug())
            console.log("manage-klasses / updateKlassList / 시작");
        if (this.myArray.isNotOK(jsonKlassList)) {
            // 검색 결과가 없습니다.
            this.klassList = null;
        }
        else {
            var klassList = [];
            for (var i = 0; i < jsonKlassList.length; ++i) {
                var klassJSON = jsonKlassList[i];
                var klass = new klass_1.Klass().setJSON(klassJSON);
                var defaultOptionListStatus = this.getDefaultOptionKlassListStatus(klass);
                klass["selectOptionListStatus"] = defaultOptionListStatus;
                klassList.push(klass);
            } // end for
            if (this.isDebug())
                console.log("manage-klasses / updateKlassList / klassList : ", klassList);
            this.klassList = klassList;
        } // end if
    }; // end method
    ManageKlassesComponent.prototype.updateKlassDays = function () {
        if (this.isDebug())
            console.log("manage-klasses / updateKlassDays / 시작");
        var checkboxList = [];
        if (null != this.checkboxKlassDays) {
            checkboxList = this.checkboxKlassDays.getCheckedDefaultOptionList();
        }
        var klassDays = "";
        if (this.myArray.isOK(checkboxList)) {
            for (var i = 0; i < checkboxList.length; ++i) {
                var checkbox = checkboxList[i];
                if (0 < i) {
                    klassDays += "|||" + checkbox.value; // REFACTOR ME
                }
                else {
                    klassDays = checkbox.value;
                } // end if
            } // end for
        }
        this.klassDays = klassDays;
        if (this.isDebug())
            console.log("manage-klasses / updateKlassDays / klassDays : ", klassDays);
    };
    // @ Desc : 저장된 변수 값들로 유저 리스트를 가져옵니다.
    ManageKlassesComponent.prototype.doFetchKlassList = function () {
        var pageNum = this.pageNum;
        var pageRange = this.pageRange;
        if (null != this.pagination) {
            pageNum = this.pagination.pageNum;
            pageRange = this.pagination.pageRange;
        }
        this.fetchKlassList(
        // pageNum:number, 
        pageNum, 
        // pageSize:number, 
        pageRange, 
        // searchQuery:string, 
        this.searchQuery, 
        // klassStatus:string, 
        this.klassStatus, 
        // klassLevel:string="",
        this.klassLevel, 
        // klassSubwayLine:string="",
        this.klassSubwayLine, 
        // klassDays:string="",
        this.klassDays, 
        // klassTime:string=""
        this.klassTime);
    }; // end method
    // @ Desc : 유저 리스트를 가져옵니다.
    ManageKlassesComponent.prototype.fetchKlassList = function (pageNum, pageSize, searchQuery, klassStatus, klassLevel, klassSubwayLine, klassDays, klassTime) {
        var _this = this;
        this.adminService
            .fetchKlassList(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // pageNum:number, 
        pageNum, 
        // pageSize:number, 
        pageSize, 
        // searchQuery:string, 
        searchQuery, 
        // klassStatus:string, 
        klassStatus, 
        // klassLevel:string="",
        klassLevel, 
        // klassSubwayLine:string="",
        klassSubwayLine, 
        // klassDays:string="",
        klassDays, 
        // klassTime:string=""
        klassTime)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-klasses / fetchKlassList / myResponse : ", myResponse);
            if (myResponse.isSuccess() &&
                myResponse.hasDataProp("pagination") &&
                myResponse.hasDataProp("klass_list")) {
                // 1. Pagination 재설정
                var jsonPagination = myResponse.getDataProp("pagination");
                if (_this.isDebug())
                    console.log("manage-klasses / fetchKlassList / jsonPagination : ", jsonPagination);
                _this.updatePagination(jsonPagination);
                // 2. Klass List 재설정 
                var klassJSONList = myResponse.getDataProp("klass_list");
                if (_this.isDebug())
                    console.log("manage-klasses / fetchKlassList / klassJSONList : ", klassJSONList);
                _this.updateKlassList(klassJSONList);
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-klasses / fetchKlassList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");
                _this.watchTower.logAPIError("fetchKlassList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    }; // end method
    ManageKlassesComponent.prototype.updateCheckBoxes = function (checked) {
        if (this.isDebug())
            console.log("manage-klasses / updateCheckBoxes / 시작");
        if (this.isDebug())
            console.log("manage-klasses / updateCheckBoxes / this.checkBoxList : ", this.checkBoxList);
        if (this.isDebug())
            console.log("manage-klasses / updateCheckBoxes / checked : ", checked);
        for (var i = 0; i < this.checkBoxList.length; ++i) {
            var checkBox = this.checkBoxList[i];
            checkBox.setIsChecked(checked);
        } // end for
    }; // end method
    ManageKlassesComponent.prototype.updateKlassStatus = function (value, klass) {
        var _this = this;
        if (this.isDebug())
            console.log("manage-klasses / updateKlassStatus / 시작");
        if (null == value || "" === value) {
            if (this.isDebug())
                console.log("manage-klasses / updateKlassStatus / 중단 / value is not valid!");
            return;
        }
        if (null == klass) {
            if (this.isDebug())
                console.log("manage-klasses / updateKlassStatus / 중단 / klass is not valid!");
            return;
        }
        if (this.isDebug())
            console.log("manage-klasses / updateKlassStatus / value : ", value);
        if (this.isDebug())
            console.log("manage-klasses / updateKlassStatus / klass : ", klass);
        this.adminService
            .updateKlass(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userIdAdmin:number, 
        this.loginUser.id, 
        // klassId:number, 
        klass.id, 
        // klassStatus:string, 
        value)
            .then(function (myResponse) {
            if (_this.isDebug())
                console.log("manage-klasses / updateKlassStatus / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                if (_this.isDebug())
                    console.log("manage-klasses / updateKlassStatus / success");
            }
            else if (myResponse.isFailed()) {
                if (_this.isDebug())
                    console.log("manage-klasses / updateKlassStatus / failed");
                _this.watchTower.logAPIError("updateKlassStatus has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service
    };
    ManageKlassesComponent.prototype.onClickSearch = function (event) {
        if (this.isDebug())
            console.log("manage-klasses / onClickSearch / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (null != this.pagination) {
            this.pagination.pageNum = 1;
        }
        this.doFetchKlassList();
    }; // end method
    ManageKlassesComponent.prototype.isDefaultStatus = function (value) {
        if (null == value || "" === value) {
            return false;
        }
        if (this.myArray.isNotOK(this.selectOptionListStatus)) {
            return false;
        } // end if
        var defaultOption = this.selectOptionListStatus[0];
        if (null == defaultOption) {
            return false;
        } // end if
        return (defaultOption.value === value) ? true : false;
    };
    ManageKlassesComponent.prototype.isDefaultLevel = function (value) {
        if (null == value || "" === value) {
            return false;
        }
        if (this.myArray.isNotOK(this.selectOptionListLevel)) {
            return false;
        } // end if
        var defaultOption = this.selectOptionListLevel[0];
        if (null == defaultOption) {
            return false;
        } // end if
        return (defaultOption.value === value) ? true : false;
    };
    ManageKlassesComponent.prototype.isDefaultSubwayLine = function (value) {
        if (null == value || "" === value) {
            return false;
        }
        if (this.myArray.isNotOK(this.selectOptionListSubwayLine)) {
            return false;
        } // end if
        var defaultOption = this.selectOptionListSubwayLine[0];
        if (null == defaultOption) {
            return false;
        } // end if
        return (defaultOption.value === value) ? true : false;
    };
    // REMOVE ME
    /*
      isDefaultDay(value:string):boolean {
    
        if(null == value || "" === value) {
          return false;
        }
    
        if(this.myArray.isNotOK(this.selectOptionListDay)) {
          return false;
        } // end if
    
        let defaultOption:DefaultOption = this.selectOptionListDay[0];
        if(null == defaultOption) {
          return false;
        } // end if
    
        return (defaultOption.value === value)?true:false;
      }
      */
    ManageKlassesComponent.prototype.isDefaultTime = function (time) {
        if (null == time || "" === time) {
            return false;
        }
        if (this.myArray.isNotOK(this.selectOptionListTime)) {
            return false;
        } // end if
        var defaultOption = this.selectOptionListTime[0];
        if (null == defaultOption) {
            return false;
        } // end if
        return (defaultOption.value === status) ? true : false;
    };
    ManageKlassesComponent.prototype.onChangedFromChild = function (myEvent) {
        if (this.isDebug())
            console.log("manage-klasses / onChangedFromChild / myEvent : ", myEvent);
        if (null == myEvent) {
            if (this.isDebug())
                console.log("manage-klasses / onChangedFromChild / 중단 / null == myEvent");
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
            }
            else if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX)) {
                this.checkBoxList.push(myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS_FOR_SEARCH)) {
                this.checkboxKlassDays = myEvent.metaObj;
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {
                var isChecked = ("true" == "" + myEvent.value) ? true : false;
                this.updateCheckBoxes(isChecked);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_STATUS)) {
                this.updateKlassStatus(myEvent.value, myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {
                this.pagination.pageNum = +myEvent.value;
                this.doFetchKlassList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_SEARCH_QUERY)) {
                this.searchQuery = myEvent.value;
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_STATUS_FOR_SEARCH)) {
                if (this.isDefaultStatus(myEvent.value)) {
                    this.klassStatus = "";
                }
                else {
                    this.klassStatus = myEvent.value;
                } // end if
                this.doFetchKlassList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_LEVEL_FOR_SEARCH)) {
                if (this.isDefaultLevel(myEvent.value)) {
                    this.klassLevel = "";
                }
                else {
                    this.klassLevel = myEvent.value;
                } // end if
                this.doFetchKlassList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_SUBWAY_LINE_FOR_SEARCH)) {
                if (this.isDefaultSubwayLine(myEvent.value)) {
                    this.klassSubwayLine = "";
                }
                else {
                    this.klassSubwayLine = myEvent.value;
                } // end if
                this.doFetchKlassList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS_FOR_SEARCH)) {
                /*
                if(this.isDefaultDay(myEvent.value)) {
                  this.klassDays = "";
                } else {
                  this.klassDays = myEvent.value;
                } // end if
                */
                this.updateKlassDays();
                this.doFetchKlassList();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_FOR_SEARCH)) {
                if (this.isDefaultTime(myEvent.value)) {
                    this.klassTime = "";
                }
                else {
                    this.klassTime = myEvent.value;
                } // end if
                this.doFetchKlassList();
            } // end if
        } // end if
    }; // end method
    ManageKlassesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'manage-klasses',
            templateUrl: 'manage-klasses.component.html',
            styleUrls: ['manage-klasses.component.css']
        }), 
        __metadata('design:paramtypes', [admin_service_1.AdminService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, router_1.Router])
    ], ManageKlassesComponent);
    return ManageKlassesComponent;
}());
exports.ManageKlassesComponent = ManageKlassesComponent; // end class
//# sourceMappingURL=manage-klasses.component.js.map