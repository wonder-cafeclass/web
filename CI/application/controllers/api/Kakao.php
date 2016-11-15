<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/*
    !Caution/주의!

    require APPPATH . '${your-class-path}';
    ...
    $this->load->library(${your-class-path});

    // 위의 경우처럼 2번 동일한 클래스를 호출하게 되면 $this->${your-class-path} 의 경우, null을 돌려주게 됩니다.

*/ 
require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/libraries/MY_Class.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : Kakao REST API 호출을 관리하는 클래스. 로그인 및 회원 정보 조회 API를 사용합니다.
*/
class Kakao extends REST_Controller implements MY_Class{

    // private $api_search_local="https://openapi.naver.com/v1/search/local.xml?query=";
    // private $api_search_map="https://openapi.naver.com/v1/map/geocode?query=";

    private $api_get_code="https://kauth.kakao.com/oauth/authorize?client_id={app_key}&redirect_uri={redirect_uri}&response_type=code";

    private $api_post_token="https://kauth.kakao.com/oauth/token";
    private $api_post_signup="https://kapi.kakao.com/v1/user/signup";
    private $api_post_me="https://kapi.kakao.com/v1/user/me";

    private $Kakao_Native_App_Key="";
    private $Kakao_REST_API_Key="";
    private $Kakao_Javascript_Key="";
    private $Kakao_Admin_Key="";

    private $redirect_uri_kakao="/assets/plugin/multi-login/authorized_kakao.html";

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        // $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

        // Set time zone as Seoul
        date_default_timezone_set('Asia/Seoul');

        // init database
        $this->load->database();

        // init path util
        $this->load->library('MY_Path');

        // init error logger
        $this->load->library('MY_Error');

        // init param checker
        $this->load->library('MY_ParamChecker');

        // init MyReponse
        $this->load->library('MY_Response');

        // init MyTime
        $this->load->library('MY_Time');

        // init MyCurl
        $this->load->library('MY_Curl');

        // init MyAPIKey
        $this->load->library('MY_ApiKey');

