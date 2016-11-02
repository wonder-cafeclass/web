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
var klass_radiobtn_service_1 = require('./service/klass-radiobtn.service');
var klass_checkbox_service_1 = require('./service/klass-checkbox.service');
var input_view_updown_1 = require('../widget/input-view/model/input-view-updown');
var KlassDetailComponent = (function () {
    function KlassDetailComponent(route, router, imageService, dialogService, authService, myEventService, radiobtnService, checkboxService) {
        this.route = route;
        this.router = router;
        this.imageService = imageService;
        this.dialogService = dialogService;
        this.authService = authService;
        this.myEventService = myEventService;
        this.radiobtnService = radiobtnService;
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
            _this.radiobtnOptionListCourseDuration =
                _this.radiobtnService.getKlassEnrolmentWeeks(_this.klass, 0);
            // 첫수업 날짜 가져오기
            _this.setFirstClassDateFormat();
            // REMOVE ME
            /*
            this.firstClassDate = this.getFirstClassDate(this.klass);
            if(this.firstClassDate) {
              this.firstClassDateFormatStr = `${this.firstClassDate.month}월 ${this.firstClassDate.date}일 ${this.firstClassDate.dayKor}요일`;
            }
            */
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
    KlassDetailComponent.prototype.setFirstClassDateFormat = function () {
        this.firstClassDate = this.getFirstClassDate(this.klass);
        console.log("HERE / setFirstClassDateFormat / this.firstClassDate : ", this.firstClassDate);
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
        // 수강신청 가능 기간
        var optionList = this.radiobtnService.getKlassEnrolmentInterval(this.klass, "" + this.klass.enrollment_interval_week);
        this.radiobtnOptionListEnrollment = optionList;
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
            "" + klassPrice.discount, 
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
        // 운영자 지정 - 수업 요일 
        // days_list
        // wonder.jung
        this.checkboxOptionListKlassDay = this.checkboxService.getKlassDays(this.klass);
        console.log("TEST / this.checkboxOptionListKlassDay : ", this.checkboxOptionListKlassDay);
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
    KlassDetailComponent.prototype.onChangedFromMiniCalendar = function (myEvent) {
        var eventName = myEvent.eventName;
        var myEventService = this.myEventService;
        if (this.myEventService.is_it(eventName, myEventService.ON_MOUSEENTER_KLASS_CALENDAR_DATE)) {
            console.log("ON_MOUSEENTER_KLASS_CALENDAR_DATE / myEvent : ", myEvent);
        }
        else if (this.myEventService.is_it(eventName, myEventService.ON_MOUSELEAVE_KLASS_CALENDAR_DATE)) {
            console.log("ON_MOUSELEAVE_KLASS_CALENDAR_DATE / myEvent : ", myEvent);
        }
    };
    // @ Deprecated
    KlassDetailComponent.prototype.onChangedFromInputView = function (myEvent) {
        var eventName = myEvent.eventName;
        var myEventService = this.myEventService;
        if (this.myEventService.is_it(eventName, myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
            // '수강신청일'이 변경되었습니다.
            console.log("'수강신청일'이 변경되었습니다.");
        } // end if
    };
    KlassDetailComponent.prototype.onChangedFromChild = function (myEvent) {
        var eventName = myEvent.eventName;
        var myEventService = this.myEventService;
        if (this.myEventService.is_it(eventName, myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
            // '수강신청일'이 변경되었습니다.
            // console.log("onChangedFromChild / eventName : ",eventName);
            // console.log("onChangedFromChild / myEvent.value : ",myEvent.value);
            var weekInterval = +myEvent.value;
            // 첫수업날짜가 변경됩니다.
            if (4 === weekInterval) {
                this.klass.enrollment_interval_week = 4;
                this.setFirstClassDateFormat();
                console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 4주");
            }
            else if (2 === weekInterval) {
                this.klass.enrollment_interval_week = 2;
                this.setFirstClassDateFormat();
                console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 2주");
            }
            else if (1 === weekInterval) {
                this.klass.enrollment_interval_week = 1;
                this.setFirstClassDateFormat();
                console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 매주");
            }
        } // end if
    };
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, image_service_1.ImageService, dialog_service_1.DialogService, auth_service_1.AuthService, my_event_service_1.MyEventService, klass_radiobtn_service_1.KlassRadioBtnService, klass_checkbox_service_1.KlassCheckBoxService])
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent;
//# sourceMappingURL=klass-detail.component.js.map