export class KlassTeacher {
	constructor(
		public id:number,
		public user_id:number,
		public nickname:string,
		public first_name:string,
		public last_name:string,
		public gender:string,
		public birth_year:number, 
		public thumbnail:string,
		public thumbnail_url:string,
		public status:string,
		public mobile:string,
		public email:string,
        public resume:string,
        public resume_arr:string[],
        public greeting:string,
        public greeting_arr:string[],
		public memo:string,
		public date_created:string,
		public date_updated:string
	) {}    
}