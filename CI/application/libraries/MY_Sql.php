<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * php curl을 편리하게 사용하기 위한 래핑 클래스
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */

require APPPATH . '/models/Teacher.php';
require APPPATH . '/models/User.php';
require APPPATH . '/models/UserValidation.php';
require APPPATH . '/models/UserCookie.php';

/*
require APPPATH . '/models/SelectTile.php';
require APPPATH . '/models/KlassCourse.php';
require APPPATH . '/models/KlassKeyword.php';
require APPPATH . '/models/KlassLevel.php';
require APPPATH . '/models/KlassStation.php';
require APPPATH . '/models/KlassDay.php';
require APPPATH . '/models/KlassTime.php';
require APPPATH . '/models/KlassCalendar.php';
require APPPATH . '/models/KlassReview.php';
require APPPATH . '/models/KlassQuestion.php';
*/

class MY_Sql
{
	private $CI=null;

    function __construct()
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
            return;
        }

        if(!isset($this->CI->my_error)) 
        {
            return;
        }

        if(!isset($this->CI->my_paramchecker)) 
        {
            return;
        }
    }

    /*
    *   @ Desc : 이 클래스를 실행하기 전에 준비해야 하는 사전 정보들에 대한 검사.
    */
    private function is_not_ready()
    {
        return !$this->is_ready();
    }
    private function is_ready()
    {
        if(is_null($this->CI->my_error)) 
        {
            return false;
        }
        if(is_null($this->CI->my_paramchecker)) 
        {
            return false;
        }
        if(is_null($this->CI->my_logger))
        {
            return false;   
        }

        return true;
    }    

    private function is_not_ok($key=null, $value=null) 
    {   
        return !$this->is_ok($key, $value);
    }

    private function is_ok($key=null, $value=null) 
    {
        if(is_null($key)) 
        {
            return false;
        }
        if(is_null($value)) 
        {
            return false;
        }
        if(!isset($this->CI->my_paramchecker)) 
        {
            return false;
        }

        $result = $this->CI->my_paramchecker->is_ok($key, $value);
        if(isset($result) && ($result["success"] === true)) 
        {
            return true;
        }
        return false;
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
        if(!isset($this->CI->my_paramchecker)) 
        {
            return null;
        }

        return $this->CI->my_paramchecker->get_const($key);
    }




    public function insert_log_error($agent="", $agent_type="", $ip="", $type="", $user_id=-1, $msg="")
    {   
        if($this->is_not_ready())
        {
            return false;
        }
        if(empty($agent))
        {
            return false;
        }
        if($this->is_not_ok("agent_type", $agent_type))
        {
            return false;
        }
        if(empty($ip))
        {
            return false;
        }
        if(empty($type))
        {
            return false;
        }
        if(empty($msg))
        {
            return false;
        }

        $data = array(
            'agent' => $agent,
            'agent_type' => $agent_type,
            'ip' => $ip,
            'type' => $type,
            'user_id' => $user_id,
            'msg' => $msg
        );
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $sql = $this->CI->db->set($data)->get_compiled_insert('log_error');
        $is_success = 
        $this->log_query(
            // $user_id=-1
            -1,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );
        if(!$is_success) 
        {
            return $is_success;
        }

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('log_error', $data);

        return $is_success;
    }
    public function select_log_error($ip="", $type="")
    {
        if(empty($ip))
        {
            return;
        }
        if(empty($type))
        {
            return;
        }

        $data = array(
            'ip' => $ip,
            'type' => $type
        );

        $this->CI->db->select("*");
        $this->CI->db->where('ip', $ip);
        $this->CI->db->where('type', $type);
        $this->CI->db->order_by('date_created', 'DESC');
        $this->CI->db->limit(1);
        $query = $this->CI->db->get('log_error');

        $log_error = null;
        foreach ($query->result() as $row)
        {
            $log_error = $row;
        } // end foreach

        return $log_error;
    }

    /*
    *   @ Desc : 사용자들의 중요한 클릭, 페이지 진입등의 행동에 대해 기록합니다.
    */
    public function insert_log_action($agent="", $agent_type="", $ip="", $type="", $user_id=-1, $key="", $uri="")
    {
        if($this->is_not_ready())
        {
            return;
        }
        if(empty($agent))
        {
            return;
        }
        if($this->is_not_ok("agent_type", $agent_type))
        {
            return;
        }
        if(empty($ip))
        {
            return;
        }
        if(empty($type))
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if(empty($key))
        {
            return;
        }

        $data = array(
            'agent' => $agent,
            'agent_type' => $agent_type,
            'ip' => $ip,
            'type' => $type,
            'user_id' => $user_id,
            'key' => $key,
            'uri' => $uri
        );
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('log_action', $data);
    }
    public function select_log_action()
    {
        
    }

    /*
    *   @ Desc : 사용자들이 수행한 INSERT/UPDATE/DELETE 쿼리에 대해 기록합니다.
    */
    public function insert_log_query($agent="", $agent_type="", $ip="", $type="", $user_id=-1, $query="")
    {
        if($this->is_not_ready())
        {
            return false;
        }

        if(empty($agent))
        {
            return false;
        }
        if($this->is_not_ok("agent_type", $agent_type))
        {
            return false;
        }
        if(empty($ip))
        {
            return false;
        }
        if(empty($type))
        {
            return false;
        }
        if(empty($query))
        {
            return false;
        }

        $data = array(
            'agent' => $agent,
            'agent_type' => $agent_type,
            'ip' => $ip,
            'type' => $type,
            'user_id' => $user_id,
            'query' => $query
        );
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('log_query', $data);

        return true;
    }
    public function select_log_query()
    {
        
    }    






    public function insert_user_facebook($facebook_id=-1, $email="", $nickname="", $name="", $thumbnail_url="")
    {
        if($this->is_not_ready())
        {
            return;
        }

        if($this->is_not_ok("facebook_id", $facebook_id))
        {
            // @ Required / 필수
            return;   
        }
        if($this->is_not_ok("user_email", $email))
        {
            // 기본값 설정 / 선택
            $email = "";
        }
        if(empty($nickname))
        {
            // @ Required / 필수
            return;   
        }
        if(empty($name)) 
        {
            // @ Required / 필수
            return;
        }
        if(empty($thumbnail_url)) 
        {
            // @ Required / 필수
            return;
        }

        /*
        {
            email:"wonder13662@gmail.com"
            id:"1209558789090118"
            name:"Wonder Jung"    
        }
        */

        $data = array(
            'facebook_id' => $facebook_id,
            'email' => $email,
            'nickname' => $nickname,
            'name' => $name,
            'thumbnail' => $thumbnail_url
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('user');
        $this->log_query(
            // $user_id=-1
            -1,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('user', $data);
    }

    public function get_user_facebook($facebook_id="")
    {
        // Do something...
        if(empty($facebook_id)) 
        {
            return null;
        }

        $this->CI->db->where('facebook_id', $facebook_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user', $limit, $offset);

        $row = $query->custom_row_object(0, 'User');

        return $this->decorate_user($row);        
    }

    public function insert_user_naver($naver_id=-1, $birth_year=-1, $birthday="", $gender="",$email="", $nickname="", $name="", $thumbnail_url="")
    {
        if($this->is_not_ready())
        {
            return;
        }        

        if($this->is_not_ok("naver_id", $naver_id))
        {
            // @ Required / 필수
            return;   
        }
        if($this->is_not_ok("user_birth_range", $birth_year))
        {
            // 기본값 설정 / 선택
            $birth_year = -1;
        }
        if($this->is_not_ok("birthday", $birthday))
        {
            // 기본값 설정 / 선택
            $birthday = "";
        }
        if($this->is_not_ok("gender", $gender))
        {
            // 기본값 설정 / 선택
            $user_gender_list = $this->get_const("user_gender_list");
            $gender = "";
            if(!empty($user_gender_list))
            {
                $gender = $user_gender_list[count($user_gender_list) - 1];
            }
        }
        if($this->is_not_ok("user_email", $email))
        {
            // 기본값 설정 / 선택
            $email = "";
        }
        if(empty($nickname))
        {
            // @ Required / 필수
            return;   
        }
        if(empty($name)) 
        {
            // @ Required / 필수
            return;
        }
        if(empty($thumbnail_url)) 
        {
            // @ Required / 필수
            return;
        }

        // TODO - Shield - 같은 ip에서 연속으로 같은 쿼리 시도를 막는다.(1분 주기?)

        $data = array(
            'naver_id' => $naver_id,
            'birthday' => $birthday,
            'gender' => $gender,
            'email' => $email,
            'nickname' => $nickname,
            'name' => $name,
            'thumbnail' => $thumbnail_url
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('user');
        $this->log_query(
            // $user_id=-1
            -1,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('user', $data);
    }

    public function get_user_naver($naver_id=-1) 
    {
        if(!(0 < $naver_id)) 
        {
            return null;
        }

        $this->CI->db->where('naver_id', $naver_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user', $limit, $offset);

        $row = $query->custom_row_object(0, 'User');

        return $this->decorate_user($row);

    }    

    public function insert_user_kakao($kakao_id=-1, $nickname="", $thumbnail_url="")
    {
        if($this->is_not_ready())
        {
            return;
        }

        if(!(0 < $kakao_id)) 
        {
            return;
        }
        if(empty($nickname)) 
        {
            return;
        }
        if(empty($thumbnail_url)) 
        {
            return;
        }

        // Need to escape!

        // TODO - Shield - 같은 ip에서 연속으로 같은 쿼리 시도를 막는다.
        $data = array(
                'kakao_id' => $kakao_id,
                'nickname' => $nickname,
                'name' => $nickname,
                'thumbnail' => $thumbnail_url
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('user');
        $this->log_query(
            // $user_id=-1
            -1,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('user', $data);
    }

    private function log_query($user_id=-1, $action_type="", $query="") {

        if($this->is_not_ready())
        {
            return false;
        }

        if(empty($action_type))
        {
            return false;
        }

        if(empty($query))
        {
            return false;
        }

        $is_success = 
        $this->insert_log_query(
            // $agent=""
            $this->CI->my_logger->get_client_agent(),
            // $agent_type=""
            $this->CI->my_logger->get_agent_type(),
            // $ip=""
            $this->CI->my_logger->get_client_ip(),
            // $type=""
            $action_type,
            // $user_id=-1
            $user_id,
            // $query=""
            $query
        );        

        return $is_success;
    }

    public function insert_user($password_hashed="", $email="", $name="", $nickname="", $gender="", $birth_year="", $birth_month="", $birth_day="", $thumbnail="", $mobile_head="", $mobile_body="", $mobile_tail="")
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_password_hashed", $password_hashed))
        {
            return;
        }
        if($this->is_not_ok("user_email_insert", $email))
        {
            return;
        }
        if($this->is_not_ok("user_name", $name))
        {
            return;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            return;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            $birth_year = "";
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            $birth_month = "";
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            $birth_day = "";
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            $thumbnail = "";
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            return;
        }

        // 생일은 없는 경우, 공백 문자로 입력한다.
        $birthday = $this->getBirthday($birth_year, $birth_month, $birth_day);

        $data = array(
            'nickname' => $nickname,
            'name' => $name,
            'gender' => $gender,
            'birthday' => $birthday,
            'thumbnail' => $thumbnail,
            'mobile' => "$mobile_head-$mobile_body-$mobile_tail",
            'email' => $email,
            'password' => $password_hashed
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('user');
        $this->log_query(
            // $user_id=-1
            -1,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('user', $data);
    } 

    private function getBirthday($birth_year="", $birth_month="", $birth_day="") 
    {
        $birthday = "$birth_year-$birth_month-$birth_day";
        if(empty($birth_year) || empty($birth_month) || empty($birth_day)) 
        {
            $birthday = "";
        }

        return $birthday;
    }

    public function update_user_mutables_by_email($email="", $name="", $nickname="", $gender="", $birth_year="", $birth_month="", $birth_day="", $thumbnail="", $mobile_head="", $mobile_body="", $mobile_tail="")
    {

        // TODO - user id로 업데이트 되고 있음.
        // 숫자로 구성되어 있으므로 공격 확률이 있음. 
        // 문자열 조합키로 변경 필요 있음.

        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_email", $email))
        {
            return;
        }
        if($this->is_not_ok("user_name", $name))
        {
            return;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            return;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            $birth_year = "";
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            $birth_month = "";
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            $birth_day = "";
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            $thumbnail = "";
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            return;
        }

        // 생일은 없는 경우, 공백 문자로 입력한다.
        $birthday = $this->getBirthday($birth_year, $birth_month, $birth_day);

        $data = array(
            'nickname' => $nickname,
            'name' => $name,
            'gender' => $gender,
            'birthday' => $birthday,
            'thumbnail' => $thumbnail,
            'mobile' => "$mobile_head-$mobile_body-$mobile_tail"
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('email', $email);
        $sql = $this->CI->db->set($data)->get_compiled_update('user');

        // email로 유저 정보를 가져온다. 
        $user = $this->get_user_by_email($email);
        if(isset($user) && isset($user->id)) 
        {
            $this->log_query(
                // $user_id=-1
                intval($user->id),
                // $action_type=""
                $this->CI->my_logger->QUERY_TYPE_UPDATE,
                // $query=""
                $sql
            );
        }

        // QUERY EXECUTION
        $this->CI->db->where('email', $email);
        $this->CI->db->update('user', $data);
    }    

    public function update_user($user_id=-1, $password_hashed="", $email="", $name="", $nickname="", $gender="", $birth_year="", $birth_month="", $birth_day="", $thumbnail="", $mobile_head="", $mobile_body="", $mobile_tail="")
    {

        // TODO - user id로 업데이트 되고 있음.
        // 숫자로 구성되어 있으므로 공격 확률이 있음. 
        // 문자열 조합키로 변경 필요 있음.

        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("user_password_hashed", $password_hashed))
        {
            return;
        }
        if($this->is_not_ok("user_email_insert", $email))
        {
            return;
        }
        if($this->is_not_ok("user_name", $name))
        {
            return;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            return;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            $birth_year = "";
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            $birth_month = "";
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            $birth_day = "";
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            $thumbnail = "";
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            return;
        }

        // 생일은 없는 경우, 공백 문자로 입력한다.
        $birthday = $this->getBirthday($birth_year, $birth_month, $birth_day);

        $data = array(
            'nickname' => $nickname,
            'name' => $name,
            'gender' => $gender,
            'birthday' => $birthday,
            'thumbnail' => $thumbnail,
            'mobile' => "$mobile_head-$mobile_body-$mobile_tail",
            'email' => $email,
            'password' => $password_hashed
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_update('user');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->where('id', $user_id);
        $this->CI->db->update('user', $data);
    }

    public function update_user_pw($email="", $password_hashed="")
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_password_hashed", $password_hashed))
        {
            return;
        }
        if($this->is_not_ok("user_email", $email))
        {
            return;
        }

        $data = array(
            'password' => $password_hashed
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_update('user');
        $this->CI->db->where('email', $email);

        $user = $this->get_user_by_email($email);
        if(isset($user) && isset($user->id)) 
        {
            $this->log_query(
                // $user_id=-1
                intval($user->id),
                // $action_type=""
                $this->CI->my_logger->QUERY_TYPE_UPDATE,
                // $query=""
                $sql
            );
        }

        // QUERY EXECUTION
        $this->CI->db->where('email', $email);
        $this->CI->db->update('user', $data);
    }            

	public function get_user_kakao($kakao_id=-1) 
	{
        if(!(0 < $kakao_id)) 
        {
            return null;
        }

        $this->CI->db->where('kakao_id', $kakao_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user', $limit, $offset);

        $row = $query->custom_row_object(0, 'User');

        return $this->decorate_user($row);

	}

    public function get_user_by_email($email="") 
    {
        if(empty($email))
        {
            return null;
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_email", $email);
        }

        if(!$is_ok) {
            return null;
        }

        $this->CI->db->select('id, facebook_id, kakao_id, naver_id, nickname, email, name, mobile, gender, birthday, thumbnail, permission, status, date_created, date_updated');
        $this->CI->db->where('email', $email);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user', $limit, $offset);

        $row = $query->custom_row_object(0, 'User');

        return $this->decorate_user($row);
    }

    public function get_user_by_mobile($mobile="") 
    {
        if(empty($mobile))
        {
            return null;
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_mobile", $mobile);
        }
        if(!$is_ok) {
            return null;
        }

        $this->CI->db->select('id, facebook_id, kakao_id, naver_id, nickname, email, name, mobile, gender, birthday, thumbnail, permission, status, date_created, date_updated');
        $this->CI->db->where('mobile', $mobile);
        $query = $this->CI->db->get('user');
        $row = $query->custom_row_object(0, 'User');

        return $this->decorate_user($row);
    }    

    public function get_user_password_by_email($email="") 
    {
        if(empty($email))
        {
            return "";
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_email", $email);
        }

        if(!$is_ok) {
            return "";
        }

        $this->CI->db->select('password');
        $this->CI->db->where('email', $email);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user', $limit, $offset);        

        $password_hashed = "";
        foreach ($query->result() as $row)
        {
            $password_hashed = $row->password;
            break;
        }

        return $password_hashed;
    }    

    // REMOVE ME
    /*
    public function get_user_by_email_n_password($email="", $password="") 
    {
        if(empty($email))
        {
            return null;
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_email", $email);
        }

        if(!$is_ok) {
            return null;
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_password_hashed", $password);
        }

        if(!$is_ok) {
            return null;
        }


        $this->CI->db->select('id, facebook_id, kakao_id, naver_id, nickname, email, name, mobile, gender, birthday, thumbnail, permission, status, date_created, date_updated');
        $this->CI->db->where('email', $email);
        $this->CI->db->where('password', $password);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user');

        $row = $query->custom_row_object(0, 'User');

        return $this->decorate_user($row);
    } 
    */   

    public function get_user_by_id($user_id=-1) 
    {
        if(!(0 < $user_id))
        {
            return null;
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_id", $user_id);
        }

        if(!$is_ok) {
            return null;
        }

        $this->CI->db->select('id, facebook_id, kakao_id, naver_id, nickname, email, name, mobile, gender, birthday, thumbnail, permission, status, date_created, date_updated');
        $this->CI->db->where('id', $user_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user', $limit, $offset);

        $row = $query->custom_row_object(0, 'User');

        return $this->decorate_user($row);
    }    

	private function decorate_user($user=null)
	{
		if(is_null($user)) 
		{
			return null;
		}

		// 뷰에 필요한 정보들을 여기서 추가합니다. 
		// ex) 시간 포맷, 이름 템플릿 ,....

		return $user;
	}

    public function insert_user_validation_key($user_id=-1, $key="")
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("user_validation_key", $key))
        {
            return;
        }

        $data = array(
            'user_id' => $user_id,
            'key' => $key
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('user_validation');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('user_validation', $data);        

    }
    public function update_user_validation_confirmed($user_id=-1, $key="") 
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("user_validation_key", $key))
        {
            return;
        }


        // 1. 회원 인증 완료, 회원 인증 상태를 R(Ready) --> C(Confirmed)로 변경한다. 
        $data = array(
            'status' => "C"
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->where('key', $key);
        $sql = $this->CI->db->set($data)->get_compiled_update('user_validation');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );
        // QUERY EXECUTION
        $this->CI->db->update('user_validation', $data);


        // 2. 회원 인증 완료, 회원 상태를 C(Candidate) --> A(Available)로 변경한다. 
        $data = array(
            'status' => "A"
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('user_id', $user_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('user');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );
        // QUERY EXECUTION
        $this->CI->db->update('user', $data);
    }
    public function select_user_validation_key_by_user_id($user_id=-1)
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }

        $this->CI->db->select("user_id, key, status, date_created, date_updated");
        $this->CI->db->where('user_id', $user_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user_validation', $limit, $offset);

        $row = $query->custom_row_object(0, 'UserValidation');

        return $row;
    }
    public function select_user_validation_key_by_key($key="", $status="R")
    {
        if($this->is_not_ok("user_validation_key", $key))
        {
            return;
        }

        $this->CI->db->select("user_id, key, status, date_created, date_updated");
        $this->CI->db->where('key', $key);
        $this->CI->db->where('status', $status);
        $this->CI->db->order_by('date_created', 'DESC');
        $this->CI->db->limit(1);
        $query = $this->CI->db->get('user_validation');

        $row = $query->custom_row_object(0, 'UserValidation');

        return $row;
    } 




    public function insert_user_cookie($user_id=-1, $key="", $expire_sec="")
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("user_cookie_key", $key))
        {
            return;
        }
        if(!(0 < $expire_sec)) 
        {
            return;
        }

        $data = array(
            'user_id' => $user_id,
            'key' => $key
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('user_cookie');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_expire', "DATE_ADD(NOW(), INTERVAL $expire_sec second)", FALSE);
        $this->CI->db->insert('user_cookie', $data);
    } 
    public function delete_user_cookie($user_id=-1)
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('user_id', $user_id);
        $sql = $this->CI->db->get_compiled_delete('user_cookie');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_DELETE,
            // $query=""
            $sql
        );
        
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->delete('user_cookie');
    }     
    public function select_user_cookie_by_key($key="")
    {
        if($this->is_not_ok("user_cookie", $key))
        {
            return;
        }

        // 쿠키 해제 시간 이전의 쿠키만 가져옴.
        $this->CI->db->select("user_id, key, date_expire");
        $this->CI->db->where('key', $key);
        $this->CI->db->where('date_expire >', 'NOW()', FALSE);
        $this->CI->db->limit(1);
        $query = $this->CI->db->get('user_cookie');

        $row = $query->custom_row_object(0, 'UserCookie');

        // 특정 시간이 지난 쿠키는 조회시마다 삭제.
        $this->CI->db->where('date_expire <', 'NOW()', FALSE);
        $this->CI->db->delete('user_cookie');

        return $row;
    } 


    public function search_klass($q="", $level="", $station="", $day="", $time="")
    {
        // 유효한 파라미터들만 검색에 사용한다.
        $where_conditions = array();
        if($this->is_ok("klass_level", $level))
        {
            $this->CI->db->where('level', $level);
        }
        if($this->is_ok("klass_station", $station))
        {
            $this->CI->db->where('venue_subway_station', $station);
        }
        if($this->is_ok("klass_day", $day))
        {
            $this->CI->db->where('days', $day);
        }
        if($this->is_ok("klass_query", $q))
        {
            $keyword_list = explode("|",$q);
            $extra['keyword_list'] = $keyword_list;

            $like_cnt = 0;
            for ($i=0; $i < count($keyword_list); $i++) 
            { 
                $keyword = $keyword_list[$i];

                if(empty($keyword)) 
                {
                    continue;
                }

                if(0 === $like_cnt) 
                {
                    // escaped automatically in 'like' or 'or_like'
                    $this->CI->db->like('title', $keyword);
                    $this->CI->db->or_like('desc', $keyword);
                }
                else
                {
                    $this->CI->db->or_like('title', $keyword);
                    $this->CI->db->or_like('desc', $keyword);
                }

                $like_cnt++;
            }
        }
        // Set time range
        // 시간 관련 검색은 범위를 가져와야 한다.
        $extra['time_begin'] = 
        $time_begin = 
        $this->CI->my_paramchecker->get_const_from_list(
            $time, 
            'class_times_list', 
            'class_times_range_list'
        );
        $extra['time_end'] = 
        $time_end = 
        $this->CI->my_paramchecker->get_const_from_list(
            $time, 
            'class_times_list', 
            'class_times_range_list', 
            1
        );
        $time_begin_HHmm = "";
        $time_end_HHmm = "";
        if(is_numeric($time_begin) && is_numeric($time_end))
        {
            $time_begin_HHmm = $this->CI->my_time->digit_to_HHmm($time_begin);
            $time_end_HHmm = $this->CI->my_time->digit_to_HHmm($time_end, true);
        }
        if( $this->CI->my_time->is_valid_HHmm($time_begin_HHmm) && 
            $this->CI->my_time->is_valid_HHmm($time_end_HHmm)) 
        {
            $this->CI->db->where('time_begin >=', $time_begin_HHmm);
            $this->CI->db->where('time_end <=', $time_end_HHmm);
        }
        $this->CI->db->order_by('id', 'DESC');

        // DB WORKS
        $limit = 30;
        $offset = 0;
        $query = $this->CI->db->get('klass', $limit, $offset);

        // RESULT
        $klass_list = $query->result();

        return $klass_list;
    }

    public function select_klass_list($offset=-1, $limit=-1)
    {
        if(!(0 < $offset)) 
        {
            return;
        }
        if(!(0 < $limit)) 
        {
            return;
        }

        $this->CI->db->order_by('id', 'DESC');
        $query = $this->CI->db->get('klass', $limit, $offset);
        $klass_list = $this->add_klass_extra_info($query);

        return $klass_list;
    }

    public function select_klass_question_list($klass_id=-1)
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }

        $klass_question_list = $this->select_klass_parent_question_list($klass_id);
        if(!empty($klass_question_list))
        {
            $klass_question_list = 
            $this->select_klass_child_question_comment_list($klass_question_list);
        }

        return $klass_question_list;
    }
    private function select_klass_parent_question_list($klass_id=-1)
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }

        // 수업의 문의를 가져옵니다.
        $question_list = null;
        // 1. 부모 문의를 먼저 가져옵니다.(최신순)
        if(0 < $klass->id)
        {
            $this->CI->db->select('question.id, question.klass_id, question.user_id, user.name, user.nickname, user.thumbnail, question.parent_id, question.comment, question.date_created, question.date_updated');
            $this->CI->db->from('question');
            $this->CI->db->join('user', 'question.user_id = user.id');
            $this->CI->db->where('question.klass_id', $klass->id);
            $this->CI->db->where('question.parent_id=', 0);
            $this->CI->db->order_by('question.id', 'DESC');
            $query = $this->CI->db->get();

            $question_list = $this->add_klass_question_extra_info($query);
        }

        return $question_list;
    }
    private function select_klass_child_question_comment_list($question_list=null)
    {
        if(empty($question_list))
        {
            return;
        }

        for ($i=0; $i < count($question_list); $i++) 
        {

            $question = $question_list[$i];
            $question_id = intval($question->id);

            if(!(0 < $question_id)) 
            {
                continue;
            }

            $this->CI->db->select('question.id, question.klass_id, question.user_id, user.name, user.nickname, user.thumbnail, question.parent_id, question.comment, question.date_created, question.date_updated');
            $this->CI->db->from('question');
            $this->CI->db->join('user', 'question.user_id = user.id');
            $this->CI->db->where('question.parent_id', $question_id);
            $this->CI->db->order_by('question.id', 'DESC');
            $query = $this->CI->db->get();

            $question->child_question_list = $this->add_klass_question_extra_info($query);
        } // end for

        return $question_list;
    }
    private function add_klass_question_extra_info($query=null)
    {
        if(is_null($query)) {
            return;
        }

        $rows = $query->custom_result_object('KlassQuestion');
        if(!empty($rows))
        {
            foreach ($rows as $row) 
            {
                $row->id = intval($row->id);
                $row->parent_id = intval($row->parent_id);
                $row->klass_id = intval($row->klass_id);
                $row->user_id = intval($row->user_id);

                if(empty($row->thumbnail))
                {
                    $row->thumbnail = "user_anonymous_150x150.png";
                }

                $row->thumbnail_url = $this->CI->my_path->get("/assets/images/user/" . $row->thumbnail);

                // 읽기 쉬운 시간 표기로 바꿉니다.
                $row->date_updated_human_readable = 
                $this->CI->my_time->get_YYYYMMDDHHMMSS_human_readable_kor($row->date_updated);

            }
        }

        return $rows;
    }    


    public function select_klass_review_list($klass_id=-1)
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }

        // 수업의 리뷰를 가져옵니다.
        $review_list = $this->select_klass_parent_review_list($klass_id);

        // 2. 부모 리뷰에 연결된 자식 리뷰 댓글들을 가져옵니다.(순차시간)
        $review_list = $this->select_klass_children_review_comment_list($review_list);

        return $review_list;
    }
    private function select_klass_parent_review_list($klass_id=-1)
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }

        // 수업의 리뷰를 가져옵니다.
        $review_list = null;
        // 1. 부모 리뷰를 먼저 가져옵니다.(최신순)
        $this->CI->db->select('review.id, review.klass_id, review.user_id, user.name, user.nickname, user.thumbnail, review.parent_id, review.comment, review.date_created, review.date_updated');
        $this->CI->db->from('review');
        $this->CI->db->join('user', 'review.user_id = user.id');
        $this->CI->db->where('review.klass_id', $klass_id);
        $this->CI->db->where('review.parent_id=', 0);
        $this->CI->db->order_by('review.id', 'DESC');
        $query = $this->CI->db->get();
        $review_list = $this->add_klass_review_extra_info($query);

        return $review_list;
    }
    private function select_klass_children_review_comment_list($review_list)
    {
        if(empty($review_list)) 
        {
            return [];
        }

        // 2. 부모 리뷰에 연결된 자식 리뷰 댓글들을 가져옵니다.(순차시간)
        for ($i=0; $i < count($review_list); $i++) 
        {

            $review = $review_list[$i];
            $review_id = intval($review->id);

            if(!(0 < $review_id)) 
            {
                continue;
            }

            $this->CI->db->select('review.id, review.klass_id, review.user_id, user.name, user.nickname, user.thumbnail, review.parent_id, review.comment, review.date_created, review.date_updated');
            $this->CI->db->from('review');
            $this->CI->db->join('user', 'review.user_id = user.id');
            $this->CI->db->where('review.parent_id', $review_id);
            $this->CI->db->order_by('review.id', 'DESC');
            $query = $this->CI->db->get();

            $review->child_review_list = $this->add_klass_review_extra_info($query);
        } 
        
        return $review_list;
    }
    private function add_klass_review_extra_info($query=null)
    {
        if($this->is_not_ok()) {
            return;
        }

        if(is_null($query)) {
            return;
        }

        $rows = $query->custom_result_object('KlassReview');
        if(!empty($rows))
        {
            foreach ($rows as $row) 
            {
                $row->id = intval($row->id);
                $row->parent_id = intval($row->parent_id);
                $row->klass_id = intval($row->klass_id);
                $row->user_id = intval($row->user_id);

                if(empty($row->thumbnail))
                {
                    $row->thumbnail = "user_anonymous_150x150.png";
                }

                $row->thumbnail_url = $this->CI->my_path->get("/assets/images/user/" . $row->thumbnail);

                // 읽기 쉬운 시간 표기로 바꿉니다.
                $row->date_updated_human_readable = 
                $this->CI->my_time->get_YYYYMMDDHHMMSS_human_readable_kor($row->date_updated);

            }
        }

        return $rows;
    }    

    public function select_teacher($teacher_id=-1)
    {
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        }

        $this->CI->db->where('id', $teacher_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('teacher', $limit, $offset);

        $teacher = $this->add_klass_teacher_extra_info($query);
        return $teacher;
    }
    private function add_klass_teacher_extra_info($query=null)
    {
        if(is_null($query)) {
            return;
        }

        $rows = $query->custom_result_object('KlassTeacher');
        $teacher = null;
        if(!empty($rows))
        {
            $teacher = $rows[0];   
        }

        return $teacher;
    }

    // @ Desc : 시작날짜 ex) 2016-10-10
    private function get_klass_date_begin_default()
    {   
        if(isset($this->CI->my_time))
        {
            // 기본 시작 값은 일주일 뒤.
            return $this->CI->my_time->get_days_after(7);
        }
        return "";
    }
    // @ Desc : 시작시간 ex) 19:00
    private function get_klass_time_begin_default()
    {   
        // 기본 시작 값은 일주일 뒤.
        return "19:00";
    }
    // @ Desc : 시작시간 ex) 21:00
    private function get_klass_time_end_default()
    {   
        // 기본 시작 값은 일주일 뒤.
        return "21:00";
    }
    // @ Desc : 수업시간 분으로 표시(minutes) ex) 120
    private function get_klass_time_duration_minutes_default()
    {   
        return 120;
    }
    // @ Desc : 수업레벨 B(Beginner/왕초급),E(Elementary/초급),P(Pre-intermediate/초중급),I(Intermediate/중급),U(Upper-intermediate/중상급),A(Advanced/상급)
    private function get_klass_level_default()
    {
        $class_level_list = $this->CI->my_paramchecker->get_const('class_level_list');
        if(!empty($class_level_list)) {
            return $class_level_list[1];
        }

        return "";
    }
    // @ Desc : '수업 최소 수강 week 수 ex) 2 - 2주'
    private function get_klass_week_min_default()
    {
        return 2;
    }    
    private function get_klass_week_max_default()
    {
        return 4;
    }    
    private function get_klass_days_default()
    {
        $class_level_list = $this->CI->my_paramchecker->get_const('class_days_list');
        if(!empty($class_level_list)) {
            return $class_level_list[1];
        }

        return "";
    }
    private function get_klass_class_per_week_default()
    {
        return 1;
    }
    private function get_klass_price_default()
    {
        return 65000;
    }
    public function add_klass($user_id=-1, $teacher_id=-1, $teacher_resume="", $teacher_greeting="", $title="", $desc="", $feature="", $target="", $schedule="", $date_begin="", $time_begin="", $time_duration_minutes=-1, $level="", $week_min=-1, $week_max=-1, $days="", $class_per_week=-1)
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        }
        if($this->is_not_ok("teacher_resume", $teacher_resume))
        {
            return;
        }
        if($this->is_not_ok("teacher_greeting", $teacher_greeting))
        {
            return;
        }
        if($this->is_not_ok("klass_title", $title))
        {
            $title = "수업 제목을 입력해주세요";
        }
        if($this->is_not_ok("klass_desc", $desc))
        {
            $desc = "수업 설명을 입력해주세요";
        }
        if($this->is_not_ok("klass_feature", $feature))
        {
            $feature = "수업 특징을 입력해주세요";
        }
        if($this->is_not_ok("klass_target", $target))
        {
            $target = "수업 대상을 입력해주세요";
        }
        if($this->is_not_ok("klass_schedule", $schedule))
        {
            $schedule = "수업 일정을 입력해주세요";
        }

        if($this->is_not_ok("klass_date_begin", $date_begin))
        {
            $date_begin = $this->get_klass_date_begin_default();
        }
        if($this->is_not_ok("klass_time", $time_begin))
        {
            $time_begin = $this->get_klass_time_begin_default();
        }
        if($this->is_not_ok("klass_time_range", $time_duration_minutes))
        {
            $time_duration_minutes = $this->get_klass_time_duration_minutes_default();
        }
        if($this->is_not_ok("klass_level", $level))
        {
            $level = $this->get_klass_level_default();
        }

        if($this->is_not_ok("klass_week_min", $week_min))
        {
            $week_min = $this->get_klass_week_min_default();
        }
        if($this->is_not_ok("klass_week_max", $week_max))
        {
            $week_max = $this->get_klass_week_max_default();
        }
        if($this->is_not_ok("klass_days", $days))
        {
            $days = $this->get_klass_days_default();
        }
        if($this->is_not_ok("klass_class_per_week", $class_per_week))
        {
            $class_per_week = $this->get_klass_class_per_week_default();
        }
        if($this->is_not_ok("klass_price", $price))
        {
            $price = $this->get_klass_price_default();
        }

        // wonder.jung

        $data = array(
            'teacher_id' => $teacher_id,
            'teacher_resume' => $teacher_resume,
            'teacher_greeting' => $teacher_greeting,
            'title' => $title,
            'desc' => $desc,
            'feature' => $feature,
            'target' => $target,
            'schedule' => $schedule,
            'date_begin' => $date_begin,
            'time_begin' => $time_begin,
            'time_duration_minutes' => $time_duration_minutes,
            'level' => $level,
            'week_min' => $week_min,
            'week_max' => $week_max,
            'days' => $days,
            'class_per_week' => $class_per_week,
            'price' => $price
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('klass');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('klass', $data);        

    } // end method


    private $delimiter_klass_banner="|||";
    public function get_klass_banner_list($klass_id=-1)
    {
        // 클래스의 배너 정보를 가져옵니다.
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }

        $this->CI->db->select('class_banner_url');
        $this->CI->db->where('id', $klass_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('klass', $limit, $offset);
        $rows = $query->result();

        $klass_banner_arr = [];
        if(empty($rows)) 
        {
            return $klass_banner_arr;
        }

        $klass_banner_url = "";
        foreach ($rows as $row) 
        {
            $klass_banner_url = $row->class_banner_url;
            break;
        }

        if(!empty($klass_banner_url))
        {
            $klass_banner_arr = explode($this->delimiter_klass_banner,$klass_banner_url);    
        }

        return $klass_banner_arr;

    }
    // @ Desc : 클래스의 특정 배너를 추가한다.
    public function add_klass_banner($user_id=-1, $klass_id=-1, $klass_banner_url_to_add="")
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }
        if($this->is_not_ok("klass_banner_url", $klass_banner_url_to_add))
        {
            return;
        }

        // 1. 해당 수업의 배너 정보를 가져옵니다.
        $klass_banner_arr = $this->get_klass_banner_list($klass_id);
        $class_banner_url_next = "";
        if(empty($klass_banner_arr)) {
            $class_banner_url_next = $klass_banner_url_to_add;
        }
        else
        {
            $class_banner_url_next = join($this->delimiter_klass_banner, $klass_banner_arr) . $this->delimiter_klass_banner . $klass_banner_url_to_add;
        }

        // 새로운 배너 주소를 추가한다.
        $this->update_klass_banner($user_id, $klass_id, $class_banner_url_next);
    }

    // @ Desc : 클래스의 특정 배너를 삭제한다.
    public function remove_klass_banner($user_id=-1, $klass_id=-1, $klass_banner_url_to_delete="")
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }
        if($this->is_not_ok("klass_banner_url", $klass_banner_url_to_delete))
        {
            return;
        } 

        // 1. 해당 수업의 배너 정보를 가져옵니다.
        $klass_banner_arr = $this->get_klass_banner_list($klass_id);
        if(empty($klass_banner_arr)) 
        {
            // Error Report
            return;
        }

        $klass_banner_arr_next = [];
        for ($i=0; $i < count($klass_banner_arr); $i++) { 
            $klass_banner = $klass_banner_arr[$i];

            if( empty($klass_banner) || 
                $klass_banner === $klass_banner_url_to_delete) 
            {
                // 삭제함.
                continue;
            }

            array_push($klass_banner_arr_next, $klass_banner);
        }
        $class_banner_url_next = join($this->delimiter_klass_banner, $klass_banner_arr_next);

        $this->update_klass_banner($user_id, $klass_id, $klass_banner_url_to_update);
    }
    private function update_klass_banner($user_id=-1, $klass_id=-1, $klass_banner_url_to_update="")
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }
        if(is_null($klass_banner_url_to_update))
        {   
            // 공백도 허용함.
            $klass_banner_url_to_update="";
        }

        // 새로운 배너 주소를 추가한다.
        $data = array(
            'class_banner_url' => $klass_banner_url_to_update
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $klass_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('klass');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->where('id', $klass_id);
        $this->CI->db->update('klass', $data);
    }



    public function select_klass($klass_id=-1) 
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }

        $this->CI->db->where('id', $klass_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('klass', $limit, $offset);
        $klass_list = $this->add_klass_extra_info($query);
        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];
            // $klass->calendar_table_monthly = $this->CI->my_klasscalendar->getMonthly($klass);
        }

        return $klass;
    }
    public function select_klass_by_teacher($teacher_id=-1) 
    {
        if($this->is_not_ready())
        {
            return;
        }

        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        }

        // wonder.jung

        $this->CI->db->where('teacher_id', $teacher_id);
        $this->CI->db->order_by('id', 'DESC');
        $this->CI->db->limit(1);
        $query = $this->CI->db->get('klass');

        $klass_list = $this->add_klass_extra_info($query);
        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];
        }

        return $klass;
    }    
    private function add_klass_extra_info($query=null) 
    {
        if(is_null($query)) {
            return;
        }

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            return;
        }
        $rows = $query->custom_result_object('KlassCourse');
        $output = array();
        foreach ($rows as $row)
        {
            // 추가할 정보들을 넣는다.
            $row->time_begin_img_url($const_map, $this->CI->my_path);
            $row->level_img_url($const_map, $this->CI->my_path);
            $row->set_days_list($const_map);
            $row->days_img_url($const_map, $this->CI->my_path);
            $row->venue_subway_station_img_url($const_map, $this->CI->my_path);
            $row->venue_cafe_logo_img_url($const_map, $this->CI->my_path);
            $row->price_with_format();
            $row->set_klass_price_list();
            $row->weeks_to_months();

            // 이미지 주소가 http|https로 시작되지 않을 경우는 내부 주소로 파악, web root domain을 찾아 추가해준다.
            $row->class_img_err_url = $this->CI->my_path->get("/assets/images/event/error.svg");
            $row->class_img_url = $this->CI->my_path->get("/assets/images/class/test.jpg");

            // 주당 수업 가격에 대해 계산한다.
            // 기본 4주/8주/12주 단위로 제공된다. 수업 기간에 따라 가격표가 최대 3개까지 표시될 수 있다.
            // 최소 주당 단위가 수업 주수를 결정하는 단위가 된다.
            $price = $row->price = intval($row->price);
            $week_max = $row->week_max = intval($row->week_max);
            $week_min = $row->week_min = intval($row->week_min);
            $week_unit_cnt = ($week_max / $week_min);

            // 주당 가격 산정은 다음과 같다. 
            // 최소 수업 단위 가격 =  수업가격 / 최소 주 수업
            $fee_per_a_week = $price/$week_min;

            $row->week_list = array();
            $row->price_list = array();
            $row->weekly_price_list = array();
            for ($i=1; $i <= $week_unit_cnt; $i++) { 
                $next_weeks = $week_min * $i;
                array_push($row->week_list, $next_weeks);
                $next_price = $fee_per_a_week * $week_min * $i;
                array_push($row->price_list, $next_price);

                $weeky_price = [
                    'weeks'=>$next_weeks,
                    'price'=>$next_price
                ];
                array_push($row->weekly_price_list, $weeky_price);
            }
            
            array_push($output, $row);
        }

        return $output;
    }     


    public function insert_teacher($user_id=-1, $email="", $name="", $nickname="", $resume="", $greeting="", $gender="", $birth_year="", $birth_month="", $birth_day="", $thumbnail="", $mobile_head="", $mobile_body="", $mobile_tail="")
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("user_email_insert", $email))
        {
            return;
        }
        if($this->is_not_ok("user_name", $name))
        {
            return;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("teacher_resume", $resume))
        {
            return;
        }
        // TODO - 입력 글자수가 많으므로, escape 처리 필요.
        if($this->is_not_ok("teacher_greeting", $greeting))
        {
            return;
        }
        // TODO - 입력 글자수가 많으므로, escape 처리 필요.
        if($this->is_not_ok("user_gender", $gender))
        {
            return;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            $birth_year = "";
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            $birth_month = "";
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            $birth_day = "";
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            $thumbnail = "";
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            return;
        }

        // 생일은 없는 경우, 공백 문자로 입력한다.
        $birthday = $this->getBirthday($birth_year, $birth_month, $birth_day);

        $data = array(
            'user_id' => $user_id,
            'nickname' => $nickname,
            'name' => $name,
            'resume' => $resume,
            'greeting' => $greeting,
            'gender' => $gender,
            'birthday' => $birthday,
            'thumbnail' => $thumbnail,
            'mobile' => "$mobile_head-$mobile_body-$mobile_tail",
            'email' => $email
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('teacher');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('teacher', $data);
    }

    public function update_teacher($user_id=-1, $nickname="", $resume="", $greeting="", $gender="", $birth_year="", $birth_month="", $birth_day="", $thumbnail="", $mobile_head="", $mobile_body="", $mobile_tail="")
    {

        // TODO - user id로 업데이트 되고 있음.
        // 숫자로 구성되어 있으므로 공격 확률이 있음. 
        // 문자열 조합키로 변경 필요 있음.

        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }
        if($this->is_not_ok("teacher_resume", $resume))
        {
            return;
        }
        if($this->is_not_ok("teacher_greeting", $greeting))
        {
            return;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            return;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            $birth_year = "";
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            $birth_month = "";
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            $birth_day = "";
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            $thumbnail = "";
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            return;
        }

        // 생일은 없는 경우, 공백 문자로 입력한다.
        $birthday = $this->getBirthday($birth_year, $birth_month, $birth_day);

        $data = array(
            'nickname' => $nickname,
            'resume' => $resume,
            'greeting' => $greeting,
            'gender' => $gender,
            'birthday' => $birthday,
            'thumbnail' => $thumbnail,
            'mobile' => "$mobile_head-$mobile_body-$mobile_tail"
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $user_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('teacher');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->update('teacher', $data);
    } 

    public function get_teacher_by_email($email=-1) 
    {
        if($this->is_not_ok("email", $email))
        {
            return;
        }

        $this->CI->db->select('id, user_id, email, name, nickname, resume, greeting, mobile, gender, birthday, thumbnail, status, date_created, date_updated');
        $this->CI->db->where('email', $email);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('teacher', $limit, $offset);

        $row = $query->custom_row_object(0, 'Teacher');

        return $row;
    }    

    public function get_teacher_by_user_id($user_id=-1) 
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }

        $this->CI->db->select('id, user_id, email, name, nickname, resume, greeting, mobile, gender, birthday, thumbnail, status, date_created, date_updated');
        $this->CI->db->where('user_id', $user_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('teacher', $limit, $offset);

        $row = $query->custom_row_object(0, 'Teacher');

        return $row;
    }

    public function get_teacher_by_mobile($mobile_head="", $mobile_body="", $mobile_tail="") 
    {
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            return;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            return;
        }

        $mobile = "$mobile_head-$mobile_body-$mobile_tail";

        $this->CI->db->select('id, user_id, email, name, nickname, resume, greeting, mobile, gender, birthday, thumbnail, status, date_created, date_updated');
        $this->CI->db->where('mobile', $mobile);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('teacher', $limit, $offset);

        $row = $query->custom_row_object(0, 'Teacher');

        return $row;
    } 

}

