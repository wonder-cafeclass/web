import { HelperMyIs }     from '../../util/helper/my-is';
import { Teacher }        from '../../teachers/model/teacher';
import { User }           from '../../users/model/user';
import { Klass }          from './klass';

export class KlassAttendance {

	private myIs:HelperMyIs;

	public id:number=-1;
	public klass_id:number=-1;
	public user_id:number=-1;
	public status:string="";
	public date_attend:string="";
	public date_created:string="";
	public date_updated:string="";

	constructor(
	) {
		this.myIs = new HelperMyIs();
	}

	isNotReady():boolean {
		return !this.isReady();
	}
	isReady():boolean {
		return ("R" === this.status)?true:false;
	}

	isSame(target:KlassAttendance):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassAttendance):boolean {
		return this.myIs.isSharing(key, this, target);
	}

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