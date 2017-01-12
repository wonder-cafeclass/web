import { HelperMyIs }     from '../../util/helper/my-is';
import { Teacher }        from '../../teachers/model/teacher';
import { User }           from '../../users/model/user';
import { Klass }          from './klass';

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