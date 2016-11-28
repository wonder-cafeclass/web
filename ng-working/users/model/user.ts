export class User {
	constructor(
		public id:number,
		public nickname:string,
		public name:string,
		public gender:string,
		public birthday:string, 
		public thumbnail:string,
		public status:string,
		public permission:string,
		public kakao_id:string,
		public naver_id:string,
		public facebook_id:string,
		public google_id:string,
		public mobile:string,
		public email:string,
		public date_created:string,
		public date_updated:string
	) {}    
}