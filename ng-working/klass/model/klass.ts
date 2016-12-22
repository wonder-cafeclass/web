import { Calendar }                 from '../../widget/calendar/model/calendar';
import { KlassPrice }               from './klass-price';
import { KlassTeacher }             from './klass-teacher';
import { KlassReview }              from './klass-review';
import { KlassQuestion }            from './klass-question';
import { KlassCalendarDay }         from './klass-calendar-day';
import { KlassCalendar }            from './klass-calendar';
import { HelperMyArray }            from '../../util/helper/my-array';
import { HelperMyIs }               from '../../util/helper/my-is';
import { HelperMyTime }             from '../../util/helper/my-time';

export class Klass {
    public id: number;

    public teacher:KlassTeacher;
    public review_list:KlassReview[];
    public question_list:KlassQuestion[];

    public teacher_id:number;
    public teacher_resume:string;
    public teacher_greeting:string;

    public title: string;
    public desc: string;
    public feature: string;
    public target: string;
    public schedule: string;
    public date_begin: string;
    public time_begin: string;
    public time_begin_img_url: string;
    public time_duration_minutes: number;
    public time_end: string;
    public level: string;
    public level_eng: string;
    public level_kor: string;
    public level_img_url: string;
    public week_min: number;
    public week_max: number;
    public week_list: string[];
    public weekly_price_list: any[];
    public month_min: number;
    public month_max: number;
    public days: string;
    public days_list: string[];
    public days_img_url: string;
    public days_img_url_list: string[];
    public days_eng: string;
    public days_kor: string;
    public class_day_per_week: number; // 주 n회 수업

    public resume: string;
    public greeting: string;

    public venue: string;
    public venue_cafe: string;
    public venue_cafe_logo_img_url: string;
    public venue_map_link: string;

    // @ Deprecated
    public venue_subway_station: string;
    public venue_subway_station_img_url: string;    

    // @ Recommended
    public subway_line: string;
    public subway_station: string;
    public subway_station_img: string;

    public venue_title: string;
    public venue_telephone: string;
    public venue_address: string;
    public venue_road_address: string;
    public venue_latitude: string;
    public venue_longitude: string;

    public search_tag: string;
    public price: number;
    public price_list: string[];
    public klass_price_list: KlassPrice[];
    public price_list_width_discount: number[];
    public discount:string;
    public discount_arr:number[];
    public price_with_format: string;
    public class_status: string;
    public enrollment_interval_week:number;
    public class_banner_url:string;
    public class_banner_url_arr:string[];
    public class_poster_url:string;
    public class_poster_url_loadable:string;
    public calendar_table_linear: Calendar[][];
    public calendar_table_monthly: Calendar[][][];
    public klass_calendar_list: KlassCalendar[];

    public date_created: string;
    public date_updated: string;

    private delimiter:string="|||";
    private myArray:HelperMyArray;
    private helperMyIs:HelperMyIs;
    private myTime:HelperMyTime;

    constructor() {
        this.myArray = new HelperMyArray();
        this.helperMyIs = new HelperMyIs();
        this.myTime = new HelperMyTime();
    }

    // @ Desc : 수업의 대상을 배열 형태로 반환합니다.
    getTargetList() :string[] {

        if(null == this.target || "" === this.target) {
            return [];            
        }

        return this.target.split(this.delimiter);
    }

    // @ Desc : 수업의 특징을 배열 형태로 반환합니다.
    getFeatureList() :string[] {

        if(null == this.feature || "" === this.feature) {
            return [];            
        }

        return this.feature.split(this.delimiter);
    }
    /*
    // @ Desc : 수업의 특징을 1열 추가합니다.
    addFeature(feature:string):void {

        if(null == feature || "" === feature) {
            return;
        }

        let featureList:string[] = this.getFeatureList();
        if(null == featureList) {
            featureList = [];
        }

        featureList.push(feature);

        this.feature = featureList.join(this.delimiter);

    } // end method
    removeFeature(feature:string):void {

        if(null == feature || "" === feature) {
            return;
        }

        // Do somthing...

    }
    */

