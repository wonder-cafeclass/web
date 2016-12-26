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
var klass_1 = require('./model/klass');
var auth_service_1 = require('../auth.service');
var klass_radiobtn_service_1 = require('./service/klass-radiobtn.service');
var klass_checkbox_service_1 = require('./service/klass-checkbox.service');
var klass_service_1 = require('./service/klass.service');
var dialog_service_1 = require('../widget/dialog.service');
var image_grid_v2_component_1 = require('../widget/image-grid/image-grid-v2.component');
var image_grid_component_1 = require('../widget/image-grid/image-grid.component');
var hidden_uploader_component_1 = require('../widget/input/img-uploader/hidden-uploader.component');
var default_component_1 = require('../widget/input/default/default.component');
var default_option_1 = require('../widget/input/default/model/default-option');
var default_service_1 = require('../widget/input/default/service/default.service');
var pricetag_h_component_1 = require('../widget/pricetag/pricetag-h.component');
var clock_board_component_1 = require('../widget/clock/clock-board.component');
var butterfly_component_1 = require('../widget/butterfly/butterfly.component');
var klass_detail_nav_list_component_1 = require('./klass-detail-nav-list.component');
// import { KlassFilterTileComponent }      from './klass-filter-tile.component';
var image_service_1 = require('../util/image.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_time_1 = require('../util/helper/my-time');
var my_array_1 = require('../util/helper/my-array');
var my_is_1 = require('../util/helper/my-is');
var teacher_service_1 = require('../teachers/service/teacher.service');
var KlassDetailComponent = (function () {
    function KlassDetailComponent(route, router, klassService, imageService, dialogService, authService, myLoggerService, myEventService, watchTower, radiobtnService, checkboxService, teacherService, defaultService, myCheckerService) {
        this.route = route;
        this.router = router;
        this.klassService = klassService;
        this.imageService = imageService;
        this.dialogService = dialogService;
        this.authService = authService;
        this.myLoggerService = myLoggerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        this.radiobtnService = radiobtnService;
        this.checkboxService = checkboxService;
        this.teacherService = teacherService;
        this.defaultService = defaultService;
        this.myCheckerService = myCheckerService;
        this.priceTagCurrency = "₩";
        this.priceTagColor = "#e85c41";
        this.priceTagWidth = 105;
        this.priceTagCageWidth = 105;
        this.pricePerWeekFormat = "4주";
        this.selectileImageHeight = 60;
        this.selectileImageWidth = 60;
        this.selectileCageWidth = 60;
        this.miniCalHeight = 60;
        this.miniCalWidth = 60;
        this.miniCalCageWidth = 60;
        // Image Uploader
        this.imgUploaderUploadAPIUrl = "";
        this.imgUploaderImagePath = "";
        this.imgUploaderImageUrl = "";
        this.imgUploaderEventKey = "";
        this.imgUploaderImagePathKlassPoster = "";
        this.imgUploaderImageUrlKlassPoster = "";
        this.imgUploaderEventKeyKlassPoster = "";
        this.isAdmin = false;
        this.isTeacher = false;
        // 운영자가 보게되는 배너 이미지 템플릿 리스트
        this.imageTableBannerList = [
            ["assets/images/class/banner/drinks_x.png"],
            ["assets/images/class/banner/drinks_o.png"],
            ["assets/images/class/banner/help.png"]
        ];
        // 사용자가 보게되는 배너 이미지 리스트
        this.imageTableBannerListService = [];
        this.klassTimeMinutesMin = 60;
        this.klassTimeMinutesMax = 180;
        this.isSaveBtnDisabled = true;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / constructor / init");
        this.defaultMetaList = this.myEventService.getDefaultMetaListKlassDetail();
        if (isDebug)
            console.log("klass-detail / ngOnInit / this.defaultMetaList : ", this.defaultMetaList);
        this.myTime = new my_time_1.HelperMyTime();
        this.myArray = new my_array_1.HelperMyArray();
        this.myIs = new my_is_1.HelperMyIs();
    }
    KlassDetailComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / ngOnInit / 시작");
    }; // end method
    KlassDetailComponent.prototype.ngAfterViewInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / ngAfterViewInit / 시작");
        if (isDebug)
            console.log("klass-detail / ngAfterViewInit / this.bannerComponent : ", this.bannerComponent);
        this.watchTower.announceIsLockedBottomFooterFlexible(false);
        this.init();
    };
    KlassDetailComponent.prototype.ngAfterViewChecked = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / ngAfterViewChecked / 시작");
    };
    KlassDetailComponent.prototype.ngOnChanges = function (changes) {
        // changes.prop contains the old and the new value...
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / ngOnChanges / 시작");
        if (isDebug)
            console.log("klass-detail / ngOnChanges / changes : ", changes);
    };
    KlassDetailComponent.prototype.subscribeLoginTeacher = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / subscribeLoginTeacher / 시작");
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        // Subscribe login user
        this.watchTower.loginTeacherAnnounced$.subscribe(function (loginTeacher) {
            if (isDebug)
                console.log("klass-detail / subscribeLoginTeacher / loginTeacher : ", loginTeacher);
            // 로그인한 선생님 정보가 들어왔습니다.
            _this.loginTeacher = _this.teacherService.getTeacherFromJSON(loginTeacher);
            _this.loginUser = _this.watchTower.getLoginUser();
            if (null != _this.loginUser) {
                _this.isAdmin = _this.loginUser.getIsAdmin();
                _this.isTeacher = _this.loginUser.isTeacher();
            } // end if
        }); // end subscribe
    };
    KlassDetailComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / init / 시작");
        this.setUserInfo();
        this.setKlassBannerImageUploader();
        this.setKlassPosterImageUploader();
        this.setDefaultComponents();
        this.getParams();
    };
    KlassDetailComponent.prototype.setUserInfo = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setUserInfo / 시작");
        // 1. 로그인 정보를 가져온다
        this.loginUser = this.watchTower.getLoginUser();
        if (null != this.loginUser) {
            // 1-1. 이미 등록되어 있는 로그인 정보가 있는 경우.
            this.isAdmin = this.loginUser.getIsAdmin();
            this.isTeacher = this.loginUser.isTeacher();
        }
        this.loginTeacher = this.watchTower.getLoginTeacher();
        if (null == this.loginTeacher) {
            // 1-2. 선생님 로그인 정보가 없다!
            // 2. 선생님 로그인 정보가 업데이트 되는 것을 비동기로 기다린다.
            this.subscribeLoginTeacher();
        }
        if (isDebug)
            console.log("klass-detail / setUserInfo / loginUser : ", this.loginUser);
        if (isDebug)
            console.log("klass-detail / setUserInfo / this.isAdmin : ", this.isAdmin);
        if (isDebug)
            console.log("klass-detail / setUserInfo / loginTeacher : ", this.loginTeacher);
        if (isDebug)
            console.log("klass-detail / setUserInfo / bannerComponent : ", this.bannerComponent);
    };
    KlassDetailComponent.prototype.setDefaultComponents = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setDefaultComponents / 시작");
        // DefaultComponent들을 세팅
        var target = this.getInput(this.myEventService.KEY_KLASS_TITLE);
        if (null != target) {
            this.klassTitleComponent = target;
        } // end if
        target = this.getInput(this.myEventService.KEY_KLASS_PRICE);
        if (null != target) {
            this.klassPriceComponent = target;
        } // end if
        target = this.getInput(this.myEventService.KEY_KLASS_TIME_BEGIN);
        if (null != target) {
            this.klassTimeBeginComponent = target;
        } // end if
        target = this.getInput(this.myEventService.KEY_KLASS_TIME_END);
        if (null != target) {
            this.klassTimeEndComponent = target;
        } // end if
    };
    // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
    KlassDetailComponent.prototype.getInput = function (eventKey) {
        return this.defaultService.getInput(this.inputComponentList, eventKey);
    };
    KlassDetailComponent.prototype.getParams = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / getParams / 시작");
        this.route.params
            .switchMap(function (params) {
            var klassId = +params['id'];
            if (klassId === -100 && null == _this.loginTeacher) {
                // 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.
                if (isDebug)
                    console.log("klass-detail / getParams / 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.");
                _this.router.navigate(["/"]);
                return;
            }
            else if (klassId === -100) {
                // 1-2. 선생님만이, 빈 수업 화면을 볼수 있습니다.
                if (isDebug)
                    console.log("klass-detail / getParams / 1-2. 선생님입니다. 새로운 수업을 하나 만듭니다.");
                return _this.klassService.addKlassEmpty(
                // apiKey:string, 
                _this.watchTower.getApiKey(), 
                // userId:number,
                +_this.loginUser.id, 
                // teacherId:number,
                +_this.loginTeacher.id, 
                // teacherResume:string,
                _this.loginTeacher.resume, 
                // teacherGreeting:string
                _this.loginTeacher.greeting);
            } // end if
            // 기존 수업 가져오기
            if (isDebug)
                console.log("klass-detail / getParams / 기존 수업 가져오기 / klassId : ", klassId);
            return _this.klassService.getKlass(klassId);
        })
            .subscribe(function (myResponse) {
            if (isDebug)
                console.log("klass-detail / getParams / subscribe / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                var klassJSON = myResponse.getDataProp("klass");
                if (isDebug)
                    console.log("klass-detail / getParams / subscribe / klassJSON : ", klassJSON);
                if (null != klassJSON) {
                    _this.klass = new klass_1.Klass().setJSON(klassJSON);
                    _this.onAfterReceivingKlass();
                } // end if
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail / getParams / Failed!");
            } // end if
            if (isDebug)
                console.log("klass-detail / getParams / subscribe / this.klass : ", _this.klass);
        }); // end route    
    };
    KlassDetailComponent.prototype.setKlassWeeks = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setKlassWeeks / 시작");
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassWeeks / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassWeeksComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassWeeks / 중단 / this.klassWeeksComponent is not valid!");
            return;
        }
        var classWeeksList = this.watchTower.getMyConst().getList("class_weeks_list");
        var classWeeksKorList = this.watchTower.getMyConst().getList("class_weeks_kor_list");
        var week = "" + this.klassCopy.week;
        if (!(0 < this.klassCopy.week)) {
            week = classWeeksList[0];
            // 초기 값은 원본에도 업데이트합니다.
            this.klass.week = this.klassCopy.week = +week;
        } // end if
        var weekKor = this.myArray.getValueFromLists(
        // key:string, 
        week, 
        // srcList:string[], 
        classWeeksList, 
        // targetList:string[]
        classWeeksKorList);
        var selectOptionList = this.getDefaultOptionList(
        // keyList:string[],
        classWeeksKorList, 
        // valueList:string[],
        classWeeksList, 
        // valueFocus:string
        week);
        if (isDebug)
            console.log("klass-detail / setKlassWeeks / selectOptionList : ", selectOptionList);
        if (isDebug)
            console.log("klass-detail / setKlassWeeks / week : ", week);
        if (isDebug)
            console.log("klass-detail / setKlassWeeks / weekKor : ", weekKor);
        this.klassWeeksComponent.setSelectOption(selectOptionList);
        this.priceTagHComponent.setTitle(weekKor);
    };
    KlassDetailComponent.prototype.updateKlassWeeks = function (klassWeeks) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassWeeks / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassWeeks / klassWeeks : ", klassWeeks);
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / updateKlassWeeks / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassWeeksComponent) {
            if (isDebug)
                console.log("klass-detail / updateKlassWeeks / 중단 / this.klassWeeksComponent is not valid!");
            return;
        }
        this.klassCopy.week = klassWeeks;
        this.setKlassWeeks();
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.setKlassPrice = function () {
        if (null == this.klass || null == this.klassCopy.price || !(0 < this.klassCopy.price)) {
            return;
        }
        if (null == this.klassPriceComponent) {
            return;
        }
        this.klassPriceComponent.setInput("" + this.klassCopy.price);
    }; // end method
    KlassDetailComponent.prototype.setKlassTimeBegin = function () {
        if (null == this.klassCopy || null == this.klassCopy.time_begin || "" == this.klassCopy.time_begin) {
            return;
        }
        if (null == this.klassTimeBeginComponent) {
            return;
        }
        this.klassTimeBeginComponent.setInput("" + this.klassCopy.time_begin);
    }; // end method
    KlassDetailComponent.prototype.setKlassTimeEnd = function () {
        if (null == this.klassCopy || null == this.klassCopy.time_end || "" == this.klassCopy.time_end) {
            return;
        }
        if (null == this.klassTimeEndComponent) {
            return;
        }
        this.klassTimeEndComponent.setInput("" + this.klassCopy.time_end);
    }; // end method
    // @ 가장 가까운 수업 시작일을 의미합니다.
    KlassDetailComponent.prototype.setKlassDateEnrollmentView = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / 시작");
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.butterflyComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.butterflyComponent is not valid!");
            return;
        }
        var enrollmentDateStr = this.klassCopy.getEnrollmentDate();
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / enrollmentDateStr : ", enrollmentDateStr);
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / this.butterflyComponent : ", this.butterflyComponent);
        this.butterflyComponent.setText(enrollmentDateStr);
    };
    // @ 가장 가까운 수업 시작일을 의미합니다.
    KlassDetailComponent.prototype.setKlassDateEnrollmentInput = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / 시작");
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassDateEnrollmentComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassDateEnrollmentView / 중단 / this.klassDateEnrollmentComponent is not valid!");
            return;
        }
        var enrollmentDateStr = this.klassCopy.getEnrollmentDate();
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / enrollmentDateStr : ", enrollmentDateStr);
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / this.butterflyComponent : ", this.butterflyComponent);
        // 운영자가 선택할 수 있는 수업 시작 등록 날짜를 select box 리스트로 만듭니다.
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / 운영자가 선택할 수 있는 수업 시작 등록 날짜를 select box 리스트로 만듭니다.");
        var enrollmentDateList = this.klassCopy.getEnrollmentDateList();
        var selectOptionList = [];
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / enrollmentDateList : ", enrollmentDateList);
        // 시작 날짜가 지정되지 않았다면, 가장 가까운 날짜를 지정해줍니다.
        // 해당 날짜가 등록 날짜 안에 있어야 합니다. 없다면 기본값.
        var hasValidEnrollmentDate = false;
        for (var i = 0; i < enrollmentDateList.length; ++i) {
            var enrollmentDate = enrollmentDateList[i];
            if (enrollmentDate.getYYYYMMDD() === this.klassCopy.date_begin) {
                hasValidEnrollmentDate = true;
                break;
            } // end if
        } // end for
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / hasValidEnrollmentDate : ", hasValidEnrollmentDate);
        if (!hasValidEnrollmentDate && this.myArray.isOK(enrollmentDateList)) {
            var enrollmentDate = enrollmentDateList[0];
            this.klass.date_begin = this.klassCopy.date_begin = enrollmentDate.getYYYYMMDD();
        } // end if
        for (var i = 0; i < enrollmentDateList.length; ++i) {
            var enrollmentDate = enrollmentDateList[i];
            var key = this.klassCopy.getEnrollmentDateStr(enrollmentDate);
            var value = enrollmentDate.getYYYYMMDD();
            var isFocus = (enrollmentDateStr === key) ? true : false;
            var defaultOption = new default_option_1.DefaultOption(
            // public key:string,
            key, 
            // public value:string,
            value, 
            // public isFocus:boolean
            isFocus);
            if (isDebug)
                console.log("klass-detail / setKlassDateEnrollmentView / defaultOption : ", defaultOption);
            selectOptionList.push(defaultOption);
        }
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollmentView / selectOptionList : ", selectOptionList);
        this.klassDateEnrollmentComponent.setSelectOption(selectOptionList);
    };
    // @ 주당 수업 횟수 데이터를 준비합니다.
    // @ 주당 수업을 하는 요일을 선택하는 데이터를 준비합니다.
    KlassDetailComponent.prototype.setKlassLevel = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassLevel / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassLevelComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassLevel / 중단 / this.klassLevelComponent is not valid!");
            return;
        }
        if (isDebug)
            console.log("klass-detail / setKlassLevel / 시작");
        var classLevelList = this.watchTower.getMyConst().getListNoDefault("class_level_list");
        var classLevelKorList = this.watchTower.getMyConst().getListNoDefault("class_level_kor_list");
        if (isDebug)
            console.log("klass-detail / setKlassLevel / classLevelList : ", classLevelList);
        if (isDebug)
            console.log("klass-detail / setKlassLevel / classLevelKorList : ", classLevelKorList);
        var klassLevel = this.klassCopy.level;
        var selectOptionList = [];
        for (var i = 0; i < classLevelList.length; ++i) {
            var klassLevelFromList = classLevelList[i];
            var klassLevelKorFromList = classLevelKorList[i];
            var key = klassLevelKorFromList;
            var value = klassLevelFromList;
            var isFocus = (klassLevelFromList === klassLevel) ? true : false;
            var defaultOption = new default_option_1.DefaultOption(
            // public key:string,
            key, 
            // public value:string,
            value, 
            // public isFocus:boolean
            isFocus);
            if (isDebug)
                console.log("klass-detail / setKlassLevel / defaultOption : ", defaultOption);
            selectOptionList.push(defaultOption);
        }
        if (isDebug)
            console.log("klass-detail / setKlassLevel / selectOptionList : ", selectOptionList);
        this.klassLevelComponent.setSelectOption(selectOptionList);
    };
    KlassDetailComponent.prototype.setKlassSubwayLine = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassSubwayLine / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassSubwayLineComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassSubwayLine / 중단 / this.klassSubwayLineComponent is not valid!");
            return;
        }
        if (isDebug)
            console.log("klass-detail / setKlassSubwayLine / 시작");
        var constMap = this.watchTower.getConstMap();
        var valueList = constMap["subway_line_list"];
        var keyList = constMap["subway_line_kor_list"];
        // let classLevelImgUrlList:string[] = constMap["class_level_img_url_list"];
        var valueFromKlassCopy = this.klassCopy.subway_line;
        var subwayLineList = constMap["subway_line_list"];
        if (null == valueFromKlassCopy || "" == valueFromKlassCopy) {
            // 선택된 역이 없다면, 2호선으로 임의 선택합니다.
            valueFromKlassCopy = subwayLineList[2];
            this.klass.subway_line = this.klassCopy.subway_line = valueFromKlassCopy;
        } // end if    
        var selectOptionList = [];
        for (var i = 1; i < valueList.length; ++i) {
            var keyFromList = keyList[i];
            var valueFromList = valueList[i];
            var key = keyFromList;
            var value = valueFromList;
            var isFocus = (valueFromList === valueFromKlassCopy) ? true : false;
            var defaultOption = new default_option_1.DefaultOption(
            // public key:string,
            key, 
            // public value:string,
            value, 
            // public isFocus:boolean
            isFocus);
            if (isDebug)
                console.log("klass-detail / setKlassSubwayLine / defaultOption : ", defaultOption);
            selectOptionList.push(defaultOption);
        }
        if (isDebug)
            console.log("klass-detail / setKlassSubwayLine / selectOptionList : ", selectOptionList);
        this.klassSubwayLineComponent.setSelectOption(selectOptionList);
    };
    KlassDetailComponent.prototype.setKlassSubwayStation = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassSubwayStation / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassSubwayStationComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassSubwayStation / 중단 / this.klassSubwayStationComponent is not valid!");
            return;
        }
        if (isDebug)
            console.log("klass-detail / setKlassSubwayStation / 시작");
        if (isDebug)
            console.log("klass-detail / setKlassSubwayStation / this.klassCopy.subway_line : ", this.klassCopy.subway_line);
        // 몇호선인지 검사 해야 한다.
        var subwayLine = this.klassCopy.subway_line;
        if (null == subwayLine || "" == subwayLine) {
            // 선택된 역이 없다면, 기본값을 선택합니다.
            this.klassCopy.subway_line = subwayLine = this.watchTower.getMyConst().getFirst("subway_line_list");
        } // end if
        if (isDebug)
            console.log("klass-detail / setKlassSubwayStation / subwayLine : ", subwayLine);
        this.updateSelectOptionSubwayStations(subwayLine);
    };
    KlassDetailComponent.prototype.updateSelectOptionSubwayStations = function (subwayLine) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / updateSelectOptionSubwayStations / 시작");
        if (null == subwayLine || "" === subwayLine) {
            return;
        }
        if (isDebug)
            console.log("klass-detail / updateSelectOptionSubwayStations / subwayLine : ", subwayLine);
        // HERE - 중첩된 값을 가져와야 함.
        // 지하철 역 이름을 가져옵니다.
        var subwayStationList = this.watchTower.getMyConst().getNestedChildList(
        // parentKey:string,
        "subway_line_list", 
        // parentValue:string,
        subwayLine, 
        // childKey:string
        "subway_station_list");
        if (isDebug)
            console.log("klass-detail / updateSelectOptionSubwayStations / subwayStationList : ", subwayStationList);
        var subwayStationKorList = this.watchTower.getMyConst().getNestedChildListFromPrevParent("subway_station_kor_list");
        var subwayStationImgList = this.watchTower.getMyConst().getNestedChildListFromPrevParent("subway_station_img_list");
        var subwayStation = this.klassCopy.subway_station;
        var subwasStationImgPrev = this.klassCopy.subway_station_img;
        var subwasStationImgNext = "";
        // 선택된 역이 역 리스트에 있는지 확인합니다.
        if (this.myArray.isOK(subwayStationKorList) &&
            this.myArray.isOK(subwayStationImgList) &&
            this.myArray.hasNotStr(subwayStationList, subwayStation)) {
            // 선택된 역이 없다면, 선택한 호선의 첫번째 역으로 임의 선택합니다. 이미지도 설정합니다.
            this.klassCopy.subway_station = this.klass.subway_station = subwayStation = subwayStationList[0];
            this.klassCopy.subway_station_img = this.klass.subway_station_img = subwasStationImgNext = subwayStation = subwayStationImgList[0];
            this.replaceSubwayStationImage(subwasStationImgPrev, subwasStationImgNext);
        } // end if
        if (isDebug)
            console.log("klass-detail / updateSelectOptionSubwayStations / subwayStation : ", subwayStation);
        var selectOptionList = this.getDefaultOptionList(
        // keyList:string[],
        subwayStationKorList, 
        // valueList:string[],
        subwayStationList, 
        // valueFocus:string
        this.klassCopy.subway_station);
        if (isDebug)
            console.log("klass-detail / updateSelectOptionSubwayStations / selectOptionList : ", selectOptionList);
        this.klassSubwayStationComponent.setSelectOption(selectOptionList);
    };
    KlassDetailComponent.prototype.getDefaultOptionList = function (keyList, valueList, valueFocus) {
        if (null == this.watchTower) {
            return [];
        }
        return this.watchTower
            .getMyConst()
            .getDefaultOptionList(
        // keyList:string[], 
        keyList, 
        // valueList:string[],
        valueList, 
        // valueFocus:string
        valueFocus);
    }; // end method
    KlassDetailComponent.prototype.setKlassDetailNavList = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setKlassDetailNavList / 시작");
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassDetailNavList / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassDetailNavListComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassDays / 중단 / this.klassDetailNavListComponent is not valid!");
            return;
        }
        if (isDebug)
            console.log("klass-detail / setKlassDays / this.klassDetailNavListComponent : ", this.klassDetailNavListComponent);
        this.klassDetailNavListComponent.setKlass(this.klassCopy);
    };
    // @ 주당 수업을 하는 요일을 선택하는 데이터를 준비합니다.
    KlassDetailComponent.prototype.setKlassDays = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setKlassDays / 시작");
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassDays / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassDaysComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassDays / 중단 / this.klassDaysComponent is not valid!");
            return;
        }
        if (isDebug)
            console.log("klass-detail / setKlassDays / this.klassDaysComponent : ", this.klassDaysComponent);
        // 컴포넌트가 준비되었습니다.
        // 1. 선택한 요일 리스트를 가져옵니다.
        var days = this.klassCopy.days;
        var daysList = this.klassCopy.days_list;
        if (isDebug)
            console.log("klass-detail / setKlassDays / days : ", days);
        if (isDebug)
            console.log("klass-detail / setKlassDays / daysList : ", daysList);
        var selectOptionList = this.watchTower
            .getMyConst()
            .getDefaultOptionListWithKeyValueFocus(
        // nameKeyList:string, 
        "class_days_kor_list", 
        // nameValueList:string,
        "class_days_list", 
        // valueFocus:string
        daysList);
        if (isDebug)
            console.log("klass-detail / setKlassDays / selectOptionList : ", selectOptionList);
        this.klassDaysComponent.setCheckOption([selectOptionList]);
    }; // end method
    KlassDetailComponent.prototype.getSubwayStationImg = function (subwayLine, subwayStation) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / getSubwayStationImg / 시작");
        if (isDebug)
            console.log("klass-detail / getSubwayStationImg / subwayLine : " + subwayLine);
        if (isDebug)
            console.log("klass-detail / getSubwayStationImg / subwayStation : " + subwayStation);
        if (null == subwayLine || "" === subwayLine) {
            subwayLine =
                this.watchTower
                    .getMyConst()
                    .getFirst("subway_line_list");
        }
        if (isDebug)
            console.log("klass-detail / getSubwayStationImg / subwayLine : " + subwayLine);
        if (null == subwayStation || "" === subwayStation) {
            subwayStation =
                this.watchTower
                    .getMyConst()
                    .getDefaultNested(
                // parentKey:string, 
                "subway_line_list", 
                // parentValue:string, 
                subwayLine, 
                // childKey:string
                "subway_station_list");
        }
        if (isDebug)
            console.log("klass-detail / getSubwayStationImg / subwayStation : " + subwayStation);
        var subwayStationImg = this.watchTower.getMyConst().getNestedChildValue(
        // parentKey:string, 
        "subway_line_list", 
        // parentValue:string,
        subwayLine, 
        // childKeySrc:string,
        "subway_station_list", 
        // childValue:string,
        subwayStation, 
        // childKeyTarget:string
        "subway_station_img_list");
        return subwayStationImg;
    };
    KlassDetailComponent.prototype.getLevelImage = function (klassLevel) {
        return this.watchTower
            .getMyConst()
            .getValue(
        // srcKey:string, 
        "class_level_list", 
        // srcValue:string, 
        klassLevel, 
        // targetKey:string
        "class_level_img_url_list");
    };
    KlassDetailComponent.prototype.setSelectileImageTable = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setSelectileImageTable / 시작");
        // 레벨 이미지 설정하기
        var levelImg = this.klassCopy.level_img_url =
            this.getLevelImage(this.klassCopy.level);
        if (isDebug)
            console.log("klass-detail / setSelectileImageTable / levelImg : ", levelImg);
        // 지하철 역 이미지 설정하기. - 시작
        var subwayStationImg = this.klassCopy.subway_station_img =
            this.getSubwayStationImg(this.klassCopy.subway_line, this.klassCopy.subway_station);
        if (isDebug)
            console.log("klass-detail / setSelectileImageTable / subwayStationImg : ", subwayStationImg);
        // TODO - 시간 이미지 설정하기
        this.selectileImageTable =
            [
                [
                    levelImg,
                    subwayStationImg,
                    this.klassCopy.time_begin_img_url
                ]
            ];
        if (null != this.klassCopy.days_img_url_list) {
            for (var i = 0; i < this.klassCopy.days_img_url_list.length; ++i) {
                var days_img_url = this.klassCopy.days_img_url_list[i];
                this.selectileImageTable[0].push(days_img_url);
            } // end for
        } // end if
    }; // end method
    KlassDetailComponent.prototype.setDaysImg = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / setDaysImg / 시작");
        var days_list = this.klass.days_list;
        var days_img_url_list = [];
        for (var i = 0; i < days_list.length; ++i) {
            var day = days_list[i];
            var day_img_url = this.watchTower
                .getMyConst()
                .getValue(
            // srcKey:string, 
            "class_days_list", 
            // srcValue:string, 
            day, 
            // targetKey:string
            "class_days_img_url_list");
            days_img_url_list.push(day_img_url);
        } // end for   
        if (isDebug)
            console.log("klass-detail / setDaysImg / days_img_url_list : ", days_img_url_list);
        this.klass.days_img_url_list = days_img_url_list;
    };
    KlassDetailComponent.prototype.onAfterReceivingKlass = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / onAfterReceivingKlass / 시작");
        if (isDebug)
            console.log("klass-detail / onAfterReceivingKlass / this.klass : ", this.klass);
        // 수업 정보를 받은 뒤에, 요일 이미지 정보를 업데이트합니다.
        // wonder.jung
        this.setDaysImg();
        // 저장 이전의 모든 데이터는 복사본에서 가져와 사용합니다.
        // 저장 이후에 복사본의 데이터를 원본으로 백업합니다.
        this.klassCopy = this.klass.copy();
        // fill datas
        this.imgUploaderImageUrlKlassPoster = this.klassCopy.class_poster_url_loadable;
        this.klassTitle = this.klassCopy.title;
        // set image-grid admin
        if (null != this.bannerComponent) {
            this.bannerComponent.compareUserImages(this.klassCopy.class_banner_url_arr);
        }
        this.setSelectileImageTable();
        // set default-input: klass price
        this.setKlassPrice();
        this.setKlassWeeks();
        this.setKlassTimeBegin();
        this.setKlassTimeEnd();
        this.setKlassDays();
        this.setKlassPriceDesc();
        // @ Deprecated
        this.setKlassDateEnrollmentView();
        this.setKlassDateEnrollmentInput();
        // set image-grid service
        var classBannerUrlArr = this.klassCopy.class_banner_url_arr;
        if (null != classBannerUrlArr && 0 < classBannerUrlArr.length) {
            for (var i = 0; i < classBannerUrlArr.length; ++i) {
                var classBannerUrl = classBannerUrlArr[i];
                classBannerUrl = this.klassService.getKlassBannerUrlLoadable(classBannerUrl);
                this.imageTableBannerListService.push([classBannerUrl]);
            } // end for
        } // end if
        // 수업 정보 리스트에게 klass 정보를 전달합니다.
    };
    KlassDetailComponent.prototype.setKlassBannerImageUploader = function () {
        // Set image uploader props
        this.imgUploaderUploadAPIUrl = "/CI/index.php/api/upload/image";
        this.imgUploaderImagePath = "/assets/images/class/banner";
        this.imgUploaderImageUrl = "/assets/images/class/banner/banner_default.svg";
        this.imgUploaderEventKey = this.myEventService.KEY_KLASS_BANNER;
    };
    KlassDetailComponent.prototype.setKlassPosterImageUploader = function () {
        // Set image uploader props
        this.imgUploaderUploadAPIUrl = "/CI/index.php/api/upload/image";
        this.imgUploaderImagePathKlassPoster = "/assets/images/class/poster";
        this.imgUploaderImageUrlKlassPoster = "/assets/images/class/poster/no_image.svg";
        this.imgUploaderEventKeyKlassPoster = this.myEventService.KEY_KLASS_POSTER;
    };
    KlassDetailComponent.prototype.setEmptyKlass = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / setEmptyKlass / 시작");
        // 새로운 수업을 만들때, 빈 수업 데이터를 만들어 가져옵니다.
    };
    // REMOVE ME
    /*
    private setFirstClassDateFormat() :void {
      this.firstClassDate = this.getFirstClassDate(this.klass);
  
      if(this.firstClassDate) {
        this.firstClassDateFormatStr = `${this.firstClassDate.month}월 ${this.firstClassDate.date}일 ${this.firstClassDate.dayKor}요일`;
      }
    }
    private getFirstClassDate(klass:Klass) :Calendar {
  
      let calendar_table_monthly = klass.calendar_table_monthly;
      for (var i = 0; i < calendar_table_monthly.length; ++i) {
        let calendar_table = calendar_table_monthly[i];
        // console.log("calendar_table : ",calendar_table);
        for (var j = 0; j < calendar_table.length; ++j) {
          let week = calendar_table[j];
          // console.log("week : ",week);
          for (var k = 0; k < week.length; ++k) {
            let date:Calendar = week[k];
            // console.log("date : ",date);
  
            if(null === date) {
              continue;
            }
            if(date.isExpired) {
              continue;
            }
            if(!date.hasKlass) {
              continue;
            }
  
            if(4 == +klass.enrollment_interval_week && !date.isEnrollment4weeks) {
              continue;
            } else if(2 == +klass.enrollment_interval_week && !date.isEnrollment2weeks) {
              continue;
            } else if(1 == +klass.enrollment_interval_week && !date.isEnrollmentWeek) {
              continue;
            }
  
            // 첫 수업을 찾았습니다.
            return date;
          }
        }
      }
  
      return null;
    }
    */
    KlassDetailComponent.prototype.cancel = function () {
        this.gotoKlassList();
    };
    KlassDetailComponent.prototype.save = function () {
        this.klassCopy.title = this.editTitle;
        this.gotoKlassList();
    };
    // @ Deprecated
    KlassDetailComponent.prototype.canDeactivate = function () {
        return true;
        /*
        // Allow synchronous navigation (`true`) if no klass or the klass is unchanged
        if (!this.klass || this.klass.title === this.editTitle) {
          return true;
        }
        // Otherwise ask the user with the dialog service and return its
        // promise which resolves to true or false when the user decides
        return this.dialogService.confirm('Discard changes?');
        */
    };
    KlassDetailComponent.prototype.gotoKlassList = function () {
        var klassId = this.klass ? this.klassCopy.id : null;
        console.log("gotoKlassList / klassId : ", klassId);
        // Pass along the klass id if available
        // so that the KlassListComponent can select that klass.
        // Add a totally useless `foo` parameter for kicks.
        // Relative navigation back to the crises
        // this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
    };
    // EVENT
    KlassDetailComponent.prototype.onClickKlassPoster = function (event) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / onClickKlassPoster / 시작");
        if (!this.isAdmin || !this.isTeacher) {
            if (isDebug)
                console.log("klass-detail / onClickKlassPoster / 중단 / 수업 포스터를 수정할수 없습니다.");
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        // 수업 이미지 업로드를 시작합니다.
        this.hiddenUploaderComponent.initFileUpload();
    };
    KlassDetailComponent.prototype.onClickEnrollment = function (event, klass) {
        event.stopPropagation();
        console.log("onClickEnrollment / klass ::: ", klass);
    };
    KlassDetailComponent.prototype.onClickWishList = function (event, klass) {
        event.stopPropagation();
        console.log("onClickEnrollment / klass ::: ", klass);
    };
    KlassDetailComponent.prototype.onClickYellowID = function (event, klass) {
        event.stopPropagation();
        console.log("onClickYellowID / klass ::: ", klass);
    };
    KlassDetailComponent.prototype.onChangedFromChild = function (myEvent) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / 시작");
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / myEvent : ", myEvent);
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("klass-detail / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            var lastHistory = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("klass-detail / onChangedFromChild / lastHistory : ", lastHistory);
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {
                if (null != myEvent.metaObj) {
                    this.klassTitleComponent = myEvent.metaObj;
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE)) {
                if (null != myEvent.metaObj) {
                    this.klassPriceComponent = myEvent.metaObj;
                    this.setKlassPrice();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_WEEKS)) {
                if (null != myEvent.metaObj) {
                    this.klassWeeksComponent = myEvent.metaObj;
                    this.setKlassWeeks();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE_VIEW)) {
                if (null != myEvent.metaObj) {
                    this.priceTagHComponent = myEvent.metaObj;
                    this.setKlassPriceDesc();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_BEGIN)) {
                if (null != myEvent.metaObj) {
                    this.klassTimeBeginComponent = myEvent.metaObj;
                    this.setKlassTimeBegin();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_END)) {
                if (null != myEvent.metaObj) {
                    this.klassTimeEndComponent = myEvent.metaObj;
                    this.setKlassTimeEnd();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DATE_ENROLLMENT_VIEW)) {
                if (null != myEvent.metaObj) {
                    this.butterflyComponent = myEvent.metaObj;
                    this.setKlassDateEnrollmentView();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DATE_ENROLLMENT_INPUT)) {
                if (null != myEvent.metaObj) {
                    this.klassDateEnrollmentComponent = myEvent.metaObj;
                    this.setKlassDateEnrollmentInput();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_LEVEL)) {
                if (null != myEvent.metaObj) {
                    this.klassLevelComponent = myEvent.metaObj;
                    this.setKlassLevel();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_LINE)) {
                if (null != myEvent.metaObj) {
                    this.klassSubwayLineComponent = myEvent.metaObj;
                    this.setKlassSubwayLine();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_STATION)) {
                if (null != myEvent.metaObj) {
                    this.klassSubwayStationComponent = myEvent.metaObj;
                    this.setKlassSubwayStation();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS)) {
                if (null != myEvent.metaObj) {
                    this.klassDaysComponent = myEvent.metaObj;
                    this.setKlassDays();
                }
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {
                if (null != myEvent.metaObj) {
                    this.bannerComponent = myEvent.metaObj;
                } // end if
                if (null != this.klass && null != this.bannerComponent) {
                    this.bannerComponent.compareUserImages(this.klassCopy.class_banner_url_arr);
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_LIST)) {
                if (null != myEvent.metaObj) {
                    this.klassDetailNavListComponent = myEvent.metaObj;
                    this.setKlassDetailNavList();
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER_VIEW)) {
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_SELECTILE_VIEW)) {
                if (null != myEvent.metaObj) {
                    this.selectTileViewComponent = myEvent.metaObj;
                } // end if
            } // end if      
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {
                this.updateKlassTitle(myEvent.value, false);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_VENUE_MAP)) {
                this.updateKlassVenue(myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_PRICE)) {
                this.updateKlassPrice(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_WEEKS)) {
                this.updateKlassWeeks(+myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {
                this.updateKlassBanners(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_BEGIN)) {
                this.updateKlassTimeBegin(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_END)) {
                this.updateKlassTimeEnd(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_SELECTILE)) {
                this.updateKlassLevelDayTimeStation(myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DATE_ENROLLMENT_INPUT)) {
                this.updateKlassDateEnrollment(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS)) {
                this.updateKlassDays(myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_LEVEL)) {
                this.updateKlassLevel(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_LINE)) {
                this.updateKlassSubwayLine(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_VENUE_SUBWAY_STATION)) {
                this.updateKlassSubwayStation(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_FEATURE_LIST)) {
                this.updateKlassFeatureList(myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {
                this.updateKlassTargetList(myEvent.metaObj);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_SCHEDULE)) {
                this.updateKlassSchedule(myEvent.value);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SUBMIT)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {
                this.updateKlassTitle(myEvent.value, true);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_DONE)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_POSTER)) {
                this.addKlassPoster(myEvent.value);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                this.klassCopy.setTeacherResumeList(myEvent.metaObj);
                this.updateSaveBtnStatus();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                this.klassCopy.setTeacherGreetingList(myEvent.metaObj);
                this.updateSaveBtnStatus();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {
                this.addKlassBanner(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {
                this.updateKlassTargetList(myEvent.metaObj);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                this.klassCopy.setTeacherResumeList(myEvent.metaObj);
                this.updateSaveBtnStatus();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                this.klassCopy.setTeacherGreetingList(myEvent.metaObj);
                this.updateSaveBtnStatus();
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {
                this.removeKlassBanner(myEvent.value);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {
                this.updateKlassTargetList(myEvent.metaObj);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SHUTDOWN_N_ROLLBACK)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_SCHEDULE)) {
                this.updateKlassSchedule(myEvent.value);
            } // end if
        } // end if
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / this.klassCopy : ", this.klassCopy);
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / Done");
    }; // end method
    KlassDetailComponent.prototype.updateKlassLevelDayTimeStation = function (klassSelectile) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassLevelDayTimeStation / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassLevelDayTimeStation / klassSelectile : ", klassSelectile);
        if (isDebug)
            console.log("klass-detail / updateKlassLevelDayTimeStation / this.klassCopy : ", this.klassCopy);
        var klassDay = klassSelectile.day;
        if (null != klassDay) {
            if (isDebug)
                console.log("klass-detail / updateKlassLevelDayTimeStation / klassDay : ", klassDay);
            this.klassCopy.days = klassDay.key;
            this.klassCopy.days_img_url = klassDay.img_url;
        } // end if
        var klassLevel = klassSelectile.level;
        if (null != klassLevel) {
            if (isDebug)
                console.log("klass-detail / updateKlassLevelDayTimeStation / klassLevel : ", klassLevel);
            this.klassCopy.level = klassLevel.key;
            this.klassCopy.level_img_url = klassLevel.img_url;
        } // end if
        var klassStation = klassSelectile.station;
        if (null != klassStation) {
            if (isDebug)
                console.log("klass-detail / updateKlassLevelDayTimeStation / klassStation : ", klassStation);
        } // end if
        var klassTime = klassSelectile.time;
        if (null != klassTime) {
            if (isDebug)
                console.log("klass-detail / updateKlassLevelDayTimeStation / klassTime : ", klassTime);
            this.klassCopy.time_begin = klassTime.hh_mm;
            this.klassCopy.time_begin_img_url = klassTime.img_url;
        } // end if
        this.updateSaveBtnStatus();
    }; // end if
    KlassDetailComponent.prototype.updateKlassPrice = function (klassPrice) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / updateKlassPrice / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassPrice / klassPrice : ", klassPrice);
        if (null == klassPrice || "" == klassPrice) {
            return;
        }
        this.klassCopy.price = parseInt(klassPrice);
        this.priceTagHComponent.setPrice(this.klassCopy.price);
        this.setKlassPriceDesc();
        this.updateSaveBtnStatus();
    };
    // @ Desc : 해당 수업의 선생님인 경우, 수수료 요율등의 정보를 표시합니다.
    KlassDetailComponent.prototype.setKlassPriceDesc = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / setKlassPriceDesc / 시작");
        if (null == this.loginUser) {
            if (isDebug)
                console.log("klass-detail / setKlassPriceDesc / 중단 / this.loginUser is not valid!");
            return;
        }
        if (!this.loginUser.isTeacher()) {
            if (isDebug)
                console.log("klass-detail / setKlassPriceDesc / 중단 / this.loginUser is not teacher!");
            return;
        }
        if (null == this.priceTagHComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassPriceDesc / 중단 / this.priceTagHComponent is not valid!");
            return;
        }
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassPriceDesc / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (isDebug)
            console.log("klass-detail / setKlassPriceDesc / 선생님이라면 가격의 수수료를 노출합니다.");
        var commision = this.klassCopy.getCommision();
        var paymentStr = this.klassCopy.getPaymentStr();
        var klassPriceDesc = "\uC2E4\uC218\uB839\uC561 : \u20A9" + paymentStr + " (\uC218\uC218\uB8CC : " + commision + "%)";
        if (isDebug)
            console.log("klass-detail / setKlassPriceDesc / commision : ", commision);
        if (isDebug)
            console.log("klass-detail / setKlassPriceDesc / paymentStr : ", paymentStr);
        if (isDebug)
            console.log("klass-detail / setKlassPriceDesc / klassPriceDesc : ", klassPriceDesc);
        this.priceTagHComponent.setPriceDesc(klassPriceDesc);
    };
    KlassDetailComponent.prototype.updateKlassTimeBegin = function (klassTimeBegin) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassTimeBegin / 시작");
        if (this.myTime.isNotHHMM(klassTimeBegin)) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeBegin / 중단 / this.myTime.isNotHHMM(klassTimeBegin)");
            return;
        }
        if (null == this.klassTimeBeginComponent) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeBegin / 중단 / this.klassTimeBeginComponent is not valid!");
            return;
        }
        if (null == this.klassTimeEndComponent) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeBegin / 중단 / this.klassTimeEndComponent is not valid!");
            return;
        }
        var klassTimeEnd = this.klassTimeEndComponent.getInput();
        if (this.myTime.isNotHHMM(klassTimeEnd)) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeBegin / 중단 / this.klassTimeEnd is not valid!");
            return;
        }
        var minutesDiff = this.myTime.getDiffMinutesHHMM(klassTimeBegin, klassTimeEnd);
        if (isDebug)
            console.log("klass-detail / updateKlassTimeBegin / klassTimeBegin : ", klassTimeBegin);
        if (isDebug)
            console.log("klass-detail / updateKlassTimeBegin / klassTimeEnd : ", klassTimeEnd);
        if (isDebug)
            console.log("klass-detail / updateKlassTimeBegin / minutesDiff : ", minutesDiff);
        if (minutesDiff < this.klassTimeMinutesMin) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeBegin / 1시간 미만의 수업은 불가능합니다.");
            // 1시간 미만의 수업은 불가능합니다.
            // 1시간 미만일 경우, 변경한 시작 시간에서 1시간 이후를 종료 시간으로 고정합니다.
            // FIX ME - 00시를 경계로 2시간이 증가되는 버그가 있음.
            var klassTimeEnd1hrAfter = this.myTime.addMinutesHHMM(klassTimeBegin, this.klassTimeMinutesMin);
            this.klassTimeEndComponent.setInput(klassTimeEnd1hrAfter);
            this.klassCopy.setTimeBeginEnd(klassTimeBegin, klassTimeEnd1hrAfter);
        }
        else if (this.klassTimeMinutesMax < minutesDiff) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeBegin / 3시간 이상의 수업은 불가능합니다.");
            // 3시간 이상의 수업은 불가능합니다.
            // 3시간 이상일 경우, 변경한 시작 시간에서 3시간 이후를 종료 시간으로 고정합니다.
            var klassTimeEnd3hrsAfter = this.myTime.addMinutesHHMM(klassTimeBegin, this.klassTimeMinutesMax);
            this.klassTimeEndComponent.setInput(klassTimeEnd3hrsAfter);
            this.klassCopy.setTimeBeginEnd(klassTimeBegin, klassTimeEnd3hrsAfter);
        }
        else {
            this.klassCopy.setTimeBegin(klassTimeBegin);
        }
        this.updateClockTime(this.klassCopy.time_begin, this.klassCopy.time_end);
        this.updateSaveBtnStatus();
        if (isDebug)
            console.log("klass-detail / updateKlassTimeBegin / this.klassCopy : ", this.klassCopy);
    }; // end method
    KlassDetailComponent.prototype.updateKlassTimeEnd = function (klassTimeEnd) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassTimeEnd / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassTimeEnd / klassTimeEnd : ", klassTimeEnd);
        if (this.myTime.isNotHHMM(klassTimeEnd)) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeEnd / 중단 / this.myTime.isNotHHMM(klassTimeBegin)");
            return;
        }
        if (null == this.klassTimeBeginComponent) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeEnd / 중단 / this.klassTimeBeginComponent is not valid!");
            return;
        }
        if (null == this.klassTimeEndComponent) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeEnd / 중단 / this.klassTimeEndComponent is not valid!");
            return;
        }
        var klassTimeBegin = this.klassTimeBeginComponent.getInput();
        if (this.myTime.isNotHHMM(klassTimeBegin)) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeEnd / 중단 / this.myTime.isNotHHMM(klassTimeBegin)");
            return;
        }
        var minutesDiff = this.myTime.getDiffMinutesHHMM(klassTimeBegin, klassTimeEnd);
        if (isDebug)
            console.log("klass-detail / updateKlassTimeEnd / minutesDiff : ", minutesDiff);
        if (minutesDiff < this.klassTimeMinutesMin) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeEnd / 1시간 미만의 수업은 불가능합니다.");
            // 1시간 미만의 수업은 불가능합니다.
            // 1시간 미만일 경우, 변경한 시작 시간에서 1시간 이후를 종료 시간으로 고정합니다.
            var klassTimeBegin1hrBefore = this.myTime.addMinutesHHMM(klassTimeEnd, -1 * this.klassTimeMinutesMin);
            this.klassTimeBeginComponent.setInput(klassTimeBegin1hrBefore);
            this.klassCopy.setTimeBeginEnd(klassTimeBegin1hrBefore, klassTimeEnd);
        }
        else if (this.klassTimeMinutesMax < minutesDiff) {
            if (isDebug)
                console.log("klass-detail / updateKlassTimeEnd / 3시간 이상의 수업은 불가능합니다.");
            // 3시간 이상의 수업은 불가능합니다.
            // 3시간 이상일 경우, 변경한 시작 시간에서 3시간 이후를 종료 시간으로 고정합니다.
            var klassTimeBegin3hrsBefore = this.myTime.addMinutesHHMM(klassTimeEnd, -1 * this.klassTimeMinutesMax);
            this.klassTimeBeginComponent.setInput(klassTimeBegin3hrsBefore);
            this.klassCopy.setTimeBeginEnd(klassTimeBegin3hrsBefore, klassTimeEnd);
        }
        else {
            this.klassCopy.setTimeEnd(klassTimeEnd);
        }
        this.updateClockTime(this.klassCopy.time_begin, this.klassCopy.time_end);
        this.updateSaveBtnStatus();
        if (isDebug)
            console.log("klass-detail / updateKlassTimeEnd / this.klassCopy : ", this.klassCopy);
    };
    KlassDetailComponent.prototype.updateKlassDays = function (metaObj) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassDays / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassDays / metaObj : ", metaObj);
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / updateKlassDays / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.selectTileViewComponent) {
            if (isDebug)
                console.log("klass-detail / updateKlassDays / 중단 / this.selectTileViewComponent is not valid!");
            return;
        }
        var selectedValue = metaObj.value;
        var constMap = this.watchTower.getConstMap();
        var classDaysList = constMap["class_days_list"];
        var classDaysImgUrlList = constMap["class_days_img_url_list"];
        var daysImgUrl = "/" + this.myArray.getValueFromLists(selectedValue, classDaysList, classDaysImgUrlList);
        if (isDebug)
            console.log("klass-detail / updateKlassDays / daysImgUrl : ", daysImgUrl);
        if (metaObj.isFocus) {
            if (isDebug)
                console.log("klass-detail / updateKlassDays / 이미지를 추가합니다.");
            // 이미지를 추가합니다.
            this.selectileImageTable[0].push(daysImgUrl);
            // 데이터를 추가합니다.
            this.klassCopy.addDay(selectedValue, daysImgUrl);
        }
        else if (0 < this.klassCopy.days_list.length) {
            if (isDebug)
                console.log("klass-detail / updateKlassDays / 이미지를 제거합니다.");
            // 이미지를 제거합니다.
            this.selectileImageTable[0] = this.myArray.removeStr(this.selectileImageTable[0], daysImgUrl);
            // 데이터를 삭제합니다.
            this.klassCopy.removeDay(selectedValue, daysImgUrl);
        } // end if
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.updateKlassLevel = function (klassLevel) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassLevel / 시작");
        if (this.klassCopy.level === klassLevel) {
            if (isDebug)
                console.log("klass-detail / updateKlassLevel / 중단 / 같은 레벨입니다.");
            return;
        }
        if (isDebug)
            console.log("klass-detail / updateKlassLevel / klassLevel : ", klassLevel);
        this.klassCopy.level = klassLevel;
        var levelImagePrev = this.klassCopy.level_img_url;
        var levelImageNext = this.klassCopy.level_img_url = this.getLevelImage(klassLevel);
        if (isDebug)
            console.log("klass-detail / updateKlassLevel / levelImagePrev : ", levelImagePrev);
        if (isDebug)
            console.log("klass-detail / updateKlassLevel / levelImageNext : ", levelImageNext);
        this.replaceSubwayStationImage(levelImagePrev, levelImageNext);
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.updateKlassSubwayLine = function (klassSubwayLine) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / updateKlassSubwayLine / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassSubwayLine / klassSubwayLine : ", klassSubwayLine);
        var constMap = this.watchTower.getConstMap();
        var subwayLineList = constMap["subway_line_list"];
        // 새로운 지하철 호선 정보로 교체!
        this.klassCopy.subway_line = klassSubwayLine;
        // 변경된 지하철 호선에 맞게 역의 선택 리스트를 옮겨줍니다.
        this.updateSelectOptionSubwayStations(klassSubwayLine);
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.updateKlassSubwayStation = function (klassSubwayStation) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassSubwayStation / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassSubwayStation / klassSubwayStation : ", klassSubwayStation);
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / updateKlassSubwayStation / 중단 / this.klassCopy is not valid!");
            return;
        }
        // REMOVE ME
        /*
        if(this.klassCopy.subway_station === klassSubwayStation) {
          if(isDebug) console.log("klass-detail / updateKlassSubwayStation / 중단 / 동일한 지하철 역을 선택했습니다.");
          return;
        }
        */
        // 새로운 지하철 역 정보로 교체!
        this.klassCopy.subway_station = klassSubwayStation;
        // 이전 이미지를 가져옵니다.
        var subwayImagePrev = this.klassCopy.subway_station_img;
        // 새로운 이미지 정보로 교체
        var subwayImageNext = this.klassCopy.subway_station_img =
            this.getSubwayStationImg(this.klassCopy.subway_line, this.klassCopy.subway_station);
        // 이미지를 교체합니다.
        if (isDebug)
            console.log("klass-detail / updateKlassSubwayStation / subwayImagePrev : ", subwayImagePrev);
        if (isDebug)
            console.log("klass-detail / updateKlassSubwayStation / subwayImageNext : ", subwayImageNext);
        this.replaceSubwayStationImage(subwayImagePrev, subwayImageNext);
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.replaceSubwayStationImage = function (subwayImagePrev, subwayImageNext) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / replaceSubwayStationImage / 시작");
        if (isDebug)
            console.log("klass-detail / replaceSubwayStationImage / subwayImagePrev : ", subwayImagePrev);
        if (isDebug)
            console.log("klass-detail / replaceSubwayStationImage / subwayImageNext : ", subwayImageNext);
        this.selectileImageTable[0] = this.myArray.replaceStr(this.selectileImageTable[0], subwayImagePrev, subwayImageNext);
    };
    KlassDetailComponent.prototype.updateKlassFeatureList = function (featureList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassFeatureList / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassFeatureList / featureList : ", featureList);
        this.klassCopy.setFeatureList(featureList);
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.updateKlassTargetList = function (targetList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassTargetList / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassTargetList / targetList : ", targetList);
        this.klassCopy.setTargetList(targetList);
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.updateKlassSchedule = function (schedule) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassSchedule / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassSchedule / schedule : ", schedule);
        // 가장 마지막에 추가되는 불필요한 태그를 삭제합니다.
        schedule = schedule.replace(/\<p\>\<br\>\<\/p\>$/gi, "");
        this.klassCopy.setSchedule(schedule);
        this.updateSaveBtnStatus();
    };
    KlassDetailComponent.prototype.setKlassDateEnrollment = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / setKlassDateEnrollment / 시작");
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / setKlassDateEnrollment / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassDateEnrollmentComponent) {
            if (isDebug)
                console.log("klass-detail / setKlassDateEnrollment / 중단 / this.klassDateEnrollmentComponent is not valid!");
            return;
        }
    };
    KlassDetailComponent.prototype.updateKlassDateEnrollment = function (klassDateEnrollment) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassDateEnrollment / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassDateEnrollment / klassDateEnrollment : ", klassDateEnrollment);
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / updateKlassDateEnrollment / 중단 / this.klassCopy is not valid!");
            return;
        }
        if (null == this.klassDateEnrollmentComponent) {
            if (isDebug)
                console.log("klass-detail / updateKlassDateEnrollment / 중단 / this.klassDateEnrollmentComponent is not valid!");
            return;
        }
        var dateEnrollmentStr = this.klassDateEnrollmentComponent.getKeyFromSelect(klassDateEnrollment);
        if (null == dateEnrollmentStr || "" === dateEnrollmentStr) {
            if (isDebug)
                console.log("klass-detail / updateKlassDateEnrollment / 중단 / dateEnrollmentStr is not valid!");
            return;
        }
        if (isDebug)
            console.log("klass-detail / updateKlassDateEnrollment / dateEnrollmentStr : ", dateEnrollmentStr);
        this.klassCopy.date_begin = klassDateEnrollment;
        this.butterflyComponent.setText(dateEnrollmentStr);
        this.updateSaveBtnStatus();
        if (isDebug)
            console.log("klass-detail / updateKlassDateEnrollment / this.klassCopy.date_begin : ", this.klassCopy.date_begin);
    };
    KlassDetailComponent.prototype.updateClockTime = function (hhmmBeing, hhmmEnd) {
        // 서비스에 표시되는 시계 아이콘을 업데이트합니다.
        this.clockBoardComponent.setClockTimeBeginEnd(hhmmBeing, hhmmEnd);
    }; // end method
    KlassDetailComponent.prototype.updateKlassVenue = function (klassVenue) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassVenue / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassVenue / klassVenue : ", klassVenue);
        if (null == this.klassCopy) {
            if (isDebug)
                console.log("klass-detail / updateKlassVenue / 중단 / this.klassCopy is not valid!");
            return;
        }
        // Klass 객체에 수업 장소 관련 데이터를 저장합니다.
        this.klassCopy.setKlassVenue(klassVenue);
        this.updateSaveBtnStatus();
        if (isDebug)
            console.log("klass-detail / updateKlassVenue / this.klassCopy : ", this.klassCopy);
    };
    KlassDetailComponent.prototype.updateKlassTitle = function (klassTitle, isDBUpdate) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassTitle / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassTitle / klassTitle : ", klassTitle);
        if (isDebug)
            console.log("klass-detail / updateKlassTitle / isDBUpdate : ", isDBUpdate);
        if (null == klassTitle || "" == klassTitle) {
            return;
        }
        if (null == this.klassCopy) {
            return;
        }
        this.klassTitle = klassTitle; // @ Deprecated
        this.klassCopy.title = klassTitle;
        this.updateSaveBtnStatus();
        // REMOVE ME
        /*
        if(isDBUpdate) {
    
          this.klassService.updateKlassTitle(
            // apiKey:string,
            this.watchTower.getApiKey(),
            // userId:number,
            +this.loginUser.id,
            // klassId:number,
            +this.klassCopy.id,
            // klassTitle:string
            klassTitle
          ).then((myResponse:MyResponse) => {
    
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if(isDebug) console.log("klass-detail / updateKlassTitle / myResponse : ",myResponse);
            if(myResponse.isSuccess() && myResponse.hasDataProp("klass_poster")) {
    
              // Do something..
    
            } else if(myResponse.isFailed() && null != myResponse.error) {
    
              this.watchTower.announceErrorMsgArr([myResponse.error]);
    
            } else {
              // 에러 로그 등록
              this.myLoggerService.logError(
                // apiKey:string
                this.watchTower.getApiKey(),
                // errorType:string
                this.myLoggerService.errorAPIFailed,
                // errorMsg:string
                `klass-detail / updateKlassTitle / user_id : ${this.loginUser.id} / klass_id : ${this.klassCopy.id} / klassTitle : ${klassTitle}`
              ); // end logger
    
            } // end if
    
          }) // end service
    
        } // end if
        */
    }; // end method
    KlassDetailComponent.prototype.addKlassPoster = function (posterUrl) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / addKlassPoster / 시작");
        if (null == this.klassCopy) {
            return;
        }
        this.klassCopy.class_poster_url = posterUrl;
        this.updateSaveBtnStatus();
        // REMOVE ME
        /*
        this.klassService.addKlassPoster(
          // apiKey:string,
          this.watchTower.getApiKey(),
          // userId:number,
          +this.loginUser.id,
          // klassId:number,
          +this.klassCopy.id,
          // klassPoster:string
          posterUrl
        ).then((myResponse:MyResponse) => {
          // 로그 등록 결과를 확인해볼 수 있습니다.
          if(isDebug) console.log("klass-detail / addKlassPoster / myResponse : ",myResponse);
          if(myResponse.isSuccess() && myResponse.hasDataProp("klass_poster")) {
    
            let klassPosterUrl:string = myResponse.getDataProp("klass_poster");
    
            if(null != klassPosterUrl && "" != klassPosterUrl) {
              klassPosterUrl = `${this.imgUploaderImagePathKlassPoster}/${klassPosterUrl}`;
              this.imgUploaderImageUrlKlassPoster = klassPosterUrl;
            }
    
            if(isDebug) console.log("klass-detail / addKlassPoster / klassPosterUrl : ",klassPosterUrl);
    
          } else if(myResponse.isFailed() && null != myResponse.error) {
    
            this.watchTower.announceErrorMsgArr([myResponse.error]);
    
          } else {
            // 에러 로그 등록
            this.myLoggerService.logError(
              // apiKey:string
              this.watchTower.getApiKey(),
              // errorType:string
              this.myLoggerService.errorAPIFailed,
              // errorMsg:string
              `klass-detail / addKlassPoster / user_id : ${this.loginUser.id} / klass_id : ${this.klassCopy.id} / posterUrl : ${posterUrl}`
            ); // end logger
    
          } // end if
    
        }) // end service
        */
    };
    KlassDetailComponent.prototype.addKlassBanner = function (imgUrlToAdd) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / addKlassBanner / 시작");
        if (isDebug)
            console.log("klass-detail / addKlassBanner / imgUrlToAdd : ", imgUrlToAdd);
        if (null == imgUrlToAdd || "" == imgUrlToAdd) {
            if (isDebug)
                console.log("klass-detail / addKlassBanner / 중단 / imgUrlToAdd is not valid!");
            return;
        }
        // TODO - banner 이름을 추출합니다.
        var banner = this.klassService.extractKlassBannerFromImgUrl(imgUrlToAdd);
        if (isDebug)
            console.log("klass-detail / addKlassBanner / banner : ", banner);
        // TODO - 가져온 klass 객체의 banner list에서 해당하는 배너 이름이 있는지 확인합니다.
        var classBannerUrlNext = "";
        if (this.klassCopy.hasNotBanner(banner)) {
            // 배너가 있어야 삭제할 수 있습니다.
            this.klassCopy.addBanner(banner);
            if (isDebug)
                console.log("klass-detail / addKlassBanner / this.klassCopy.class_banner_url : ", this.klassCopy.class_banner_url);
            if (isDebug)
                console.log("klass-detail / addKlassBanner / this.klassCopy.class_banner_url_arr : ", this.klassCopy.class_banner_url_arr);
            // 새로 추가된 배너가 포함된 전체 문자열을 만들어 DB에 업데이트합니다.
            classBannerUrlNext = this.klassCopy.class_banner_url;
        }
        if (null == classBannerUrlNext || "" === classBannerUrlNext) {
            if (isDebug)
                console.log("klass-detail / addKlassBanner / 중단 / classBannerUrlNext is not valid!");
            return;
        }
        this.updateKlassBanners(classBannerUrlNext);
    }; // end method
    KlassDetailComponent.prototype.removeKlassBanner = function (imgUrlToDelete) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / removeKlassBanner / 시작");
        if (isDebug)
            console.log("klass-detail / removeKlassBanner / imgUrlToDelete : ", imgUrlToDelete);
        if (null == imgUrlToDelete || "" == imgUrlToDelete) {
            if (isDebug)
                console.log("klass-detail / removeKlassBanner / 중단 / imgUrlToDelete is not valid!");
            return;
        }
        // TODO - banner 이름을 추출합니다.
        var banner = this.klassService.extractKlassBannerFromImgUrl(imgUrlToDelete);
        if (isDebug)
            console.log("klass-detail / removeKlassBanner / banner : ", banner);
        // TODO - 가져온 klass 객체의 banner list에서 해당하는 배너 이름이 있는지 확인합니다.
        var classBannerUrlNext = "";
        if (this.klassCopy.hasBanner(banner)) {
            // 배너가 있어야 삭제할 수 있습니다.
            this.klassCopy.removeBanner(banner);
            if (isDebug)
                console.log("klass-detail / removeKlassBanner / this.klassCopy.class_banner_url : ", this.klassCopy.class_banner_url);
            if (isDebug)
                console.log("klass-detail / removeKlassBanner / this.klassCopy.class_banner_url_arr : ", this.klassCopy.class_banner_url_arr);
            // 삭제된 배너가 빠진 전체 문자열을 만들어 DB에 업데이트합니다.
            // 공백도 가능합니다.
            classBannerUrlNext = this.klassCopy.class_banner_url;
        }
        if (null == classBannerUrlNext) {
            if (isDebug)
                console.log("klass-detail / addKlassBanner / 중단 / classBannerUrlNext is not valid!");
            return;
        } // end if
        this.updateKlassBanners(classBannerUrlNext);
        this.updateSaveBtnStatus();
    }; // end method
    KlassDetailComponent.prototype.updateKlassBanners = function (classBannerUrlNext) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-detail / updateKlassBanners / 시작");
        if (isDebug)
            console.log("klass-detail / updateKlassBanners / classBannerUrlNext : ", classBannerUrlNext);
        if (null == classBannerUrlNext) {
            if (isDebug)
                console.log("klass-detail / updateKlassBanners / 중단 / classBannerUrlNext is not valid!");
            return;
        }
        if (null == this.klassCopy) {
            return;
        }
        this.klassCopy.class_poster_url = classBannerUrlNext;
        this.updateSaveBtnStatus();
        // REMOVE ME
        /*
        this.klassService.updateKlassBanner(
          // apiKey:string,
          this.watchTower.getApiKey(),
          // userId:number,
          +this.loginUser.id,
          // klassId:number,
          +this.klassCopy.id,
          // klassBanners:string
          classBannerUrlNext
        ).then((myResponse:MyResponse) => {
          // 로그 등록 결과를 확인해볼 수 있습니다.
          if(isDebug) console.log("klass-detail / updateKlassBanner / myResponse : ",myResponse);
    
          if(myResponse.isSuccess()) {
    
            // TODO - 가져온 klass 객체의 banner list를 업데이트 해야 합니다.
    
          } else if(myResponse.isFailed() && null != myResponse.error) {
    
            this.watchTower.announceErrorMsgArr([myResponse.error]);
    
          } else {
    
            // 에러 로그 등록
            this.myLoggerService.logError(
              // apiKey:string
              this.watchTower.getApiKey(),
              // errorType:string
              this.myLoggerService.errorAPIFailed,
              // errorMsg:string
              `klass-detail / updateKlassBanner / user_id : ${this.loginUser.id} / klass_id : ${this.klassCopy.id} / banner_url : ${classBannerUrlNext}`
            ); // end logger
    
          } // end if
          
        }); // end service
        */
    }; // end method
    // @ Desc : 수업 저장 항목이 모두 이상이 없는지 확인합니다. 이상이 있다면 해당 컴포넌트에 메시지를 표시합니다.
    KlassDetailComponent.prototype.isNotOKKlass = function () {
        return !this.isOKKlass();
    };
    KlassDetailComponent.prototype.isOKKlass = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / isOKKlass / 시작");
        // 입력 관련 모든 컴포넌트를 가져옴.
        // this.klassCopy의 정보를 검사.
        if (null == this.klassTitleComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTitleComponent is not valid!");
            return false;
        }
        if (this.klassTitleComponent.hasNotDone()) {
            var value = this.klassTitleComponent.getInput();
            var history_1 = this.klassTitleComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTitleComponent.hasNotDone() / " + value);
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTitleComponent.hasNotDone() / history : ", history_1);
            return false;
        }
        if (null == this.klassPriceComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassPriceComponent is not valid!");
            return false;
        }
        if (this.klassPriceComponent.hasNotDone()) {
            var value = this.klassPriceComponent.getInput();
            var history_2 = this.klassPriceComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassPriceComponent.hasNotDone() / " + value);
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassPriceComponent.hasNotDone() / history : ", history_2);
            return false;
        }
        if (null == this.klassTimeBeginComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTimeBeginComponent is not valid!");
            return false;
        }
        if (this.klassTimeBeginComponent.hasNotDone()) {
            var value = this.klassTimeBeginComponent.getInput();
            var history_3 = this.klassTimeBeginComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTimeBeginComponent.hasNotDone() / " + value);
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTimeBeginComponent.hasNotDone() / history : ", history_3);
            return false;
        }
        if (null == this.klassTimeEndComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTimeEndComponent is not valid!");
            return false;
        }
        if (this.klassTimeEndComponent.hasNotDone()) {
            var value = this.klassTimeEndComponent.getInput();
            var history_4 = this.klassTimeEndComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTimeEndComponent.hasNotDone() / " + value);
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassTimeEndComponent.hasNotDone() / history : ", history_4);
            return false;
        }
        if (null == this.klassDateEnrollmentComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassDateEnrollmentComponent is not valid!");
            return false;
        }
        if (this.klassDateEnrollmentComponent.hasNotDone()) {
            var value = this.klassDateEnrollmentComponent.getInput();
            var history_5 = this.klassDateEnrollmentComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassDateEnrollmentComponent.hasNotDone() / " + value);
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassDateEnrollmentComponent.hasNotDone() / history : ", history_5);
            return false;
        }
        if (null == this.klassLevelComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassLevelComponent is not valid!");
            return false;
        }
        if (this.klassLevelComponent.hasNotDone()) {
            var value = this.klassLevelComponent.getInput();
            var history_6 = this.klassLevelComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassLevelComponent.hasNotDone() / " + value);
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassLevelComponent.hasNotDone() / history : ", history_6);
            return false;
        }
        if (null == this.klassSubwayLineComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassSubwayLineComponent is not valid!");
            return false;
        }
        if (this.klassSubwayLineComponent.hasNotDone()) {
            var value = this.klassSubwayLineComponent.getInput();
            var history_7 = this.klassSubwayLineComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassSubwayLineComponent.hasNotDone() / " + value);
            return false;
        }
        if (null == this.klassSubwayStationComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassSubwayStationComponent is not valid!");
            return false;
        }
        if (this.klassSubwayStationComponent.hasNotDone()) {
            var value = this.klassSubwayStationComponent.getInput();
            var history_8 = this.klassSubwayStationComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassSubwayStationComponent.hasNotDone() / " + value);
            return false;
        }
        if (null == this.klassDaysComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassDaysComponent is not valid!");
            return false;
        }
        if (this.klassDaysComponent.hasNotDone()) {
            var value = this.klassDaysComponent.getInput();
            var history_9 = this.klassDaysComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassDaysComponent.hasNotDone() / " + value);
            return false;
        }
        if (null == this.klassWeeksComponent) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassWeeksComponent is not valid!");
            return false;
        }
        if (this.klassWeeksComponent.hasNotDone()) {
            var value = this.klassWeeksComponent.getInput();
            var history_10 = this.klassWeeksComponent.getHistory();
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassWeeksComponent.hasNotDone() / " + value);
            return false;
        } // end if
        if (null == this.klassCopy.klassVenue ||
            null == this.klassCopy.venue_address ||
            "" == this.klassCopy.venue_address) {
            if (isDebug)
                console.log("klass-detail / isOKKlass / \uC911\uB2E8 / this.klassCopy.klassVenue is not valid!");
            alert("지도에서 수업 장소를 확인해주세요.");
            return false;
        }
        if (isDebug)
            console.log("klass-detail / isOKKlass / All is OK");
        return true;
    };
    KlassDetailComponent.prototype.onClickSave = function (event) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / onClickSave / 시작");
        // 1. 변경되었는지 다시 한번 확인합니다.
        var hasChanged = this.klassCopy.isNotSame(this.klass);
        if (!hasChanged) {
            if (isDebug)
                console.log("klass-detail / onClickSave / 중단 / 변경된 사항이 없습니다.");
            return;
        } // end if
        if (this.isNotOKKlass()) {
            if (isDebug)
                console.log("klass-detail / onClickSave / 중단 / this.isNotOKKlass()");
            return;
        } // end if
        if (!this.loginUser.isTeacher()) {
            if (isDebug)
                console.log("klass-detail / onClickSave / 중단 / !this.loginUser.isTeacher()");
            return;
        }
        // 2. DB Update!
        this.klassService.updateKlass(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // teacherId:number,
        this.loginUser.getTeacherId(), 
        // klass:Klass
        this.klassCopy).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-detail / onClickSave / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass")) {
                // 저장 완료! 초기화!
                _this.klass = _this.klassCopy.copy();
                _this.isSaveBtnDisabled = true;
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail / updateKlass / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klassCopy.id); // end logger      
            } // end if
        }); // end service
    }; // end method
    KlassDetailComponent.prototype.updateSaveBtnStatus = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / updateSaveBtnStatus / 시작");
        var hasChanged = this.klassCopy.isNotSame(this.klass);
        if (isDebug)
            console.log("klass-detail / updateSaveBtnStatus / hasChanged : ", hasChanged);
        this.isSaveBtnDisabled = !hasChanged;
    };
    __decorate([
        core_1.ViewChildren(default_component_1.DefaultComponent), 
        __metadata('design:type', core_1.QueryList)
    ], KlassDetailComponent.prototype, "inputComponentList", void 0);
    __decorate([
        core_1.ViewChild(image_grid_v2_component_1.ImageGridV2Component), 
        __metadata('design:type', image_grid_v2_component_1.ImageGridV2Component)
    ], KlassDetailComponent.prototype, "bannerComponent", void 0);
    __decorate([
        core_1.ViewChild(image_grid_component_1.ImageGridComponent), 
        __metadata('design:type', image_grid_component_1.ImageGridComponent)
    ], KlassDetailComponent.prototype, "selectTileViewComponent", void 0);
    __decorate([
        core_1.ViewChild(hidden_uploader_component_1.HiddenUploaderComponent), 
        __metadata('design:type', hidden_uploader_component_1.HiddenUploaderComponent)
    ], KlassDetailComponent.prototype, "hiddenUploaderComponent", void 0);
    __decorate([
        core_1.ViewChild(pricetag_h_component_1.PriceTagHComponent), 
        __metadata('design:type', pricetag_h_component_1.PriceTagHComponent)
    ], KlassDetailComponent.prototype, "priceTagHComponent", void 0);
    __decorate([
        core_1.ViewChild(clock_board_component_1.ClockBoardComponent), 
        __metadata('design:type', clock_board_component_1.ClockBoardComponent)
    ], KlassDetailComponent.prototype, "clockBoardComponent", void 0);
    __decorate([
        core_1.ViewChild(butterfly_component_1.ButterflyComponent), 
        __metadata('design:type', butterfly_component_1.ButterflyComponent)
    ], KlassDetailComponent.prototype, "butterflyComponent", void 0);
    __decorate([
        core_1.ViewChild(klass_detail_nav_list_component_1.KlassDetailNavListComponent), 
        __metadata('design:type', klass_detail_nav_list_component_1.KlassDetailNavListComponent)
    ], KlassDetailComponent.prototype, "klassDetailNavListComponent", void 0);
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, klass_service_1.KlassService, image_service_1.ImageService, dialog_service_1.DialogService, auth_service_1.AuthService, my_logger_service_1.MyLoggerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, klass_radiobtn_service_1.KlassRadioBtnService, klass_checkbox_service_1.KlassCheckBoxService, teacher_service_1.TeacherService, default_service_1.DefaultService, my_checker_service_1.MyCheckerService])
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent; // end class
//# sourceMappingURL=klass-detail.component.js.map