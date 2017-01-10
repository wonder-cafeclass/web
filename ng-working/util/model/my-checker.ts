export class MyChecker {

	public msg:string;
	// 서버에서 전달해주는 필터링 조건 문자열 
	// ex) ["is_str","exact_length[8]"]
	public filterArr:string; 

	public uniqueTable:string;
	public uniqueColumn:string;

	// 이 배열이 있다면 value는 반드시 matches의 인자중 하나여야 한다.
	public matches:string[];

	// 초과
	public greaterThan:number;
	// 이상
	public greaterThanEqualTo:number;
	// 미만
	public lessThan:number;
	// 이하
	public lessThanEqualTo:number;

	// 이하
	public isBoolean:boolean=false;


	// RegExp / 매칭 결과가 있어어야 함.
	public regexInclude:RegExp;
	public regexIncludeArr:RegExp[];

	public regexExcludeArr:RegExp[];

	// DB Query
	public dbQueryUnique:string;

	constructor(
	    public type:string,
	    public min:number,
	    public max:number,
	    public regexExclude:RegExp // 매칭 결과가 없어야 함.
	) {

		// initialize
		this.regexIncludeArr = [];
		this.regexExcludeArr = [];

	}

}