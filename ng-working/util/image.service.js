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
var url_service_1 = require('./url.service');
var ImageService = (function () {
    function ImageService(us) {
        this.us = us;
        // 서비스 서버내의 이미지를 가져오는 유틸 클래스.
        // 개발 서버 혹은 서비스 서버등의 환경에도 일관되게 이미지를 가져오는 역할을 합니다.
        this.noticeHelpUrl = "assets/images/notice/help.png";
        this.noticeDrinksUrl = "assets/images/notice/drinks.png";
        this.cafeclassLogoUrl = "assets/images/cafeclass_logo_text_only.svg";
        this.watchTowerUrl = "assets/images/admin/watchtower.svg";
        this.watchTowerWhiteUrl = "assets/images/admin/watchtower_white.svg";
        this.clock1hr00m00mUrl = "assets/images/clock/clock-1hr-00m-00m.svg";
        this.clock1hr00m30mUrl = "assets/images/clock/clock-1hr-00m-30m.svg";
        this.clock1hr30m00mUrl = "assets/images/clock/clock-1hr-30m-00m.svg";
        this.clock1hr30m30mUrl = "assets/images/clock/clock-1hr-30m-30m.svg";
        this.clock1hrNoticeAMUrl = "assets/images/clock/clock-1hr-notice-am.svg";
        this.clock1hrNoticePMUrl = "assets/images/clock/clock-1hr-notice-pm.svg";
        this.clock1hr30mNoticeAMUrl = "assets/images/clock/clock-1hr-30m-notice-am.svg";
        this.clock1hr30mNoticePMUrl = "assets/images/clock/clock-1hr-30m-notice-pm.svg";
        this.clock2hr00m00mUrl = "assets/images/clock/clock-2hr-00m-00m.svg";
        this.clock2hr00m30mUrl = "assets/images/clock/clock-2hr-00m-30m.svg";
        this.clock2hr30m00mUrl = "assets/images/clock/clock-2hr-30m-00m.svg";
        this.clock2hr30m30mUrl = "assets/images/clock/clock-2hr-30m-30m.svg";
        this.clock2hrNoticeAMUrl = "assets/images/clock/clock-2hr-notice-am.svg";
        this.clock2hrNoticePMUrl = "assets/images/clock/clock-2hr-notice-pm.svg";
        this.clock2hr30mNoticeAMUrl = "assets/images/clock/clock-2hr-30m-notice-am.svg";
        this.clock2hr30mNoticePMUrl = "assets/images/clock/clock-2hr-30m-notice-pm.svg";
        this.clock3hr00m00mUrl = "assets/images/clock/clock-3hr-00m-00m.svg";
        this.clock3hr00m30mUrl = "assets/images/clock/clock-3hr-00m-30m.svg";
        this.clock3hr30m00mUrl = "assets/images/clock/clock-3hr-00m-00m.svg";
        this.clock3hr30m30mUrl = "assets/images/clock/clock-3hr-00m-30m.svg";
        this.clock3hrNoticeAMUrl = "assets/images/clock/clock-3hr-notice-am.svg";
        this.clock3hrNoticePMUrl = "assets/images/clock/clock-3hr-notice-pm.svg";
        this.clock3hr30mNoticeAMUrl = "assets/images/clock/clock-3hr-30m-notice-am.svg";
        this.clock3hr30mNoticePMUrl = "assets/images/clock/clock-3hr-30m-notice-pm.svg";
        this.clockBGUrl = "assets/images/clock/clock-bg.svg";
        this.classFeatureUrl = "assets/images/class/info/points.png";
        this.mapDummy = "assets/images/map_dummy.png";
    }
    ImageService.prototype.get = function (imgUrl) {
        // url segment를 보낸 경우, 자신의 app base href를 확인, full request url을 만들어 준다.
        if (null === this.us) {
            return "";
        }
        return this.us.get(imgUrl);
    };
    ImageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService])
    ], ImageService);
    return ImageService;
}());
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map