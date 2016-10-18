export class KlassLevel {

	public parentList: KlassLevel[];
	
	constructor(
		public key: string,
		public name_eng: string,
		public name_kor: string,
		public img_url: string
	) {}
}