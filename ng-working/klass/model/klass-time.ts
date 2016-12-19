import { HelperMyIs } from '../../util/helper/my-is';

export class KlassTime {

	public parentList: KlassTime[];
	private myIs:HelperMyIs;

	constructor(
		public key: string,
		public name_eng: string,
		public name_kor: string,
		public hh_mm: string,
		public img_url: string
	) {
		this.myIs = new HelperMyIs();
	}

	isSame(target:KlassTime):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassTime):boolean {
		return this.myIs.isSharing(key, this, target);
	}		
}