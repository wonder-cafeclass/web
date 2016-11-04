import { Pipe, PipeTransform } 	from '@angular/core';
import { DomSanitizer } 		from '@angular/platform-browser';

/*
 * 
 * iframe으로 페이지를 로딩시, security risk를 우회합니다. 
 * (주의) 내부 페이지 주소만 사용해주세요. 보안의 위험성이 있는 페이지 로딩은 자제해주세요.
 * Usage:
 *   value | IframeSanitizerPipe
 * Example:
 *   {{ 2 |  IframeSanitizerPipe }}
*/
@Pipe({name: 'safe'})
export class IframeSanitizerPipe implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) {}

	transform(url:string){
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
