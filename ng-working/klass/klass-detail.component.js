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
var my_checker_service_1 = require('../util/service/my-checker.service');
var dialog_service_1 = require('../widget/dialog.service');
var auth_service_1 = require('../auth.service');
var klass_radiobtn_service_1 = require('./service/klass-radiobtn.service');
var klass_checkbox_service_1 = require('./service/klass-checkbox.service');
var input_view_updown_1 = require('../widget/input-view/model/input-view-updown');
var KlassDetailComponent = (function () {
    function KlassDetailComponent(route, router, imageService, dialogService, authService, myEventService, radiobtnService, checkboxService, myCheckerService) {
        this.route = route;
        this.router = router;
        this.imageService = imageService;
        this.dialogService = dialogService;
        this.authService = authService;
        this.myEventService = myEventService;
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
            _this.pricePerWeekFormat = _this.klass.week_min + "\uC8FC";
            _this.pricetagDesc = "( \uC8FC " + _this.klass.days_list.length + "\uD68C )";
            // 첫수업 날짜 가져오기
            _this.setFirstClassDateFormat();
            // nav-tabs : 수업 관련 내용
            // wonder.jung
            _this.radiobtnOptionListNavTabs =
                _this.radiobtnService.getNavTabsKlassInfo(_this.klass, _this.myEventService.KLASS_DESC);
            // this.radiobtnService.getNavTabsKlassInfo(this.klass, "klass_venue");
            console.log("klass-detail / this.radiobtnOptionListNavTabs : ", _this.radiobtnOptionListNavTabs);
            _this.klassFeature = _this.klass.feature; // @ Deprecated
            _this.klassTarget = _this.klass.target; // @ Deprecated
            _this.klassSchedule = _this.klass.schedule;
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
        console.log("TEST / XXX / onChangedFromChild / myEvent : ", myEvent);
        var eventName = myEvent.eventName;
        var myEventService = this.myEventService;
        // console.log("onChangedFromChild / eventName : ",eventName);
        // console.log("onChangedFromChild / myEvent.value : ",myEvent.value);
        // console.log("onChangedFromChild / myEvent.valueNext : ",myEvent.valueNext);
        /*
        if(this.myEventService.is_it(eventName,myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
    
          // '수강신청일'이 변경되었습니다.
    
          let weekInterval:number = +myEvent.value;
    
          // 첫수업날짜가 변경됩니다.
          if(4 === weekInterval) {
    
            this.klass.enrollment_interval_week = 4;
            this.setFirstClassDateFormat();
            console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 4주");
    
          } else if(2 === weekInterval) {
    
            this.klass.enrollment_interval_week = 2;
            this.setFirstClassDateFormat();
            console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 2주");
    
          } else if(1 === weekInterval) {
    
            this.klass.enrollment_interval_week = 1;
            this.setFirstClassDateFormat();
            console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 매주");
    
          }
        } else if (myEventService.ON_CLICK_KLASS_SCHEDULE === eventName) {
    
          // 드론 리스트 - klass.schedule을 수정합니다.
          this.clearDronList();
          this.dronListKey = this.myEventService.KLASS_SCHEDULE;
          this.dronListTitle = "일일수업 스케쥴을 입력해주세요";
          this.dronListSEinnerHTML = myEvent.value;
    
          //ON_PREVIEW
          
        } else if (myEventService.ON_CHANGE_DRON_LIST === eventName) {
    
          console.log("onChangedFromChild / myEvent : ",myEvent);
          console.log("onChangedFromChild / myEvent.value : ",myEvent.value);
    
          // 드론 리스트의 입력 내용이 수정되었습니다.
          if(this.myEventService.KLASS_FEATURE === myEvent.key) {
            
            console.log("feature 입력 내용이 수정되었습니다.");
            this.klassFeature = myEvent.value;
    
          } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
            
            console.log("target 입력 내용이 수정되었습니다.");
            this.klassTarget = myEvent.value;
    
          } else if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
            
            console.log("schedule 입력 내용이 수정되었습니다.");
            this.klassSchedule = myEvent.value;
    
          } // end if
    
        } else if (myEventService.ON_SAVE_DRON_LIST === eventName) {
    
          // @ Deprecated
    
          // 드론 리스트의 입력 내용이 수정되었습니다. 저장합니다.
          if(this.myEventService.KLASS_FEATURE === myEvent.key) {
            console.log("feature 입력 내용이 수정되었습니다. 저장합니다.");
            console.log("onChangedFromChild / myEvent.value : ",myEvent.value);
          }
    
    
        } else if (myEventService.ON_SHUTDOWN_DRON_LIST === eventName) {
    
          // @ Deprecated
    
          // 사용자가 드론리스트를 닫았습니다.
          console.log("사용자가 드론리스트를 닫았습니다.");
          // 관련 파라미터 초기화
          this.clearDronList();
    
        } else if (myEventService.ON_SHUTDOWN_N_ROLLBACK_DRON_LIST === eventName) {
    
          // @ Deprecated
    
          // 사용자가 드론리스트를 닫았습니다.
          console.log("사용자가 드론리스트를 닫았습니다. 입력 내용을 취소합니다.");
          // 관련 파라미터 초기화
          this.clearDronList();
    
          // 드론 리스트의 입력 내용이 입력 이전 내용으로 돌아갑니다.
          if(this.myEventService.KLASS_FEATURE === myEvent.key) {
            
            console.log("feature 입력 내용이 입력 이전 내용으로 돌아갑니다.");
            this.klassFeature = myEvent.value;
    
          } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
            
            console.log("target 입력 내용이 입력 이전 내용으로 돌아갑니다.");
            this.klassTarget = myEvent.value;
    
          } else if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
            
            console.log("schedule 입력 내용이 입력 이전 내용으로 돌아갑니다.");
            this.klassSchedule = myEvent.value;
    
          } // end if
        } // end if
        */
    }; // end method
    KlassDetailComponent.prototype.clearDronList = function () {
        this.dronListTitle = null;
        this.dronListSEinnerHTML = null;
        this.dronListMyEventSingleInput = null;
    };
    // Admin Section
    KlassDetailComponent.prototype.showSEKlassFeature = function () {
    };
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, image_service_1.ImageService, dialog_service_1.DialogService, auth_service_1.AuthService, my_event_service_1.MyEventService, klass_radiobtn_service_1.KlassRadioBtnService, klass_checkbox_service_1.KlassCheckBoxService, my_checker_service_1.MyCheckerService])
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent;
//# sourceMappingURL=klass-detail.component.js.map