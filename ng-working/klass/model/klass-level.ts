import { HelperMyIs } from '../../util/helper/my-is';
import { HelperMyArray } from '../../util/helper/my-array';

export class KlassLevel {

	// selectile에서 선택할 수 있는 선택지를 보여주는 리스트.
	public selectableList: KlassLevel[];
	// selectile에서 선택된 idx
	public focusIdx:number;
	
	private myIs:HelperMyIs;
	private myArray:HelperMyArray;
	
	constructor(
		public key: string,
		public name_eng: string,
		public name_kor: string,
		public img_url: string
	) {
		this.myIs = new HelperMyIs();
		this.myArray = new HelperMyArray();
	}

	getKeyNotDefault():string {
		if(this.myArray.isOK(this.selectableList)) {
			// 기본값 여부 검사
			let target:KlassLevel = this.selectableList[0];
			if(target.key === this.key) {
				return ""
			} // end if
		} // end if

		return this.key;
	}

	isSame(target:KlassLevel):boolean {
		return this.myIs.isSame(this, target);
	}

	isSharing(key:string, target:KlassLevel):boolean {
		return this.myIs.isSharing(key, this, target);
	}
}