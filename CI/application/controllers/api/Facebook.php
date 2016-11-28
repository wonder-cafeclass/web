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

// @ TODO - MY_REST_Controller를 상속받아야 합니다.

/*
*   @ Author : Wonder Jung
*   @ Desc : 페이스북 로그인 API 호출을 관리하는 클래스. \
*   @ Referer : https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
*   @ SDK : https://developers.facebook.com/docs/reference/php
*   @ API Explorer : https://developers.facebook.com/tools/explorer/145634995501895/?method=GET&path=me&version=v2.8
*   @ Graph API GUIDE : https://developers.facebook.com/docs/graph-api/reference/user
*/
class Facebook extends REST_Controller implements MY_Class{

    private $api_get_auth = "https://www.facebook.com/v2.8/dialog/oauth?client_id={app-id}&redirect_uri={redirect-uri}&state={state}&response_type=code&scope=public_profile,email";

    private $api_get_access = "https://graph.facebook.com/v2.8/oauth/access_token?client_id={app-id}&redirect_uri={redirect-uri}&client_secret={app-secret}&code={code-parameter}";

    private $api_inspect_access_token = "https://graph.facebook.com/debug_token?input_token={token-to-inspect}&access_token={app-token-or-admin-token}";

    private $api_get_me = "https://graph.facebook.com/v2.8/me?fields=id%2Cname%2Cemail%2Cpicture.width(300).height(300)&access_token={access_token}";

    // private $api_get_big_picture = "https://graph.facebook.com/{user-id}/picture?type=large";

    /*
    // 사용자 섬네일 큰사진 가져오기 (200 x 200)
    https://graph.facebook.com/881025428610124/picture?type=large
    https://graph.facebook.com/{user-id}/picture?type=large

    // curl sample

    // fields=id,name,picture,email

    curl -i -X GET \
     "https://graph.facebook.com/v2.8/me?fields=id%2Cname%2Cpicture%2Cemail&access_token=EAACEdEose0cBAAovyXn0GROl3ZCi8WQJVd6yfZBrvNkU66b25OUCLmveKjTWI2XM2PrGio6LKc9QpimZA5OO4VjfDi7brCZBUyLzmXfKGt18REWlAQJTT0qZA80KYOaENbHzWm2oTlZCljlIpCrXHnf9EFZCB5jARBQ0Czb77I9DQZDZD"
    */

    /*
    
    // Canceled Login

    YOUR_REDIRECT_URI?
    error_reason=user_denied
    &error=access_denied
    &error_description=The+user+denied+your+request.

    */


    private $Facebook_App_Id="";
    private $Facebook_App_Secret="";

    private $session_state_key="facebook_auth_state";
    private $session_access_token="facebook_access_token";
    private $session_token_type="facebook_token_type";

    private $redirect_uri="/assets/plugin/multi-login/authorized_facebook.html";
    
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

        // start session
        session_start();

        // set API Key
        $this->Facebook_App_Id = $this->my_apikey->get($this->my_apikey->Facebook_App_Id);
        $this->Facebook_App_Secret = $this->my_apikey->get($this->my_apikey->Facebook_App_Secret);

        // Do someting...
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

        $req_url = $this->api_get_auth;

        // private $api_get_auth = "https://www.facebook.com/v2.8/dialog/oauth?client_id={app-id}&redirect_uri={redirect-uri}&state={state}&response_type=token";

        // 1. client_id
        $pattern = '/\{app-id\}/i';
        $replacement = $this->Facebook_App_Id;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 2. redirect_uri
        $pattern = '/\{redirect-uri\}/i';
        $replacement = $this->my_path->get_full_path($this->redirect_uri);
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 상태 토큰 가져오기.
        $state = $this->get_new_state();

        // 3. state
        $pattern = '/\{state\}/i';
        $replacement = $state;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        $output = $req_url;

        $this->respond_200($output);

        // http://devcafeclass.co.uk/assets/plugin/multi-login/authorized_facebook.html?#state=60b33f10ebeaedd1f3c4b6657e5b2499&access_token=EAAXvZBHVXolIBAIx1Lcna8PXNsjIZCatcEXaZCKZB6wQXdfQUtr84k2WSGZC3fub57L6DD6ZAIUG7KNZB6D4tsUKZA5pBjH6MjAG5RptsmfRj3EynyJLgZAlHBDHGOt3ntlCpEK3e8mVtJYH5ZBRDqgZBN70AS1o7ae2dy1Y17dHw0fsAZDZD&expires_in=3974

