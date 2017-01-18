import { HelperMyIs }     from '../../util/helper/my-is';
import { HelperMyTime }   from '../../util/helper/my-time';
import { Teacher }        from '../../teachers/model/teacher';
import { User }           from '../../users/model/user';
import { Klass }          from './klass';

export class KlassAttendance {

	private myIs:HelperMyIs;
	private myTime:HelperMyTime;

	public id:number=-1;
	public klass_id:number=-1;
	public user_id:number=-1;
	public status:string="";
	public date_attend:string="";
	public date_created:string="";
	public date_updated:string="";

	public status_ready:string = "R";
	public status_presence:string = "P";
	public status_absence:string = "A";

	public status_ready_kor:string = "수업전";
	public status_presence_kor:string = "출석";
	public status_absence_kor:string = "결석";

	public user:User;

	constructor(
	) {
		this.myIs = new HelperMyIs();
		this.myTime = new HelperMyTime();
	}

	isNotReady():boolean {
		return !this.isReady();
	}
	isReady():boolean {
		return (this.status_ready === this.status)?true:false;
	}
	isPresence():boolean {
		return (this.status_presence === this.status)?true:false;
	}
	isAbsence():boolean {
		return (this.status_absence === this.status)?true:false;
	}

	isSame(target:KlassAttendance):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassAttendance):boolean {
		return this.myIs.isSharing(key, this, target);
	}

	getYYYYMMDDKor():string {

		let yyyymmdd:string = 
		this.myTime.convert(
			// date_str:string, 
			this.date_attend,
			// input_date_format_type:number, 
			this.myTime.DATE_TYPE_YYYY_MM_DD_HH_MM_SS,
			// output_date_format_type:number
			this.myTime.DATE_TYPE_H_YYYY_MM_DD
		);

		return yyyymmdd;
	}

	hasNotStarted():boolean {
		return !this.hasStarted();
	}

	hasStarted():boolean {
		return this.myTime.isBeforeTomorrow(this.date_attend);
		// TEST
		// return this.myTime.isBeforeTomorrow("2017-01-01 11:36:37");
	}

	getStatusKor():string {

		if(this.status_ready === this.status) {

			return this.status_ready_kor;

		} else if(this.status_presence === this.status) {

			return this.status_presence_kor;

		} else if(this.status_absence === this.status) {

			return this.status_absence_kor;

		}

		return "";
	}

	// @ Desc : 출석 상태를 업데이트 합니다.
	updateStatus(status:string):void {

		if(this.status_ready === status) {

			this.status = this.status_ready;

		} else if(this.status_presence === status) {

			this.status = this.status_presence;

		} else if(this.status_absence === status) {

			this.status = this.status_absence;

		} // end if

	} // end method

    setJSON(json):KlassAttendance {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("kat / setJSON / init");

        if(isDebug) console.log("kat / setJSON / json : ",json);

        let kat:KlassAttendance = this._setJSON(json);

        if(isDebug) console.log("kat / setJSON / kat : ",kat);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.

        return kat;

    } // end method

    private _setJSON(json):KlassAttendance {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method	

}