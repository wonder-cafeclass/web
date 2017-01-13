import { HelperMyIs }         from '../../util/helper/my-is';
import { Teacher }            from '../../teachers/model/teacher';
import { PaymentImport }      from '../../widget/payment/model/payment-import';
import { User }               from '../../users/model/user';
import { Klass }              from './klass';
import { KlassAttendance }    from './klass-attendance';

export class KlassNStudent {

	private myIs:HelperMyIs;

	public id:number=-1;
	public klass_id:number=-1;
	public user_id:number=-1;
	public status:string="";
	public date_created:string="";
	public date_updated:string="";

    public klass:Klass;
    public teacher:Teacher;
    public user:User;

    // 출,결석 횟수
    public attendanceTotalCnt:number=-1;
    public attendanceReadyCnt:number=-1;
    public attendancePresenceCnt:number=-1;
    public attendanceAbsenceCnt:number=-1;

    // 결재 횟수
    public paymentTotalCnt:number=-1;    

    // public attendanceList:KlassAttendance[]; // @ Deprecated - 횟수만 노출하는 것으로 변경.
    // public paymentIMPortList:PaymentImport[]; // @ Deprecated - 횟수만 노출하는 것으로 변경.

	constructor(
	) {
		this.myIs = new HelperMyIs();
	}

	isSame(target:KlassNStudent):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassNStudent):boolean {
		return this.myIs.isSharing(key, this, target);
	}

    // @ Desc : '완료된 수업 수 / 전체 수업 수'
    getProgress():string {

        if(!(0 < this.attendanceTotalCnt)) {
            return "";
        }
        if(!(-1 < this.attendanceReadyCnt)) {
            return "";
        }
        if(!(-1 < this.attendancePresenceCnt)) {
            return "";
        }
        if(!(-1 < this.attendanceAbsenceCnt)) {
            return "";
        }

        let totalCnt:number = this.attendanceTotalCnt;
        let doneCnt:number = totalCnt - this.attendanceReadyCnt;

        return `${doneCnt}/${totalCnt}`;
    }

    isFinished():boolean {

        if(!(0 < this.attendanceTotalCnt)) {
            return false;
        }
        if(!(-1 < this.attendanceReadyCnt)) {
            return false;
        }
        if(!(-1 < this.attendancePresenceCnt)) {
            return false;
        }
        if(!(-1 < this.attendanceAbsenceCnt)) {
            return false;
        }

        let totalCnt:number = this.attendanceTotalCnt;
        let doneCnt:number = totalCnt - this.attendanceReadyCnt;

        return (totalCnt === doneCnt)?true:false;
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

        if(null != json.attendance_total_cnt && -1 < json.attendance_total_cnt) {
            klassStudent.attendanceTotalCnt = json.attendance_total_cnt;
        }
        if(null != json.attendance_ready_cnt && -1 < json.attendance_ready_cnt) {
            klassStudent.attendanceReadyCnt = json.attendance_ready_cnt;
        }
        if(null != json.attendance_presence_cnt && -1 < json.attendance_presence_cnt) {
            klassStudent.attendancePresenceCnt = json.attendance_presence_cnt;
        }
        if(null != json.attendance_absence_cnt && -1 < json.attendance_absence_cnt) {
            klassStudent.attendanceAbsenceCnt = json.attendance_absence_cnt;
        }

        if(null != json.payment_import_cnt && -1 < json.payment_import_cnt) {
            klassStudent.paymentTotalCnt = json.payment_import_cnt;
        }

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