    // @ Desc : 수업이 있는 요일을 추가합니다.
    addDay(day:string, imgUrl:string) :void {

        if(null == day || "" === day) {
            return;
        }
        if(null == imgUrl || "" === imgUrl) {
            return;
        }

        if(null == this.days_list) {
            this.days_list = [];
            this.days_img_url_list = [];
        }
        this.days_list.push(day);
        this.days = this.days_list.join(this.delimiter);

        this.days_img_url_list.push(imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter);
    }
    // @ Desc : 수업이 있는 요일을 뺍니다.
    removeDay(day:string, imgUrl:string) :void {

        if(null == day || "" === day) {
            return;
        }
        if(null == imgUrl || "" === imgUrl) {
            return;
        }        

        if(null == this.days_list) {
            this.days_list = [];
            this.days_img_url_list = [];
        }

        this.days_list = this.myArray.removeStr(this.days_list, day);
        this.days = this.days_list.join(this.delimiter);

        this.days_img_url_list = this.myArray.removeStr(this.days_img_url_list, imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter);
    }

    setTimeBegin(hhmmBegin:string) :void {
        if(this.myTime.isNotHHMM(hhmmBegin)) {
            return;
        }
        this.time_begin = hhmmBegin;

        if(this.myTime.isNotHHMM(this.time_end)) {
            return;
        }
        // 종료 시간이 있다면, 수업 시간을 구합니다.
        let diffMinutes:number = this.myTime.getDiffMinutesHHMM(this.time_begin, this.time_end);
        if(0 < diffMinutes) {
            this.time_duration_minutes = diffMinutes;
        } // end if

    } // end method
    setTimeEnd(hhmmEnd:string) :void {
        if(this.myTime.isNotHHMM(hhmmEnd)) {
            return;
        }
        this.time_end = hhmmEnd;

        if(this.myTime.isNotHHMM(this.time_begin)) {
            return;
        }
        // 시작 시간이 있다면, 수업 시간을 구합니다.
        let diffMinutes:number = this.myTime.getDiffMinutesHHMM(this.time_begin, this.time_end);
        if(0 < diffMinutes) {
            this.time_duration_minutes = diffMinutes;
        } // end if
        
    }
    setTimeBeginEnd(hhmmBegin:string, hhmmEnd:string) :void {
        if(this.myTime.isNotHHMM(hhmmBegin) || this.myTime.isNotHHMM(hhmmEnd)) {
            return;
        }
        this.setTimeBegin(hhmmBegin);
        this.setTimeEnd(hhmmEnd);
    }

