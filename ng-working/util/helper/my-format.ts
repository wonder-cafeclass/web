/*
*	@ Desc : 가격, 시간, 시간등의 포맷 지원
*/
export class HelperMyFormat {

  public numberWithCommas(x) :string{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }	

}