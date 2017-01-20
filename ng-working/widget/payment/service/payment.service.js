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
var url_service_1 = require("../../../util/url.service");
var my_extractor_1 = require('../../../util/http/my-extractor');
var my_request_1 = require('../../../util/http/my-request');
var PaymentService = (function () {
    function PaymentService(urlService, http) {
        this.urlService = urlService;
        this.http = http;
        this.fetchImportHistoryUrl = '/CI/index.php/api/payment/fetchimporthistory';
        this.afterbuyklassUrl = '/CI/index.php/api/payment/afterbuyklass';
        this.addImportHistoryUrl = '/CI/index.php/api/payment/addimporthistory';
        this.cancelPaymentImportUrl = '/CI/index.php/api/payment/cancelpaymentimport';
        this.myExtractor = new my_extractor_1.MyExtractor();
        this.myRequest = new my_request_1.MyRequest();
    }
    PaymentService.prototype.setWatchTower = function (watchTower) {
        this.watchTower = watchTower;
    };
    PaymentService.prototype.isDebug = function () {
        if (null == this.watchTower) {
            return false;
        }
        return this.watchTower.isDebug();
    }; // end method 
    PaymentService.prototype.cancelPaymentImport = function (apiKey, klassId, userId, loginUserId) {
        if (this.isDebug())
            console.log("payment.service / addImportHistory / 시작");
        if (this.isDebug())
            console.log("payment.service / addImportHistory / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("payment.service / addImportHistory / klassId : ", klassId);
        if (this.isDebug())
            console.log("payment.service / addImportHistory / userId : ", userId);
        if (this.isDebug())
            console.log("payment.service / addImportHistory / loginUserId : ", loginUserId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.cancelPaymentImportUrl);
        var params = {
            klass_id: klassId,
            user_id: userId,
            login_user_id: loginUserId,
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    PaymentService.prototype.fetchImportHistory = function (apiKey, pageNum, pageRowCnt, paymentImpUid, klassId, userId, loginUserId) {
        if (this.isDebug())
            console.log("payment.service / fetchImportHistory / 시작");
        if (this.isDebug())
            console.log("payment.service / fetchImportHistory / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("payment.service / fetchImportHistory / pageNum : ", pageNum);
        if (this.isDebug())
            console.log("payment.service / fetchImportHistory / pageRowCnt : ", pageRowCnt);
        if (this.isDebug())
            console.log("payment.service / fetchImportHistory / paymentImpUid : ", paymentImpUid);
        if (this.isDebug())
            console.log("payment.service / fetchImportHistory / klassId : ", klassId);
        if (this.isDebug())
            console.log("payment.service / fetchImportHistory / userId : ", userId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.fetchImportHistoryUrl);
        var params = {
            payment_imp_uid: paymentImpUid,
            page_num: pageNum,
            pageRowCnt: pageRowCnt,
            klass_id: klassId,
            user_id: userId,
            login_user_id: loginUserId,
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    PaymentService.prototype.afterbuyklass = function (apiKey, paymentImpUid, klassId, userId, loginUserId) {
        if (this.isDebug())
            console.log("payment.service / afterbuyklass / 시작");
        if (this.isDebug())
            console.log("payment.service / afterbuyklass / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("payment.service / afterbuyklass / paymentImpUid : ", paymentImpUid);
        if (this.isDebug())
            console.log("payment.service / afterbuyklass / klassId : ", klassId);
        if (this.isDebug())
            console.log("payment.service / afterbuyklass / userId : ", userId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.afterbuyklassUrl);
        var params = {
            payment_imp_uid: paymentImpUid,
            klass_id: klassId,
            user_id: userId,
            login_user_id: loginUserId,
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    PaymentService.prototype.addImportHistory = function (apiKey, paymentImpUid, klassId, userId, loginUserId) {
        if (this.isDebug())
            console.log("payment.service / addImportHistory / 시작");
        if (this.isDebug())
            console.log("payment.service / addImportHistory / apiKey : ", apiKey);
        if (this.isDebug())
            console.log("payment.service / addImportHistory / paymentImpUid : ", paymentImpUid);
        if (this.isDebug())
            console.log("payment.service / addImportHistory / klassId : ", klassId);
        if (this.isDebug())
            console.log("payment.service / addImportHistory / userId : ", userId);
        // POST
        var options = this.myRequest.getReqOptionCafeclassAPI(apiKey);
        var req_url = this.urlService.get(this.addImportHistoryUrl);
        var params = {
            payment_imp_uid: paymentImpUid,
            klass_id: klassId,
            user_id: userId,
            login_user_id: loginUserId,
        };
        return this.http.post(req_url, params, options)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    PaymentService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], PaymentService);
    return PaymentService;
}());
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map