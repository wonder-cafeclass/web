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
var image_service_1 = require('../util/image.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var KlassDetailComponent = (function () {
    function KlassDetailComponent(route, router, klassService, imageService, dialogService, authService, myEventService, watchTower, radiobtnService, checkboxService, myCheckerService) {
        this.route = route;
        this.router = router;
        this.klassService = klassService;
        this.imageService = imageService;
        this.dialogService = dialogService;
        this.authService = authService;
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
        this.isAdmin = false;
        this.isTeacher = false;
    }
    KlassDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / ngOnInit / 시작");
        // 1. 로그인 정보를 가져온다
        var loginUser = this.watchTower.getLoginUser();
        this.isAdmin = loginUser.getIsAdmin();
        var loginTeacher = this.watchTower.getLoginTeacher();
        if (isDebug)
            console.log("klass-detail / ngOnInit / loginUser : ", loginUser);
        if (isDebug)
            console.log("klass-detail / ngOnInit / this.isAdmin : ", this.isAdmin);
        if (isDebug)
            console.log("klass-detail / ngOnInit / loginTeacher : ", loginTeacher);
        // 1-1. 선생님만이, 빈 수업 화면을 볼수 있습니다.
        if (null == loginTeacher) {
            if (isDebug)
                console.log("klass-detail / ngOnInit / 1-2. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.");
            this.router.navigate(["/"]);
        }
        // 1-2. 일반 유저라면 빈 수업 화면으로 접근시, 홈으로 돌려보냅니다.
        this.route.params
            .switchMap(function (params) {
            var klassId = +params['id'];
            if (isDebug)
                console.log("klass-detail / ngOnInit / klassId : ", klassId);
            if (klassId < 0 && klassId == -100 && null != loginTeacher) {
                // 새로운 수업 가져오기
                return _this.klassService.getKlassNew(+loginTeacher.id);
            }
            // 기존 수업 가져오기
            return _this.klassService.getKlass(klassId);
        })
            .subscribe(function (myResponse) {
            if (isDebug)
                console.log("klass-detail / ngOnInit / subscribe / myResponse : ", myResponse);
            var klassJSON = myResponse.getDataProp("klass");
            if (isDebug)
                console.log("klass-detail / ngOnInit / subscribe / klassJSON : ", klassJSON);
            if (myResponse.isSuccess() && null != klassJSON) {
                _this.klass = _this.klassService.getKlassFromJSON(klassJSON);
            }
            if (isDebug)
                console.log("klass-detail / ngOnInit / subscribe / this.klass : ", _this.klass);
        }); // end route
        this.setKlassBannerImageUploader();
    }; // end method
    KlassDetailComponent.prototype.ngOnChanges = function (changes) {
        // changes.prop contains the old and the new value...
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / ngOnChanges / 시작");
        if (isDebug)
            console.log("klass-detail / ngOnChanges / changes : ", changes);
    };
    KlassDetailComponent.prototype.setKlassBannerImageUploader = function () {
        // Set image uploader props
        this.imgUploaderUploadAPIUrl = "/CI/index.php/api/upload/image";
        this.imgUploaderImagePath = "/assets/images/class/banner";
        this.imgUploaderImageUrl = "/assets/images/class/banner/banner_default.svg";
        this.imgUploaderEventKey = this.myEventService.KEY_KLASS_BANNER;
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
    KlassDetailComponent.prototype.onChangedFromChild = function (myEvent) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / 시작");
        if (isDebug)
            console.log("klass-detail / onChangedFromChild / myEvent : ", myEvent);
        var eventName = myEvent.eventName;
        var isOK = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
        if (!isOK) {
            if (isDebug)
                console.log("klass-detail / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_BANNER)) {
                // 섬네일 주소가 넘어옴.
                var thumbnail_url = this.imgUploaderImagePath + "/" + myEvent.value;
                // 이미지를 추가합니다. 
                if (null == this.bannerImageTable || 0 == this.bannerImageTable.length) {
                    this.bannerImageTable = [[thumbnail_url]];
                }
                else {
                    this.bannerImageTable[0].push(thumbnail_url);
                } // end if
                // Footer의 속성을 fixed-bottom을 해제해야 함.
                this.watchTower.announceContentHeight();
                if (isDebug)
                    console.log("klass-detail / onChangedFromChild / thumbnail_url : ", thumbnail_url);
            } // end if
        } // end if
    }; // end method
    // Admin Section
    KlassDetailComponent.prototype.showSEKlassFeature = function () {
    };
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, klass_service_1.KlassService, image_service_1.ImageService, dialog_service_1.DialogService, auth_service_1.AuthService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService, klass_radiobtn_service_1.KlassRadioBtnService, klass_checkbox_service_1.KlassCheckBoxService, my_checker_service_1.MyCheckerService])
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent;
//# sourceMappingURL=klass-detail.component.js.map