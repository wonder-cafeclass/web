export class User {
	constructor(
		public id:number,
		public nickname:string,
		public first_name:string,
		public last_name:string,
		public gender:string,
		public birthday:string, 
		public thumbnail:string,
		public status:string,
		public permission:string,
		public kakao_id:string,
		public naver_id:string,
		public fb_id:string,
		public google_id:string,
		public mobile:string,
		public email:string,
		public password:string,
		public date_created:string,
		public date_updated:string
	) {}    
}