/*
*	@ Desc : 브라우저의 쿠키 제어 on js. 
*
*/
export class MyCookie {
	constructor() {}

	public deleteCookie(cname) {
	    var d = new Date();
	    d.setTime(d.getTime() - (24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = `${cname}=;${expires};`;
	}

	public setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = `${cname}=${cvalue};${expires};path=/`;
	}

	public getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	        	let value:string = c.substring(name.length, c.length);
	        	if(	null == value || 
	        		"" == value || 
	        		undefined == value || 
	        		"undefined" == value) {
	    			return "";    		
	        	}
	            return value;
	        }
	    }
	    return "";
	}	
}