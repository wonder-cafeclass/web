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
var http_1 = require('@angular/http');
var klass_1 = require('../model/klass');
var klass_venue_1 = require('../model/klass-venue');
var url_service_1 = require('../../util/url.service');
var my_extractor_1 = require('../../util/http/my-extractor');
var my_request_1 = require('../../util/http/my-request');
var my_array_1 = require('../../util/helper/my-array');
var my_time_1 = require('../../util/helper/my-time');
var KlassService = (function () {
    function KlassService(http, urlService) {
        this.http = http;
        this.urlService = urlService;
        this.klassesUrl = '/CI/index.php/api/klass/list';
        this.klassUrl = '/CI/index.php/api/klass/course';
        this.klassNewUrl = '/CI/index.php/api/klass/coursenew';
        this.klassSelectileUrl = '/CI/index.php/api/klass/selectile';
        this.klassSearchUrl = '/CI/index.php/api/klass/search';
        this.klassVenueSearchLocalUrl = '/CI/index.php/api/naver/searchlocal';
        this.klassVenueSearchMapUrl = '/CI/index.php/api/naver/searchmap';
        this.addKlassEmptyUrl = '/CI/index.php/api/klass/addklassempty';
        this.updateKlassTitleUrl = '/CI/index.php/api/klass/updatetitle';
        this.addKlassPosterUrl = '/CI/index.php/api/klass/addposter';
        this.updateKlassBannerUrl = '/CI/index.php/api/klass/updatebanner';
        this.addKlassQuestionUrl = '/CI/index.php/api/klass/addquestion';
        this.addKlassQuestionReplyUrl = '/CI/index.php/api/klass/addquestionreply';
        this.addKlassReviewUrl = '/CI/index.php/api/klass/addreview';
        this.addKlassReviewReplyUrl = '/CI/index.php/api/klass/addreviewreply';
        this.baseHref = "";
        this.dirPathKlassBanner = "/assets/images/class/banner";
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
        this.myArray = new my_array_1.HelperMyArray();
        this.myTime = new my_time_1.HelperMyTime();
    }
    KlassService.prototype.addKlassReview = function (apiKey, userId, klassId, review, star) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass.service / addKlassQuestion / 시작");
        if (isDebug)
            console.log("klass.service / addKlassQuestion / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / addKlassQuestion / userId : ", userId);
        if (isDebug)
            console.log("klass.service / addKlassQuestion / klassId : ", klassId);
        if (isDebug)
            console.log("klass.service / addKlassQuestion / review : ", review);
        if (isDebug)
            console.log("klass.service / addKlassQuestion / star : ", star);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addKlassReviewUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_review: review,
            klass_review_star: star
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    // addKlassReviewReply 
    KlassService.prototype.addKlassReviewReply = function (apiKey, userId, klassId, parentId, reply) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass.service / addKlassReviewReply / 시작");
        if (isDebug)
            console.log("klass.service / addKlassReviewReply / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / addKlassReviewReply / userId : ", userId);
        if (isDebug)
            console.log("klass.service / addKlassReviewReply / klassId : ", klassId);
        if (isDebug)
            console.log("klass.service / addKlassReviewReply / parentId : ", parentId);
        if (isDebug)
            console.log("klass.service / addKlassReviewReply / reply : ", reply);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addKlassReviewReplyUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_review_parent_id: parentId,
            klass_review: reply
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.addKlassQuestion = function (apiKey, userId, klassId, question) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass.service / addKlassQuestion / 시작");
        if (isDebug)
            console.log("klass.service / addKlassQuestion / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / addKlassQuestion / userId : ", userId);
        if (isDebug)
            console.log("klass.service / addKlassQuestion / klassId : ", klassId);
        if (isDebug)
            console.log("klass.service / addKlassQuestion / question : ", question);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addKlassQuestionUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_question: question
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.addKlassQuestionReply = function (apiKey, userId, klassId, parentId, question) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass.service / addKlassQuestionReply / 시작");
        if (isDebug)
            console.log("klass.service / addKlassQuestionReply / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / addKlassQuestionReply / userId : ", userId);
        if (isDebug)
            console.log("klass.service / addKlassQuestionReply / klassId : ", klassId);
        if (isDebug)
            console.log("klass.service / addKlassQuestionReply / parentId : ", parentId);
        if (isDebug)
            console.log("klass.service / addKlassQuestionReply / question : ", question);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addKlassQuestionReplyUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_question_parent_id: parentId,
            klass_question: question
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.updateKlassTitle = function (apiKey, userId, klassId, klassTitle) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / updateKlassTitle / 시작");
        if (isDebug)
            console.log("klass.service / updateKlassTitle / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / updateKlassTitle / userId : ", userId);
        if (isDebug)
            console.log("klass.service / updateKlassTitle / klassId : ", klassId);
        if (isDebug)
            console.log("klass.service / updateKlassTitle / klassTitle : ", klassTitle);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.updateKlassTitleUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_title: klassTitle
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.addKlassPoster = function (apiKey, userId, klassId, klassPosterUrl) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / addKlassPoster / 시작");
        if (isDebug)
            console.log("klass.service / addKlassPoster / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / addKlassPoster / userId : ", userId);
        if (isDebug)
            console.log("klass.service / addKlassPoster / klassId : ", klassId);
        if (isDebug)
            console.log("klass.service / addKlassPoster / klassPosterUrl : ", klassPosterUrl);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addKlassPosterUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_poster_url: klassPosterUrl
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.addKlassEmpty = function (apiKey, userId, teacherId, teacherResume, teacherGreeting) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / addKlassEmpty / 시작");
        if (isDebug)
            console.log("klass.service / addKlassEmpty / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / addKlassEmpty / userId : ", userId);
        if (isDebug)
            console.log("klass.service / addKlassEmpty / teacherId : ", teacherId);
        if (isDebug)
            console.log("klass.service / addKlassEmpty / teacherResume : ", teacherResume);
        if (isDebug)
            console.log("klass.service / addKlassEmpty / teacherGreeting : ", teacherGreeting);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addKlassEmptyUrl);
        var params = {
            user_id: userId,
            teacher_id: teacherId,
            teacher_resume: teacherResume,
            teacher_greeting: teacherGreeting
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.updateKlassBanner = function (apiKey, userId, klassId, klassBanners) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / addKlassBanner / 시작");
        if (isDebug)
            console.log("klass.service / addKlassBanner / apiKey : ", apiKey);
        if (isDebug)
            console.log("klass.service / addKlassBanner / userId : ", userId);
        if (isDebug)
            console.log("klass.service / addKlassBanner / klassId : ", klassId);
        if (isDebug)
            console.log("klass.service / addKlassBanner / klassBanners : ", klassBanners);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.updateKlassBannerUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_banner_url: klassBanners
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.searchKlassVenue = function (q) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / searchKlassVenue / 시작");
        if (isDebug)
            console.log("klass.service / searchKlassVenue / q : ", q);
        var qEncoded = encodeURIComponent(q);
        var req_url = this.urlService.get(this.klassVenueSearchLocalUrl);
        req_url = req_url + "?q=" + qEncoded;
        if (isDebug)
            console.log("klass.service / searchKlassVenue / req_url : ", req_url);
        return this.http.get(req_url).map(this.getKlassVenue);
    };
    KlassService.prototype.getKlassVenue = function (r) {
        var responseJson = r.json();
        var result = [];
        if (null != responseJson &&
            null != responseJson.data &&
            null != responseJson.data.result) {
            result = responseJson.data.result;
        }
        // 예외 사항 검사
        if (0 < result.length) {
            var element = result[0];
            if (null == element) {
                console.log("!Error! / klass.service.ts / null == element");
                console.log("r : ", r);
                return [];
            }
            else if (null == element.title) {
                console.log("!Error! / klass.service.ts / null == element.title");
                console.log("r : ", r);
                return [];
            }
        }
        return result;
    };
    KlassService.prototype.searchKlassMap = function (q) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / searchKlassMap / 시작");
        if (isDebug)
            console.log("klass.service / searchKlassMap / q : ", q);
        var qEncoded = encodeURIComponent(q);
        var req_url = this.urlService.get(this.klassVenueSearchMapUrl);
        req_url = req_url + "?q=" + qEncoded;
        if (isDebug)
            console.log("klass.service / searchKlassMap / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.getKlassVenueEmpty = function () {
        var klassVenue = new klass_venue_1.KlassVenue(
        // public title:string
        "", 
        // public telephone:string
        "", 
        // public address:string
        "", 
        // public roadAddress:string
        "", 
        // public latitude:number
        0, 
        // public longitude:number
        0);
        return klassVenue;
    };
    KlassService.prototype.getLatLon = function (r) {
        var responseJson = r.json();
        var klassVenue = this.getKlassVenueEmpty();
        if (!responseJson.success) {
            return klassVenue;
        }
        // 위도 / latitude / point.y
        // * 위도 값의 범위 : +90.00000(North)북위 90도 ~ -90.000000(South)남위 90도
        var latitude = null;
        // 경도 / longitude / point.x
        // * 경도 값의 범위 : +180.000000(East)동경 180도 ~ -180.000000(West)서경 180도 [그리니치 천문대 기준 0도]                          
        var longitude = null;
        if (null != responseJson &&
            null != responseJson.data &&
            null != responseJson.data.result &&
            null != responseJson.data.result[0] &&
            null != responseJson.data.result[0].x &&
            null != responseJson.data.result[0].y) {
            longitude = parseFloat(responseJson.data.result[0].x);
            latitude = parseFloat(responseJson.data.result[0].y);
        }
        if (null != longitude) {
            klassVenue.longitude = longitude;
        }
        if (null != latitude) {
            klassVenue.latitude = latitude;
        }
        return klassVenue;
    };
    KlassService.prototype.searchKlassList = function (level, station, day, time, q) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / searchKlassList / 시작");
        if (isDebug)
            console.log("klass.service / searchKlassList / level : ", level);
        if (isDebug)
            console.log("klass.service / searchKlassList / station : ", station);
        if (isDebug)
            console.log("klass.service / searchKlassList / day : ", day);
        if (isDebug)
            console.log("klass.service / searchKlassList / time : ", time);
        if (isDebug)
            console.log("klass.service / searchKlassList / q : ", q);
        var qEncoded = encodeURIComponent(q);
        var req_url = this.urlService.get(this.klassSearchUrl);
        req_url = req_url + "?level=" + level + "&station=" + station + "&day=" + day + "&time=" + time + "&q=" + qEncoded;
        if (isDebug)
            console.log("klass.service / searchKlassList / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.getKlass = function (id) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / getKlass / 시작");
        if (isDebug)
            console.log("klass.service / getKlass / id : ", id);
        var req_url = this.urlService.get(this.klassUrl);
        req_url = req_url + "?id=" + id;
        if (isDebug)
            console.log("klass.service / getKlass / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.getKlasses = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / getKlasses / 시작");
        var req_url = this.urlService.get(this.klassesUrl);
        if (isDebug)
            console.log("klass.service / getKlasses / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end getKlasses
    KlassService.prototype.getKlassSelectile = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / getKlassSelectile / 시작");
        var req_url = this.urlService.get(this.klassSelectileUrl);
        if (isDebug)
            console.log("klass.service / getKlassSelectile / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end getKlassSelectile
    KlassService.prototype.getKlassListFromJSON = function (klassJSONList) {
        if (null == klassJSONList && 0 == klassJSONList.length) {
            return [];
        }
        var klassList = [];
        for (var i = 0; i < klassJSONList.length; ++i) {
            var klassJSON = klassJSONList[i];
            var klass = new klass_1.Klass();
            klass.setJSON(klassJSON);
            // REMOVE ME
            // let klass:Klass = this.getKlassFromJSON(klassJSON);
            klassList.push(klass);
        }
        return klassList;
    };
    KlassService.prototype.getKlassBannerUrlLoadable = function (imgUrl) {
        if (null == imgUrl || "" === imgUrl) {
            return "";
        }
        return this.dirPathKlassBanner + "/" + imgUrl;
    };
    KlassService.prototype.extractKlassBannerFromImgUrl = function (imgUrl) {
        if (null == imgUrl || "" === imgUrl) {
            return "";
        }
        return imgUrl.replace(/[\/]?assets\/images\/class\/banner/gi, "").replace(/[\/]+/gi, "");
    };
    KlassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, url_service_1.UrlService])
    ], KlassService);
    return KlassService;
}());
exports.KlassService = KlassService; // end class
//# sourceMappingURL=klass.service.js.map