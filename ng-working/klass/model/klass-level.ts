import { HelperMyIs } from '../../util/helper/my-is';

export class KlassLevel {

	public parentList: KlassLevel[];
	private myIs:HelperMyIs;
	
	constructor(
		public key: string,
		public name_eng: string,
		public name_kor: string,
		public img_url: string
	) {
		this.myIs = new HelperMyIs();
	}

	isSame(target:KlassLevel):boolean {
		return this.myIs.isSame(this, target);
	}

	isSharing(key:string, target:KlassLevel):boolean {
		return this.myIs.isSharing(key, this, target);
	}
}