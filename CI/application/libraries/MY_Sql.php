<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * php curl을 편리하게 사용하기 위한 래핑 클래스
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */

require APPPATH . '/models/User.php';

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
        if(is_null($key)) 
        {
            return true;
        }
        if(is_null($value)) 
        {
            return true;
        }
        if(!isset($this->CI->my_paramchecker)) 
        {
            return true;
        }

        if($this->CI->my_paramchecker->is_not_ok($key, $value))
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
        if(empty($msg))
        {
            return;
        }

        $data = array(
            'agent' => $agent,
            'agent_type' => $agent_type,
            'ip' => $ip,
            'type' => $type,
            'user_id' => $user_id,
            'msg' => $msg
        );

        $this->CI->db->insert('log_error', $data);
    }
    public function select_log_error()
    {
        
    }

    /*
    *   @ Desc : 사용자들의 중요한 클릭, 페이지 진입등의 행동에 대해 기록합니다.
    */
    public function insert_log_action($agent="", $agent_type="", $ip="", $type="", $user_id=-1, $key="")
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
            'key' => $key
        );

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
        if(empty($query))
        {
            return;
        }

        $data = array(
            'agent' => $agent,
            'agent_type' => $agent_type,
            'ip' => $ip,
            'type' => $type,
            'user_id' => $user_id,
            'query' => $query
        );

        $this->CI->db->insert('log_query', $data);
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
        $query = $this->CI->db->get('user');

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
        $query = $this->CI->db->get('user');

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
            return;
        }

        if(empty($action_type))
        {
            return;
        }

        if(empty($query))
        {
            return;
        }

        $this->CI->my_logger->add_query(
            // $user_id=-1, 
            $user_id,
            // $action_type="", 
            $action_type,
            // $query=""
            $query
        );
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
            return;
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            return;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            return;
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            return;
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            return;
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            return;
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

        $data = array(
            'nickname' => $nickname,
            'name' => $name,
            'gender' => $gender,
            'birthday' => "$birth_year-$birth_month-$birth_day",
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

    public function update_user($user_id=-1, $password_hashed="", $email="", $name="", $nickname="", $gender="", $birth_year="", $birth_month="", $birth_day="", $thumbnail="", $mobile_head="", $mobile_body="", $mobile_tail="")
    {
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
            return;
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            return;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            return;
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            return;
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            return;
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            return;
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

        $data = array(
            'nickname' => $nickname,
            'name' => $name,
            'gender' => $gender,
            'birthday' => "$birth_year-$birth_month-$birth_day",
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
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->where('id', $user_id);
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
        $query = $this->CI->db->get('user');

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

        $this->CI->db->select('id, nickname, email, name, gender, birthday, thumbnail, permission, status, date_created, date_updated');
        $this->CI->db->where('email', $email);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('user');

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

}

