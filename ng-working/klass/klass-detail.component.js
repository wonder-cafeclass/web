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
var image_service_1 = require('../util/image.service');
var my_event_service_1 = require('../util/my-event.service');
var my_event_1 = require('../util/model/my-event');
var dialog_service_1 = require('../widget/dialog.service');
var auth_service_1 = require('../auth.service');
var klass_checkbox_service_1 = require('./service/klass-checkbox.service');
var input_view_updown_1 = require('../widget/input-view/model/input-view-updown');
var KlassDetailComponent = (function () {
    function KlassDetailComponent(route, router, imageService, dialogService, authService, myEventService, checkboxService) {
        this.route = route;
        this.router = router;
        this.imageService = imageService;
        this.dialogService = dialogService;
        this.authService = authService;
        this.myEventService = myEventService;
        this.checkboxService = checkboxService;
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
        this.isAdmin = false;
    }
    KlassDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.forEach(function (data) {
            if (null != data.klass) {
                _this.klass = data.klass;
            }
            _this.klassCalendarTableLinear = _this.klass.calendar_table_linear;
            _this.klassCalendarTableMonthly = _this.klass.calendar_table_monthly;
            _this.klassDayBegin = _this.klass.days;
            // send time data to "clock board"
            _this.klassTimeBegin = _this.klass.time_begin;
            _this.klassTimeEnd = _this.klass.time_end;
            _this.klassDateBegin = _this.klass.date_begin;
            _this.klassWeekMin = _this.klass.week_min;
            _this.klassWeekMax = _this.klass.week_max;
            _this.priceTagCageWidth = _this.klass.weekly_price_list.length * _this.priceTagWidth;
            // send image table to "image-grid"
            _this.selectileImageTable =
                [
                    [
                        _this.klass.level_img_url,
                        _this.klass.venue_subway_station_img_url,
                        _this.klass.venue_cafe_logo_img_url,
                        _this.klass.days_img_url,
                        _this.klass.time_begin_img_url,
                    ]
                ];
            var fieldCntSelectile = _this.selectileImageTable[0].length;
            _this.selectileCageWidth = (fieldCntSelectile * _this.selectileImageWidth) + 20;
            // wonder.jung
            var fieldCntCalMonthly = _this.klassCalendarTableMonthly.length;
            _this.miniCalCageWidth = (fieldCntCalMonthly * _this.miniCalWidth);
            _this.bannerImageTable =
                [
                    [
                        _this.imageService.get(_this.imageService.noticeDrinksUrl)
                    ],
                    [
                        _this.imageService.get(_this.imageService.noticeHelpUrl)
                    ]
                ];
            _this.pricePerWeekFormat = _this.klass.week_min + _this.pricePerWeekFormat;
            // 유저 수강 기간
            _this.checkboxOptionListCourseDuration =
                _this.checkboxService.getKlassEnrolmentWeeks(_this.klass, 0);
        });
        this.authService.getAdminAuth().then(function (result) {
            if (null != result.is_admin) {
                _this.isAdmin = result.is_admin;
                // 운영툴 여부 결정 
                if (_this.isAdmin) {
                    _this.initAdmin();
                }
            }
        });
    };
    KlassDetailComponent.prototype.initAdmin = function () {
        this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
        // 수강신청 가능 기간
        var optionList = this.checkboxService.getKlassEnrolmentInterval(this.klass, "" + this.klass.enrollment_interval_week);
        this.checkboxOptionListEnrollment = optionList;
        // 가장 짧은 수강 기간
        optionList = this.checkboxService.getKlassWeeksMin(this.klass, "" + this.klass.week_min);
        this.checkboxOptionListCourseDurationMin = optionList;
        // 가장 긴 수강 기간
        optionList = this.checkboxService.getKlassWeeksMax(this.klass, "" + this.klass.week_max);
        this.checkboxOptionListCourseDurationMax = optionList;
        var updownList = [];
        for (var i = 0; i < this.klass.klass_price_list.length; ++i) {
            var klassPrice = this.klass.klass_price_list[i];
            var updown = new input_view_updown_1.InputViewUpdown(
            // public myEvent:MyEvent
            new my_event_1.MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS, 
            // public title:string
            klassPrice.weeks + "주", 
            // public key:string
            "week_max", 
            // public value:string
            "4", 
            // public metaObj:any
            this.klass), 
            // public fontSizeTitle:number
            12, 
            // public fontSizeText:number
            12, 
            // public type:string
            "price", 
            // public color:string
            "#f0f");
            updownList.push(updown);
        }
        this.klassPriceList = updownList;
    };
    KlassDetailComponent.prototype.cancel = function () {
        this.gotoKlassList();
    };
    KlassDetailComponent.prototype.save = function () {
        this.klass.title = this.editTitle;
        this.gotoKlassList();
    };
    KlassDetailComponent.prototype.canDeactivate = function () {
        // Allow synchronous navigation (`true`) if no klass or the klass is unchanged
        if (!this.klass || this.klass.title === this.editTitle) {
            return true;
        }
        // Otherwise ask the user with the dialog service and return its
        // promise which resolves to true or false when the user decides
        return this.dialogService.confirm('Discard changes?');
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
    KlassDetailComponent.prototype.onChangedFromInputView = function (myEvent) {
        var eventName = myEvent.eventName;
        var myEventService = this.myEventService;
        if (this.myEventService.is_it(eventName, myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
            // '수강신청일'이 변경되었습니다.
            // 1. 표시된 달력의 수강시작일 표시가 변경된 데이터에 맞게 표시되어야 합니다.
            var interval = +myEvent.value;
            var cloneTableGroup = this.klassCalendarTableMonthly;
            for (var i = 0; i < cloneTableGroup.length; ++i) {
                // 한달의 4개 이상의 수업이 있어야 4주마다 참여할 수 있음.
                // 한달의 2개 이상의 수업이 있어야 2주마다 참여할 수 있음.
                var table = cloneTableGroup[i];
                var isFirstClass = false;
                for (var j = 0; j < table.length; ++j) {
                    var row = table[j];
                    for (var k = 0; k < row.length; ++k) {
                        var field = row[k];
                        if (null == field) {
                            continue;
                        }
                        if (!field.hasKlass) {
                            // 수업이 없는 날은 제외
                            continue;
                        }
                        if (field.isExpired) {
                            // 지난 날은 제외
                            continue;
                        }
                        // 수업 시작은 모두 아닌 것으로 초기화.
                        field.isEnrollment = false;
                        // 매주 수강이 가능한 경우의 날짜들만 필터링.
                        if (4 === interval && field.isEnrollment4weeks) {
                            // 4주마다 새로 강의 참여가 가능.
                            // 매월 첫번째 강의 날에만 참여할 수 있음.
                            field.isEnrollment = true;
                        }
                        else if (2 === interval && field.isEnrollment2weeks) {
                            // 2주마다 새로 강의 참여가 가능.
                            // 매월 첫번째,세번째 강의 날에만 참여할 수 있음.
                            field.isEnrollment = true;
                        }
                        else if (1 === interval && field.isEnrollmentWeek) {
                            // 매주마다 새로 강의 참여가 가능.
                            // 모든 주에 신청이 가능.
                            field.isEnrollment = true;
                        } // end if
                    } // end for
                } // end for
            } // end for
        }
    };
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, image_service_1.ImageService, dialog_service_1.DialogService, auth_service_1.AuthService, my_event_service_1.MyEventService, klass_checkbox_service_1.KlassCheckboxService])
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent;
//# sourceMappingURL=klass-detail.component.js.map