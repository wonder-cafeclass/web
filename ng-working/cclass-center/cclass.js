"use strict";
var CClass = (function () {
    function CClass(id, 
        // 수업이름
        title, 
        // 수업설명
        desc, 
        // 시작날짜
        date_begin, 
        // 시작시간
        time_begin, 
        // 시작시간 이미지
        time_begin_img_url, 
        // 수업시간
        time_duration, 
        // 종료시간
        time_end, 
        // 난이도
        level, 
        // 난이도 - ENG
        level_eng, 
        // 난이도 - KOR
        level_kor, 
        // 난이도 이미지
        level_img_url, 
        // 수업최소 주 단위
        week_min, 
        // 수업최장 주 단위
        week_max, 
        // 수업최소 월 단위
        month_min, 
        // 수업최장 월 단위
        month_max, 
        // 수업요일
        days, 
        // 수업요일 - ENG
        days_eng, 
        // 수업요일 - KOR
        days_kor, 
        // 수업요일 이미지
        days_img_url, 
        // 주당수업횟수
        class_day_per_week, 
        // 수업장소 - 화면에 표시될 이름
        venue, 
        // 수업장소 - 지하철 역
        venue_subway_station, 
        // 수업장소 이미지 - 지하철 역
        venue_subway_station_img_url, 
        // 수업장소 - 카페
        venue_cafe, 
        // 수업장소 이미지 - 카페
        venue_cafe_logo_img_url, 
        // 수업장소링크
        venue_link, 
        // 검색태그
        search_tag, 
        // 가격
        price, 
        // 가격 - 포맷적용
        price_with_format, 
        // 수업운영상태
        class_status, 
        // 이미지 링크    
        class_img_url) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.date_begin = date_begin;
        this.time_begin = time_begin;
        this.time_begin_img_url = time_begin_img_url;
        this.time_duration = time_duration;
        this.time_end = time_end;
        this.level = level;
        this.level_eng = level_eng;
        this.level_kor = level_kor;
        this.level_img_url = level_img_url;
        this.week_min = week_min;
        this.week_max = week_max;
        this.month_min = month_min;
        this.month_max = month_max;
        this.days = days;
        this.days_eng = days_eng;
        this.days_kor = days_kor;
        this.days_img_url = days_img_url;
        this.class_day_per_week = class_day_per_week;
        this.venue = venue;
        this.venue_subway_station = venue_subway_station;
        this.venue_subway_station_img_url = venue_subway_station_img_url;
        this.venue_cafe = venue_cafe;
        this.venue_cafe_logo_img_url = venue_cafe_logo_img_url;
        this.venue_link = venue_link;
        this.search_tag = search_tag;
        this.price = price;
        this.price_with_format = price_with_format;
        this.class_status = class_status;
        this.class_img_url = class_img_url;
    }
    return CClass;
}());
exports.CClass = CClass;
//# sourceMappingURL=cclass.js.map