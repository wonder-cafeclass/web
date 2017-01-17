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

	private status_ready:string = "R";
	private status_presence:string = "P";
	private status_absence:string = "A";

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

	getStatusKor():string {

		if(this.status_ready === this.status) {

			return "준비";

		} else if(this.status_presence === this.status) {

			return "출석";

		} else if(this.status_absence === this.status) {

			return "결석";

		}

		return "";
	}

	// @ Desc : 출석 상태를 다음 단계로 업데이트 합니다. R(준비)-->P(출석)-->A(결석)-->R(준비)...
	updateStatus():void {

		if(this.status_ready === this.status) {

			this.status = this.status_presence;

		} else if(this.status_presence === this.status) {

			this.status = this.status_absence;

		} else if(this.status_absence === this.status) {

			this.status = this.status_ready;

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