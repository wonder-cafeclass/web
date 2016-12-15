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
require APPPATH . '/libraries/MY_REST_Controller.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : 페이스북 로그인 API 호출을 관리하는 클래스. \
*   @ Referer : https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
*   @ SDK : https://developers.facebook.com/docs/reference/php
*   @ API Explorer : https://developers.facebook.com/tools/explorer/145634995501895/?method=GET&path=me&version=v2.8
*   @ Graph API GUIDE : https://developers.facebook.com/docs/graph-api/reference/user
*/

class Facebook extends MY_REST_Controller {

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

        // Library Loaded from parent - MY_REST_Controller
        /*
        date_default_timezone_set('Asia/Seoul');
        $this->load->database();
        $this->load->library('MY_Error');
        $this->load->library('MY_Path');
        $this->load->library('MY_KeyValue');
        $this->load->library('MY_ParamChecker');
        $this->load->library('MY_Response');
        $this->load->library('MY_Time');
        $this->load->library('MY_Curl');
        $this->load->library('MY_ApiKey');
        $this->load->library('MY_Sql');
        $this->load->library('user_agent');
        $this->load->library('MY_Logger');
        */

        // Please add library you need here!
        $this->load->library('MY_Thumbnail');
        $this->load->library('email');
        $this->load->library('MY_Cookie');
        $this->load->library('MY_Auth');

        // start session
        session_start();

        // set API Key
        $this->Facebook_App_Id = $this->my_apikey->get($this->my_apikey->Facebook_App_Id);
        $this->Facebook_App_Secret = $this->my_apikey->get($this->my_apikey->Facebook_App_Secret);

    }

    private function set_session_facebook_state($new_state = "")
    {
        $_SESSION[$this->session_state_key] = $new_state;
    }
    private function get_session_facebook_state()
    {
        $stored_state = "";
        if(array_key_exists($this->session_state_key, $_SESSION)) 
        {
            $stored_state = $_SESSION[$this->session_state_key];
        }

        return $stored_state;
    }    

    /*
    *   @ Desc : 페이스북 로그인 창으로 이동하는 url을 만들어 돌려줍니다.
    */
    public function authurl_get() 
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        // API 호출에 제한이 있음.
        // 어떤 유저(ip, os, broswer)가 이 메서드를 호출했는지 기록필요. - 로그인그 작업.

        $auth_url = $this->api_get_auth;

        // private $api_get_auth = "https://www.facebook.com/v2.8/dialog/oauth?client_id={app-id}&redirect_uri={redirect-uri}&state={state}&response_type=token";

        // 1. client_id
        $pattern = '/\{app-id\}/i';
        $replacement = $this->Facebook_App_Id;
        $auth_url = preg_replace($pattern, $replacement, $auth_url);

        // 2. redirect_uri
        $pattern = '/\{redirect-uri\}/i';
        $replacement = $this->my_path->get_path_full($this->redirect_uri);
        $auth_url = preg_replace($pattern, $replacement, $auth_url);

        // 상태 토큰 가져오기.
        $this->set_session_facebook_state($this->my_auth->get_new_state_query_string_safe());
        $state = $this->get_session_facebook_state();

        // 3. state
        $pattern = '/\{state\}/i';
        $replacement = $state;
        $auth_url = preg_replace($pattern, $replacement, $auth_url);

        if(empty($auth_url)) 
        {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "auth_url is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );            
        }        

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        $output["auth_url"] = $auth_url;
        $this->respond_200($output);

    }

    /*
    *   @ Desc : 페이스북에서 인증코드를 입력, Access Key를 가져옵니다.
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
            $this->respond_500_detail(
                // $msg=""
                "facebook_code is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        $req_url = $this->api_get_access;

        // 1. app-id
        $pattern = '/\{app-id\}/i';
        $replacement = $this->Facebook_App_Id;
        $req_url = preg_replace($pattern, $replacement, $req_url);

        // 2. redirect-uri
        $pattern = '/\{redirect-uri\}/i';
        $replacement = $this->my_path->get_path_full($this->redirect_uri);
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
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "access_token is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "access_token"=>$access_token
                )
            );            
        }

        $token_type = $this->my_keyvalue->get($result, "token_type");
        if(!empty($token_type))
        {
            $_SESSION[$this->session_token_type] = $token_type;
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "token_type is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "access_token"=>$access_token,
                    "token_type"=>$token_type
                )
            );            
        }

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        $output["result"] = $result;
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
            $this->respond_500_detail(
                // $msg=""
                "access_token is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );            
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
        if($this->is_not_ok_param("facebook_id", $facebook_id))
        {
            $this->respond_500_detail(
                // $msg=""
                "facebook_id is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );            
            return;
        }
        $name = $this->my_keyvalue->dig($result, ["name"]);
        if($this->is_not_ok_param("facebook_name", $name))
        {
            $this->respond_500_detail(
                // $msg=""
                "name is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }
        $email = $this->my_keyvalue->dig($result, ["email"]);
        if($this->is_not_ok_param("user_email", $email))
        {
            $this->respond_500_detail(
                // $msg=""
                "email is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );            
            return;
        }

        // 페이스북 유저 추가 정보
        $fb_thumbnail_url = $this->my_keyvalue->dig($result, ["picture","data","url"]);
        if(empty($fb_thumbnail_url))
        {
            $this->respond_500_detail(
                // $msg=""
                "fb_thumbnail_url is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
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
                $this->respond_500_detail(
                    // $msg=""
                    "thumbnail_url is not valid!",
                    // $function=""
                    __FUNCTION__,
                    // $file=""
                    __FILE__,
                    // $line=""
                    __LINE__
                );                
                return;
            }
            $thumbnail_url = $this->my_path->get_path_user_thumb_loadable($thumbnail_url);

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
            $this->respond_500_detail(
                // $msg=""
                "\$user is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        $output["me"] = $user;
        $this->respond_200($output);

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
            $this->respond_500_detail(
                // $msg=""
                "state is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        // 세션 또는 별도의 저장 공간에서 상태 토큰을 가져옴
        $stored_state = $this->get_session_facebook_state();

        $is_valid_state = false;
        if( !empty($stored_state) && $state == $stored_state ) 
        {
            $is_valid_state = true;
        }


        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];        

        $output["is_valid_state"] = $is_valid_state;
        $output["param_state"] = $state;
        $output["stored_state"] = $stored_state;
        if(!$is_valid_state)
        {
            $this->respond_200_Failed(
                // $msg=""
                "stored_state is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "output"=>$output
                )
            );            
        }

        $this->respond_200($output);
    }

    /*
    *   @ Desc : 페이스북 로그아웃
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
        if($this->is_not_ok_param("facebook_id", $facebook_id))
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

        if($this->is_not_ok_param("facebook_id", $facebook_id))
        {
            $this->respond_500_detail(
                // $msg=""
                "\$facebook_id is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }
        if($this->is_not_ok_param("user_email", $email))
        {
            $this->respond_500_detail(
                // $msg=""
                "\$email is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );            
            return;
        }
        if($this->is_not_ok_param("facebook_name", $name))
        {
            $this->respond_500_detail(
                // $msg=""
                "\$name is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }
        if(empty($thumbnail_url))
        {
            $this->respond_500_detail(
                // $msg=""
                "\$thumbnail_url is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        // 페이스북 유저 이름은 다음과 같은 형식이다. 공백을 기준으로 2개 이상의 이름이 있다면 First Name, Last Name으로 사용한다.
        // {"name": "Wonder Jung"}

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

    } 
   
}
