export class MyRegEx {

	// @ Desc : 정규표현식 모음 클래스
	public EMAIL_REGEX:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public REGEX_SAFE_STR:RegExp=/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20\s\(\)\,\.\:\;?\!\=\-\_\'\"`\^\(\)\&\~]/g;
	public REGEX_NATURAL_NUM:RegExp=/[^0-9]/g;
}