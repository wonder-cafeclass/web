export class KlassTeacher {

	public id:number;
	public user_id:number;
	public nickname:string;
	public name:string;
	public gender:string;
	public birthday:string; 
	public thumbnail:string;
	public thumbnail_url:string;
	public status:string;
	public mobile:string;
	public email:string;
    public resume:string;
    public resume_arr:string[];
    public greeting:string;
    public greeting_arr:string[];
	public memo:string;
	public date_created:string;
	public date_updated:string;

	private delimiter:string="|||";

	constructor() {} 

	getResumeArr():string[] {

		if(null == this.resume || "" === this.resume) {
			return [];
		}

		return this.resume.split(this.delimiter);
	}

	getGreetingArr():string[] {

		if(null == this.greeting || "" === this.greeting) {
			return [];
		}

		return this.greeting.split(this.delimiter);
	}

	setJSON(json):KlassTeacher {

		if(null == json) {
			return this;
		}

		if(null != json["birthday"]) {
			this.birthday = json["birthday"];	
		}

		if(null != json["date_created"]) {
			this.date_created = json["date_created"];	
		}

		if(null != json["date_updated"]) {
			this.date_updated = json["date_updated"];	
		}
		
		if(null != json["email"]) {
			this.email = json["email"];	
		}

		if(null != json["gender"]) {
			this.gender = json["gender"];	
		}

		if(null != json["greeting"]) {
			this.greeting = json["greeting"];	
		}

		if(null != json["id"]) {
			this.id = parseInt(json["id"]);	
		}

		if(null != json["memo"]) {
			this.memo = json["memo"];	
		}

		if(null != json["mobile"]) {
			this.mobile = json["mobile"];	
		}

		if(null != json["name"]) {
			this.name = json["name"];	
		}

		if(null != json["nickname"]) {
			this.nickname = json["nickname"];	
		}

		if(null != json["resume"]) {
			this.resume = json["resume"];	
		}

		if(null != json["status"]) {
			this.status = json["status"];	
		}

		if(null != json["thumbnail"]) {
			this.thumbnail = json["thumbnail"];	
		}

		if(null != json["user_id"]) {
			this.user_id = parseInt(json["user_id"]);	
		}

		return this;
	}   
}