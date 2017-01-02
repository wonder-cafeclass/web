/*
*	@ Desc : 가격, 시간, 시간등의 포맷 지원
*/
export class HelperMyFormat {

  public numberWithCommas(x) :string{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }	

  // @ Desc : "도전하는 삶이 아름답습니다.↵당신의 도전에 힘이 되어 드리겠습니다.↵" --> "도전하는 삶이 아름답습니다.<br>당신의 도전에 힘이 되어 드리겠습니다.<br>"
  public nextlineToBR(target:string):string{

  	if(null == target || "" === target) {
  		return "";
  	}

  	target = target.replace(/(\n|\n\r)/gi,"<br>");

  	return target;
  }

  public brToNextline(target:string):string{

  	if(null == target || "" === target) {
  		return "";
  	}

  	target = target.replace(/(\<br\>|\<\/br\>|\<br\/\>)/gi,"\n");

  	return target;
  }

  public splitWithBR(target:string):string[]{

    if(null == target || "" === target) {
      return [];
    } // end if

    return target.split("<br>");

  }


}