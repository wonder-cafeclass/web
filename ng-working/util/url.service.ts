import { Injectable }             from '@angular/core';
import { PlatformLocation }       from '@angular/common';

@Injectable()
export class UrlService {

    private baseHref:string;
    private hostname:string;
    private appBaseUrl:string;

    constructor(private pl:PlatformLocation) {
        this.baseHref = pl.getBaseHrefFromDOM();
        this.hostname = window.location.hostname;
        this.appBaseUrl = `http://${ this.hostname }${ this.baseHref }`;

        console.log("window.location : ",window.location);
        console.log("this.baseHref : ",this.baseHref);
        console.log("this.hostname : ",this.hostname);
        console.log("this.appBaseUrl : ",this.appBaseUrl);
    }

    get(urlFragment:string) {
        // url segment를 보낸 경우, 자신의 app base href를 확인, full request url을 만들어 준다.

        if(0 < urlFragment.length && 0 === urlFragment.indexOf("/")) {
            // "/subtree/subtree/A.php" --> "subtree/subtree/A"
            urlFragment = urlFragment.replace("/","");
        }

        return `${ this.appBaseUrl }${ urlFragment }`;

    }

}
