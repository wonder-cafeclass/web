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
    private $query="";

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

    public function get_last_query()
    {
        return $this->query;
    }
    private function set_last_query($query="")
    {
        if(!empty($query)) 
        {
            $this->query = $query;
        } // end if
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


    private function add_track($class_name="", $method_name="", $line_num=-1, $msg="")
    {
        if(is_null($this->CI->my_tracker)) {
            return;
        }

        $this->CI->my_tracker->add($class_name, $method_name, $line_num, $msg);
    }  
    private function add_track_init($class_name="", $method_name="", $line_num=-1)
    {
        if(is_null($this->CI->my_tracker)) {
            return;
        }

        $this->CI->my_tracker->add_init($class_name, $method_name, $line_num);
    }
    private function add_track_stopped($class_name="", $method_name="", $line_num=-1, $msg)
    {
        if(is_null($this->CI->my_tracker)) {
            return;
        }

        $this->CI->my_tracker->add_stopped($class_name, $method_name, $line_num, $msg);
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
        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }        

        if($this->is_not_ok("naver_id", $naver_id))
        {
            // @ Required / 필수
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"naver_id\", \$naver_id)");
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
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$nickname)");
            return;   
        }
        if(empty($name)) 
        {
            // @ Required / 필수
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$name)");
            return;
        }
        if(empty($thumbnail_url)) 
        {
            // @ Required / 필수
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$thumbnail_url)");
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
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $sql = $this->CI->db->set($data)->get_compiled_insert('user');
        $this->log_query(
            // $user_id=-1
            -1,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('user', $data);
    }

    public function get_user_naver($naver_id=-1) 
    {
        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);

        if(!(0 < $naver_id)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "(!(0 < \$naver_id))");
            return null;
        }

        $limit = 1;
        $offset = 0;
        $this->CI->db->where('naver_id', $naver_id);
        $this->CI->db->limit($limit, $offset);
        $sql = $this->CI->db->get_compiled_select('user');
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->CI->db->where('naver_id', $naver_id);
        $this->CI->db->limit($limit, $offset);
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

        $this->set_last_query($query);

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
        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return false;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id:$user_id)");
            return false;
        }
        if($this->is_not_ok("user_password_hashed", $password_hashed))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(password_hashed:$password_hashed)");
            return false;
        }
        if($this->is_not_ok("user_email", $email))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(email:$email)");
            return false;
        }
        if($this->is_not_ok("user_name", $name))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(name:$name)");
            return false;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(gender:$gender)");
            return false;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(birth_year:$birth_year)");
            $birth_year = "";
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(birth_month:$birth_month)");
            $birth_month = "";
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(birth_day:$birth_day)");
            $birth_day = "";
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(thumbnail:$thumbnail)");
            $thumbnail = "";
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(mobile_head:$mobile_head)");
            return false;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(mobile_body:$mobile_body)");
            return false;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok(mobile_tail:$mobile_tail)");
            return false;
        }

        // 생일은 없는 경우, 공백 문자로 입력한다.
        $birthday = $this->getBirthday($birth_year, $birth_month, $birth_day);
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, "\$birthday : $birthday");

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
        $this->CI->db->where('id', $user_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('user');
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, "\$sql : $sql");
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

        return true;
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

    public function get_user_list() 
    {
        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);

        $limit = 100;
        $offset = 0;

        $this->CI->db->select('id, facebook_id, kakao_id, naver_id, nickname, email, name, mobile, gender, birthday, thumbnail, permission, status, date_created, date_updated');
        // 유효한 상태의 유저들만 가져옴.
        $this->CI->db->where('status', "A");
        $this->CI->db->limit($limit, $offset);
        $sql = $this->CI->db->get_compiled_select('user');
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, $sql);

        $query = $this->CI->db->get('user', $limit, $offset);

        return $query->custom_result_object('User');
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
        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);

        if(empty($email))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$email)");
            return "";
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_email", $email);
        }

        if(!$is_ok) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
            return "";
        }

        $this->CI->db->select('password');
        $this->CI->db->where('email', $email);
        $this->CI->db->limit(1);
        $sql = $this->CI->db->get_compiled_select('user');
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, $sql);

        $this->CI->db->select('password');
        $this->CI->db->where('email', $email);
        $this->CI->db->limit(1);
        $query = $this->CI->db->get('user');

        $password_hashed = "";
        foreach ($query->result() as $row)
        {
            $password_hashed = $row->password;
            break;
        }
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, "\$password_hashed : $password_hashed");

        return $password_hashed;
    }    

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

        // 1. 유저가 선생님이라면 선생님 정보를 추가합니다.
        $user_id = intval($user->id);
        $teacher = $this->get_teacher_by_user_id($user_id);
        if(isset($teacher))
        {
            $user->teacher = $teacher;
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
        if($this->is_not_ok("user_cookie_key", $key))
        {
            return;
        }

        // 쿠키 해제 시간 이전의 쿠키만 가져옴.
        $this->CI->db->select("user_id, key, date_expire");
        $this->CI->db->where('key', $key);
        $this->CI->db->where('date_expire >', 'NOW()', FALSE);
        $this->CI->db->limit(1);
        // 쿼리 등록
        $last_query = $this->CI->db->get_compiled_select('user_cookie');
        $this->set_last_query($last_query);
        // 쿼리 실행
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
        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);

        if(!(0 < $offset)) 
        {
            $offset = 0;
        }
        if(!(0 < $limit)) 
        {
            $limit = 20;
        }

        // wonder.jung

        // TODO : A 상태인 수업만 노출해야 합니다.

        $select_query = 
        'klass.id AS klass_id,' .
        'klass.title AS klass_title,'.
        'klass.desc AS klass_desc,'.
        'klass.feature AS klass_feature,'.
        'klass.target AS klass_target,'.
        'klass.schedule AS klass_schedule,'.
        'klass.date_begin AS klass_date_begin,'.
        'klass.time_begin AS klass_time_begin,'.
        'klass.time_duration_minutes AS klass_time_duration_minutes,'.
        'klass.time_end AS klass_time_end,'.
        'klass.level AS klass_level,'.
        'klass.week AS klass_week,'.
        'klass.days AS klass_days,'.

        'klass.subway_line AS klass_subway_line,'.
        'klass.subway_station AS klass_subway_station,'.

        'klass.venue_title AS klass_venue_title,'.
        'klass.venue_telephone AS klass_venue_telephone,'.
        'klass.venue_address AS klass_venue_address,'.
        'klass.venue_road_address AS klass_venue_road_address,'.
        'klass.venue_latitude AS klass_venue_latitude,'.
        'klass.venue_longitude AS klass_venue_longitude,'.

        'klass.status AS klass_status,'.
        'klass.price AS klass_price,'.
        'klass.student_cnt AS klass_student_cnt,'.
        'klass.class_poster_url AS klass_class_poster_url,'.
        'klass.class_banner_url AS klass_class_banner_url,'.

        'klass.date_created AS klass_date_created,'.
        'klass.date_updated AS klass_date_updated,'.

        'teacher.id AS teacher_id,'.
        'teacher.user_id AS teacher_user_id,'.
        'teacher.nickname AS teacher_nickname,'.
        'teacher.name AS teacher_name,'.
        'teacher.gender AS teacher_gender,'.
        'teacher.birthday AS teacher_birthday,'.
        'teacher.thumbnail AS teacher_thumbnail,'.
        'teacher.status AS teacher_status,'.
        'teacher.mobile AS teacher_mobile,'.
        'teacher.email AS teacher_email,'.
        'teacher.resume AS teacher_resume,'.
        'teacher.greeting AS teacher_greeting,'.
        'teacher.memo AS teacher_memo,'.
        'teacher.date_created AS teacher_date_created,'.
        'teacher.date_updated AS teacher_date_updated'
        ;

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($offset, $limit);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($offset, $limit);
        $query = $this->CI->db->get();

        return $query->result_object();

    } // end method

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
        if(0 < $klass_id)
        {
            $this->CI->db->select('question.id, question.klass_id, question.user_id, question.status, user.name, user.nickname, user.thumbnail, question.parent_id, question.comment, question.date_created, question.date_updated');
            $this->CI->db->from('question');
            $this->CI->db->join('user', 'question.user_id = user.id');
            $this->CI->db->where('question.klass_id', $klass_id);
            $this->CI->db->where('question.parent_id < ', 1);
            $this->CI->db->where('question.status', 'A');
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
            $this->CI->db->where('question.status', 'A');
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
        $this->CI->db->select('review.id, review.klass_id, review.user_id, user.name, user.nickname, user.thumbnail, review.parent_id, review.comment, review.star, review.date_created, review.date_updated');
        $this->CI->db->from('review');
        $this->CI->db->join('user', 'review.user_id = user.id');
        $this->CI->db->where('review.klass_id', $klass_id);
        $this->CI->db->where('review.parent_id < ', 1);
        $this->CI->db->where('review.status',"A");
        $this->CI->db->order_by('review.id', 'DESC');
        $query = $this->CI->db->get();
        $review_list = $this->add_klass_review_extra_info($query);

        return $review_list;
    }
    public function select_klass_review_last($klass_id=-1, $user_id=-1)
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }

        // 수업의 리뷰를 가져옵니다.
        $review_list = null;
        // 1. 부모 리뷰를 먼저 가져옵니다.(최신순)
        $this->CI->db->select('review.id, review.klass_id, review.user_id, review.status, user.name, user.nickname, user.thumbnail, review.parent_id, review.comment, review.star, review.date_created, review.date_updated');
        $this->CI->db->from('review');
        $this->CI->db->join('user', 'review.user_id = user.id');
        $this->CI->db->where('review.klass_id', $klass_id);
        $this->CI->db->where('review.user_id', $user_id);
        $this->CI->db->order_by('review.id', 'DESC');
        $this->CI->db->limit(1);
        $query = $this->CI->db->get();
        $review_list = $this->add_klass_review_extra_info($query);

        if(empty($review_list)) {
            return null;
        }

        return $review_list[0];
    } 

    public function select_klass_review_by_id($klass_review_id=-1)
    {
        if($this->is_not_ok("klass_review_id", $klass_review_id))
        {
            return;
        }

        // 수업의 리뷰를 가져옵니다.
        $review_list = null;
        // 1. 부모 리뷰를 먼저 가져옵니다.(최신순)
        $this->CI->db->select('review.id, review.klass_id, review.user_id, review.status, user.name, user.nickname, user.thumbnail, review.parent_id, review.comment, review.star, review.date_created, review.date_updated');
        $this->CI->db->from('review');
        $this->CI->db->join('user', 'review.user_id = user.id');
        $this->CI->db->where('review.id', $klass_review_id);
        $query = $this->CI->db->get();
        $review_list = $this->add_klass_review_extra_info($query);

        if(empty($review_list)) {
            return null;
        }

        return $review_list[0];
    }      
    public function select_klass_question_last($klass_id=-1, $user_id=-1)
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }

        // 수업의 문의를 가져옵니다.
        $question_list = null;
        $this->CI->db->select('question.id, question.klass_id, question.user_id, user.name, user.nickname, user.thumbnail, question.parent_id, question.comment, question.date_created, question.date_updated');
        $this->CI->db->from('question');
        $this->CI->db->join('user', 'question.user_id = user.id');
        $this->CI->db->where('question.klass_id', $klass_id);
        $this->CI->db->where('question.user_id', $user_id);
        $this->CI->db->order_by('question.id', 'DESC');
        $this->CI->db->limit(1);
        $query = $this->CI->db->get();
        $question_list = $this->add_klass_question_extra_info($query);

        if(empty($question_list)) {
            return null;
        }

        return $question_list[0];
    } 

    public function select_klass_question_by_id($klass_question_id=-1)
    {
        if($this->is_not_ok("klass_question_id", $klass_question_id))
        {
            return;
        }

        // 수업의 리뷰를 가져옵니다.
        $question_list = null;
        // 1. 부모 리뷰를 먼저 가져옵니다.(최신순)
        $this->CI->db->select('question.id, question.klass_id, question.user_id, question.status, user.name, user.nickname, user.thumbnail, question.parent_id, question.comment, question.date_created, question.date_updated');
        $this->CI->db->from('question');
        $this->CI->db->join('user', 'question.user_id = user.id');
        $this->CI->db->where('question.id', $klass_question_id);
        $query = $this->CI->db->get();
        $question_list = $this->add_klass_question_extra_info($query);

        if(empty($question_list)) {
            return null;
        }

        return $question_list[0];
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
            $this->CI->db->where('review.status', 'A');
            $this->CI->db->order_by('review.id', 'DESC');
            $query = $this->CI->db->get();

            $review->child_review_list = $this->add_klass_review_extra_info($query);
        } 
        
        return $review_list;
    }
    private function add_klass_review_extra_info($query=null)
    {
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
                $row->star = intval($row->star);

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
    private function get_subway_line_default()
    {
        $subway_line_list = $this->CI->my_paramchecker->get_const('subway_line_list');
        return $subway_line_list[2]; // 2호선
    }
    private function get_subway_station_default()
    {
        $subway_station_list = $this->CI->my_paramchecker->get_const('subway_station_list');
        return $subway_station_list[2][1]; // 잠실역
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
            $feature = "수업 특징을 입력해주세요|||수업 특징을 입력해주세요|||수업 특징을 입력해주세요";
        }
        if($this->is_not_ok("klass_target", $target))
        {
            $target = "수업 대상을 입력해주세요|||수업 대상을 입력해주세요|||수업 대상을 입력해주세요";
        }
        if($this->is_not_ok("klass_schedule", $schedule))
        {
            $schedule = "수업 일정을 입력해주세요";
        }

        if($this->is_not_ok("klass_date_begin", $date_begin))
        {
            $date_begin = $this->get_klass_date_begin_default();
        }
        if($this->is_not_ok("klass_date_begin", $time_begin))
        {
            $time_begin = $this->get_klass_time_begin_default();
            $time_end = $this->get_klass_time_end_default();
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

        // @ Default Venue Info
        $venue_title = "<b>스타벅스</b> 갤러리아팰리스점";
        $venue_telephone = "02-758-8118";
        $venue_address = "서울특별시 송파구 잠실동 40";
        $venue_road_address = "서울특별시 송파구 올림픽로 212 갤러리아팰리스";
        $venue_latitude = "37.5111896";
        $venue_longitude = "37.5111896";

        $subway_line = $this->get_subway_line_default();
        $subway_station = $this->get_subway_station_default();

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
            'time_end' => $time_end,
            'time_duration_minutes' => $time_duration_minutes,
            'level' => $level,
            'week' => 4,
            'week_min' => $week_min,
            'week_max' => $week_max,
            'days' => $days,
            'class_per_week' => $class_per_week,
            'price' => $price,
            'student_cnt' => 3,
            'venue_title' => $venue_title,
            'venue_telephone' => $venue_telephone,
            'venue_address' => $venue_address,
            'venue_road_address' => $venue_road_address,
            'venue_latitude' => $venue_latitude,
            'venue_longitude' => $venue_longitude,
            'subway_line' => $subway_line,
            'subway_station' => $subway_station,
            'class_banner_url' => "",
            'class_poster_url' => ""
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

    public function update_klass($klass_id=-1,$user_id=-1, $teacher_id=-1, $teacher_resume="", $teacher_greeting="", $title="", $feature="", $target="", $schedule="", $date_begin="", $time_begin="", $time_end="", $time_duration_minutes=-1, $level="", $week=-1, $days="", $venue_title="", $venue_telephone="", $venue_address="", $venue_road_address="", $venue_latitude="", $venue_longitude="", $subway_line="", $subway_station="", $banner_url="", $poster_url="", $price=-1, $student_cnt=-1)
    {

        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_id\", $klass_id)");
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"user_id\", $user_id)");
            return;
        }
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"teacher_id\", $teacher_id)");
            return;
        }
        if($this->is_not_ok("teacher_resume", $teacher_resume))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"teacher_resume\", $teacher_resume)");
            return;
        }
        if($this->is_not_ok("teacher_greeting", $teacher_greeting))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"teacher_greeting\", $teacher_greeting)");
            return;
        }
        if($this->is_not_ok("klass_title", $title))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_title\", $title)");
            return;
        }
        if($this->is_not_ok("klass_feature", $feature))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_feature\", $feature)");
            return;
        }
        if($this->is_not_ok("klass_target", $target))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_target\", $target)");
            return;
        }
        if($this->is_not_ok("klass_schedule", $schedule))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_schedule\", $schedule)");
            return;
        }
        if($this->is_not_ok("klass_date_begin", $date_begin))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_date_begin\", $date_begin)");
            return;
        }
        if($this->is_not_ok("klass_time_hhmm", $time_begin))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_time_hhmm\", $time_begin)");
            return;
        }
        if($this->is_not_ok("klass_time_hhmm", $time_end))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_time_hhmm\", $time_end)");
            return;
        }
        if($this->is_not_ok("klass_level", $level))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_level\", $level)");
            return;
        }
        if($this->is_not_ok("klass_week", $week))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_week\", $week)");
            return;
        }
        if($this->is_not_ok("klass_days", $days))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_days\", $days)");
            return;
        }
        if($this->is_not_ok("klass_price", $price))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_price\", $price)");
            return;
        }
        if($this->is_not_ok("klass_student_cnt", $student_cnt))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_student_cnt\", $student_cnt)");
            return;
        }

        if($this->is_not_ok("klass_venue_title", $venue_title))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_title\", $venue_title)");
            return;
        }
        if($this->is_not_ok("klass_venue_telephone", $venue_telephone))
        {
            $venue_telephone = "";
        }
        if($this->is_not_ok("klass_venue_address", $venue_address))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_address\", $venue_address)");
            return;
        }
        if($this->is_not_ok("klass_venue_road_address", $venue_road_address))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_road_address\", $venue_road_address)");
            return;
        }
        if($this->is_not_ok("klass_venue_latitude", $venue_latitude))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_latitude\", $venue_latitude)");
            return;
        }
        if($this->is_not_ok("klass_venue_longitude", $venue_longitude))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_longitude\", $venue_longitude)");
            return;
        }
        if($this->is_not_ok("klass_subway_line", $subway_line))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_subway_line\", $subway_line)");
            return;
        }
        if($this->is_not_ok("klass_subway_station", $subway_station))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_subway_station\", $subway_station)");
            return;
        }        
        if($this->is_not_ok("klass_banner_url", $banner_url))
        {
            $banner_url = "";
        }        
        if($this->is_not_ok("klass_poster_url", $poster_url))
        {
            $poster_url = "";
        }

        $data = array(
            'teacher_resume' => $teacher_resume,
            'teacher_greeting' => $teacher_greeting,
            'title' => $title,
            'feature' => $feature,
            'target' => $target,
            'schedule' => $schedule,
            'date_begin' => $date_begin,
            'time_begin' => $time_begin,
            'time_end' => $time_end,
            'time_duration_minutes' => $time_duration_minutes,
            'level' => $level,
            'week' => $week,
            'days' => $days,
            'price' => $price,
            'student_cnt' => $student_cnt,

            'venue_title' => $venue_title,
            'venue_telephone' => $venue_telephone,
            'venue_address' => $venue_address,
            'venue_road_address' => $venue_road_address,
            'venue_latitude' => $venue_latitude,
            'venue_longitude' => $venue_longitude,

            'subway_line' => $subway_line,
            'subway_station' => $subway_station,

            'class_banner_url' => $banner_url,
            'class_poster_url' => $poster_url
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $klass_id);
        $this->CI->db->where('teacher_id', $teacher_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('klass');
        $this->log_query(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );
        $this->add_track(__FILE__, __FUNCTION__, __LINE__, $sql);

        $this->CI->db->where('id', $klass_id);
        $this->CI->db->where('teacher_id', $teacher_id);
        $this->CI->db->update('klass', $data);

    } // end method
    
    // @ Desc : 클래스의 제목을 업데이트합니다.
    public function update_klass_title($user_id=-1, $klass_id=-1, $klass_title_to_update="")
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
        if(is_null($klass_title_to_update))
        {   
            // 공백도 허용함.
            $klass_title_to_update="";
        }

        // 새로운 배너 주소를 추가한다.
        $data = array(
            'title' => $klass_title_to_update
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $klass_id);
        $this->CI->db->set('date_created', 'NOW()', FALSE);
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

    public function remove_klass_review($user_id=-1, $klass_id=-1, $klass_review_id=-1)
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
        if($this->is_not_ok("klass_review_id", $klass_review_id))
        {
            return;
        }

        $this->update_klass_review_status($user_id, $klass_id, $klass_review_id, "N");
    }

    // @ Desc : 클래스의 상태를 변경한다.
    private function update_klass_review_status($user_id=-1, $klass_id=-1, $klass_review_id=-1, $klass_review_status="")
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
        if($this->is_not_ok("klass_review_id", $klass_review_id))
        {
            return;
        }
        if($this->is_not_ok("klass_review_status", $klass_review_status))
        {
            return;
        }

        $data = array(
            'status' => $klass_review_status,
        );

        // QUERY Logging
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->where('id', $klass_review_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('review');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

        // QUERY Execution
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->where('id', $klass_review_id);
        $this->CI->db->update('review', $data);

    }

    // @ Desc : 클래스의 리뷰를 추가한다.
    public function add_klass_review($user_id=-1, $klass_id=-1, $klass_review="", $klass_review_star=-1)
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
        if($this->is_not_ok("klass_review", $klass_review))
        {
            return;
        }
        if($this->is_not_ok("klass_review_star", $klass_review_star))
        {
            return;
        }

        // 새로운 수업의 사용자 질문을 추가한다.
        $data = array(
            'user_id' => $user_id,
            'klass_id' => $klass_id,
            'parent_id' => -1,
            'comment' => $klass_review,
            'star' => $klass_review_star
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $sql = $this->CI->db->set($data)->get_compiled_insert('review');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('review', $data);
    }
    // @ Desc : 클래스의 리뷰의 답글을 추가한다.
    public function add_klass_review_reply($user_id=-1, $klass_id=-1, $klass_review_parent_id=-1, $klass_reply="")
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
        if($this->is_not_ok("klass_review_parent_id", $klass_review_parent_id))
        {
            return;
        }
        if($this->is_not_ok("klass_review", $klass_reply))
        {
            return;
        }

        // 새로운 수업의 사용자 질문을 추가한다.
        $data = array(
            'user_id' => $user_id,
            'klass_id' => $klass_id,
            'parent_id' => $klass_review_parent_id,
            'comment' => $klass_reply
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $sql = $this->CI->db->set($data)->get_compiled_insert('review');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('review', $data);
    }        


    public function remove_klass_question($user_id=-1, $klass_id=-1, $klass_question_id=-1)
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
        if($this->is_not_ok("klass_question_id", $klass_question_id))
        {
            return;
        }

        $this->update_klass_question_status($user_id, $klass_id, $klass_question_id, "N");
    }

    // @ Desc : 클래스의 상태를 변경한다.
    private function update_klass_question_status($user_id=-1, $klass_id=-1, $klass_question_id=-1, $klass_question_status="")
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
        if($this->is_not_ok("klass_question_id", $klass_question_id))
        {
            return;
        }
        if($this->is_not_ok("klass_question_status", $klass_question_status))
        {
            return;
        }

        $data = array(
            'status' => $klass_question_status,
        );

        // QUERY Logging
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->where('id', $klass_question_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('question');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

        // QUERY Execution
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->where('id', $klass_question_id);
        $this->CI->db->update('question', $data);

    }

    // @ Desc : 클래스의 질문을 추가한다.
    public function add_klass_question($user_id=-1, $klass_id=-1, $klass_question="")
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
        if($this->is_not_ok("klass_question", $klass_question))
        {
            return;
        }

        // 새로운 수업의 사용자 질문을 추가한다.
        $data = array(
            'user_id' => $user_id,
            'klass_id' => $klass_id,
            'parent_id' => -1,
            'comment' => $klass_question
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $sql = $this->CI->db->set($data)->get_compiled_insert('question');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('question', $data);
    }
    // @ Desc : 클래스의 질문의 답글을 추가한다.
    public function add_klass_question_reply($user_id=-1, $klass_id=-1, $klass_question_parent_id=-1, $klass_question_reply="")
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
        if($this->is_not_ok("klass_question_parent_id", $klass_question_parent_id))
        {
            return;
        }
        if($this->is_not_ok("klass_question", $klass_question_reply))
        {
            return;
        }

        // 새로운 수업의 사용자 질문을 추가한다.
        $data = array(
            'user_id' => $user_id,
            'klass_id' => $klass_id,
            'parent_id' => $klass_question_parent_id,
            'comment' => $klass_question_reply
        );
        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $sql = $this->CI->db->set($data)->get_compiled_insert('question');
        $this->log_query(
            // $user_id=-1
            intval($user_id),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('question', $data);
    }        


    // @ Desc : 클래스의 포스터 정보를 가져옵니다.
    public function get_klass_poster($klass_id=-1)
    {
        
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            return;
        }

        $this->CI->db->select('class_poster_url');
        $this->CI->db->where('id', $klass_id);
        $limit = 1;
        $offset = 0;
        $query = $this->CI->db->get('klass', $limit, $offset);
        $rows = $query->result();

        $klass_poster_url = "";
        foreach ($rows as $row) 
        {
            $klass_poster_url = $row->class_poster_url;
            break;
        }
        
        return $klass_poster_url;

    }
    // @ Desc : 클래스의 포스터를 추가한다.
    public function add_klass_poster($user_id=-1, $klass_id=-1, $klass_poster_url_to_add="")
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
        if($this->is_not_ok("klass_poster_url", $klass_poster_url_to_add))
        {
            return;
        }

        // 새로운 poster 주소를 추가한다.
        $this->update_klass_poster($user_id, $klass_id, $klass_poster_url_to_add);
    }
    private function update_klass_poster($user_id=-1, $klass_id=-1, $klass_poster_url_to_update="")
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
        if(is_null($klass_poster_url_to_update))
        {   
            // 공백도 허용함.
            $klass_poster_url_to_update="";
        }

        // 새로운 배너 주소를 추가한다.
        $data = array(
            'class_poster_url' => $klass_poster_url_to_update
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

    /*
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

        $this->update_klass_banner($user_id, $klass_id, $class_banner_url_next);
    }
    */
    public function update_klass_banner($user_id=-1, $klass_id=-1, $klass_banner_url_to_update="")
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

        /*
        $klass_list = $this->decorate_klass($query);

        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];
            $klass->calendar_table_monthly = $this->CI->my_klasscalendar->getMonthly($klass);
        }
        */

        return $query;
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

        $this->CI->db->where('teacher_id', $teacher_id);
        $this->CI->db->order_by('id', 'DESC');
        $this->CI->db->limit(1);
        $query = $this->CI->db->get('klass');

        $klass_list = $this->decorate_klass($query);
        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];
        }

        return $klass;
    }    
    private function decorate_klass($query=null) 
    {
        $this->add_track_init(__FILE__, __FUNCTION__, __LINE__);

        if(is_null($query)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$query)");
            return;
        } // end if
        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if
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

            $row->price_with_format();
            $row->weeks_to_months();

            // Set number type
            $row->id = intval($row->id);
            $row->enrollment_interval_week = intval($row->enrollment_interval_week);
            $row->student_cnt = intval($row->student_cnt);
            $row->discount = intval($row->discount);
            $row->teacher_id = intval($row->teacher_id);
            $row->time_duration_minutes = intval($row->time_duration_minutes);
            $row->week = intval($row->week);

            array_push($output, $row);
        }

        return $output;
    }     


    public function insert_teacher($user_id=-1, $email="", $name="", $nickname="", $resume="", $greeting="", $gender="", $birth_year="", $birth_month="", $birth_day="", $thumbnail="", $mobile_head="", $mobile_body="", $mobile_tail="")
    {
        if($this->is_not_ready())
        {
            return false;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            return false;
        }
        if($this->is_not_ok("user_email", $email))
        {
            return false;
        }
        if($this->is_not_ok("user_name", $name))
        {
            return false;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("teacher_resume", $resume))
        {
            return false;
        }
        // TODO - 입력 글자수가 많으므로, escape 처리 필요.
        if($this->is_not_ok("teacher_greeting", $greeting))
        {
            return false;
        }
        // TODO - 입력 글자수가 많으므로, escape 처리 필요.
        if($this->is_not_ok("user_gender", $gender))
        {
            return false;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            return false;
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            return false;
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            return false;
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            return false;
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            return false;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            return false;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            return false;
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

        return true;
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

