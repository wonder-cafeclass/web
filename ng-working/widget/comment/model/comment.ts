import { HelperMyArray }            from '../../../util/helper/my-array';
import { HelperMyIs }               from '../../../util/helper/my-is';
import { HelperMyTime }             from '../../../util/helper/my-time';

export class Comment {

	public id:number=-1;
	public comment:string="";
    public writer:string="";
	public writerId:number=-1;
    public thumbnail:string="";
    public dateUpdated:string="";
    public dateUpdatedHumanReadable:string="";

	public star:number=-1;
	public childCommentList:Comment[]=null;

    private myArray:HelperMyArray;
    private myIs:HelperMyIs;
    private myTime:HelperMyTime;

    private uniqueId:number=-1; // DB 업데이트 이후에 저장된 데이터를 덮어쓰기 대상을 찾기 위해 쓰임.

	constructor() {

		this.myArray = new HelperMyArray();
		this.myIs = new HelperMyIs();
		this.myTime = new HelperMyTime();

		this.uniqueId = this.myTime.getUniqueId();

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("comment / setJSON / init");
        if(isDebug) console.log("comment / setJSON / this.uniqueId : ",this.uniqueId);

	}

	setNew(id:number, comment:string, writerId:number, writer:string, thumbnail:string):Comment {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("comment / setNew / init");


		this.id = id;
		this.comment = comment;
		this.writerId = writerId;
		this.writer = writer;
		this.thumbnail = thumbnail;

	    this.dateUpdated = 
	    this.myTime.getNow_YYYY_MM_DD_HH_MM_SS();

	    this.dateUpdatedHumanReadable = 
	    this.myTime.convert(
	    	// date_str:string, 
	    	this.dateUpdated,
	    	// input_date_format_type:number, 
	    	this.myTime.DATE_TYPE_YYYY_MM_DD_HH_MM_SS,
	    	// output_date_format_type:number
	    	this.myTime.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS
	    );

	    return this;

	}

	set(id:number, comment:string, writerId:number, writer:string, thumbnail:string, dateUpdated:string):Comment {

		this.id = id;
		this.comment = comment;
		this.writerId = writerId;
		this.writer = writer;
		this.thumbnail = thumbnail;

	    this.dateUpdated = dateUpdated;

	    this.dateUpdatedHumanReadable =
	    this.myTime.convert(
	    	// date_str:string, 
	    	this.dateUpdated,
	    	// input_date_format_type:number, 
	    	this.myTime.DATE_TYPE_YYYY_MM_DD_HH_MM_SS,
	    	// output_date_format_type:number
	    	this.myTime.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS
	    );

	    return this;		

	}

    copy():Comment {

        return this.myIs.copy(
            // src:any
            this, 
            // copy:any
            new Comment()
        );

    } // end method

    setJSON(json):Comment {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("comment / setJSON / init");

        let comment:Comment = this._setJSON(json);

        if(isDebug) console.log("comment / setJSON / comment : ",comment);
        
        // 추가 작업이 필요한 데이터들을 여기서 다룹니다.

        return comment;

    } // end method

    private _setJSON(json):Comment {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method	

}