        // http://devcafeclass.co.uk/assets/plugin/multi-login/authorized_facebook.html?code=AQBG_bzPBQn_cYYrjrIFqC4wlE50kt-hsO28qhaFfYxbEfrTlkonuw8Upfn5l6dtrJia9mIHRyn4F2C9ykmdty9HSsCdhzNpaqicBwANuYG2FvNPIhR20BDd9UIk382SCkwYGyZxI2YNr2d-LDZrOB2F2SMzIkbByvS9rh9iMEmk0nI4CCVPJ9fCQxBFiN1XlI96xLzdi4iGbuSglkU3w0b6Bu6YOGRXsZNo25C1uCU0gBJJCmW25QoRonrx2GH6hCq7aMjvJMHonVkz8__OkrwSIGpFw5XusxqTr1NsqyVNwDVErFhryCJZObCsGvBZfM5BnkDBDvoKuowWuWFKDnSa&state=d46e3622d9d32a748217ee8b78291c0e#_=_
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

        // 콜백 응답에서 facebook_code 파라미터의 값을 가져옴
        $facebook_code = $this->my_paramchecker->get('code','facebook_code');
        if(empty($facebook_code)) 
        {
            $this->respond_500('facebook_code is not valid!');
            return;
        }

        $req_url = $this->api_get_access;

        // 1. app-id
        $pattern = '/\{app-id\}/i';
        $replacement = $this->Facebook_App_Id;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 2. redirect-uri
        $pattern = '/\{redirect-uri\}/i';
        $replacement = $this->my_path->get_full_path($this->redirect_uri);
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 3. client_secret
        $pattern = '/\{app-secret\}/i';
        $replacement = $this->Facebook_App_Secret;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 4. code
        $pattern = '/\{code-parameter\}/i';
        $replacement = $facebook_code;
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

        /*
        // Example Response
        {
          "access_token": {access-token}, 
          "token_type": {type},
          "expires_in": {seconds-til-expiration}
        }
        */

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
    *   @ Desc : 페이스북의 회원 정보를 가져옵니다. !접근 토큰(Access Token)이 필요합니다!
    */
    public function me_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        // 콜백 응답에서 facebook_token_type, facebook_access_token 파라미터의 값을 가져옴
        $access_token = $_SESSION[$this->session_access_token];
        if(empty($access_token)) 
        {
            $response_body =
            $this->my_response->getResBodyFailMsg('access_token is not valid!');
            $this->set_response($response_body, REST_Controller::HTTP_OK);
            return;
        }

        $req_url = $this->api_get_me;

        // 1. app-id
        $pattern = '/\{access_token\}/i';
        $replacement = $access_token;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        $result =
        $this->my_curl->get_json(
            // $url=""
            $req_url,
            // $header_arr=null
            [],
            // $attr_arr=null
            [],
            // $post_params
            []
        );

        // 페이스북 유저 기본 정보
        $facebook_id = $this->my_keyvalue->dig($result, ["id"]);
        if($this->my_paramchecker->is_not_ok("facebook_id", $facebook_id))
        {
            $this->respond_500("facebook_id is not valid!");
            return;
        }
        $name = $this->my_keyvalue->dig($result, ["name"]);
        if($this->my_paramchecker->is_not_ok("facebook_name", $name))
        {
            $this->respond_500("name is not valid!");
            return;
        }
        $email = $this->my_keyvalue->dig($result, ["email"]);
        if($this->my_paramchecker->is_not_ok("user_email", $email))
        {
            $this->respond_500("email is not valid!");
            return;
        }

        // wonder.jung
        // 페이스북 유저 추가 정보
        $fb_thumbnail_url = $this->my_keyvalue->dig($result, ["picture","data","url"]);
        if(empty($fb_thumbnail_url))
        {
            $this->respond_500("fb_thumbnail_url is not valid!");
            return;
        }

