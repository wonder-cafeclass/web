import { HelperMyIs }         from '../../util/helper/my-is';
import { HelperMyTime }       from '../../util/helper/my-time';
import { HelperMyArray }      from '../../util/helper/my-array';
import { Teacher }            from '../../teachers/model/teacher';
import { PaymentImport }      from '../../widget/payment/model/payment-import';
import { User }               from '../../users/model/user';
import { Klass }              from './klass';
import { KlassAttendance }    from './klass-attendance';

export class KlassNStudent {

	private myIs:HelperMyIs;
    private myTime:HelperMyTime;
    private myArray:HelperMyArray;

	public id:number=-1;
	public klass_id:number=-1;
    public teacher_id:number=-1;
	public user_id:number=-1;
    public payment_import_id:number=-1;
	public status:string="";
	public date_created:string="";
	public date_updated:string="";

    public klass:Klass;
    public teacher:Teacher;
    public user:User;

    public attendance_list:KlassAttendance[]=[];

    // 출,결석 횟수
    public attendance_total_cnt:number=-1;
    public attendance_ready_cnt:number=-1;
    public attendance_presence_cnt:number=-1;
    public attendance_absence_cnt:number=-1;

    public review_cnt:number=-1;
    public question_cnt:number=-1;

    // 결제 횟수
    public payment_import_cnt:number=-1;  

    public receipt_url:string="";  

	constructor(
	) {
		this.myIs = new HelperMyIs();
        this.myTime = new HelperMyTime();
        this.myArray = new HelperMyArray();
	}

	isSame(target:KlassNStudent):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassNStudent):boolean {
		return this.myIs.isSharing(key, this, target);
	}

    isEnableCancle():boolean {

        // 취소 관련 정책 확인 필요.

        // http://cafeclass.kr/%EC%95%BD%EA%B4%80-%EB%B0%8F-%EC%A0%95%EC%B1%85/%EA%B0%95%EC%9D%98-%EC%B0%B8%EA%B0%80%EC%9E%90-%EC%95%BD%EA%B4%80/
        // 강의 개시 1일전 통보 취소는?
        // 2. 강의 개시 당일 통보시 : 강의 참가비의 10% 배상        

        // 강의 시작 며칠전인지 확인 필요.
        let headYYYYMMDD_HHMMSS:string = `${this.klass.date_begin} ${this.klass.time_begin}:00`;
        let diffDays:number = 
        this.myTime.getDiffDaysYYYYMMDD_HHMMSS(
            // headYYYYMMDD_HHMMSS:string
            headYYYYMMDD_HHMMSS,
            // tailYYYYMMDD_HHMMSS:string
            this.myTime.getNow_YYYY_MM_DD_HH_MM_SS()
        );

        if(2 <= diffDays) {
            // 1. 강의 개시 시점으로부터 2일 이전 통보 시 : 손해배상 없음
            return true;
        } // end if

        return false;
    }

    // @ Desc : '완료된 수업 수 / 전체 수업 수'
    getProgress():string {

        if(!(0 < this.attendance_total_cnt)) {
            return "";
        }
        if(!(-1 < this.attendance_ready_cnt)) {
            return "";
        }
        if(!(-1 < this.attendance_presence_cnt)) {
            return "";
        }
        if(!(-1 < this.attendance_absence_cnt)) {
            return "";
        }

        let totalCnt:number = this.attendance_total_cnt;
        let doneCnt:number = totalCnt - this.attendance_ready_cnt;

        return `${doneCnt}/${totalCnt}`;
    }

    isFinished():boolean {

        if(!(0 < this.attendance_total_cnt)) {
            return false;
        }
        if(!(-1 < this.attendance_ready_cnt)) {
            return false;
        }
        if(!(-1 < this.attendance_presence_cnt)) {
            return false;
        }
        if(!(-1 < this.attendance_absence_cnt)) {
            return false;
        }

        let totalCnt:number = this.attendance_total_cnt;
        let doneCnt:number = totalCnt - this.attendance_ready_cnt;

        return (totalCnt === doneCnt)?true:false;
    }

    // @ Desc : 자료실 자료가 있는지 여부.
    hasSupplement():boolean {
        return false;
    }

    setJSON(json):KlassNStudent {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klassStudent / setJSON / init");

        if(isDebug) console.log("klassStudent / setJSON / json : ",json);

        let klassStudent:KlassNStudent = this._setJSON(json);

        if(isDebug) console.log("klassStudent / setJSON / klassStudent : ",klassStudent);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.
        if(null != json.klass) {
            klassStudent.klass = new Klass().setJSON(json.klass);
        }
        if(null != json.teacher) {
            klassStudent.teacher = new Teacher().setJSON(json.teacher);
        }
        if(null != json.user) {
            klassStudent.user = new User().setJSON(json.user);
        }

        if(klassStudent.myArray.isOK(json.attendance_list)) {
            let kaList:KlassAttendance[] = [];
            for (var i = 0; i < json.attendance_list.length; ++i) {
                let json_attendance = json.attendance_list[i];
                let ka:KlassAttendance = new KlassAttendance().setJSON(json_attendance);

                kaList.push(ka);
            } // end for
            klassStudent.attendance_list = kaList;
        } // end if

        return klassStudent;

    } // end method

    private _setJSON(json):KlassNStudent {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method	

}