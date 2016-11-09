import { Injectable }             from '@angular/core';

@Injectable()
export class MyRulerService {

    // HTML Element의 수치를 확인하는 서비스 객체
    getHeight(id) {
        let element = document.getElementById(id);

        if(null == element) {
            return -1;
        }

        let style = window.getComputedStyle(element, null);
        // let Height = element.offsetHeight;
        // let Height = element.clientHeight;
        // let Height = element.scrollHeight;

        // console.log("MyRulerService / getHeight / style : ",style);

        let Height:number = +style.getPropertyValue("Height").replace("px","");
        let webkitLogicalHeight:number = +style["webkitLogicalHeight"].replace("px","");

        // console.log("MyRulerService / getHeight / element.offsetHeight : ",element.offsetHeight);
        // console.log("MyRulerService / getHeight / element.clientHeight : ",element.clientHeight);
        // console.log("MyRulerService / getHeight / element.scrollHeight : ",element.scrollHeight);

        let margin:number = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        let padding:number = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        let border:number = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

        // console.log("MyRulerService / getHeight / Height : ",Height);
        // console.log("MyRulerService / getHeight / webkitLogicalHeight : ",webkitLogicalHeight);
        // console.log("MyRulerService / getHeight / margin : ",margin);
        // console.log("MyRulerService / getHeight / padding : ",padding);
        // console.log("MyRulerService / getHeight / border : ",border);

        let actualHeight = Height + padding + margin + border;

        return actualHeight;
    }

    getWidth(id) {
        let element = document.getElementById(id);

        if(null == element) {
            return -1;
        }

        let style = window.getComputedStyle(element, null);
        // let Width = element.offsetWidth;
        // let Width = element.clientWidth;
        // let Width = element.scrollWidth;

        // console.log("MyRulerService / getWidth / style : ",style);

        let width:number = +style.getPropertyValue("width").replace("px","");
        

        // console.log("MyRulerService / getWidth / element.offsetWidth : ",element.offsetWidth);
        // console.log("MyRulerService / getWidth / element.clientWidth : ",element.clientWidth);
        // console.log("MyRulerService / getWidth / element.scrollWidth : ",element.scrollWidth);

        let margin:number = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        let padding:number = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        let border:number = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

        // console.log("MyRulerService / getWidth / Width : ",Width);
        // console.log("MyRulerService / getWidth / webkitLogicalWidth : ",webkitLogicalWidth);
        // console.log("MyRulerService / getWidth / margin : ",margin);
        // console.log("MyRulerService / getWidth / padding : ",padding);
        // console.log("MyRulerService / getWidth / border : ",border);

        let actualWidth = width + padding + margin + border;

        return actualWidth;
    }    
}
