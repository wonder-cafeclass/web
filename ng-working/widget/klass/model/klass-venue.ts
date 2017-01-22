import { HelperMyArray }            from '../../../util/helper/my-array';
import { HelperMyIs }               from '../../../util/helper/my-is';
import { HelperMyTime }             from '../../../util/helper/my-time';

export class KlassVenue {

	public isFocus:boolean=false;
	
    public title:string="";
    public telephone:string="";
    public address:string="";
    public roadAddress:string="";
    // 위도 / latitude / point.y
    // * 위도 값의 범위 : +90.00000(North)북위 90도 ~ -90.000000(South)남위 90도 	    
    public latitude:number=-1;
    // 경도 / longitude / point.x
    // * 경도 값의 범위 : +180.000000(East)동경 180도 ~ -180.000000(West)서경 180도 [그리니치 천문대 기준 0도]
    public longitude:number=-1;

    private delimiter:string="|||";
    private myArray:HelperMyArray;
    private myIs:HelperMyIs;
    private myTime:HelperMyTime;

	constructor() {
        this.myArray = new HelperMyArray();
        this.myIs = new HelperMyIs();
        this.myTime = new HelperMyTime();
	}

    copy():KlassVenue {

        return this.myIs.copy(
            // src:any
            this, 
            // copy:any
            new KlassVenue()
        );

    } // end method

    set(title:string,
        telephone:string,
        address:string,
        roadAddress:string,
        latitude:number,
        longitude:number ):KlassVenue {

        this.title = title;
        this.telephone = telephone;
        this.address = address;
        this.roadAddress = roadAddress;
        this.latitude = latitude;
        this.longitude = longitude;

        return this;
    }

    setJSON(json):KlassVenue {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;

        if(isDebug) console.log("klass-venue / setJSON / init");
        if(isDebug) console.log("klass-venue / setJSON / json : ",json);

        let klassVenue:KlassVenue = this._setJSON(json);

        if(isDebug) console.log("klass-venue / setJSON / klassVenue : ",klassVenue);
        
        // 추가 작업이 필요한 데이터들을 여기서 다룹니다.

        return klassVenue;

    } // end method

    private _setJSON(json):KlassVenue {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method     

}