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
require APPPATH . '/models/KlassLocation.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : 네이버 API 호출을 관리하는 클래스. 검색-지역(상점), 지도-주소검색 의 2가지 API를 사용합니다.
*/
class Naver extends REST_Controller implements MY_Class{

    // 로컬 서버에서 domain 검증으로 api 호출이 불가능한 경우, 사용해야할 api url.
    private $api_search_local="https://openapi.naver.com/v1/search/local.xml?query=";
    private $api_search_map="https://openapi.naver.com/v1/map/geocode?query=";

    private $api_auth = "https://nid.naver.com/oauth2.0/authorize?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&state={state}";
    private $api_access = "https://nid.naver.com/oauth2.0/token?client_id={client_id}&client_secret={client_secret}&grant_type=authorization_code&state={state}&code={code}";
    private $api_me = "https://openapi.naver.com/v1/nid/me";


    private $X_Naver_Client_Id="";
    private $X_Naver_Client_Secret="";

    private $redirect_uri_naver="/login/naver";
    
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
        $this->X_Naver_Client_Id = $this->my_apikey->get($this->my_apikey->X_Naver_Client_Id);
        $this->X_Naver_Client_Secret = $this->my_apikey->get($this->my_apikey->X_Naver_Client_Secret);
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
    *   @ Desc : 네이버 로그인 창으로 이동하는 url을 만들어 돌려줍니다.
    */
    public function authurl_get() 
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        // API 호출에 제한이 있음.
        // 어떤 유저(ip, os, broswer)가 이 메서드를 호출했는지 기록필요. - 로그인그 작업.

        // 1. client_id
        $req_url = $this->api_auth;
        $pattern = '/\{client_id\}/i';
        $replacement = $this->X_Naver_Client_Id;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 2. redirect_uri
        $pattern = '/\{redirect_uri\}/i';
        $replacement = $this->my_path->get_full_path($this->redirect_uri_naver);
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 2. state
        $pattern = '/\{state\}/i';
        // 상태 토큰 가져오기.
        $state = $this->get_new_state();
        $replacement = $state;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        $output = $req_url;

