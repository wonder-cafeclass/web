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
*   @ Desc : Kakao REST API 호출을 관리하는 클래스. 로그인 및 회원 정보 조회 API를 사용합니다.
*/

class Kakao extends MY_REST_Controller {

    private $api_get_code="https://kauth.kakao.com/oauth/authorize?client_id={app_key}&redirect_uri={redirect_uri}&response_type=code";

    private $api_post_token="https://kauth.kakao.com/oauth/token";
    private $api_post_signup="https://kapi.kakao.com/v1/user/signup";
    private $api_post_me="https://kapi.kakao.com/v1/user/me";

    private $Kakao_Native_App_Key="";
    private $Kakao_REST_API_Key="";
    private $Kakao_Javascript_Key="";
    private $Kakao_Admin_Key="";

    private $token_type;
    private $access_token;

    private $redirect_uri_kakao="/assets/plugin/multi-login/authorized_kakao.html";

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

        // set API Key
        $this->Kakao_Native_App_Key = $this->my_apikey->get($this->my_apikey->Kakao_Native_App_Key);
        $this->Kakao_REST_API_Key = $this->my_apikey->get($this->my_apikey->Kakao_REST_API_Key);
        $this->Kakao_Javascript_Key = $this->my_apikey->get($this->my_apikey->Kakao_Javascript_Key);
        $this->Kakao_Admin_Key = $this->my_apikey->get($this->my_apikey->Kakao_Admin_Key);
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
        // 어떤 유저(ip, os, broswer)가 이 메서드를 호출했는지 기록필요. - 로그 작업.

        $auth_url = $this->api_get_code;
        $pattern = '/\{app_key\}/i';
        $replacement = $this->Kakao_REST_API_Key;
        $auth_url = preg_replace($pattern, $replacement, $auth_url);

        $pattern = '/\{redirect_uri\}/i';
        $replacement = $this->my_path->get_path_full($this->redirect_uri_kakao);
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

