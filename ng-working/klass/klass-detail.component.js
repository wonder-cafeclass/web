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
var auth_service_1 = require('../auth.service');
var klass_radiobtn_service_1 = require('./service/klass-radiobtn.service');
var klass_checkbox_service_1 = require('./service/klass-checkbox.service');
var klass_service_1 = require('./service/klass.service');
var input_view_updown_1 = require('../widget/input-view/model/input-view-updown');
var dialog_service_1 = require('../widget/dialog.service');
var image_grid_component_1 = require('../widget/image-grid/image-grid.component');
var hidden_uploader_component_1 = require('../widget/input/img-uploader/hidden-uploader.component');
var image_service_1 = require('../util/image.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var KlassDetailComponent = (function () {
    //
    function KlassDetailComponent(route, router, klassService, imageService, dialogService, authService, myLoggerService, myEventService, watchTower, radiobtnService, checkboxService, myCheckerService) {
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
        this.myCheckerService = myCheckerService;
        this.priceTagCurrency = "₩";
        this.priceTagColor = "#e85c41";
        this.priceTagWidth = 105;
        this.priceTagCageWidth = 105;
        this.pricePerWeekFormat = "주";
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
    }
    KlassDetailComponent.prototype.ngOnInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / ngOnInit / 시작");
    }; // end method
    KlassDetailComponent.prototype.ngAfterViewInit = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / ngAfterViewInit / 시작");
        if (isDebug)
            console.log("klass-detail / ngAfterViewInit / this.imageGridComponent : ", this.imageGridComponent);
        this.watchTower.announceIsLockedBottomFooterFlexible(false);
        this.init();
    };
    KlassDetailComponent.prototype.ngAfterViewChecked = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / ngAfterViewChecked / 시작");
    };
    KlassDetailComponent.prototype.ngOnChanges = function (changes) {
        // changes.prop contains the old and the new value...
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / ngOnChanges / 시작");
        if (isDebug)
            console.log("klass-detail / ngOnChanges / changes : ", changes);
    };
    KlassDetailComponent.prototype.init = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / init / 시작");
        // 1. 로그인 정보를 가져온다
        this.loginUser = this.watchTower.getLoginUser();
        if (null != this.loginUser) {
            this.isAdmin = this.loginUser.getIsAdmin();
            this.loginTeacher = this.watchTower.getLoginTeacher();
            this.isTeacher = this.loginUser.isTeacher();
        }
        if (isDebug)
            console.log("klass-detail / init / loginUser : ", this.loginUser);
        if (isDebug)
            console.log("klass-detail / init / this.isAdmin : ", this.isAdmin);
        if (isDebug)
            console.log("klass-detail / init / loginTeacher : ", this.loginTeacher);
        if (isDebug)
            console.log("klass-detail / init / imageGridComponent : ", this.imageGridComponent);
        this.route.params
            .switchMap(function (params) {
            var klassId = +params['id'];
            if (klassId === -100 && null == _this.loginTeacher) {
                // 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.
                if (isDebug)
                    console.log("klass-detail / init / 1-1. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.");
                _this.router.navigate(["/"]);
                return;
            }
            else if (klassId === -100) {
                // 1-2. 선생님만이, 빈 수업 화면을 볼수 있습니다.
                if (isDebug)
                    console.log("klass-detail / init / 1-2. 선생님입니다. 새로운 수업을 하나 만듭니다.");
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
                console.log("klass-detail / init / 기존 수업 가져오기 / klassId : ", klassId);
            return _this.klassService.getKlass(klassId);
        })
            .subscribe(function (myResponse) {
            if (isDebug)
                console.log("klass-detail / init / subscribe / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
                var klassJSON = myResponse.getDataProp("klass");
                if (isDebug)
                    console.log("klass-detail / init / subscribe / klassJSON : ", klassJSON);
                if (null != klassJSON) {
                    _this.klass = _this.klassService.getKlassFromJSON(klassJSON);
                    if (isDebug)
                        console.log("klass-detail / init / subscribe / this.imageGridComponent : ", _this.imageGridComponent);
                    // fill datas
                    _this.imgUploaderImageUrlKlassPoster = _this.klass.class_poster_url_loadable;
                    _this.onAfterReceivingKlass();
                    if (null != _this.imageGridComponent) {
                        _this.imageGridComponent.addImageListSingleColumn(_this.klass.class_banner_url_arr);
                    }
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
                "klass-detail / ngOnInit / Failed!");
            } // end if
            if (isDebug)
                console.log("klass-detail / init / subscribe / this.klass : ", _this.klass);
        }); // end route
        this.setKlassBannerImageUploader();
        this.setKlassPosterImageUploader();
    };
    KlassDetailComponent.prototype.onAfterReceivingKlass = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / onAfterReceivingKlass / 시작");
        if (isDebug)
            console.log("klass-detail / onAfterReceivingKlass / this.imageGridComponent : ", this.imageGridComponent);
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
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / setEmptyKlass / 시작");
        // 새로운 수업을 만들때, 빈 수업 데이터를 만들어 가져옵니다.
    };
    KlassDetailComponent.prototype.setFirstClassDateFormat = function () {
        this.firstClassDate = this.getFirstClassDate(this.klass);
        if (this.firstClassDate) {
            this.firstClassDateFormatStr = this.firstClassDate.month + "\uC6D4 " + this.firstClassDate.date + "\uC77C " + this.firstClassDate.dayKor + "\uC694\uC77C";
        }
    };
    KlassDetailComponent.prototype.getFirstClassDate = function (klass) {
        var calendar_table_monthly = klass.calendar_table_monthly;
        for (var i = 0; i < calendar_table_monthly.length; ++i) {
            var calendar_table = calendar_table_monthly[i];
            // console.log("calendar_table : ",calendar_table);
            for (var j = 0; j < calendar_table.length; ++j) {
                var week = calendar_table[j];
                // console.log("week : ",week);
                for (var k = 0; k < week.length; ++k) {
                    var date = week[k];
                    // console.log("date : ",date);
                    if (null === date) {
                        continue;
                    }
                    if (date.isExpired) {
                        continue;
                    }
                    if (!date.hasKlass) {
                        continue;
                    }
                    if (4 == +klass.enrollment_interval_week && !date.isEnrollment4weeks) {
                        continue;
                    }
                    else if (2 == +klass.enrollment_interval_week && !date.isEnrollment2weeks) {
                        continue;
                    }
                    else if (1 == +klass.enrollment_interval_week && !date.isEnrollmentWeek) {
                        continue;
                    }
                    // 첫 수업을 찾았습니다.
                    return date;
                }
            }
        }
        return null;
    };
    KlassDetailComponent.prototype.initAdmin = function () {
        this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
        this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
        // 수강단위 기간 - (4주/8주/12주)
        this.radiobtnOptionListCourseDuration =
            this.radiobtnService.getKlassEnrolmentWeeks(this.klass);
        // 수강신청 가능 기간
        var optionList = this.radiobtnService.getKlassEnrolmentInterval(this.klass, "" + this.klass.enrollment_interval_week);
        this.radiobtnOptionListEnrollment = optionList;
        var fontSizeTitle = 16;
        var fontSizeText = 12;
        var color = "#f0f";
        this.klassTitleUpdown =
            new input_view_updown_1.InputViewUpdown(
            // public title:string
            "강의 제목", 
            // public fontSizeTitle:number
            fontSizeTitle, 
            // public fontSizeText:number
            fontSizeText, 
            // public type:string
            "title", 
            // public color:string
            color, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_TITLE, 
            // public value:string
            this.klass.title, 
            // public metaObj:any
            this.klass, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker()));
        this.klassDescUpdown =
            new input_view_updown_1.InputViewUpdown(
            // public title:string
            "강의 설명", 
            // public fontSizeTitle:number
            fontSizeTitle, 
            // public fontSizeText:number
            fontSizeText, 
            // public type:string
            "title", 
            // public color:string
            color, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_DESC, 
            // public value:string
            this.klass.desc, 
            // public metaObj:any
            this.klass, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker()));
        // 수업 시작 시간  
        this.klassTimeBeginUpdown =
            new input_view_updown_1.InputViewUpdown(
            // public title:string
            "수업 시작 시간", 
            // public fontSizeTitle:number
            fontSizeTitle, 
            // public fontSizeText:number
            fontSizeText, 
            // public type:string
            "price", 
            // public color:string
            color, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_TIME_BEGIN, 
            // public value:string
            this.klass.time_begin, 
            // public metaObj:any
            this.klass, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker()));
        //   
        this.klassTimeEndUpdown =
            new input_view_updown_1.InputViewUpdown(
            // public title:string
            "수업 종료 시간", 
            // public fontSizeTitle:number
            fontSizeTitle, 
            // public fontSizeText:number
            fontSizeText, 
            // public type:string
            "price", 
            // public color:string
            color, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_TIME_END, 
            // public value:string
            this.klass.time_end, 
            // public metaObj:any
            this.klass, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker()));
        // 수강 금액
        this.klassPriceUpdown =
            new input_view_updown_1.InputViewUpdown(
            // public title:string
            "수강 금액", 
            // public fontSizeTitle:number
            fontSizeTitle, 
            // public fontSizeText:number
            fontSizeText, 
            // public type:string
            "price", 
            // public color:string
            color, 
            // public myEvent:MyEvent
            this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_WEEK_MAX, 
            // public value:string
            "" + this.klass.price, 
            // public metaObj:any
            this.klass, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker()));
        // 운영자 지정 - 수업 요일 
        // days_list
        this.checkboxOptionListKlassDay = this.checkboxService.getKlassDays(this.klass);
    };
    KlassDetailComponent.prototype.cancel = function () {
        this.gotoKlassList();
    };
    KlassDetailComponent.prototype.save = function () {
        this.klass.title = this.editTitle;
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
        var klassId = this.klass ? this.klass.id : null;
        console.log("gotoKlassList / klassId : ", klassId);
        // Pass along the klass id if available
        // so that the KlassListComponent can select that klass.
        // Add a totally useless `foo` parameter for kicks.
        // Relative navigation back to the crises
        // this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
    };
    // EVENT
    KlassDetailComponent.prototype.onClickKlassPoster = function (event) {
        var isDebug = true;
        // let isDebug:boolean = false;
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
    KlassDetailComponent.prototype.onChangedFromMiniCalendar = function (myEvent) {
        var eventName = myEvent.eventName;
        var myEventService = this.myEventService;
        /*
        if(this.myEventService.is_it(eventName,myEventService.ON_MOUSEENTER_KLASS_CALENDAR_DATE)) {
          console.log("ON_MOUSEENTER_KLASS_CALENDAR_DATE / myEvent : ",myEvent);
        } else if(this.myEventService.is_it(eventName,myEventService.ON_MOUSELEAVE_KLASS_CALENDAR_DATE)) {
          console.log("ON_MOUSELEAVE_KLASS_CALENDAR_DATE / myEvent : ",myEvent);
        }
        */
    };
    // @ Deprecated
    KlassDetailComponent.prototype.onChangedFromInputView = function (myEvent) {
        var eventName = myEvent.eventName;
        var myEventService = this.myEventService;
        /*
        if(this.myEventService.is_it(eventName,myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
          // '수강신청일'이 변경되었습니다.
          console.log("'수강신청일'이 변경되었습니다.");
        } // end if
        */
    };
    KlassDetailComponent.prototype.deleteBannerImg = function (imgUrlToDelete) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / deleteBannerImg / 시작");
        if (isDebug)
            console.log("klass-detail / deleteBannerImg / imgUrlToDelete : ", imgUrlToDelete);
        if (null == imgUrlToDelete || "" == imgUrlToDelete) {
            if (isDebug)
                console.log("klass-detail / deleteBannerImg / 중단 / imgUrlToDelete is not valid!");
            return;
        }
        this.klassService.removeKlassBanner(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // klassBanner:string
        imgUrlToDelete).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-detail / deleteBannerImg / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
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
                "klass-detail / deleteBannerImg / removeKlassBanner / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / banner_url : " + imgUrlToDelete); // end logger      
            } // end if
        });
    };
    KlassDetailComponent.prototype.onChangedFromChild = function (myEvent) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / 시작");
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / myEvent : ", myEvent);
        var eventName = myEvent.eventName;
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_IMAGE_GRID)) {
                if (isDebug)
                    console.log("klass-detail / onChangedFromChild / ON_READY / KEY_IMAGE_GRID");
                if (null != myEvent.metaObj &&
                    null != this.klass &&
                    null != this.klass.class_banner_url_arr &&
                    (0 < this.klass.class_banner_url_arr.length)) {
                    if (isDebug)
                        console.log("klass-detail / onChangedFromChild / KEY_IMAGE_GRID");
                    this.imageGridComponent = myEvent.metaObj;
                    this.imageGridComponent.addImageListSingleColumn(this.klass.class_banner_url_arr);
                    // 이미지가 추가되므로 높이가 변경되는 것을 전파!
                    this.watchTower.announceContentHeight();
                } // end if
            } // end if
            // Ready는 여기서 중단.
            return;
        }
        else if (myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_IMAGE_GRID)) {
                var imgUrlToDelete = this.klassService.extractKlassBannerFromImgUrl(myEvent.value);
                if (isDebug)
                    console.log("klass-detail / onChangedFromChild / ON_REMOVE_ROW / KEY_IMAGE_GRID");
                if (null != imgUrlToDelete && "" != imgUrlToDelete) {
                    this.deleteBannerImg(imgUrlToDelete);
                }
            } // end if
            // Ready는 여기서 중단.
            return;
        } // end if
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("klass-detail / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
        }
        else if (myEvent.hasEventName(this.myEventService.ON_DONE)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_POSTER)) {
                // let posterUrl:string = `${this.imgUploaderImagePathKlassPoster}/${myEvent.value}`;
                // this.imgUploaderImageUrlKlassPoster = posterUrl;
                // if(isDebug) console.log("klass-detail / onChangedFromChild / ON_DONE / KEY_KLASS_POSTER PosterUrl : ",posterUrl);
                // DB Update!
                this.addKlassPoster(myEvent.value);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {
                // 섬네일 주소가 넘어옴.
                var banner_url_1 = this.imgUploaderImagePath + "/" + myEvent.value;
                // 이미지를 추가합니다. 
                if (isDebug)
                    console.log("klass-detail / onChangedFromChild / this.imageGridComponent : ", this.imageGridComponent);
                this.imageGridComponent.addImageSingleColumn(banner_url_1);
                // Footer의 속성을 fixed-bottom을 해제해야 함.
                this.watchTower.announceContentHeight();
                if (isDebug)
                    console.log("klass-detail / onChangedFromChild / banner_url : ", banner_url_1);
                // TODO - class banner를 등록합니다.
                this.klassService.addKlassBanner(
                // apiKey:string, 
                this.watchTower.getApiKey(), 
                // userId:number,
                +this.loginUser.id, 
                // klassId:number,
                +this.klass.id, 
                // klassBanner:string
                myEvent.value).then(function (myResponse) {
                    // 로그 등록 결과를 확인해볼 수 있습니다.
                    if (isDebug)
                        console.log("klass-detail / onChangedFromChild / myResponse : ", myResponse);
                    if (myResponse.isSuccess()) {
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
                        "klass-detail / onChangedFromChild / addKlassBanner / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / banner_url : " + banner_url_1); // end logger      
                    } // end if
                }); // end service
            } // end if
        } // end if
    }; // end method
    KlassDetailComponent.prototype.addKlassPoster = function (posterUrl) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / addKlassPoster / 시작");
        this.klassService.addKlassPoster(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // klassPoster:string
        posterUrl).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-detail / addKlassPoster / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass_poster")) {
                var klassPosterUrl = myResponse.getDataProp("klass_poster");
                if (null != klassPosterUrl && "" != klassPosterUrl) {
                    klassPosterUrl = _this.imgUploaderImagePathKlassPoster + "/" + klassPosterUrl;
                    _this.imgUploaderImageUrlKlassPoster = klassPosterUrl;
                }
                if (isDebug)
                    console.log("klass-detail / addKlassPoster / klassPosterUrl : ", klassPosterUrl);
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
                "klass-detail / addKlassPoster / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / posterUrl : " + posterUrl); // end logger      
            } // end if
        }); // end service    
    };
    // Admin Section
    KlassDetailComponent.prototype.showSEKlassFeature = function () {
    };
    __decorate([
        core_1.ViewChild(image_grid_component_1.ImageGridComponent), 
        __metadata('design:type', image_grid_component_1.ImageGridComponent)
    ], KlassDetailComponent.prototype, "imageGridComponent", void 0);
    __decorate([
        core_1.ViewChild(hidden_uploader_component_1.HiddenUploaderComponent), 
        __metadata('design:type', hidden_uploader_component_1.HiddenUploaderComponent)
    ], KlassDetailComponent.prototype, "hiddenUploaderComponent", void 0);
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, klass_service_1.KlassService, image_service_1.ImageService, dialog_service_1.DialogService, auth_service_1.AuthService, my_logger_service_1.MyLoggerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, klass_radiobtn_service_1.KlassRadioBtnService, klass_checkbox_service_1.KlassCheckBoxService, my_checker_service_1.MyCheckerService])
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent;
//# sourceMappingURL=klass-detail.component.js.map