        $response_body = $this->my_response->getResBodySuccessData($output);
        $this->set_response($response_body, REST_Controller::HTTP_OK);
    }



    /*
    *   @ Usage : http://${base_domain}/CI/index.php/api/naver/searchlocal?q=스타벅스%20잠실
    */
    public function searchlocal_get() 
    {

        if($this->is_not_ok()) 
        {
            return;
        }

        // 선생님/운영자인 경우에만 해당 메서드를 쓸수 있도록 제한해야 함. 
        // API 호출에 제한이 있음.
        // 어떤 유저가 이 메서드를 호출했는지 기록필요. - 로그 작업.

        // check params
        $query = $this->my_paramchecker->get('q','search_q_klass_venue');

        $output = array();
        $is_ok = true;
        if(empty($query)) 
        {
            $is_ok = false;

            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                'Search query is not valid!', 
                // $query=""
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
            $this->set_response($response_body, REST_Controller::HTTP_OK);

            return;
        }

        // 1. 네이버 지역 검색 (도메인 영향없음.)
        // 검색 - 지역 을 통해서 카페의 주소 정보를 가져온다. 
        // 필요한 정보는 다음과 같습니다. - 
        // 1.상호명(title) / 5.전화번호(telephone) / 6.주소(address) / 7.도로명 주소(roadAddress)
        $query_encoded = urlencode($query);

        $result =
        $this->my_curl->get_xml(
            // $url=""
            $this->api_search_local . $query_encoded,
            // $header_arr=null
            [
                $this->my_apikey->X_Naver_Client_Id => $this->X_Naver_Client_Id,
                $this->my_apikey->X_Naver_Client_Secret => $this->X_Naver_Client_Secret
            ],
            // $attr_arr=null
            [
                "channel",
                "item",
                [
                    "title",
                    "telephone",
                    "address",
                    "roadAddress"
                ]
            ]
        );

        $location_list = array();
        if(is_array($result)) 
        {   
            // 2개 이상의 배열로 넘어오는 경우.
            for ($i=0; $i < count($result); $i++) { 
                $element = $result[$i];

                $klassLocation = new KlassLocation();
                if(isset($element->title)) {
                    $klassLocation->title = $element->title;
                }
                if(isset($element->telephone)) {
                    $klassLocation->telephone = $element->telephone;
                }
                if(isset($element->address)) {
                    $klassLocation->address = $element->address;
                }
                if(isset($element->roadAddress)) {
                    $klassLocation->roadAddress = $element->roadAddress;
                }
                if(!empty($klassLocation->title)) {
                    // 데이터가 이상없는 객체만 추가한다.
                    array_push($location_list, $klassLocation);
                }
            }
        } 
        else 
        {
            // 1개의 단독 객체로 넘어오는 경우.
            $location_list = array();
            $klassLocation = new KlassLocation();
            if(isset($result->title)) {
                $klassLocation->title = $result->title;
            }
            if(isset($result->telephone)) {
                $klassLocation->telephone = $result->telephone;
            }
            if(isset($result->address)) {
                $klassLocation->address = $result->address;
            }
            if(isset($result->roadAddress)) {
                $klassLocation->roadAddress = $result->roadAddress;
            }
            if(!empty($klassLocation->title)) {
                // 데이터가 이상없는 객체만 추가한다.
                array_push($location_list, $klassLocation);
            }
        }


        $output["result"] = $location_list;


        array_push($output, $result);

        $response_body = array();
        if ($is_ok)
        {
            $response_body = 
            $this->my_response->getResBodySuccess(
                // $query="" 
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
        }
        else
        {
            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                'Naver API is not valid!', 
                // $query="" 
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
        }        

        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    /*
    *   @ Usage : http://${base_domain}/CI/index.php/api/naver/searchmap?q=서울특별시 송파구 올림픽로 212 갤러리아팰리스
    */

    public function searchmap_get() {

        // check params
        $query = $this->my_paramchecker->get('q','search_q_naver_map');

        $output = array();
        $is_ok = true;
        if(empty($query)) 
        {
            $is_ok = false;

            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                'Search query is not valid!', 
                // $query=""
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
            $this->set_response($response_body, REST_Controller::HTTP_OK);

            return;
        } 

        // TEST 주소명 테스트 - param checker에서 일반 주소명을 검색할때 문제가 없는지 확인해본다.       

        $query_encoded = urlencode($query);

        $result =
        $this->my_curl->get_json(
            // $url=""
            $this->api_search_map . $query_encoded,
            // $header_arr=null
            [
                $this->my_apikey->X_Naver_Client_Id => $this->X_Naver_Client_Id,
                $this->my_apikey->X_Naver_Client_Secret => $this->X_Naver_Client_Secret
            ],
            // $attr_arr=null
            [
                "result",
                "items",
                "point"
            ]
        );
        $output["result"] = $result;

        $response_body = array();
        if ($is_ok)
        {
            $response_body = 
            $this->my_response->getResBodySuccess(
                // $query="" 
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
        }
        else
        {
            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                'Naver API is not valid!', 
                // $query="" 
                "", 
                // $data=null 
                $output, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
        }        

        $this->set_response($response_body, REST_Controller::HTTP_OK);
    }

    // 인증 검증을 위한 State Token
    // https://developers.naver.com/docs/login/web - 1.1.1. PHP로 구현한 상태 토큰 생성 코드 예
    /*
    
        // @ Usage

        // 상태 토큰으로 사용할 랜덤 문자열을 생성
        $state = generate_state();
        // 세션 또는 별도의 저장 공간에 상태 토큰을 저장
        $session->set_state($state);
        return $state;

    */
    private function generate_state() 
    {
        $mt = microtime();
        $rand = mt_rand();
        return md5($mt . $rand);
    } // end function

    private function get_new_state()
    {
        // start session
        session_start();

        // 상태 토큰으로 사용할 랜덤 문자열을 생성
        $state = $this->generate_state();

        // 세션 또는 별도의 저장 공간에 상태 토큰을 저장
        $_SESSION["naver_auth_state"] = $state;

        return $state;        
    }


}
