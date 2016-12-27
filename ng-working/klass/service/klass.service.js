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
        this.klassUpdateUrl = '/CI/index.php/api/klass/update';
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
        this.removeKlassQuestionUrl = '/CI/index.php/api/klass/removequestion';
        this.addKlassReviewUrl = '/CI/index.php/api/klass/addreview';
        this.addKlassReviewReplyUrl = '/CI/index.php/api/klass/addreviewreply';
        this.removeKlassReviewUrl = '/CI/index.php/api/klass/removereview';
        this.baseHref = "";
        this.dirPathKlassBanner = "/assets/images/class/banner";
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
        this.myArray = new my_array_1.HelperMyArray();
        this.myTime = new my_time_1.HelperMyTime();
    }
    KlassService.prototype.setWatchTower = function (watchTower) {
        this.watchTower = watchTower;
    };
    KlassService.prototype.isDebug = function () {
        if (null == this.watchTower) {
            return false;
        }
        return this.watchTower.isDebug();
    };
    KlassService.prototype.updateKlass = function (apiKey, userId, teacherId, klass) {
        if (this.isDebug())
            console.log("klass.service / updateKlass / 시작");
        if (this.isDebug())
            console.log("klass.service / updateKlass / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / updateKlass / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / updateKlass / klass : ", klass);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.klassUpdateUrl);
        var params = {
            user_id: userId,
            teacher_id: teacherId,
            klass_id: klass.id,
            teacher_resume: klass.teacher_resume,
            teacher_greeting: klass.teacher_greeting,
            klass_title: klass.title,
            klass_desc: klass.desc,
            klass_feature: klass.feature,
            klass_target: klass.target,
            klass_schedule: klass.schedule,
            klass_date_begin: klass.date_begin,
            klass_time_begin: klass.time_begin,
            klass_time_end: klass.time_end,
            klass_time_duration_minutes: klass.time_duration_minutes,
            klass_level: klass.level,
            klass_week: klass.week,
            klass_days: klass.days,
            klass_venue_title: klass.venue_title,
            klass_venue_telephone: klass.venue_telephone,
            klass_venue_address: klass.venue_address,
            klass_venue_road_address: klass.venue_road_address,
            klass_venue_latitude: klass.venue_latitude,
            klass_venue_longitude: klass.venue_longitude,
            klass_subway_line: klass.subway_line,
            klass_subway_station: klass.subway_station,
            klass_student_cnt: klass.student_cnt,
            klass_price: klass.price,
            klass_banner_url: klass.class_banner_url,
            klass_poster_url: klass.class_poster_url
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.removeKlassReview = function (apiKey, userId, klassId, reviewId) {
        if (this.isDebug())
            console.log("klass.service / removeKlassReview / 시작");
        if (this.isDebug())
            console.log("klass.service / removeKlassReview / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / removeKlassReview / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / removeKlassReview / klassId : ", klassId);
        if (this.isDebug())
            console.log("klass.service / removeKlassReview / reviewId : ", reviewId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.removeKlassReviewUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_review_id: reviewId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.addKlassReview = function (apiKey, userId, klassId, review, star) {
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / 시작");
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / klassId : ", klassId);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / review : ", review);
        if (this.isDebug())
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
    KlassService.prototype.addKlassReviewReply = function (apiKey, userId, klassId, parentId, reply) {
        if (this.isDebug())
            console.log("klass.service / addKlassReviewReply / 시작");
        if (this.isDebug())
            console.log("klass.service / addKlassReviewReply / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / addKlassReviewReply / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / addKlassReviewReply / klassId : ", klassId);
        if (this.isDebug())
            console.log("klass.service / addKlassReviewReply / parentId : ", parentId);
        if (this.isDebug())
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
    KlassService.prototype.removeKlassQuestion = function (apiKey, userId, klassId, questionId) {
        if (this.isDebug())
            console.log("klass.service / removeKlassQuestion / 시작");
        if (this.isDebug())
            console.log("klass.service / removeKlassQuestion / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / removeKlassQuestion / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / removeKlassQuestion / klassId : ", klassId);
        if (this.isDebug())
            console.log("klass.service / removeKlassQuestion / questionId : ", questionId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.removeKlassQuestionUrl);
        var params = {
            user_id: userId,
            klass_id: klassId,
            klass_question_id: questionId
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.addKlassQuestion = function (apiKey, userId, klassId, question) {
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / 시작");
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestion / klassId : ", klassId);
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass.service / addKlassQuestionReply / 시작");
        if (this.isDebug())
            console.log("klass.service / addKlassQuestionReply / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestionReply / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestionReply / klassId : ", klassId);
        if (this.isDebug())
            console.log("klass.service / addKlassQuestionReply / parentId : ", parentId);
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass.service / updateKlassTitle / 시작");
        if (this.isDebug())
            console.log("klass.service / updateKlassTitle / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / updateKlassTitle / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / updateKlassTitle / klassId : ", klassId);
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass.service / addKlassPoster / 시작");
        if (this.isDebug())
            console.log("klass.service / addKlassPoster / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / addKlassPoster / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / addKlassPoster / klassId : ", klassId);
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass.service / addKlassEmpty / 시작");
        if (this.isDebug())
            console.log("klass.service / addKlassEmpty / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / addKlassEmpty / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / addKlassEmpty / teacherId : ", teacherId);
        if (this.isDebug())
            console.log("klass.service / addKlassEmpty / teacherResume : ", teacherResume);
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass.service / addKlassBanner / 시작");
        if (this.isDebug())
            console.log("klass.service / addKlassBanner / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("klass.service / addKlassBanner / userId : ", userId);
        if (this.isDebug())
            console.log("klass.service / addKlassBanner / klassId : ", klassId);
        if (this.isDebug())
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
        if (this.isDebug())
            console.log("klass.service / searchKlassVenue / 시작");
        if (this.isDebug())
            console.log("klass.service / searchKlassVenue / q : ", q);
        var qEncoded = encodeURIComponent(q);
        var req_url = this.urlService.get(this.klassVenueSearchLocalUrl);
        req_url = req_url + "?q=" + qEncoded;
        if (this.isDebug())
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
        // console.log("klass.service / getKlassVenue / 시작");
        // console.log("klass.service / getKlassVenue / result : ",result);
        // json 정보를 KlassVenue 정보로 바꿉니다.
        var klassVenueList = [];
        if (null != result && 0 < result.length) {
            for (var i = 0; i < result.length; ++i) {
                var klassVenueJSON = result[i];
                if (null == klassVenueJSON || "" === klassVenueJSON["address"]) {
                    continue;
                } // end if
                var klassVenue = new klass_venue_1.KlassVenue().setJSON(klassVenueJSON);
                klassVenueList.push(klassVenue);
            } // end for
        } // end if
        // console.log("klass.service / getKlassVenue / klassVenueList : ",klassVenueList);
        return klassVenueList;
    };
    KlassService.prototype.searchKlassMap = function (q) {
        if (this.isDebug())
            console.log("klass.service / searchKlassMap / 시작");
        if (this.isDebug())
            console.log("klass.service / searchKlassMap / q : ", q);
        var qEncoded = encodeURIComponent(q);
        var req_url = this.urlService.get(this.klassVenueSearchMapUrl);
        req_url = req_url + "?q=" + qEncoded;
        if (this.isDebug())
            console.log("klass.service / searchKlassMap / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.setLatLon = function (json, klassVenue) {
        if (null == json) {
            return klassVenue;
        }
        if (null == klassVenue) {
            return klassVenue;
        }
        // 위도 / latitude / point.y
        // * 위도 값의 범위 : +90.00000(North)북위 90도 ~ -90.000000(South)남위 90도
        var latitude = null;
        // 경도 / longitude / point.x
        // * 경도 값의 범위 : +180.000000(East)동경 180도 ~ -180.000000(West)서경 180도 [그리니치 천문대 기준 0도]                          
        var longitude = null;
        if (null != json &&
            null != json.result &&
            null != json.result[0] &&
            null != json.result[0].x &&
            null != json.result[0].y) {
            longitude = parseFloat(json.result[0].x);
            latitude = parseFloat(json.result[0].y);
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
        if (this.isDebug())
            console.log("klass.service / searchKlassList / 시작");
        if (this.isDebug())
            console.log("klass.service / searchKlassList / level : ", level);
        if (this.isDebug())
            console.log("klass.service / searchKlassList / station : ", station);
        if (this.isDebug())
            console.log("klass.service / searchKlassList / day : ", day);
        if (this.isDebug())
            console.log("klass.service / searchKlassList / time : ", time);
        if (this.isDebug())
            console.log("klass.service / searchKlassList / q : ", q);
        var qEncoded = encodeURIComponent(q);
        var req_url = this.urlService.get(this.klassSearchUrl);
        req_url = req_url + "?level=" + level + "&station=" + station + "&day=" + day + "&time=" + time + "&q=" + qEncoded;
        if (this.isDebug())
            console.log("klass.service / searchKlassList / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.getKlass = function (id) {
        if (this.isDebug())
            console.log("klass.service / getKlass / 시작");
        if (this.isDebug())
            console.log("klass.service / getKlass / id : ", id);
        var req_url = this.urlService.get(this.klassUrl);
        req_url = req_url + "?id=" + id;
        if (this.isDebug())
            console.log("klass.service / getKlass / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.getKlasses = function () {
        if (this.isDebug())
            console.log("klass.service / getKlasses / 시작");
        var req_url = this.urlService.get(this.klassesUrl);
        if (this.isDebug())
            console.log("klass.service / getKlasses / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    }; // end getKlasses
    KlassService.prototype.getKlassSelectile = function () {
        if (this.isDebug())
            console.log("klass.service / getKlassSelectile / 시작");
        var req_url = this.urlService.get(this.klassSelectileUrl);
        if (this.isDebug())
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