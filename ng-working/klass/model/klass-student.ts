import { HelperMyIs } from '../../util/helper/my-is';

export class KlassStudent {

	private myIs:HelperMyIs;

	public id:number=-1;
	public klass_id:number=-1;
	public user_id:number=-1;
	public status:string="";
	public date_created:string="";
	public date_updated:string="";

	constructor(
	) {
		this.myIs = new HelperMyIs();
	}

	isSame(target:KlassStudent):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassStudent):boolean {
		return this.myIs.isSharing(key, this, target);
	}

    setJSON(json):KlassStudent {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klassStudent / setJSON / init");

        if(isDebug) console.log("klassStudent / setJSON / json : ",json);

        let klassStudent:KlassStudent = this._setJSON(json);

        if(isDebug) console.log("klassStudent / setJSON / klassStudent : ",klassStudent);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.

        return klassStudent;

    } // end method

    private _setJSON(json):KlassStudent {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method	

}