    hasNotBanner(banner:string) :boolean {
        return this.myArray.hasNotStr(this.class_banner_url_arr, banner);
    }
    hasBanner(banner:string) :boolean {
        return this.myArray.hasStr(this.class_banner_url_arr, banner);
    }
    removeBanner(banner:string):void {
        this.class_banner_url_arr = this.myArray.removeStr(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    }
    addBanner(banner:string):void {
        this.class_banner_url_arr = this.myArray.addStrUnique(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    }    
    private updateBannerUrl():void {
        this.class_banner_url = this.class_banner_url_arr.join(this.delimiter);
    }

    getEnrollmentDateList():KlassCalendarDay[] {

        if(null == this.klass_calendar_list || 0 == this.klass_calendar_list.length) {
            return [];
        } // end if

        let enrollmentDateList:KlassCalendarDay[] = [];
        for (var i = 0; i < this.klass_calendar_list.length; ++i) {
            let klassCalendar:KlassCalendar = this.klass_calendar_list[i];
            let klassCalDayList:KlassCalendarDay[] = klassCalendar.getDayList();

            for (var j = 0; j < klassCalDayList.length; ++j) {

                let klassCalDay:KlassCalendarDay = klassCalDayList[j];

                if(null === klassCalDay) {
                    continue;
                }
                if(klassCalDay.isExpired) {
                    continue; 
                }
                if(!klassCalDay.hasKlass) {
                    continue;
                }

                if(4 == +this.enrollment_interval_week && !klassCalDay.isEnrollment4weeks) {
                    continue; 
                } else if(2 == +this.enrollment_interval_week && !klassCalDay.isEnrollment2weeks) {
                    continue; 
                } else if(1 == +this.enrollment_interval_week && !klassCalDay.isEnrollmentWeek) {
                    continue;
                }

                if(klassCalDay.isEnrollment) {
                    enrollmentDateList.push(klassCalDay);
                } // end if

            } // end for

        } // end for

        return enrollmentDateList;
    }

    // @ Desc : 가장 최근 수업 등록 가능한 날짜(수업 시작 날짜) 를 가져옵니다.
    getEnrollmentDate():string {

        let enrollmentDateList:KlassCalendarDay[] = this.getEnrollmentDateList();
        if(null == enrollmentDateList || 0 == enrollmentDateList.length) {
            return "";
        } // end if

        let enrollmentDate:KlassCalendarDay = enrollmentDateList[0];

        return this.getEnrollmentDateStr(enrollmentDate);

    } // end method

    getEnrollmentDateStr(enrollmentDate:KlassCalendarDay):string {

        if(null == enrollmentDate) {
            return "";
        }

        return `${enrollmentDate.month}월 ${enrollmentDate.date}일 ${enrollmentDate.dayKor}요일`;
    }

    setKlassCalendarList(klassCalendarJSONList:any[]):void {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setKlassCalendarList / init");

        if(null == klassCalendarJSONList || 0 == klassCalendarJSONList.length) {
            if(isDebug) console.log("klass / setKlassCalendarList / 중단 / klassCalendarJSONList is not valid!");
            return;
        }

        let klassCalendarList:KlassCalendar[] = [];
        for (var i = 0; i < klassCalendarJSONList.length; ++i) {
            let monthJSON:any = klassCalendarJSONList[i];
            if(null == monthJSON) {
                if(isDebug) console.log(`klass / setKlassCalendarList / 중단 / monthJSON is not valid! / idx-i : ${i}`);
                continue;
            }

            let klassCalendar = new KlassCalendar();

            for (var j = 0; j < monthJSON.length; ++j) {
                let weekJSON:any = monthJSON[j];
                if(null == weekJSON) {
                    if(isDebug) console.log(`klass / setKlassCalendarList / 중단 / weekJSON is not valid! / idx-j : ${j}`);
                    continue;
                }

                for (var k = 0; k < weekJSON.length; ++k) {

                    let dayJSON:any = weekJSON[k];
                    if(null == dayJSON) {
                        // 달력에서 날짜가 빠진날
                        klassCalendar.addDay(null);
                        continue;
                    }
                    let klassCalendarDay = new KlassCalendarDay().setFromJSON(dayJSON);
                    if(null == klassCalendarDay) {
                        // Error Report
                        if(isDebug) console.log(`klass / setKlassCalendarList / 중단 / klassCalendarDay is not valid! / idx-k : ${k}`);
                        continue;
                    }

                    // 달력에서 날짜가 있는 날
                    if(isDebug) console.log(`klass / setKlassCalendarList / klassCalendarDay : `,klassCalendarDay);
                    klassCalendar.addDay(klassCalendarDay);

                } // end for
                
            } // end for
            if(isDebug) console.log(`klass / setKlassCalendarList / klassCalendar : `,klassCalendar);

            klassCalendarList.push(klassCalendar);
        } // end for

        this.klass_calendar_list = klassCalendarList;

        if(isDebug) console.log(`klass / setKlassCalendarList / klassCalendarList : `,klassCalendarList);
    }

    // REMOVE ME
    /*
    private getFirstClassDateFormat() :string {

        let firstClassDate:Calendar = this.getFirstClassDate(this);
        let firstClassDateFormatStr:string = "";
        if(firstClassDate) {
          firstClassDateFormatStr = `${firstClassDate.month}월 ${firstClassDate.date}일 ${firstClassDate.dayKor}요일`;
        }

        return firstClassDateFormatStr;
    }
    private getFirstClassDate(klass:Klass) :Calendar {

        let calendar_table_monthly = klass.calendar_table_monthly;
        for (var i = 0; i < calendar_table_monthly.length; ++i) {
            let calendar_table = calendar_table_monthly[i];
            // console.log("calendar_table : ",calendar_table);
            for (var j = 0; j < calendar_table.length; ++j) {
                let week = calendar_table[j];
                // console.log("week : ",week);
                for (var k = 0; k < week.length; ++k) {
                    let date:Calendar = week[k];
                    // console.log("date : ",date);

                    if(null === date) {
                    continue;
                    }
                    if(date.isExpired) {
                    continue; 
                    }
                    if(!date.hasKlass) {
                    continue;
                    }

                    if(4 == +klass.enrollment_interval_week && !date.isEnrollment4weeks) {
                    continue; 
                    } else if(2 == +klass.enrollment_interval_week && !date.isEnrollment2weeks) {
                    continue; 
                    } else if(1 == +klass.enrollment_interval_week && !date.isEnrollmentWeek) {
                    continue; 
                    }

                    // 첫 수업을 찾았습니다.
                    return date;
                }
            }
        }

        return null;
    }  
    */  

    copy():Klass {

        return this.helperMyIs.copy(
            // src:any
            this, 
            // copy:any
            new Klass()
        );

    } // end method

    setJSON(json):Klass{

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("klass / setJSON / 시작");

        if(isDebug) console.log("klass / setJSON / json : ",json);

        // id,
        this.id = -1;
        if(null != json.id) {
          this.id = +json.id;
        }

        // review - TODO

        // comment - TODO

        // teacher
        if(null != json["teacher"]) {
            this.teacher = new KlassTeacher().setJSON(json["teacher"]);
        }

        // teacher_id,
        this.teacher_id = -1;
        if(null != json.teacher_id) {
          this.teacher_id = +json.teacher_id;
        }
        // teacher_resume,
        this.teacher_resume = json.teacher_resume;
        // teacher_greeting,
        this.teacher_greeting = json.teacher_greeting;
        // title,
        this.title = json.title;
        // desc,
        this.desc = json.desc;
        // feature,
        this.feature = json.feature;
        // target,
        this.target = json.target;
        // schedule,
        this.schedule = json.schedule;
        // date_begin,
        this.date_begin = json.date_begin;
        // time_begin,
        this.time_begin = json.time_begin;
        // time_duration_minutes,
        this.time_duration_minutes = parseInt(json.time_duration_minutes);
        // time_end,
        this.time_end = json.time_end;
        if( null == this.time_end || 
            "" === this.time_end) {
          if( null != this.time_begin && 
              "" != this.time_begin && 
              !isNaN(this.time_duration_minutes) ) {

            // 끝나는 시간이 없고, 시작 시간과 진행 시간 정보가 있다면 계산해서 넣어준다.
            this.time_end = this.myTime.addMinutesHHMM(this.time_begin, this.time_duration_minutes);

          } // end if
        } // end if

        // level,
        this.level = json.level;
        // week_min,
        this.week_min = json.week_min;
        // week_max,
        this.week_max = json.week_max;
        // days,
        this.days = json.days;
        if( null != this.days && "" != this.days ) {
          this.days_list = this.days.split(this.delimiter);
        }
        // class_per_week, / Warning! 이름다름
        this.class_day_per_week = json.class_per_week;

        // venue,
        this.venue = json.venue;
        // venue_cafe,
        this.venue_cafe = json.venue_cafe;
        // venue_map_link,
        this.venue_map_link = json.venue_map_link;
        // venue_title,
        this.venue_title = json.venue_title;
        // venue_telephone,
        this.venue_telephone = json.venue_telephone;
        // venue_address,
        this.venue_address = json.venue_address;
        // venue_road_address,
        this.venue_road_address = json.venue_road_address;
        // venue_latitude,
        this.venue_latitude = json.venue_latitude;
        // venue_longitude,
        this.venue_longitude = json.venue_longitude;


        // @ Deprecated
        // venue_subway_station,
        this.venue_subway_station = json.venue_subway_station;
        // venue_subway_station_img_url,
        this.venue_subway_station_img_url = json.venue_subway_station_img_url;

        // @ Recommended
        if(null != json.subway_line) {
          this.subway_line = json.subway_line;
        }
        if(null != json.subway_station) {
          this.subway_station = json.subway_station;
        }
        if(null != json.subway_station_img) {
          this.subway_station_img = json.subway_station_img;
        }

        // staturlService,
        this.class_status = json.status;
        // enrollment_interval_week,
        this.enrollment_interval_week = json.enrollment_interval_week;
        // tags,
        this.search_tag = json.tags;
        // price,
        this.price = json.price;
        // discount,
        this.discount = json.discount;
        // class_poster_url,
        this.class_poster_url = json.class_poster_url;
        // class_poster_url_loadable,
        this.class_poster_url_loadable = json.class_poster_url_loadable;
        // class_banner_url,
        this.class_banner_url = json.class_banner_url;
        // class_banner_url_arr,
        if(null != json.class_banner_url && "" != json.class_banner_url) {
          this.class_banner_url_arr = json.class_banner_url.split("|||");
        } else {
          this.class_banner_url_arr = [];
        }
        // level_img_url,
        this.level_img_url = json.level_img_url;
        // days_img_url,
        this.days_img_url = json.days_img_url;
        // days_img_url_list
        if(null != json.days_img_url && "" != json.days_img_url) {
          this.days_img_url_list = json.days_img_url.split("|||");
        } else {
          this.days_img_url_list = [];
        }
        // time_begin_img_url,
        this.time_begin_img_url = json.time_begin_img_url;

        // calendar_table_linear // @ Deprecated
        // this.calendar_table_linear = json.calendar_table_linear;
        // calendar_table_monthly
        this.calendar_table_monthly = json.calendar_table_monthly;
        this.setKlassCalendarList(json.calendar_table_monthly);

        // date_created,
        this.date_created = json.date_created;
        // date_updated
        this.date_updated = json.date_updated;

        return this;

    } // end method    


}