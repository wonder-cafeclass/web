import { Injectable }             from '@angular/core';
import { PlatformLocation }       from '@angular/common';

@Injectable()
export class UrlService {

    private baseHref:string;
    private hostname:string;
    private href:string;
    private appBaseUrl:string;
    private appViewUrl:string;

    constructor(private pl:PlatformLocation) {
        this.baseHref = pl.getBaseHrefFromDOM();
        this.href = window.location.href;
        this.hostname = window.location.hostname;
        this.appBaseUrl = `http://${ this.hostname }${ this.baseHref }`;

        let target:string = `${this.appBaseUrl}#`;
        this.appViewUrl = this.href.replace(target,"");
    }

    getAppViewUrl():string {
        return this.appViewUrl;
    }

    get(urlFragment:string) :string{
        // url segment를 보낸 경우, 자신의 app base href를 확인, full request url을 만들어 준다.

        if(0 < urlFragment.length && 0 === urlFragment.indexOf("/")) {
            // "/subtree/subtree/A.php" --> "subtree/subtree/A"
            urlFragment = urlFragment.replace("/","");
        }

        return `${ this.appBaseUrl }${ urlFragment }`;

    }

    getInner(urlFragment:string) :string{
        if(0 < urlFragment.length && 0 === urlFragment.indexOf("/")) {
            // "/subtree/subtree/A.php" --> "subtree/subtree/A"
            urlFragment = urlFragment.replace("/","");
        }

        return `${ this.baseHref }${ urlFragment }`;

    }

}
