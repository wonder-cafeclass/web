import { HelperMyIs } from '../../../util/helper/my-is';

export class KlassStation {

	public parentList: KlassStation[];
	private myIs:HelperMyIs;

	constructor(
		public key: string,
		public name_eng: string,
		public name_kor: string,		
		public img_url: string
	) {
		this.myIs = new HelperMyIs();
	}

	isSame(target:KlassStation):boolean {
		return this.myIs.isSame(this, target);
	}	

	isSharing(key:string, target:KlassStation):boolean {
		return this.myIs.isSharing(key, this, target);
	}			
}