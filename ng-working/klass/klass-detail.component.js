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
var dialog_service_1 = require('../widget/dialog.service');
var auth_service_1 = require('../auth.service');
var checkbox_option_1 = require('../widget/checkbox/model/checkbox-option');
var input_view_updown_1 = require('../widget/input-view/model/input-view-updown');
var KlassDetailComponent = (function () {
    function KlassDetailComponent(route, router, imageService, dialogService, authService) {
        this.route = route;
        this.router = router;
        this.imageService = imageService;
        this.dialogService = dialogService;
        this.authService = authService;
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
            // console.log("this.klass : ",this.klass);
            _this.klassCalendarTableLinear = _this.klass.calendar_table_linear;
            _this.klassCalendarTableMonthly = _this.klass.calendar_table_monthly;
            console.log("this.klassCalendarTableMonthly : ", _this.klassCalendarTableMonthly);
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
            // 최대수강신청기간
            _this.checkboxOptionListCourseDuration = [
                new checkbox_option_1.CheckboxOption("4주", "4", true),
                new checkbox_option_1.CheckboxOption("8주", "8", false),
                new checkbox_option_1.CheckboxOption("12주", "12", false)
            ];
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
        // 수강신청일
        var optionList = [
            new checkbox_option_1.CheckboxOption("4주마다", "4", false),
            new checkbox_option_1.CheckboxOption("2주마다", "2", false),
            new checkbox_option_1.CheckboxOption("매주마다", "1", false)
        ];
        for (var i = 0; i < optionList.length; ++i) {
            var option = optionList[i];
            if (this.klass.enrollment_interval_week == +option.value) {
                option.isFocus = true;
            }
            optionList[i] = option;
        }
        this.checkboxOptionListEnrollment = optionList;
        optionList = [
            new checkbox_option_1.CheckboxOption("4주", "4", true),
            new checkbox_option_1.CheckboxOption("8주", "8", false),
            new checkbox_option_1.CheckboxOption("12주", "12", false)
        ];
        for (var i = 0; i < optionList.length; ++i) {
            var option = optionList[i];
            if (this.klass.week_min == +option.value) {
                option.isFocus = true;
            }
            optionList[i] = option;
        }
        this.checkboxOptionListCourseDurationMin = optionList;
        optionList = [
            new checkbox_option_1.CheckboxOption("4주", "4", true),
            new checkbox_option_1.CheckboxOption("8주", "8", false),
            new checkbox_option_1.CheckboxOption("12주", "12", false)
        ];
        for (var i = 0; i < optionList.length; ++i) {
            var option = optionList[i];
            if (this.klass.week_max == +option.value) {
                option.isFocus = true;
            }
            optionList[i] = option;
        }
        this.checkboxOptionListCourseDurationMax = optionList;
        var updownList = [];
        for (var i = 0; i < this.klass.klass_price_list.length; ++i) {
            var klassPrice = this.klass.klass_price_list[i];
            var updown = new input_view_updown_1.InputViewUpdown(klassPrice.weeks + "주", 12, "" + klassPrice.discount, 12, "price", "#f0f");
            updownList.push(updown);
        }
        console.log("TEST / updownList : ", updownList);
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
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, image_service_1.ImageService, dialog_service_1.DialogService, auth_service_1.AuthService])
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent;
//# sourceMappingURL=klass-detail.component.js.map