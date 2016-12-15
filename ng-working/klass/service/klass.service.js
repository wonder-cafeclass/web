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
var KlassService = (function () {
    function KlassService(http, us) {
        this.http = http;
        this.us = us;
        this.klassesUrl = '/CI/index.php/api/klass/list';
        this.klassUrl = '/CI/index.php/api/klass/course';
        this.klassNewUrl = '/CI/index.php/api/klass/coursenew';
        this.klassSelectileUrl = '/CI/index.php/api/klass/selectile';
        this.klassSearchUrl = '/CI/index.php/api/klass/search';
        this.klassVenueSearchLocalUrl = '/CI/index.php/api/naver/searchlocal';
        this.klassVenueSearchMapUrl = '/CI/index.php/api/naver/searchmap';
        this.baseHref = "";
        this.myExtractor = new my_extractor_1.MyExtractor();
    }
    KlassService.prototype.searchKlassVenue = function (q) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass.service / searchKlassVenue / 시작");
        if (isDebug)
            console.log("klass.service / searchKlassVenue / q : ", q);
        var qEncoded = encodeURIComponent(q);
        var req_url = this.us.get(this.klassVenueSearchLocalUrl);
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
        var req_url = this.us.get(this.klassVenueSearchMapUrl);
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
        var req_url = this.us.get(this.klassSearchUrl);
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
        var req_url = this.us.get(this.klassUrl);
        req_url = req_url + "?id=" + id;
        if (isDebug)
            console.log("klass.service / getKlass / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    KlassService.prototype.getKlassNew = function (teacherId) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass.service / getKlassNew / 시작");
        var req_url = this.us.get(this.klassNewUrl);
        req_url = req_url + "?teacher_id=" + teacherId;
        if (isDebug)
            console.log("klass.service / getKlassNew / req_url : ", req_url);
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
        var req_url = this.us.get(this.klassesUrl);
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
        var req_url = this.us.get(this.klassSelectileUrl);
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
            var klass = this.getKlassFromJSON(klassJSON);
            klassList.push(klass);
        }
        return klassList;
    };
    KlassService.prototype.getKlassFromJSON = function (klassJSON) {
        var klass = new klass_1.Klass();
        // id,
        klass.id = -1;
        if (null != klassJSON.id) {
            klass.id = +klassJSON.id;
        }
        // teacher_id,
        klass.teacher_id = -1;
        if (null != klassJSON.teacher_id) {
            klass.teacher_id = +klassJSON.teacher_id;
        }
        // teacher_resume,
        klass.teacher_resume = klassJSON.teacher_resume;
        // teacher_greeting,
        klass.teacher_greeting = klassJSON.teacher_greeting;
        // title,
        klass.title = klassJSON.title;
        // desc,
        klass.desc = klassJSON.desc;
        // feature,
        klass.feature = klassJSON.feature;
        // target,
        klass.target = klassJSON.target;
        // schedule,
        klass.schedule = klassJSON.schedule;
        // date_begin,
        klass.date_begin = klassJSON.date_begin;
        // time_begin,
        klass.time_begin = klassJSON.time_begin;
        // time_duration_minutes,
        klass.time_duration_minutes = klassJSON.time_duration_minutes;
        // time_end,
        klass.time_end = klassJSON.time_end;
        // level,
        klass.level = klassJSON.level;
        // week_min,
        klass.week_min = klassJSON.week_min;
        // week_max,
        klass.week_max = klassJSON.week_max;
        // days,
        klass.days = klassJSON.days;
        // class_per_week, / Warning! 이름다름
        klass.class_day_per_week = klassJSON.class_per_week;
        // venue,
        klass.venue = klassJSON.venue;
        // venue_subway_station,
        klass.venue_subway_station = klassJSON.venue_subway_station;
        // venue_cafe,
        klass.venue_cafe = klassJSON.venue_cafe;
        // venue_map_link,
        klass.venue_map_link = klassJSON.venue_map_link;
        // venue_title,
        klass.venue_title = klassJSON.venue_title;
        // venue_telephone,
        klass.venue_telephone = klassJSON.venue_telephone;
        // venue_address,
        klass.venue_address = klassJSON.venue_address;
        // venue_road_address,
        klass.venue_road_address = klassJSON.venue_road_address;
        // venue_latitude,
        klass.venue_latitude = klassJSON.venue_latitude;
        // venue_longitude,
        klass.venue_longitude = klassJSON.venue_longitude;
        // status,
        klass.class_status = klassJSON.status;
        // enrollment_interval_week,
        klass.enrollment_interval_week = klassJSON.enrollment_interval_week;
        // tags,
        klass.search_tag = klassJSON.tags;
        // price,
        klass.price = klassJSON.price;
        // discount,
        klass.discount = klassJSON.discount;
        // class_img_url,
        klass.class_img_url = klassJSON.class_img_url;
        // level_img_url,
        klass.level_img_url = klassJSON.level_img_url;
        // days_img_url,
        klass.days_img_url = klassJSON.days_img_url;
        // time_begin_img_url,
        klass.time_begin_img_url = klassJSON.time_begin_img_url;
        // venue_subway_station_img_url,
        klass.venue_subway_station_img_url = klassJSON.venue_subway_station_img_url;
        // date_created,
        klass.date_created = klassJSON.date_created;
        // date_updated
        klass.date_updated = klassJSON.date_updated;
        return klass;
    }; // end method
    KlassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, url_service_1.UrlService])
    ], KlassService);
    return KlassService;
}());
exports.KlassService = KlassService;
//# sourceMappingURL=klass.service.js.map