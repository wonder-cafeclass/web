import { Calendar }                 from '../../widget/calendar/model/calendar';
import { KlassPrice }               from './klass-price';
import { KlassTeacher }             from './klass-teacher';
import { KlassReview }              from './klass-review';
import { KlassQuestion }            from './klass-question';

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
    public days_eng: string;
    public days_kor: string;
    public days_img_url: string;
    public class_day_per_week: number;

    public resume: string;
    public greeting: string;

    public venue: string;
    public venue_subway_station: string;
    public venue_subway_station_img_url: string;
    public venue_cafe: string;
    public venue_cafe_logo_img_url: string;
    public venue_map_link: string;

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
    public class_img_url: string;
    public calendar_table_linear: Calendar[][];
    public calendar_table_monthly: Calendar[][][];

    public date_created: string;
    public date_updated: string;
}