    public function token_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $kakao_code = $this->my_paramchecker->get("code","kakao_code");
        if(empty($kakao_code)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "kakao_code is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_code"=>$kakao_code
                )
            );
            return;
        }

        // 1. 로그인에 성공한 유저가 kakao-code로 API 통신을 위한 token을 가져옵니다.
        $kakao_token = $this->postToken($kakao_code);
        if(is_null($kakao_token))
        {
            $this->respond_200_Failed(
                // $msg=""
                "kakao_token is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_code"=>$kakao_code,
                    "kakao_token"=>$kakao_token
                )
            );
            return;
        }

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        if($this->my_keyvalue->has($kakao_token,"access_token"))
        {
            $output["access_token"] = $kakao_token["access_token"];
        }
        if($this->my_keyvalue->has($kakao_token,"token_type"))
        {
            $output["token_type"] = $kakao_token["token_type"];
        }
        
        $this->respond_200($output);
    }

    public function signup_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $kakao_token_type = $this->my_paramchecker->get("token_type","kakao_token_type");
        if(empty($kakao_token_type)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "kakao_token_type is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type
                )
            );
            return;
        }
        $kakao_access_token = $this->my_paramchecker->get("access_token","kakao_access_token");
        if(empty($kakao_access_token)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "kakao_access_token is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type,
                    "kakao_access_token"=>$kakao_access_token
                )
            );
            return;
        }

        // 1. 로그인에 성공한 유저가 kakao-code로 API 통신을 위한 token을 가져옵니다.
        $singup = $this->postSignUp($kakao_token_type, $kakao_access_token);
        if(is_null($singup))
        {
            $this->respond_200_Failed(
                // $msg=""
                "singup is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type,
                    "kakao_access_token"=>$kakao_access_token,
                    "singup"=>$singup
                )
            );
            return;
        }

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        if($this->my_keyvalue->has($singup,"code"))
        {
            $output["code"] = $this->my_keyvalue->get($singup,"code");
        }
        if($this->my_keyvalue->has($singup,"msg"))
        {
            $output["msg"] = $this->my_keyvalue->get($singup,"msg");
        }
        $this->respond_200($output);
    } 

    public function me_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $kakao_token_type = $this->my_paramchecker->get("token_type","kakao_token_type");
        if(empty($kakao_token_type)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "kakao_token_type is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type
                )
            );
            return;
        }
        $kakao_access_token = $this->my_paramchecker->get("access_token","kakao_access_token");
        if(empty($kakao_access_token)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "kakao_access_token is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type,
                    "kakao_access_token"=>$kakao_access_token
                )
            );                       
            return;
        }

        // 1. 로그인에 성공한 유저가 자신의 kakao 계정 공개 정보를 가져옵니다.
        $me = $this->postMe($kakao_token_type, $kakao_access_token);
        if(is_null($me))
        {
            $this->respond_200_Failed(
                // $msg=""
                "me is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type,
                    "kakao_access_token"=>$kakao_access_token,
                    "me"=>$me
                )
            );             
            return;
        }

        // 2. 이미 등록되어 있는 유저인지 확인.
        $me = $this->checkUserRegistry($me);

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        $output["me"] = $me;

        $this->respond_200($output);
    } 
    /*
    *   @ Desc : 카카오 유저 정보가 정상적으로 들어왔다면 해당 유저의 등록 여부를 확인, 없다면 추가 등록한다.
    */
    private function checkUserRegistry($output=null) {

        if(is_null($output)) {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "output is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );            
            return;
        }

        $kakao_id = -1;
        $nickname = "";
        $profile_image = "";
        if(isset($output) && isset($output->id)) 
        {
            $kakao_id = intval($output->id);
        }
        else
        {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "\$output->id is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        $properties = $output->properties;
        if(isset($properties)) 
        {
            foreach ($properties as $key => $value) {
                if("nickname" === $key) 
                {
                    $nickname = $value;
                }
                else if("profile_image" === $key) 
                {
                    $profile_image = $value;
                }
            }

        }
        else
        {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "properties is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        $user = $this->get_user($kakao_id);
        if(is_null($user))
        {
            // 4-1-1-1. 등록되어 있지 않다면 새롭게 등록한다.

            // 4-1-1-2. 유저 닉네임(nickname) 등록.
            // 닉네임은 first name으로 등록합니다.

            // 4-1-1-3. 프로필 이미지를 서버에 업로드. 업로드한 이미지 주소를 DB에 등록한다.
            $thumbnail_url = $this->my_thumbnail->get_user_thumbnail($profile_image);
            $thumbnail_url = $this->my_path->get_path_user_thumb_loadable($thumbnail_url);
            if(!empty($thumbnail_url))
            {
                $this->add_user(
                    // $kakao_id=-1
                    $kakao_id,
                    // $nickname=""
                    $nickname, 
                    // $thumbnail_url=""
                    $thumbnail_url
                );
            }
            // 4-1-1-4. 유저 등록이 진행되었다면, 추가 정보 입력이 필요함. 추가 정보 입력창으로 이동.
            $user = $this->get_user($kakao_id);
        }
        else 
        {
            // 4-1-2-1. 등록되어 있다면 등록하지 않는다.
            // 4-1-2-2. 뷰에 정상적으로 로그인된 것을 알려줌.
            // 4-1-2-3. (Redirect)유저 등록이 이미 완료된 상태라면, 로그인을 호출한 위치로 돌아간다.
        } 

        return $user;
    }       

    /*
    *   @ Desc : 사용자의 카카오 토큰를 받아옵니다.
    */
    private function postToken($kakao_code="") {

        if(empty($kakao_code)) {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "kakao_code is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return null;
        }
        if(empty($this->Kakao_REST_API_Key)) {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "Kakao_REST_API_Key is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );            
            return null;
        }

        // authorization code 유효 시간은 3분 - https://devtalk.kakao.com/t/invalid-grant/18816/3

        $redirect_uri = $this->my_path->get_path_full($this->redirect_uri_kakao);
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
        
        $result_arr = [];
        foreach ($result as $key => $value) 
        {
            if( "access_token" === $key || 
                "token_type" === $key ||  
                "error" === $key ||  
                "error_description" === $key )
            {
               $result_arr[$key] = $value;
            }
        }
        if(empty($result_arr)) 
        {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "result is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
        }

        // Sample Data
        /*
        // OK
        {
            access_token:"qtGqEEpWNmyWqzAAyDjqa_wwI-WMgic_E_tMdQo8BJ4AAAFYZXvxvQ"
            expires_in:21599
            refresh_token:"ROR4rs00L6BjN2lPvYa6-RPrS1RB-2NFlpGnHAo8BJ4AAAFYZXvxuQ"
            scope:"profile"
            token_type:"bearer"
        }
        // ERROR
        stdClass Object
        (
            [error] => invalid_grant
            [error_description] => invalid_authorization_code
        )   

        // curl test
        curl -v -X POST https://kauth.kakao.com/oauth/token \
        -d 'grant_type=authorization_code' \
        -d 'client_id=d0c854c16fc07b13a78c02ebe3a6ad9e' \
        -d 'redirect_uri=http://devcafeclass.co.uk/cafeclass/assets/plugin/multi-login/authorized_kakao.html' \
        -d 'code=XRgDTYwhF1716eeQysoqWjOrHnK_TE2OfrRSa4csD9Kr86cMt2LwgAkN4LWYTgSmpc3bZwo8BRIAAAFYZr92Hw'    
        */

        return $result_arr;
    } 
    /*
    *   @ Desc : 유저를 카카오톡 cafeclass앱연결 - 사용자를 카카오톡->cafeclass 앱에 가입/등록.
    */
    private function postSignUp($kakao_token_type="", $kakao_access_token="") {

        if(empty($kakao_token_type)) {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "kakao_token_type is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return "";
        }
        if(empty($kakao_access_token)) {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "kakao_access_token is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
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

        if(empty($result)) {
            $this->respond_200_Failed(
                // $msg=""
                "result is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type,
                    "kakao_access_token"=>$kakao_access_token
                )
            );
        } // end if

        return $result;
    }    
    private function postMe($kakao_token_type="", $kakao_access_token="") {

        if(empty($kakao_token_type)) {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "kakao_token_type is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return "";
        }
        if(empty($kakao_access_token)) {
            // Error Report
            $this->respond_500_detail(
                // $msg=""
                "kakao_access_token is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
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

        if(empty($result)) {
            $this->respond_200_Failed(
                // $msg=""
                "result is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_token_type"=>$kakao_token_type,
                    "kakao_access_token"=>$kakao_access_token
                )
            );
        } // end if

        return $result;
    }     

    /*
    *   @ Desc : 카카오톡 로그아웃
    */
    public function logout_get()
    {
        // Need to implement
    }

    /*
    *   @ Desc : 유저 정보를 가져옵니다.
    */
    public function get_user($kakao_id=-1) 
    {
        if(!(0 < $kakao_id)) 
        {
            return null;
        }
        return $this->my_sql->get_user_kakao($kakao_id);
    }

    /*
    *   @ Desc : 새로운 유저를 추가합니다.
    */
    public function add_user($kakao_id=-1, $nickname="", $thumbnail_url="") 
    {
        if(!(0 < $kakao_id)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "0 < \$kakao_id : $kakao_id",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_id"=>$kakao_id,
                    "nickname"=>$nickname,
                    "thumbnail_url"=>$thumbnail_url
                )
            );                      
            return;
        }
        if(empty($nickname)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "nickname is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_id"=>$kakao_id,
                    "nickname"=>$nickname,
                    "thumbnail_url"=>$thumbnail_url
                )
            );
            return;
        }
        if(empty($thumbnail_url)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "thumbnail_url is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "kakao_id"=>$kakao_id,
                    "nickname"=>$nickname,
                    "thumbnail_url"=>$thumbnail_url
                )
            );
        }

        $this->my_sql->insert_user_kakao(
            // $kakao_id=-1
            $kakao_id,
            // $nickname=""
            $nickname, 
            // $thumbnail_url=""
            $thumbnail_url
        );
    }
   
}
