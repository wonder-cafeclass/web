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

    private $api_search_local="https://openapi.naver.com/v1/search/local.xml?query=";
    private $api_search_map="https://openapi.naver.com/v1/map/geocode?query=";

    private $api_auth = "https://nid.naver.com/oauth2.0/authorize?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&state={state}";
    private $api_access = "https://nid.naver.com/oauth2.0/token?client_id={client_id}&client_secret={client_secret}&grant_type=authorization_code&state={state}&code={code}";
    private $api_me = "https://openapi.naver.com/v1/nid/me";


    private $X_Naver_Client_Id="";
    private $X_Naver_Client_Secret="";

    private $session_state_key="naver_auth_state";
    private $session_access_token="naver_access_token";
    private $session_token_type="naver_token_type";

    private $redirect_uri_naver="/assets/plugin/multi-login/authorized_naver.html";
    
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

        // init error logger
        $this->load->library('MY_Error');

        // init path util
        $this->load->library('MY_Path');

        // init My_KeyValue
        $this->load->library('MY_KeyValue');

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

        // init MySql
        $this->load->library('MY_Sql');

        // init UserAgent
        $this->load->library('user_agent');

        // init MyLogger
        $this->load->library('MY_Logger');

        // init MyThumbnail
        $this->load->library('MY_Thumbnail');

        // ----

        // init MyAuth
        $this->load->library('MY_Auth');

        // start session
        session_start();

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

        $req_url = $this->api_auth;

        // 1. client_id
        $pattern = '/\{client_id\}/i';
        $replacement = $this->X_Naver_Client_Id;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 2. redirect_uri
        $pattern = '/\{redirect_uri\}/i';
        $replacement = $this->my_path->get_path_full($this->redirect_uri_naver);
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 상태 토큰 가져오기.
        $state = $this->my_auth->get_new_state();

        // 3. state
        $pattern = '/\{state\}/i';
        $replacement = $state;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        $output = $req_url;

        $this->respond_200($output);
    }

    /*
    *   @ Desc : 네이버에서 인증코드를 입력, Access Key를 가져옵니다.
    */
    public function access_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        // 콜백 응답에서 naver_code 파라미터의 값을 가져옴
        $naver_code = $this->my_paramchecker->get('naver_code','naver_code');
        if(empty($naver_code)) 
        {
            $response_body =
            $this->my_response->getResBodyFailMsg('naver_code is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        $req_url = $this->api_access;

        // 1. client_id
        $pattern = '/\{client_id\}/i';
        $replacement = $this->X_Naver_Client_Id;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 2. client_secret
        $pattern = '/\{client_secret\}/i';
        $replacement = $this->X_Naver_Client_Secret;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 상태 토큰 가져오기.
        $state = $this->my_auth->get_new_state();

        // 3. state
        $pattern = '/\{state\}/i';
        $replacement = $state;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 4. state
        $pattern = '/\{code\}/i';
        $replacement = $naver_code;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        $result =
        $this->my_curl->get_json(
            // $url=""
            $req_url,
            // $header_arr=null
            [],
            // $attr_arr=null
            []
        );
        $output = $result;

        // access token이 있다면 session에 저장.
        $access_token = $this->my_keyvalue->get($result, "access_token");
        if(!empty($access_token))
        {
            $_SESSION[$this->session_access_token] = $access_token;
        }

        $token_type = $this->my_keyvalue->get($result, "token_type");
        if(!empty($token_type))
        {
            $_SESSION[$this->session_token_type] = $token_type;
        }

        $this->respond_200($output);
    }

    /*
    *   @ Desc : 네이버의 회원 정보를 가져옵니다. !접근 토큰(Access Token)이 필요합니다!
    */
    public function me_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        // 콜백 응답에서 naver_token_type, naver_access_token 파라미터의 값을 가져옴
        $token_type = $_SESSION[$this->session_token_type];
        if(empty($token_type)) 
        {
            $response_body =
            $this->my_response->getResBodyFailMsg('token_type is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }
        $access_token = $_SESSION[$this->session_access_token];
        if(empty($access_token)) 
        {
            $response_body =
            $this->my_response->getResBodyFailMsg('access_token is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        // wonder.jung
        $result =
        $this->my_curl->get_json(
            // $url=""
            $this->api_me,
            // $header_arr=null
            [
                "Authorization"=>"$token_type $access_token"
                // "Authorization"=>"Bearer $access_token"
            ],
            // $attr_arr=null
            [
                "response"
            ],
            // $post_params
            []
        );

        /*
        // Sample Data
        {
            age: "30-39"
            birthday: "03-29"
            email: "wonder13662@naver.com"
            enc_id: "883922d718931108f3c278a9b5e33e6661728b694efc5003684c011e76d14c4b"
            gender: "M"
            id: "67025373"
            name: "정원덕"
            nickname: "wonder1****"
            profile_image: "https://ssl.pstatic.net/static/pwe/address/nodata_33x33.gif"
        }
        */

        $naver_id = $this->my_keyvalue->get_number($result, "id");
        $user = null;
        if(0 < $naver_id) 
        {
            $user = $this->get_user($naver_id);
        }
        if(0 < $naver_id && is_null($user))
        {
            // 회원 정보를 검사, 없다면 회원으로 추가합니다.
            // 유저 등록이 진행되었다면, 추가 정보 입력이 필요함. 추가 정보 입력창으로 이동.
            $this->add_user($result);
            $user = $this->get_user($naver_id);   
        }
        else if(0 < $naver_id)
        {
            // 등록되어 있다면 등록하지 않는다.
            // 뷰에 정상적으로 로그인된 것을 알려줌.
            // (Redirect)유저 등록이 이미 완료된 상태라면, 로그인을 호출한 위치로 돌아간다.
        }

        if(is_null($user))
        {
            // 그 외의 상황.
            // 에러 등록.
            // 사용자에게 서비스 이상 메시지로 알림.
            $this->respond_500(MY_Response::$EVENT_UNKNOWN_ERROR_OCCURED);
            return;
        }

        $this->respond_200($user);
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
            $response_body = 
            $this->my_response->getResBodyFailMsg('Search query is not valid!');
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
        $this->respond_200($output);
    }

    /*
    *   @ Usage : http://${base_domain}/CI/index.php/api/naver/searchmap?q=서울특별시 송파구 올림픽로 212 갤러리아팰리스
    */

    public function searchmap_get() {

        // check params
        $query = $this->my_paramchecker->get('q','search_q_naver_map');

        $output = array();
        if(empty($query)) 
        {
            $response_body =
            $this->my_response->getResBodyFailMsg('Search query is not valid!');
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

        $this->respond_200($output);
    }




    /*
    *   @ Usage : http://${base_domain}/CI/index.php/api/naver/searchlocal?q=스타벅스%20잠실
    */
    public function state_get() 
    {
        // CSRF 방지를 위한 상태 토큰 검증
        // 세션 또는 별도의 저장 공간에 저장된 상태 토큰과 콜백으로 전달받은 state 파라미터의 값이 일치해야 함

        // 콜백 응답에서 state 파라미터의 값을 가져옴
        $state = $this->my_paramchecker->get('state','naver_login_state');
        if(empty($state)) 
        {
            $response_body =
            $this->my_response->getResBodyFailMsg('state is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        // 세션 또는 별도의 저장 공간에서 상태 토큰을 가져옴
        if(array_key_exists($this->session_state_key, $_SESSION)) 
        {
            $stored_state = $_SESSION[$this->session_state_key];
        }

        $is_valid_state = false;
        if( !empty($stored_state) && $state == $stored_state ) 
        {
            $is_valid_state = true;
        }

        $output["is_valid_state"] = $is_valid_state;
        $output["param_state"] = $state;
        $output["stored_state"] = "";
        if($is_valid_state)
        {
            $output["stored_state"] = $stored_state;
        }

        $this->respond_200($output);
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

    // REMOVE ME
    /*
    private function generate_state() 
    {
        $mt = microtime();
        $rand = mt_rand();
        return md5($mt . $rand);
    } // end function

    private function get_new_state()
    {
        // 상태 토큰으로 사용할 랜덤 문자열을 생성
        $state = $this->generate_state();

        // 세션 또는 별도의 저장 공간에 상태 토큰을 저장
        $_SESSION[$this->session_state_key] = $state;

        return $state;        
    }
    */


    /*
    *   @ Desc : 네이버 로그아웃
    */
    public function logout_get()
    {
        // Need to implement
    }

    /*
    *   @ Desc : 유저 정보를 가져옵니다.
    */
    public function get_user($naver_id=-1) 
    {
        if($this->my_paramchecker->is_not_ok("naver_id", $naver_id))
        {
            return null;   
        }

        return $this->my_sql->get_user_naver($naver_id);
    }


    /*
    *   @ Desc : 새로운 유저를 추가합니다.
    */
    public function add_user($naver_user=null) 
    {
        // $is_debug = true;
        $is_debug = false;

        if($is_debug) print_r($naver_user);
        if($is_debug) echo "add_user 1-1 <br/>\n";

        if(is_null($naver_user)) 
        {
            return;
        }

        /*
        {
            age: "30-39"
            birthday: "03-29"
            email: "wonder13662@naver.com"
            enc_id: "883922d718931108f3c278a9b5e33e6661728b694efc5003684c011e76d14c4b"
            gender: "M"
            id: "67025373"
            name: "정원덕"
            nickname: "wonder1****"
            profile_image: "https://ssl.pstatic.net/static/pwe/address/nodata_33x33.gif"
        }
        */
        
        $age = $this->my_keyvalue->get($naver_user, "age");
        if(empty($age))
        {
            return;
        }

        if($is_debug) echo "add_user 1-2 <br/>\n";

        // age: "30-39" --> 2016 - 35 = 1981 년생
        $age_arr = explode("-", $age);
        $year_birth = -1;        
        if(!empty($age_arr) && (2 == count($age_arr))) 
        {
            $head = intval($age_arr[0]);
            $tail = intval($age_arr[1]);
            $inbetween = round(($head + $tail)/2);

            $year_now = intval($this->my_time->get_now_YYYY());
            $year_birth = $year_now - $inbetween;
        }
        if($this->my_paramchecker->is_not_ok("user_birth_range", $year_birth))
        {
            // 기본값 설정
            $year_birth = -1;
        }
        
        $birthday = $this->my_keyvalue->get($naver_user, "birthday");
        if($this->my_paramchecker->is_not_ok("user_birthday", $birthday))
        {
            // 기본값 설정
            $birthday = "";
        }
        
        $email = $this->my_keyvalue->get($naver_user, "email");
        if($this->my_paramchecker->is_not_ok("user_email", $email))
        {
            $this->respond_500('email is not valid!');
            return;
        }
        $gender = $this->my_keyvalue->get($naver_user, "gender");
        if($this->my_paramchecker->is_not_ok("user_gender", $gender))
        {
            // 기본값 설정 / 선택
            $user_gender_list = $this->get_const("user_gender_list");
            $gender = "";
            if(!empty($user_gender_list))
            {
                $gender = $user_gender_list[count($user_gender_list) - 1];
            }
        }

        if($is_debug) echo "add_user 1-3 <br/>\n";

        $naver_id = $this->my_keyvalue->get($naver_user, "id");
        if($this->my_paramchecker->is_not_ok("naver_id", $naver_id))
        {
            $this->respond_500('naver_id is not valid!');
            return;
        }
        $name = $this->my_keyvalue->get($naver_user, "name");
        if(empty($name))
        {
            $this->respond_500('name is not valid!');
            return;
        }
        $nickname = $this->my_keyvalue->get($naver_user, "nickname");
        if(empty($nickname))
        {
            $this->respond_500('nickname is not valid!');
            return;
        }
        $profile_image = $this->my_keyvalue->get($naver_user, "profile_image");
        if(empty($profile_image))
        {
            $this->respond_500('profile_image is not valid!');
            return;
        }

        if($is_debug) echo "add_user 1-4 <br/>\n";

        // 1. 전달받은 프로파일 이미지로 섬네일을 만듭니다.
        // 1-1. 이미지가 지정되지 않은 상태라면, 기본 이미지 주소를 사용합니다.

        // 2. 나이는 연령대의 중간 연도를 사용합니다.
        // 3. 생일은 그대로 저장.
        // 4. 이메일 그대로 저장.

        // 섬네일 다운로드. - 네이버는 기본 33x33 사이즈.
        // 다운로드 받지 않고 기본 섬네일을 사용합니다.
        $thumbnail_url = $this->get_const("user_thumbnail_default");

        $last_query = 
        $this->my_sql->insert_user_naver(
            // $naver_id=-1, 
            $naver_id,
            // $year="", 
            $year_birth,
            // $birthday="", 
            $birthday,
            // $gender="",
            $gender,
            // $email="",
            $email, 
            // $nickname="", 
            $nickname,
            // $name="", 
            $name,
            // $thumbnail_url=""
            $thumbnail_url
        );

        if($is_debug) echo "add_user 1-5 <br/>\n";

        return $last_query;
    } 


    /*
    *   @ Desc : 서버 내부 에러 응답 객체를 만드는 helper method
    */
    public function respond_500($msg="")
    {
        if(empty($msg)) 
        {
            return;
        }

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $this->set_response(
                // $response_body
                $this->my_response->getResBodyFailMsg($msg),
                // status code
                REST_Controller::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    } 

    /*
    *   @ Desc : 서버 내부 200 정상 응답 객체를 만드는 helper method
    */
    public function respond_200($data=null)
    {
        if(is_null($data)) 
        {
            return;
        }

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $response_body = $this->my_response->getResBodySuccessData($data);
            $this->set_response($response_body, REST_Controller::HTTP_OK);
        }
    } 


    /*
    *   @ Desc : my_paramchecker가 가지고 있는 상수값 리스트를 키 이름에 맞게 줍니다.
    */
    private function get_const($key="") 
    {
        if(empty($key)) 
        {
            return null;
        }
        if(!isset($this->my_paramchecker)) 
        {
            return null;
        }

        return $this->my_paramchecker->get_const($key);
    }


}
