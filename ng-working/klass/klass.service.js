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
var klass_venue_1 = require('./model/klass-venue');
var url_service_1 = require('../util/url.service');
var KlassService = (function () {
    function KlassService(http, us) {
        this.http = http;
        this.us = us;
        this.klassesUrl = '/CI/index.php/api/klass/list';
        this.klassUrl = '/CI/index.php/api/klass/course';
        this.klassSelectileUrl = '/CI/index.php/api/klass/selectile';
        this.klassSearchUrl = '/CI/index.php/api/klass/search';
        this.klassVenueSearchLocalUrl = '/CI/index.php/api/naver/searchlocal';
        this.klassVenueSearchMapUrl = '/CI/index.php/api/naver/searchmap';
        this.baseHref = "";
    }
    KlassService.prototype.searchKlassVenue = function (q) {
        var qEncoded = encodeURIComponent(q);
        var req_url = this.us.get(this.klassVenueSearchLocalUrl);
        req_url = req_url + "?q=" + qEncoded;
        console.log("klass.service.ts / searchKlassVenue / req_url : ", req_url);
        return this.http.get(req_url).map(this.getKlassVenue);
        /*
        .map((r: Response) => {

          let responseJson = r.json();
          let result = [];
          if( null != responseJson &&
              null != responseJson.data &&
              null != responseJson.data.result ) {

              result = responseJson.data.result;
          }

          console.log("klass.service.ts / searchKlassVenue / responseJson : ",responseJson);

          // return r.json().data as KlassVenue[];
          return result as KlassVenue[];
        });
        */
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
        var qEncoded = encodeURIComponent(q);
        var req_url = this.us.get(this.klassVenueSearchMapUrl);
        req_url = req_url + "?q=" + qEncoded;
        // console.log("klass.service.ts / searchKlassMap / req_url : ",req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.getLatLon)
            .catch(this.handleError);
    };
    KlassService.prototype.getLatLon = function (r) {
        var responseJson = r.json();
        var result = new klass_venue_1.KlassVenue(
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
        if (!responseJson.success) {
            return result;
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
            result.longitude = longitude;
        }
        if (null != latitude) {
            result.latitude = latitude;
        }
        return result;
    };
    KlassService.prototype.searchKlassList = function (level, station, day, time, q) {
        var qEncoded = encodeURIComponent(q);
        var req_url = this.us.get(this.klassSearchUrl);
        req_url = req_url + "?level=" + level + "&station=" + station + "&day=" + day + "&time=" + time + "&q=" + qEncoded;
        // console.log("TEST / searchKlassList / req_url : ",req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    KlassService.prototype.getKlass = function (id) {
        var req_url = this.us.get(this.klassUrl);
        req_url = req_url + "?id=" + id;
        // console.log("TEST / getKlass / req_url : ",req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    KlassService.prototype.getKlasses = function () {
        var req_url = this.us.get(this.klassesUrl);
        // console.log("TEST / getKlasses / req_url : ",req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    KlassService.prototype.getKlassSelectile = function () {
        var req_url = this.us.get(this.klassSelectileUrl);
        // console.log("TEST / getKlassSelectile / req_url : ",req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    KlassService.prototype.extractData = function (res) {
        var body = res.json();
        // console.log("KlassService / extractData / body ::: ",body);
        // TODO - 데이터 검증 프로세스.
        if (null == body.data || !body.success) {
            return null;
        }
        return body.data;
    };
    // New - XHR
    // promise-based
    KlassService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    };
    KlassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, url_service_1.UrlService])
    ], KlassService);
    return KlassService;
}());
exports.KlassService = KlassService;
//# sourceMappingURL=klass.service.js.map