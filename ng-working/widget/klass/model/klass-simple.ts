import { HelperMyIs }               from '../../../util/helper/my-is';

// @ Desc : 홈 리스트에서 노출할 최소한의 정보만 가져오는 클래스
export class KlassSimple {

    public id: number=-1;

    public teacher_id:number=-1;
    public teacher_thumbnail:string="";

    public title: string="";
    public desc: string="";
    public type: string="";
    public date_begin: string="";
    public time_begin: string="";
    public time_begin_img_url: string="";
    public time_duration_minutes: number=-1;
    public time_end: string="";
    public level: string="";
    public level_eng: string="";
    public level_kor: string="";
    public level_img_url: string="";

    public week: number=-1;

    public days: string="";
    public days_list: string[]=[];
    public days_img_url: string="";
    public days_img_url_list: string[]=[];
    public days_a_week_img_url: string="";
    public days_eng: string="";
    public days_kor: string="";

    public subway_line: string="";
    public subway_station: string="";
    public subway_station_img: string="";

    public price: number=-1;
    public price_with_format: string="";

    // 수업 참여 학생수
    public student_cnt: number=-1;

    public status: string="";

    public class_poster_url:string="";
    public class_poster_url_loadable:string="";

    private delimiter:string="|||";
    private myIs:HelperMyIs=null;

    constructor() {
        this.myIs = new HelperMyIs();
    }

    // @ Desc : 수업없음 클래스인지 여부.
    isNoClassBtn() :boolean {
        return (-1 === this.id) ? true:false;
    }
    isNotNoClassBtn() :boolean {
        return !this.isNoClassBtn();
    }
    
    // @ Desc : 새로운 클래스를 만드는 버튼 역할의 수업인지 여부.
    isNewClassBtn() :boolean {
        return (-100 === this.id) ? true:false;
    }
    isNotNewClassBtn() :boolean {
        return !this.isNewClassBtn();
    }

    setJSON(json):KlassSimple {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("klass / setJSON / init");

        if(isDebug) console.log("klass / setJSON / json : ",json);

        let klass:KlassSimple = this._setJSON(json);

        // teacher
        if(null != json.teacher) {
            klass.teacher_id = parseInt(json.teacher.id);
            klass.teacher_thumbnail = json.teacher.thumbnail;
        }  

        // days_img_url_list
        if(null != klass.days_img_url && "" != klass.days_img_url) {
            klass.days_img_url_list = klass.days_img_url.split("|||");
        } else {
            klass.days_img_url_list = [];
        }

        if(isDebug) console.log("klass / setJSON / klass : ",klass);
        
        return klass;

    } // end method

    private _setJSON(json):KlassSimple {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method

}