        // set API Key
        $this->Kakao_Native_App_Key = $this->my_apikey->get($this->my_apikey->Kakao_Native_App_Key);
        $this->Kakao_REST_API_Key = $this->my_apikey->get($this->my_apikey->Kakao_REST_API_Key);
        $this->Kakao_Javascript_Key = $this->my_apikey->get($this->my_apikey->Kakao_Javascript_Key);
        $this->Kakao_Admin_Key = $this->my_apikey->get($this->my_apikey->Kakao_Admin_Key);
    }

    // @ Required : MyClass interface
    public function is_not_ok() {
        return !$this->is_ok();
    }

    // @ Required : MyClass interface
    public function is_ok() {

        $is_ok = true;
        if($this->my_error->hasError()) {
            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                MY_Response::$EVENT_UNKNOWN_ERROR_OCCURED, 
                // $query="" 
                "", 
                // $data=null 
                null, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
            $is_ok = false;
        }

        return $is_ok;
    }

    /*
    *   @ Desc : 사용자의 카카오 코드를 받아올수 있는 로그인 페이지 주소를 얻습니다.
    */
    public function authurl_get()
    {

        if($this->is_not_ok()) 
        {
            return;
        }

        $is_ok = true;

        // API 호출에 제한이 있음.
        // 어떤 유저가 이 메서드를 호출했는지 기록필요. - 로그 작업.

        $req_url = $this->api_get_code;
        $pattern = '/\{app_key\}/i';
        $replacement = $this->Kakao_REST_API_Key;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        $pattern = '/\{redirect_uri\}/i';
        $replacement = $this->my_path->get_full_path($this->redirect_uri_kakao);
        $req_url = preg_replace($pattern, $replacement, $req_url);

        $output = $req_url;

        $response_body = array();
        if ($is_ok)
        {
            $response_body = $this->my_response->getResBodySuccessData($output);
        }
        else
        {
            $response_body = $this->my_response->getResBodyFailMsg('Kakao API is not valid!');
        }
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    // REMOVE ME
    /*
    public function signup_get()
    {
        $kakao_access_token = 
        $this->my_paramchecker->get("access_token","kakao_access_token");
        if(empty($kakao_access_token)) 
        {
            $response_body = $this->my_response->getResBodyFailMsg('$kakao_access_token is not valid!'); 
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        $kakao_token_type = 
        $this->my_paramchecker->get("token_type","kakao_token_type");
        if(empty($kakao_token_type)) 
        {
            $response_body = $this->my_response->getResBodyFailMsg('$kakao_token_type is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }
        $is_ok = true;

        $output = $this->getSignUp($kakao_token_type, $kakao_access_token);

        $response_body = array();
        if ($is_ok)
        {
            $response_body = $this->my_response->getResBodySuccessData($output);
        }
        else
        {
            $response_body = $this->my_response->getResBodyFailMsg('Kakao API is not valid!');
        }
        $this->set_response($response_body, REST_Controller::HTTP_OK);
    }
    public function token_get()
    {
        $kakao_code = $this->my_paramchecker->get("code","kakao_code");
        if(empty($kakao_code)) 
        {
            $response_body = $this->my_response->getResBodyFailMsg('$kakao_code is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        $is_ok = true;

        $output = $this->getToken($kakao_code);

        $response_body = array();
        if ($is_ok)
        {
            $response_body = $this->my_response->getResBodySuccessData($output);
        }
        else
        {
            $response_body = $this->my_response->getResBodyFailMsg('Kakao API is not valid!');
        }
        $this->set_response($response_body, REST_Controller::HTTP_OK);
    }
    */



    /*
    *   @ Desc : 사용자의 카카오 토큰를 받아옵니다.
    */
    private function getToken($kakao_code="") {

        if(empty($kakao_code)) {
            return "";
        }

        $redirect_uri = $this->my_path->get_full_path($this->redirect_uri_kakao);

        $result =
        $this->my_curl->post_json(
            // $url=""
            $this->api_post_token,
            // $header_arr=null
            [],
            // $attr_arr=null
            [],
            // $post_params
            [
                "grant_type"=>"authorization_code",
                "client_id"=>$this->Kakao_REST_API_Key,
                "redirect_uri"=>$redirect_uri,
                "code"=>$kakao_code
            ]
        );
        return $result;
    } 
    /*
    *   @ Desc : 유저를 카카오톡 cafeclass앱연결 - 사용자를 카카오톡->cafeclass 앱에 가입/등록.
    */
    private function getSignUp($kakao_token_type="", $kakao_access_token="") {

        if(empty($kakao_token_type)) {
            return "";
        }
        if(empty($kakao_access_token)) {
            return "";
        }

        $result =
        $this->my_curl->post_json(
            // $url=""
            $this->api_post_signup,
            // $header_arr=null
            [
                "Authorization"=>"$kakao_token_type {$kakao_access_token}",
                // "Authorization"=>"$kakao_token_type $kakao_access_token",
                "Content-Type"=>"application/x-www-form-urlencoded;charset=utf-8"
            ],
            // $attr_arr=null
            []
        );

        return $result;
    }    
    private function getMe($kakao_token_type="", $kakao_access_token="") {

        if(empty($kakao_token_type)) {
            return "";
        }
        if(empty($kakao_access_token)) {
            return "";
        }

        $result =
        $this->my_curl->post_json(
            // $url=""
            $this->api_post_me,
            // $header_arr=null
            [
                "Authorization"=>"$kakao_token_type {$kakao_access_token}",
                // "Authorization"=>"$kakao_token_type $kakao_access_token",
                "Content-Type"=>"application/x-www-form-urlencoded;charset=utf-8"
            ],
            // $attr_arr=null
            [],
            // $post_params
            [
                // "grant_type"=>"authorization_code",
                // "code"=>$kakao_code
            ]
        );
        return $result;
    }     

    public function auth_get() {

        $kakao_code = $this->my_paramchecker->get("code","kakao_code");
        if(empty($kakao_code)) 
        {
            $response_body = $this->my_response->getResBodyFailMsg('$kakao_code is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        $is_ok = true;
        // 1. 로그인에 성공한 유저가 kakao-code로 API 통신을 위한 token을 가져옵니다.
        $output = $this->getToken($kakao_code);

        // Sample Data
        /*
        {
            access_token:"qtGqEEpWNmyWqzAAyDjqa_wwI-WMgic_E_tMdQo8BJ4AAAFYZXvxvQ"
            expires_in:21599
            refresh_token:"ROR4rs00L6BjN2lPvYa6-RPrS1RB-2NFlpGnHAo8BJ4AAAFYZXvxuQ"
            scope:"profile"
            token_type:"bearer"
        }
        */
        $access_token = "";
        if(isset($output) && isset($output->access_token)) 
        {   
            $access_token = $output->access_token;
        }
        $token_type = "";
        if(isset($output) && isset($output->token_type)) 
        {   
            $token_type = $output->token_type;
        }

        // 2. 유저를 등록합니다.
        $output = $this->getSignUp($token_type, $access_token);
        // Sample Data
        // @ Guide : https://developers.kakao.com/docs/restapi#사용자-관리-로그인
        /*
        // 새로 등록된 경우
        {
            "id":123456789
        }
        // 이미 등록된 경우
        {
            "code": -102,
            "msg": "already registered"
        }
        // -9798  서비스 점검중  503
        */
        $code = -1;
        $user_id = -1;
        if(isset($output) && isset($output->code)) 
        {   
            $code = intval($output->code);

            if(-102 === $code) 
            {
                // 이미 등록된 경우.

            }
            else if(-9798 === $code) 
            {
                // 서비스 점검중.
                $response_body = $this->my_response->getResBodyFailMsg('Kakao is not in service.');
                $this->set_response($response_body, REST_Controller::HTTP_OK);
                return;
            }
        } 
        else if(isset($output) && isset($output->id))
        {
            // 새로 등록된 경우.
            $user_id = intval($output->id);
        }
        else
        {
            // 그 외의 상황.
            $response_body = $this->my_response->getResBodyFailMsg('Unknown error has occured!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        // 3. 유저 정보를 가져옵니다.
        $output = $this->getMe($token_type, $access_token);
        /*
        // Sample Data
        {
            id:311947172
            properties:
            {
                nickname:"정원덕"
                profile_image:"http://mud-kage.kakao.co.kr/14/dn/btqe1OdLoQo/1iI4dPkTySO5sParzdKkNK/o.jpg"
                thumbnail_image:"http://mud-kage.kakao.co.kr/14/dn/btqe2BSKfOb/jTMKlhCPTmBA1YmdphShr0/o.jpg"
            }
        }
        */

        // 4. 가져온 유저 정보를 DB에 등록.
        // 4-1. 이미 등록되어 있는 유저인지 확인. 등록되어 있다면 등록하지 않는다.
        // 4-2. 등록되어 있지 않다면 새롭게 등록한다.
        // 4-2-1. 프로필 이미지를 서버에 업로드. 업로드한 이미지 주소를 DB에 등록한다.
        // 4-2-2. 유저 닉네임(nickname) 등록.

        // 5. 뷰에 정상적으로 로그인된 것을 알려줌.
        // 5-1. 유저 등록이 진행되었다면, 추가 정보 입력이 필요함. 추가 정보 입력창으로 이동.
        // 5-2. (Redirect)유저 등록이 이미 완료된 상태라면, 로그인을 호출한 위치로 돌아간다.


        $response_body = $this->my_response->getResBodySuccessData($output);
        $this->set_response($response_body, REST_Controller::HTTP_OK);
    } 


    /*
    *   @ Desc : 카카오톡 로그아웃
    */
    public function logout_get()
    {
        // Need to implement
    }

}
