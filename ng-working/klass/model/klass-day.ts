import { HelperMyIs } from '../../util/helper/my-is';

export class KlassDay {

	public parentList: KlassDay[];
	private myIs:HelperMyIs;
	
	constructor(
		public key: string,
		public name_eng: string,
		public name_kor: string,
		public img_url: string
	) {
		this.myIs = new HelperMyIs();
	}

	isSame(target:KlassDay):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassDay):boolean {
		return this.myIs.isSharing(key, this, target);
	}	
}