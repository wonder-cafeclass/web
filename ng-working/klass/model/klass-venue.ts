export class KlassVenue {
	public isFocus:boolean=false;
	constructor(
	    public title:string,
	    public telephone:string,
	    public address:string,
	    public roadAddress:string,
	    // 위도 / latitude / point.y
	    // * 위도 값의 범위 : +90.00000(North)북위 90도 ~ -90.000000(South)남위 90도 	    
	    public latitude:number,
	    // 경도 / longitude / point.x
	    // * 경도 값의 범위 : +180.000000(East)동경 180도 ~ -180.000000(West)서경 180도 [그리니치 천문대 기준 0도]
	    public longitude:number
	) {}
}