        $user = null;
        if(0 < $facebook_id) 
        {
            $user = $this->get_user($facebook_id);
        }
        if(0 < $facebook_id && is_null($user))
        {
            // 섬네일을 추가합니다. 신규 유저 등록시에만 작동합니다.
            $thumbnail_url = $this->my_thumbnail->get_user_thumbnail($fb_thumbnail_url);
            if(empty($thumbnail_url))
            {
                $this->respond_500("thumbnail_url is not valid!");
                return;
            }
            $thumbnail_url = $this->my_path->get_user_thumb_loadable_path($thumbnail_url);

            // 회원 정보를 검사, 없다면 회원으로 추가합니다.
            // 유저 등록이 진행되었다면, 추가 정보 입력이 필요함. 추가 정보 입력창으로 이동.
            $this->add_user(
                // $facebook_id=-1
                $facebook_id,
                // $name="" 
                $name,
                // $email=""
                $email,
                // $thumbnail_url=""
                $thumbnail_url
            );
            $user = $this->get_user($facebook_id);   
        }
        else if(0 < $facebook_id)
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
    *   @ Usage : http://${base_domain}/CI/index.php/api/facebook/searchlocal?q=스타벅스%20잠실
    */
    public function state_get() 
    {
        // CSRF 방지를 위한 상태 토큰 검증
        // 세션 또는 별도의 저장 공간에 저장된 상태 토큰과 콜백으로 전달받은 state 파라미터의 값이 일치해야 함

        // 콜백 응답에서 state 파라미터의 값을 가져옴
        $state = $this->my_paramchecker->get('state','facebook_login_state');
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
    // https://developers.facebook.com/docs/login/web - 1.1.1. PHP로 구현한 상태 토큰 생성 코드 예
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
        // 상태 토큰으로 사용할 랜덤 문자열을 생성
        $state = $this->generate_state();

        // 세션 또는 별도의 저장 공간에 상태 토큰을 저장
        $_SESSION[$this->session_state_key] = $state;

        return $state;        
    }


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
    public function get_user($facebook_id=-1) 
    {
        if($this->my_paramchecker->is_not_ok("facebook_id", $facebook_id))
        {
            return null;   
        }

        return $this->my_sql->get_user_facebook($facebook_id);
    }


    /*
    *   @ Desc : 새로운 유저를 추가합니다.
    */
    public function add_user($facebook_id=-1, $name="", $email="", $thumbnail_url="") 
    {
        // $is_debug = true;
        $is_debug = false;

        if($is_debug) echo "add_user 1-1 <br/>\n";

        if($this->my_paramchecker->is_not_ok("facebook_id", $facebook_id))
        {
            $this->respond_500('facebook_id is not valid!');
            return;
        }
        if($this->my_paramchecker->is_not_ok("user_email", $email))
        {
            $this->respond_500('email is not valid!');
            return;
        }
        if($this->my_paramchecker->is_not_ok("facebook_name", $name))
        {
            $this->respond_500("name is not valid!");
            return;
        }
        if(empty($thumbnail_url))
        {
            $this->respond_500("thumbnail_url is not valid!");
            return;
        }

        // 페이스북 유저 이름은 다음과 같은 형식이다. 공백을 기준으로 2개 이상의 이름이 있다면 First Name, Last Name으로 사용한다.
        // {"name": "Wonder Jung"}

        if($is_debug) echo "add_user 1-4 <br/>\n";

        $last_query = 
        $this->my_sql->insert_user_facebook(
            // $facebook_id=-1 
            $facebook_id,
            // $email=""
            $email,
            // $nickname="", 
            $name,
            // $name="", 
            $name,
            // $thumbnail_url=""
            $thumbnail_url
        );

        if($is_debug) echo "add_user 1-5 / \$last_query : $last_query <br/>\n";
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

        $this->report_error(
            // $error_type=null
            $this->my_logger->ERROR_INTERNAL_SERVER_500,
            // $error_msg=""
            $msg
        );
    }

    /*
    *   @ Desc : 에러 상황을 기록하는 Logger method wrapper
    */
    public function report_error($error_type=null, $error_msg="")
    {
        if(is_null($error_type)) 
        {
            return;
        }
        if(empty($error_msg)) 
        {
            return;
        }
        if(is_null($this->my_logger)) 
        {
            return;
        }

        $this->my_logger->add_error(
            // $user_id=-1
            -1,
            // $error_type=""
            $error_type,
            // $error_msg=""
            $error_msg
        );
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
