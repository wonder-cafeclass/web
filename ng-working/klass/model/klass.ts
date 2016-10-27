import { Calendar }                from '../../widget/calendar/model/calendar';

export class Klass {
    public id: number;
    public title: string;
    public desc: string;
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
    public month_min: number;
    public month_max: number;
    public days: string;
    public days_eng: string;
    public days_kor: string;
    public days_img_url: string;
    public class_day_per_week: number;
    public venue: string;
    public venue_subway_station: string;
    public venue_subway_station_img_url: string;
    public venue_cafe: string;
    public venue_cafe_logo_img_url: string;
    public venue_map_link: string;
    public search_tag: string;
    public price: number;
    public price_with_format: string;
    public class_status: string;
    public class_img_url: string;
    public calendar_table: Calendar[][];
}