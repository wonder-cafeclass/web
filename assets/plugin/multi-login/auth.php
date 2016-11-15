<?php
    header('X-Frame-Options: ALLOW-FROM https://nid.naver.com/'); 
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <!-- KAKAO / NAVER / FACEBOOK -->
    <title>멀티로그인</title>
</head>
<body style="margin:0px;padding:0px;">
    
    <div id="cage" style="text-align: center;padding: 15px;">
        <a id="login_kakao" href="#" alt="..." onclick="onClickLoginKakao()">
            <img src="../../images/auth/login_kakao.png">
        </a>
        <!--
        <a id="login_naver" href="#" alt="..." target="_blank" onclick="onClickLoginNaver()">
            <img src="../../images/auth/login_naver.png">
        </a>
        -->
    </div>

<script>
// https://navermaps.github.io/maps.js/docs/naver.maps.html#.MapOptions

// /assets/plugin/multi-login/auth.html


//function init(latitude, longitude) {
function init(kakao_auth_url, naver_auth_url, facebook_auth_url) {

    // 플랫폼 별 REST API 로그인을 위한 주소들을 받는다.
    console.log("auth.html / init / kakao_auth_url : ",kakao_auth_url);

}

function setKakaoAuthUrl(kakao_auth_url) {

    if(null == kakao_auth_url || "" == kakao_auth_url) {
        return;
    }

    // login_kakao
    var login_kakao = document.getElementById("login_kakao");
    login_kakao.setAttribute('href', kakao_auth_url);

    console.log("auth.html / setKakaoAuthUrl / kakao_auth_url : ",kakao_auth_url);

}
function onClickLoginKakao() {
    console.log("auth.html / onClickLoginKakao");
}
function setNaverAuthUrl(naver_auth_url) {

    if(null == naver_auth_url || "" == naver_auth_url) {
        return;
    }

    // login_kakao
    var login_kakao = document.getElementById("login_naver");
    login_kakao.setAttribute('href', naver_auth_url);

    console.log("auth.html / setNaverAuthUrl / naver_auth_url : ",naver_auth_url);

}
function onClickLoginNaver() {
    console.log("auth.html / onClickLoginNaver");
}

// custom
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// quiery string으로 넘어온 인자들을 화면에 적용합니다.
function callbackParent(myEvent) {
    if(null !== angularCallback) {
        angularCallback.zone.run(function () { angularCallback.componentFn(myEvent)});
    }   
}

function readyToInit() {
    // 페이지 로딩이 완료되었습니다.
    // 부모 객체에서 SE 설정값을 전달받습니다.
    var myEvent = {
        key:"ready_to_init",
        value:""
    };
    callbackParent(myEvent);
}

function setSize(width, height) {

    // console.log("maps.html / setSize / width : ",width);
    // console.log("maps.html / setSize / height : ",height);

    var cage = document.getElementById("cage");

    if(null != cage && 0 < height) {
        cage.style.height = (height) + "px";
    }
    if(null != cage && 0 < width) {
        cage.style.width = (width) + "px";
    }
}

// cage width & height
var cageWidth = parseInt(getParameterByName("width"));
var cageHeight = parseInt(getParameterByName("height"));
setSize(cageWidth, cageHeight);

// interaction with angular2
var callbackName = getParameterByName("callbackName");
var parentWindow = window.parent.window;
var angularCallback = null;
if(null != parentWindow[callbackName]) {
    angularCallback = parentWindow[callbackName];
}

// redirect시, 로그인 결과값 - code를 돌려준다. 이 code로 회원 관련 정보를 돌려받음.
var callbackName = getParameterByName("callbackName");

// callback to parent
this.readyToInit();

</script>
</body>
</html>