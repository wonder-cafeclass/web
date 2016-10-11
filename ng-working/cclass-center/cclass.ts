export class CClass {
  constructor(

    public id: number,
    // 수업이름
    public title: string,
    // 수업설명
    public desc: string,
    // 시작날짜
    public date_begin: string,
    // 시작시간
    public time_begin: string,
    // 시작시간 이미지
    public time_begin_img_url: string,
    // 수업시간
    public time_duration: number,
    // 종료시간
    public time_end: string,
    // 난이도
    public level: string,
    // 난이도 - ENG
    public level_eng: string,
    // 난이도 - KOR
    public level_kor: string,
    // 난이도 이미지
    public level_img_url: string,
    // 수업최소 주 단위
    public week_min: number,
    // 수업최장 주 단위
    public week_max: number,
    // 수업최소 월 단위
    public month_min: number,
    // 수업최장 월 단위
    public month_max: number,
    // 수업요일
    public days: string,
    // 수업요일 - ENG
    public days_eng: string,
    // 수업요일 - KOR
    public days_kor: string,
    // 수업요일 이미지
    public days_img_url: string,
    // 주당수업횟수
    public class_day_per_week: number,
    // 수업장소 - 화면에 표시될 이름
    public venue: string,
    // 수업장소 - 지하철 역
    public venue_subway_station: string,
    // 수업장소 이미지 - 지하철 역
    public venue_subway_station_img_url: string,
    // 수업장소 - 카페
    public venue_cafe: string,
    // 수업장소 이미지 - 카페
    public venue_cafe_logo_img_url: string,
    // 수업장소링크
    public venue_link: string,
    // 검색태그
    public search_tag: string,
    // 가격
    public price: number,
    // 가격 - 포맷적용
    public price_with_format: string,
    // 수업운영상태
    public class_status: string,
    // 이미지 링크    
    public class_img_url: string  
  ) { }
}