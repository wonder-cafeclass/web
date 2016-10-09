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
var CClass = (function () {
    function CClass(
        // id
        id, 
        // 수업이름
        title, 
        // 수업설명
        desc, 
        // 시작날짜
        dateBegin, 
        // 시작시간
        timeBegin, 
        // 수업시간
        timeDuration, 
        // 종료시간
        timeEnd, 
        // 난이도
        classLevel, 
        // 수업최소개월
        monthMin, 
        // 수업최장개월
        monthMax, 
        // 수업요일
        classDay, 
        // 주당수업횟수
        classDayPerWeek, 
        // 수업장소
        venue, 
        // 수업장소링크
        venueLink, 
        // 수업진행상태
        classProgress, 
        // 검색태그
        searchTag, 
        // 가격
        price, 
        // 수업운영상태
        classStatus, 
        // 이미지 링크    
        classImgLink) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.dateBegin = dateBegin;
        this.timeBegin = timeBegin;
        this.timeDuration = timeDuration;
        this.timeEnd = timeEnd;
        this.classLevel = classLevel;
        this.monthMin = monthMin;
        this.monthMax = monthMax;
        this.classDay = classDay;
        this.classDayPerWeek = classDayPerWeek;
        this.venue = venue;
        this.venueLink = venueLink;
        this.classProgress = classProgress;
        this.searchTag = searchTag;
        this.price = price;
        this.classStatus = classStatus;
        this.classImgLink = classImgLink;
    }
    return CClass;
}());
exports.CClass = CClass;
var CCLASSES = [
    new CClass(
    // id
    1, 
    // 수업이름
    "소수정예 초중급 영어회화", 
    // 수업설명
    "틀려도 무조건 영어로 말하기 + 틀린 부분은 나중에 알려준다.", 
    // 시작날짜
    "2016-10-08", 
    // 시작시간
    "10:00", 
    // 수업시간
    2, 
    // 종료시간
    "12:00", 
    // 난이도
    "초중급", 
    // 수업최소개월
    1, 
    // 수업최장개월
    3, 
    // 수업요일
    "토요일", 
    // 주당수업횟수
    1, 
    // 수업장소
    "투썸플레이스 잠실역", 
    // 수업장소링크
    "http://map.naver.com/?pinId=35135795&pinType=site&dlevel=12&y=fdcd665902373b826efc0d6f5fe69206&x=500b0955451f6cc123cc867c010f2177&enc=b64", 
    // 수업진행상태
    "모집중", 
    // 검색태그
    "모집|영어|잠실|석촌|토요일", 
    // 가격
    65000, 
    // 수업운영상태
    "New", 
    // 이미지 링크
    "http://cafeclass.kr/wp-content/uploads/2016/10/영어회화_잠실_카페클래스.jpg"),
    new CClass(
    // id
    2, 
    // 수업이름
    "매끄러운 영어", 
    // 수업설명
    "초중급 영어회화  하고 싶은 말을 영어로 매끄럽게", 
    // 시작날짜
    "2016-10-13", 
    // 시작시간
    "19:30", 
    // 수업시간
    2, 
    // 종료시간
    "21:30", 
    // 난이도
    "초급", 
    // 수업최소개월
    1, 
    // 수업최장개월
    3, 
    // 수업요일
    "목요일", 
    // 주당수업횟수
    1, 
    // 수업장소
    "종합운동장 신천역 세인트앤드류스", 
    // 수업장소링크
    "http://map.naver.com/?pinId=36432428&pinType=site&dlevel=12&y=bf1954ec3a182aea0826101150c84ceb&x=9f9fb57b478d2e6f7f8c19ccbfb5f6f4&enc=b64", 
    // 수업진행상태
    "모집중", 
    // 검색태그
    "모집|영어|잠실|신천|무조건|말하기", 
    // 가격
    65000, 
    // 수업운영상태
    "New", 
    // 이미지 링크
    "http://cafeclass.kr/wp-content/uploads/2016/09/초중급-영어회화_신천역_카페클래스.jpg")
];
var cclassesPromise = Promise.resolve(CCLASSES);
var core_1 = require('@angular/core');
var CClassService = (function () {
    function CClassService() {
    }
    CClassService.prototype.getCClasses = function () { return cclassesPromise; };
    CClassService.prototype.getCClass = function (id) {
        return cclassesPromise
            .then(function (cclasses) { return cclasses.find(function (cclass) { return cclass.id === +id; }); });
    };
    CClassService.prototype.addCClass = function (title) {
        title = title.trim();
        if (title) {
        }
    };
    CClassService.nextCClassId = 100;
    CClassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CClassService);
    return CClassService;
}());
exports.CClassService = CClassService;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=cclass.service.js.map