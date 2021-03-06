<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * php curl을 편리하게 사용하기 위한 래핑 클래스
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */

require_once APPPATH . '/libraries/MY_Library.php';
require_once APPPATH . '/models/User.php';
require_once APPPATH . '/models/UserValidation.php';
require_once APPPATH . '/models/UserCookie.php';
require_once APPPATH . '/models/Teacher.php';
require_once APPPATH . '/models/KlassQuestion.php';
require_once APPPATH . '/models/KlassReview.php';
require_once APPPATH . '/models/KlassCourse.php';

class MY_Sql extends MY_Library
{
    function __construct()
    {
        // Construct the parent class
        parent::__construct();
    } // end method

    private $query="";
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
    } // end method





















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
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if(empty($agent))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$agent)");
            return;
        }
        if($this->is_not_ok("agent_type", $agent_type))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\$agent_type)");
            return;
        }
        if(empty($ip))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$ip)");
            return;
        }
        if(empty($type))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$type)");
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\$user_id)");
            return;
        }
        if(empty($key))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$key)");
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
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }        

        if($this->is_not_ok("naver_id", $naver_id))
        {
            // @ Required / 필수
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"naver_id\", \$naver_id)");
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
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$nickname)");
            return;   
        }
        if(empty($name)) 
        {
            // @ Required / 필수
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$name)");
            return;
        }
        if(empty($thumbnail_url)) 
        {
            // @ Required / 필수
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$thumbnail_url)");
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
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('user', $data);
    }

    public function get_user_naver($naver_id=-1) 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if(!(0 < $naver_id)) 
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "(!(0 < \$naver_id))");
            return null;
        }

        $limit = 1;
        $offset = 0;
        $this->CI->db->where('naver_id', $naver_id);
        $this->CI->db->limit($limit, $offset);
        $sql = $this->CI->db->get_compiled_select('user');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

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
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return false;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id:$user_id)");
            return false;
        }
        if($this->is_not_ok("user_password_hashed", $password_hashed))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(password_hashed:$password_hashed)");
            return false;
        }
        if($this->is_not_ok("user_email", $email))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(email:$email)");
            return false;
        }
        if($this->is_not_ok("user_name", $name))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(name:$name)");
            return false;
        }
        if($this->is_not_ok("user_nickname", $nickname))
        {
            $nickname = "";
        }
        if($this->is_not_ok("user_gender", $gender))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(gender:$gender)");
            return false;
        }
        if($this->is_not_ok("user_birth_year", $birth_year))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(birth_year:$birth_year)");
            $birth_year = "";
        }
        if($this->is_not_ok("user_birth_month", $birth_month))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(birth_month:$birth_month)");
            $birth_month = "";
        }
        if($this->is_not_ok("user_birth_day", $birth_day))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(birth_day:$birth_day)");
            $birth_day = "";
        }
        if($this->is_not_ok("user_thumbnail", $thumbnail))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(thumbnail:$thumbnail)");
            $thumbnail = "";
        }
        if($this->is_not_ok("user_mobile_kor_head", $mobile_head))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(mobile_head:$mobile_head)");
            return false;
        }
        if($this->is_not_ok("user_mobile_kor_body", $mobile_body))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(mobile_body:$mobile_body)");
            return false;
        }
        if($this->is_not_ok("user_mobile_kor_tail", $mobile_tail))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(mobile_tail:$mobile_tail)");
            return false;
        }

        // 생일은 없는 경우, 공백 문자로 입력한다.
        $birthday = $this->getBirthday($birth_year, $birth_month, $birth_day);
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$birthday : $birthday");

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
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");
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

    public function update_klass_on_admin($user_id_admin=-1, $klass_id=-1, $klass_status="")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return false;
        }
        if($this->is_not_ok("user_id", $user_id_admin))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id_admin:$user_id_admin)");
            return false;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(klass_id:$klass_id)");
            return false;
        }
        if($this->is_not_ok("klass_status", $klass_status))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(klass_status:$klass_status)");
            return false;
        }
        
        $data = array(
            'status' => $klass_status
        );

        // QUERY EXECUTION
        $this->CI->db->where('id', $klass_id);
        $this->CI->db->update('klass', $data);        

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $klass_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('klass');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");
        $this->log_query(
            // $user_id=-1
            intval($user_id_admin),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );
        
        return true;
    }    

    public function update_teacher_on_admin($user_id_admin=-1, $teacher_id=-1, $teacher_status="")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return false;
        }
        if($this->is_not_ok("user_id", $user_id_admin))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id_admin:$user_id_admin)");
            return false;
        }
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(teacher_id:$teacher_id)");
            return false;
        }
        if($this->is_not_ok("teacher_status", $teacher_status))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(teacher_status:$teacher_status)");
            return false;
        }
        
        $data = array(
            'status' => $teacher_status
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $teacher_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('teacher');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");
        $this->log_query(
            // $user_id=-1
            intval($user_id_admin),
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

        // QUERY EXECUTION
        $this->CI->db->where('id', $teacher_id);
        $this->CI->db->update('teacher', $data);

        return true;
    }     

    public function update_user_on_admin($user_id_admin=-1, $user_id=-1, $user_status="", $user_permission="")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return false;
        }
        if($this->is_not_ok("user_id", $user_id_admin))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id_admin:$user_id_admin)");
            return false;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id:$user_id)");
            return false;
        }
        if($this->is_not_ok("user_status", $user_status))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_status:$user_status)");
            return false;
        }
        if($this->is_not_ok("user_permission", $user_permission))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_permission:$user_permission)");
            return false;
        }
        
        $data = array(
            'status' => $user_status,
            'permission' => $user_permission
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $user_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('user');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");
        $this->log_query(
            // $user_id=-1
            intval($user_id_admin),
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



    private function get_query_teacher_field()
    {
        $query_fields = 
        "id,". 
        "user_id,". 
        "email,". 
        "name,". 
        "nickname,". 
        "mobile,". 
        "gender,". 
        "birthday,". 
        "thumbnail,". 
        "status,". 
        "resume,". 
        "greeting,". 
        "memo,". 
        "date_created,". 
        "date_updated"
        ;

        return $query_fields;
    }


    private function get_query_field_user()
    {
        $query_field = 
        "id,".
        "facebook_id,".
        "kakao_id,".
        "naver_id,".
        "nickname,".
        "email,".
        "name,".
        "mobile,".
        "gender,".
        "birthday,".
        "thumbnail,".
        "permission,".
        "status,".
        "date_created,".
        "date_updated"
        ;

        return $query_field;
    }  

     

    private function get_query_klass_field() 
    {
        $select_query = 
        'klass.id AS klass_id,' .
        'klass.teacher_id AS klass_teacher_id,' .
        'klass.title AS klass_title,'.
        'klass.type AS klass_type,'.
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

        return $select_query;
    }    

    private function set_where_klass_search($search_query="")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return "";
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            return "";
        } // end if

        $this->CI->db->where($this->get_where_klass_search($search_query), NULL, FALSE);

    }
    private function get_where_klass_search($search_query="")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return "";
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            return "";
        } // end if

        $search_query_like = 
        '('.
        '`title` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ' OR '.
        '`feature` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ' OR '.
        '`target` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ' OR '.
        '`schedule` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ' OR '.
        '`venue_address` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ')'
        ;        

        return $search_query_like;
    }
    private function set_where_klass($klass_status="", $klass_level="", $klass_subway_line="", $klass_subway_station="", $klass_days="", $klass_time="")
    {
        if($this->is_not_ok("klass_status", $klass_status))
        {
            $klass_status = "";
        } // end if
        if($this->is_not_ok("klass_level", $klass_level))
        {
            $klass_level = "";
        } // end if
        if($this->is_not_ok("klass_subway_line", $klass_subway_line))
        {
            $klass_subway_line = "";
        } // end if
        if($this->is_not_ok("klass_subway_station", $klass_subway_station))
        {
            $klass_subway_station = "";
        } // end if
        if($this->is_not_ok("klass_days", $klass_days))
        {
            $klass_days = "";
        } // end if
        if($this->is_not_ok("klass_time", $klass_time))
        {
            $klass_time = "";
        } // end if

        if(!empty($klass_status))
        {
            $this->CI->db->where('klass.status', $klass_status);
        }
        if(!empty($klass_level))
        {
            $this->CI->db->where('klass.level', $klass_level);
        }
        if(!empty($klass_subway_line))
        {
            $this->CI->db->where('klass.subway_line', $klass_subway_line);
        }
        if(!empty($klass_subway_station))
        {
            $this->CI->db->where('klass.subway_station', $klass_subway_station);
        }
        if(!empty($klass_days))
        {
            $this->set_where_klass_days($klass_days);
        }
        if(!empty($klass_time))
        {
            $this->set_where_klass_time($klass_time);
        } // end if
    } // end method

    private function set_where_klass_days($klass_days="")
    {
        if($this->is_not_ok("klass_days", $klass_days))
        {
            return;
        } // end if

        // REFACTOR ME - delimiter를 const에서 가져오도록 변경.
        $klass_days_list = explode("|||", $klass_days);

        $search_query_like = "";
        if(!empty($klass_days_list)) {
            $search_query_like .= "(";
            for ($i=0; $i < count($klass_days_list); $i++) 
            { 
                $search_query = $klass_days_list[$i];
                if(0 == $i) 
                {
                    // 첫번째 요일
                    $search_query_like .= '`days` LIKE \'%'.$search_query.'%\' ESCAPE \'!\'';
                }
                else 
                {
                    // 그 이후의 요일들
                    $search_query_like .= ' OR `days` LIKE \'%'.$search_query.'%\' ESCAPE \'!\'';
                }
                
            }
            $search_query_like .= ")";
        }
        $this->CI->db->where($search_query_like, NULL, FALSE);        

    }

    private function set_where_klass_time($klass_time="")
    {
        if($this->is_not_ok("klass_time", $klass_time))
        {
            return;
        } // end if

        // Set time range
        // 시간 관련 검색은 범위를 가져와야 한다.
        $extra = [];
        $extra['time_begin'] = 
        $time_begin = 
        $this->CI->my_paramchecker->get_const_from_list(
            $klass_time, 
            'class_times_list', 
            'class_times_range_list'
        );
        $extra['time_end'] = 
        $time_end = 
        $this->CI->my_paramchecker->get_const_from_list(
            $klass_time, 
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
    }

    public function select_klass_cnt_on_admin($search_query="", $klass_status="", $klass_level="", $klass_subway_line="", $klass_subway_station="", $klass_days="", $klass_time="") 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            $search_query = "";
        } // end if

        // Query Execution
        $this->CI->db->from('klass');
        $this->set_where_klass(
            // $klass_status="",
            $klass_status, 
            // $klass_level="",
            $klass_level, 
            // $klass_subway_line="",
            $klass_subway_line,
            // $klass_subway_station="",
            $klass_subway_station,
            // $klass_days="",
            $klass_days,
            // $klass_time=""
            $klass_time
        );
        $this->set_where_klass_search($search_query);
        $cnt = $this->CI->db->count_all_results();

        // Query Logging
        $this->CI->db->from('klass');
        $this->set_where_klass(
            // $klass_status="",
            $klass_status, 
            // $klass_level="",
            $klass_level, 
            // $klass_subway_line="",
            $klass_subway_line,
            // $klass_subway_station="",
            $klass_subway_station,            
            // $klass_days="",
            $klass_days,
            // $klass_time=""
            $klass_time
        );        
        $this->set_where_klass_search($search_query);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);

        return $cnt;

    } // end method 

    public function select_klass_on_admin($limit=-1, $offset=-1, $search_query="", $klass_status="", $klass_level="", $klass_subway_line="", $klass_subway_station="", $klass_days="", $klass_time="") 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            $search_query = "";
        } // end if
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if  

        // Query Execution
        $query_field = $this->get_query_klass_field();
        $this->CI->db->select($query_field);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        // $this->set_where_on_search_klass("", $level, $station, $day, $time);
        $this->set_where_klass(
            // $klass_status="",
            $klass_status, 
            // $klass_level="",
            $klass_level, 
            // $klass_subway_line="",
            $klass_subway_line,
            // $klass_subway_station="",
            $klass_subway_station,
            // $klass_days="",
            $klass_days,
            // $klass_time=""
            $klass_time
        );        
        $this->set_where_klass_search($search_query);
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($limit, $offset);
        $query = $this->CI->db->get();

        // Query Logging
        $this->CI->db->select($query_field);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        // $this->set_where_on_search_klass("", $level, $station, $day, $time);
        $this->set_where_klass(
            // $klass_status="",
            $klass_status, 
            // $klass_level="",
            $klass_level, 
            // $klass_subway_line="",
            $klass_subway_line,
            // $klass_subway_station="",
            $klass_subway_station,            
            // $klass_days="",
            $klass_days,
            // $klass_time=""
            $klass_time
        );
        $this->set_where_klass_search($search_query);
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($limit, $offset);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);    

        return $query->result_object();

    } // end method        



    private function get_query_search_like($search_query="")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return "";
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            return "";
        } // end if

        $search_query_like = 
        '('.
        '`name` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ' OR '.
        '`nickname` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ' OR '.
        '`email` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ' OR '.
        '`mobile` LIKE \'%'.$search_query.'%\' ESCAPE \'!\''.
        ')'
        ;        

        return $search_query_like;
    }

    public function select_teacher_cnt_on_admin($search_query="", $teacher_status="") 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            $search_query = "";
        } // end if
        if($this->is_not_ok("teacher_status", $teacher_status))
        {
            $teacher_status = "";
        } // end if

        // Query Execution
        $this->CI->db->from('teacher');
        if(!empty($teacher_status))
        {
            $this->CI->db->where('status', $teacher_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
        }
        $cnt = $this->CI->db->count_all_results();

        // Query Logging
        $this->CI->db->from('teacher');
        if(!empty($teacher_status))
        {
            $this->CI->db->where('status', $teacher_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
        }
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);

        return $cnt;

    } // end method 

    public function select_teacher_on_admin($search_query="", $teacher_status="", $limit=-1, $offset=-1) 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            $search_query = "";
        } // end if
        if($this->is_not_ok("teacher_status", $teacher_status))
        {
            $teacher_status = "";
        } // end if
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if        

        $query_field = $this->get_query_teacher_field();

        // Query Execution
        $this->CI->db->select($query_field);
        $this->CI->db->from('teacher');
        if(!empty($teacher_status))
        {
            $this->CI->db->where('status', $teacher_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
        }
        $this->CI->db->limit($limit, $offset);
        $query = $this->CI->db->get();

        // Query Logging
        $this->CI->db->select($query_field);
        $this->CI->db->from('teacher');
        if(!empty($teacher_status))
        {
            $this->CI->db->where('status', $teacher_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
        }
        $this->CI->db->limit($limit, $offset);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);    

        return $query->custom_result_object('Teacher');

    } // end method       

    public function select_user_cnt_on_admin($search_query="", $user_status="", $user_permission="") 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            $search_query = "";
        } // end if
        if($this->is_not_ok("user_status", $user_status))
        {
            $user_status = "";
        } // end if
        if($this->is_not_ok("user_permission", $user_permission))
        {
            $user_permission = "";
        } // end if

        // Query Execution
        $this->CI->db->from('user');
        if(!empty($user_permission))
        {
            $this->CI->db->where('permission', $user_permission);
        }
        if(!empty($user_status))
        {
            $this->CI->db->where('status', $user_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
        }
        $cnt = $this->CI->db->count_all_results();

        // Query Logging
        $this->CI->db->from('user');
        if(!empty($user_permission))
        {
            $this->CI->db->where('permission', $user_permission);
        }
        if(!empty($user_status))
        {
            $this->CI->db->where('status', $user_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
            // $this->CI->db->like('name', $search_query);
            // $this->CI->db->or_like('nickname', $search_query);
            // $this->CI->db->or_like('email', $search_query);
            // $this->CI->db->or_like('mobile', $search_query);
        }
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);

        return $cnt;

    } // end method

    public function select_user_on_admin($search_query="", $user_status="", $user_permission="", $limit=-1, $offset=-1) 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("search_query", $search_query))
        {
            $search_query = "";
        } // end if
        if($this->is_not_ok("user_status", $user_status))
        {
            $user_status = "";
        } // end if
        if($this->is_not_ok("user_permission", $user_permission))
        {
            $user_permission = "";
        } // end if        
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if        

        $query_field = $this->get_query_field_user();

        // Query Execution
        $this->CI->db->select($query_field);
        $this->CI->db->from('user');
        if(!empty($user_permission))
        {
            $this->CI->db->where('permission', $user_permission);
        }
        if(!empty($user_status))
        {
            $this->CI->db->where('status', $user_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
            // $this->CI->db->like('name', $search_query);
            // $this->CI->db->or_like('nickname', $search_query);
            // $this->CI->db->or_like('email', $search_query);
            // $this->CI->db->or_like('mobile', $search_query);
        }
        $this->CI->db->limit($limit, $offset);
        $query = $this->CI->db->get();

        // Query Logging
        $this->CI->db->select($query_field);
        $this->CI->db->from('user');
        if(!empty($user_permission))
        {
            $this->CI->db->where('permission', $user_permission);
        }
        if(!empty($user_status))
        {
            $this->CI->db->where('status', $user_status);
        }
        if(!empty($search_query))
        {
            $this->CI->db->where($this->get_query_search_like($search_query), NULL, FALSE);
            // $this->CI->db->like('name', $search_query);
            // $this->CI->db->or_like('nickname', $search_query);
            // $this->CI->db->or_like('email', $search_query);
            // $this->CI->db->or_like('mobile', $search_query);
        }
        $this->CI->db->limit($limit, $offset);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);    

        return $query->custom_result_object('User');

    } // end method



  

  

    public function get_user_list() 
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        $limit = 100;
        $offset = 0;

        $this->CI->db->select('id, facebook_id, kakao_id, naver_id, nickname, email, name, mobile, gender, birthday, thumbnail, permission, status, date_created, date_updated');
        // 유효한 상태의 유저들만 가져옴.
        $this->CI->db->where('status', "A");
        $this->CI->db->limit($limit, $offset);
        $sql = $this->CI->db->get_compiled_select('user');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);

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
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if(empty($email))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$email)");
            return "";
        }

        $is_ok = true;
        if(isset($this->CI->my_paramchecker)) {
            $is_ok = $this->CI->my_paramchecker->is_ok("user_email", $email);
        }

        if(!$is_ok) {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
            return "";
        }

        $this->CI->db->select('password');
        $this->CI->db->where('email', $email);
        $this->CI->db->limit(1);
        $sql = $this->CI->db->get_compiled_select('user');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);

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
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$password_hashed : $password_hashed");

        return $password_hashed;
    }    

    public function select_user_by_id($user_id=-1) 
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

    private function set_where_select_active_klass_cnt_by_teacher($teacher_id=-1)
    {
        $this->CI->db->select('*');
        $this->CI->db->from('klass');
        $this->CI->db->where('klass.teacher_id', $teacher_id);
        $status_list = array('E', 'B', 'C');
        $this->CI->db->where_in('klass.status', $status_list);
    }

    public function select_active_klass_cnt_by_teacher($teacher_id=-1)
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        } // end if

        $this->set_where_select_active_klass_cnt_by_teacher($teacher_id);
        $cnt = $this->CI->db->count_all_results();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$cnt : $cnt");

        $this->set_where_select_active_klass_cnt_by_teacher($teacher_id);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $cnt;

    } // end method 

    private function set_where_select_active_klass_list_by_teacher($offset=-1, $limit=-1, $teacher_id=-1)
    {
        $select_query = $this->get_query_klass_field();

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->where('klass.teacher_id', $teacher_id);
        $status_list = array('E', 'B', 'C');
        $this->CI->db->where_in('klass.status', $status_list);
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($limit,$offset);
    }
    public function select_active_klass_list_by_teacher($offset=-1, $limit=-1, $teacher_id=-1)
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if(!(0 < $offset)) 
        {
            $offset = 0;
        } // end if
        if(!(0 < $limit)) 
        {
            $limit = 20;
        } // end if
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        } // end if

        $this->set_where_select_active_klass_list_by_teacher($offset, $limit, $teacher_id);
        $query = $this->CI->db->get();

        $this->set_where_select_active_klass_list_by_teacher($offset, $limit, $teacher_id);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_object();

    } // end method        

    public function select_klass_cnt_by_teacher($teacher_id=-1, $klass_status="O")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        } // end if
        if($this->is_not_ok("klass_status", $klass_status))
        {
            $klass_status = "";
        } // end if

        $this->CI->db->select('*');
        $this->CI->db->from('klass');
        $this->CI->db->where('klass.teacher_id', $teacher_id);
        if(!empty($klass_status))
        {
            $this->CI->db->where('klass.status', $klass_status);
        }
        $cnt = $this->CI->db->count_all_results();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$cnt : $cnt");

        $this->CI->db->select('*');
        $this->CI->db->from('klass');
        $this->CI->db->where('klass.teacher_id', $teacher_id);
        if(!empty($klass_status))
        {
            $this->CI->db->where('klass.status', $klass_status);
        }
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $cnt;

    } // end method 

    public function select_klass_list_by_teacher($offset=-1, $limit=-1, $teacher_id=-1, $klass_status="O")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if(!(0 < $offset)) 
        {
            $offset = 0;
        } // end if
        if(!(0 < $limit)) 
        {
            $limit = 20;
        } // end if
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        } // end if
        if($this->is_not_ok("klass_status", $klass_status))
        {
            $klass_status = "";
        } // end if

        $select_query = $this->get_query_klass_field();

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->where('klass.teacher_id', $teacher_id);
        if(!empty($klass_status))
        {
            $this->CI->db->where('klass.status', $klass_status);
        }
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($limit,$offset);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->where('klass.teacher_id', $teacher_id);
        if(!empty($klass_status))
        {
            $this->CI->db->where('klass.status', $klass_status);
        }
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($limit,$offset);
        $query = $this->CI->db->get();

        return $query->result_object();

    } // end method    


    public function select_klass_list($offset=-1, $limit=-1, $klass_status="O")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if(!(0 < $offset)) 
        {
            $offset = 0;
        }
        if(!(0 < $limit)) 
        {
            $limit = 20;
        }

        $select_query = $this->get_query_klass_field();

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        if(!empty($klass_status))
        {
            $this->CI->db->where('klass.status', $klass_status);
        }
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($limit,$offset);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        if(!empty($klass_status))
        {
            $this->CI->db->where('klass.status', $klass_status);
        }
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit($limit,$offset);
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





    // @ Desc : 선생님과 수업을 기준으로 전체 리뷰 갯수 - 부모글(parent_id=-1)를 알려줍니다.
    private function set_where_select_klass_question_cnt_by_teacher($klass_id_list=null)
    {
        if(empty($klass_id_list))
        {
            return "";
        }

        $this->CI->db->select("*");
        $this->CI->db->from("question");
        $this->CI->db->where_in('klass_id', $klass_id_list);
        $this->CI->db->where('parent_id',-1);
        $this->CI->db->where('status','A');
    }
    public function select_klass_question_cnt_by_teacher($teacher_id=-1, $klass_id=-1)
    {
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return [];
        } // end if
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        } // end if

        $klass_id_list = [];
        if(0 < $klass_id)
        {
            array_push($klass_id_list, $klass_id);
        }
        else 
        {
            // 선생님이 진행중인 모든 수업 id 리스트를 가져와야 합니다.
            $klass_id_list = $this->select_klass_id_list_by_teacher($teacher_id);
        } // end if

        if(empty($klass_id_list))
        {
            return [];
        }

        // Query Execution
        $this->set_where_select_klass_question_cnt_by_teacher($klass_id_list);
        $cnt = $this->CI->db->count_all_results();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$cnt : $cnt");

        // Logging
        $this->set_where_select_klass_question_cnt_by_teacher($klass_id_list);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $cnt;
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

    // @ Desc : 선생님과 수업을 기준으로 전체 리뷰 갯수 - 부모글(parent_id=-1)를 알려줍니다.
    private function set_where_select_klass_review_cnt_by_teacher($klass_id_list=null)
    {
        if(empty($klass_id_list))
        {
            return "";
        }

        $this->CI->db->select("*");
        $this->CI->db->from("review");
        $this->CI->db->where_in('klass_id', $klass_id_list);
        $this->CI->db->where('parent_id',-1);
        $this->CI->db->where('status','A');
    }
    public function select_klass_review_cnt_by_teacher($teacher_id=-1, $klass_id=-1)
    {
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return [];
        } // end if
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        } // end if

        $klass_id_list = [];
        if(0 < $klass_id)
        {
            array_push($klass_id_list, $klass_id);
        }
        else 
        {
            // 선생님이 진행중인 모든 수업 id 리스트를 가져와야 합니다.
            $klass_id_list = $this->select_klass_id_list_by_teacher($teacher_id);
        } // end if

        if(empty($klass_id_list))
        {
            return [];
        }

        // Query Execution
        $this->set_where_select_klass_review_cnt_by_teacher($klass_id_list);
        $cnt = $this->CI->db->count_all_results();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$cnt : $cnt");

        // Logging
        $this->set_where_select_klass_review_cnt_by_teacher($klass_id_list);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $cnt;
    }
    // @ Desc : 선생님과 수업을 기준으로 리뷰 리스트 - 부모글(parent_id=-1)를 가져옵니다. Pagination을 사용합니다.
    private function set_where_select_klass_review_id_list_by_teacher($limit=-1, $offset=-1, $klass_id_list=null)
    {
        if(empty($klass_id_list))
        {
            return "";
        } // end if

        $query_select = 
        '`review`.`id` AS review_id'
        ;

        $this->CI->db->select($query_select);
        $this->CI->db->from("review");
        $this->CI->db->join('user', '`review`.`user_id` = `user`.`id`','left');
        if(!empty($klass_id_list))
        {
            $this->CI->db->where_in('`review`.`klass_id`', $klass_id_list);
        }
        $this->CI->db->where('`review`.`parent_id`',-1);
        $this->CI->db->where('`review`.`status`','A');
        $this->CI->db->where('`user`.`status`','A');
        $this->CI->db->limit($limit, $offset);
        $this->CI->db->order_by('`review`.`id`', 'DESC');

    } 
    private function select_klass_review_id_list_by_teacher($limit=-1, $offset=-1, $klass_id_list=null)
    {
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return [];
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return [];
        } // end if
        if(empty($klass_id_list))
        {
            return [];
        } // end if

        // Query Execution
        $this->set_where_select_klass_review_id_list_by_teacher($limit, $offset, $klass_id_list);
        $query = $this->CI->db->get();

        // Logging
        $this->set_where_select_klass_review_id_list_by_teacher($limit, $offset, $klass_id_list);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $review_id_list = [];
        foreach ($query->result_array() as $row)
        {
            array_push($review_id_list, intval($row['review_id']));
        } // end foreach

        return $review_id_list;
    }   
    private function set_where_select_klass_review_list_by_teacher($limit=-1, $offset=-1, $review_id_list=null)
    {
        if(empty($review_id_list))
        {
            return "";
        } // end if

        $query_select = 
        'review.id AS parent_review_id,'.
        'review.parent_id AS parent_review_parent_id,'.
        'review.klass_id AS parent_review_klass_id,'.
        'review.user_id AS parent_review_user_id,'.
        'review.parent_id AS parent_review_parent_id,'.
        'review.comment AS parent_review_comment,'.
        'review.star AS parent_review_star,'.
        'review.date_created AS parent_review_date_created,'.
        'review.date_updated AS parent_review_date_updated,'.

        'user.id AS parent_review_user_id,'.
        'user.name AS parent_review_user_name,'.
        'user.nickname AS parent_review_user_nickname,'.
        'user.thumbnail AS parent_review_user_thumbnail,'.

        'IFNULL(child_review.id, -1) AS child_review_id,'.
        'IFNULL(child_review.parent_id, -1) AS child_review_parent_id,'.
        'IFNULL(child_review.klass_id, -1) AS child_review_klass_id,'.
        'IFNULL(child_review.user_id, -1) AS child_review_user_id,'.
        'IFNULL(child_review.parent_id, -1) AS child_review_parent_id,'.
        'IFNULL(child_review.comment, "") AS child_review_comment,'.
        'IFNULL(child_review.star, -1) AS child_review_star,'.
        'IFNULL(child_review.date_created, "") AS child_review_date_created,'.
        'IFNULL(child_review.date_updated, "") AS child_review_date_updated,'.

        'IFNULL(child_review_user.id, -1) AS child_review_user_id,'.
        'IFNULL(child_review_user.name, "") AS child_review_user_name,'.
        'IFNULL(child_review_user.nickname, "") AS child_review_user_nickname,'.
        'IFNULL(child_review_user.thumbnail, "") AS child_review_user_thumbnail,'
        ;

        $this->CI->db->select($query_select);
        $this->CI->db->from("review");
        $this->CI->db->join('user', 'review.user_id = user.id','left');
        $this->CI->db->join('review AS child_review', 'child_review.parent_id = review.id AND `child_review`.`status` = "A"','left');
        $this->CI->db->join('user AS child_review_user', 'child_review_user.id = child_review.user_id AND `child_review_user`.`status` = "A"','left');
        $this->CI->db->where_in('review.id', $review_id_list);
        $this->CI->db->where('review.parent_id',-1);
        $this->CI->db->where('review.status','A');
        $this->CI->db->where('user.status','A');
        $this->CI->db->limit($limit, $offset);
        $this->CI->db->order_by('review.id', 'DESC');
        $this->CI->db->order_by('child_review.id', 'DESC');

    }
    public function select_klass_review_list_by_teacher($limit=-1, $offset=-1, $teacher_id=-1, $klass_id=-1)
    {
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return [];
        } // end if
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        } // end if

        $klass_id_list = [];
        if(0 < $klass_id)
        {
            array_push($klass_id_list, $klass_id);
        }
        else 
        {
            // 선생님이 진행중인 모든 수업 id 리스트를 가져와야 합니다.
            $klass_id_list = $this->select_klass_id_list_by_teacher($teacher_id);
        } // end if

        if(empty($klass_id_list))
        {
            return [];
        }

        // 해당 수업의 모든 부모 리뷰의 id 리스트를 가져옵니다.
        $review_id_list = 
        $this->select_klass_review_id_list_by_teacher($limit, $offset, $klass_id_list);
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$review_id_list : " . join(',', $review_id_list));

        // $limit과 $offset에 해당하는 부모 리뷰와 이에 속한 댓글 - 자식 리뷰 리스트 가져옵니다.
        $this->set_where_select_klass_review_list_by_teacher($limit, $offset, $review_id_list);
        $query = $this->CI->db->get();

        $this->set_where_select_klass_review_list_by_teacher($limit, $offset, $review_id_list);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
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
    public function select_teacher_by_user_id($user_id=-1)
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            return;
        }

        $this->CI->db->where('user_id', $user_id);
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

        $rows = $query->custom_result_object('Teacher');
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
    private function get_klass_days_default()
    {
        $class_level_list = $this->CI->my_paramchecker->get_const('class_days_list');
        if(!empty($class_level_list)) {
            return $class_level_list[1];
        }

        return "";
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

    public function add_klass($user_id=-1, $teacher_id=-1, $teacher_resume="", $teacher_greeting="", $title="", $type="", $feature="", $target="", $schedule="", $date_begin="", $time_begin="", $time_duration_minutes=-1, $level="", $days="")
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
        if($this->is_not_ok("klass_type", $type))
        {
            $class_type_list = $this->get_const("class_type_list");
            $type = $class_type_list[1]; // F : 과금 모델을 사용하지 않음.
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
        if($this->is_not_ok("klass_days", $days))
        {
            $days = $this->get_klass_days_default();
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
        $venue_latitude = "127.0939713";
        $venue_longitude = "37.5111896";

        $subway_line = $this->get_subway_line_default();
        $subway_station = $this->get_subway_station_default();

        $data = array(
            'teacher_id' => $teacher_id,
            'teacher_resume' => $teacher_resume,
            'teacher_greeting' => $teacher_greeting,
            'title' => $title,
            'type' => $type,
            'feature' => $feature,
            'target' => $target,
            'schedule' => $schedule,
            'date_begin' => $date_begin,
            'time_begin' => $time_begin,
            'time_end' => $time_end,
            'time_duration_minutes' => $time_duration_minutes,
            'level' => $level,
            'week' => 4,
            'days' => $days,
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

    public function update_klass($klass_id=-1,$user_id=-1, $teacher_id=-1, $teacher_resume="", $teacher_greeting="", $title="", $type="", $feature="", $target="", $schedule="", $date_begin="", $time_begin="", $time_end="", $time_duration_minutes=-1, $level="", $week=-1, $days="", $venue_title="", $venue_telephone="", $venue_address="", $venue_road_address="", $venue_latitude="", $venue_longitude="", $subway_line="", $subway_station="", $banner_url="", $poster_url="", $price=-1, $student_cnt=-1)
    {

        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_id\", $klass_id)");
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"user_id\", $user_id)");
            return;
        }
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"teacher_id\", $teacher_id)");
            return;
        }
        if($this->is_not_ok("teacher_resume", $teacher_resume))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"teacher_resume\", $teacher_resume)");
            return;
        }
        if($this->is_not_ok("teacher_greeting", $teacher_greeting))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"teacher_greeting\", $teacher_greeting)");
            return;
        }
        if($this->is_not_ok("klass_title", $title))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_title\", $title)");
            return;
        }
        if($this->is_not_ok("klass_type", $type))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_feature\", $feature)");
            return;
        }
        if($this->is_not_ok("klass_feature", $feature))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_feature\", $feature)");
            return;
        }
        if($this->is_not_ok("klass_target", $target))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_target\", $target)");
            return;
        }
        if($this->is_not_ok("klass_schedule", $schedule))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_schedule\", $schedule)");
            return;
        }
        if($this->is_not_ok("klass_date_begin", $date_begin))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_date_begin\", $date_begin)");
            return;
        }
        if($this->is_not_ok("klass_time_hhmm", $time_begin))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_time_hhmm\", $time_begin)");
            return;
        }
        if($this->is_not_ok("klass_time_hhmm", $time_end))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_time_hhmm\", $time_end)");
            return;
        }
        if($this->is_not_ok("klass_level", $level))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_level\", $level)");
            return;
        }
        if($this->is_not_ok("klass_week", $week))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_week\", $week)");
            return;
        }
        if($this->is_not_ok("klass_days", $days))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_days\", $days)");
            return;
        }
        if($this->is_not_ok("klass_price", $price))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_price\", $price)");
            return;
        }
        if($this->is_not_ok("klass_student_cnt", $student_cnt))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_student_cnt\", $student_cnt)");
            return;
        }

        if($this->is_not_ok("klass_venue_title", $venue_title))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_title\", $venue_title)");
            return;
        }
        if($this->is_not_ok("klass_venue_telephone", $venue_telephone))
        {
            $venue_telephone = "";
        }
        if($this->is_not_ok("klass_venue_address", $venue_address))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_address\", $venue_address)");
            return;
        }
        if($this->is_not_ok("klass_venue_road_address", $venue_road_address))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_road_address\", $venue_road_address)");
            return;
        }
        if($this->is_not_ok("klass_venue_latitude", $venue_latitude))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_latitude\", $venue_latitude)");
            return;
        }
        if($this->is_not_ok("klass_venue_longitude", $venue_longitude))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_venue_longitude\", $venue_longitude)");
            return;
        }
        if($this->is_not_ok("klass_subway_line", $subway_line))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_subway_line\", $subway_line)");
            return;
        }
        if($this->is_not_ok("klass_subway_station", $subway_station))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "$this->is_not_ok(\"klass_subway_station\", $subway_station)");
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
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, $sql);

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

        $select_query = $this->get_query_klass_field();

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->where('klass.id', $klass_id);
        $this->CI->db->limit(1);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->where('klass.id', $klass_id);
        $this->CI->db->limit(1);
        $query = $this->CI->db->get();

        return $query->row();        

    }

    private function set_where_klass_by_teacher($teacher_id=-1) 
    {
        $select_query = $this->get_query_klass_field();

        $this->CI->db->select($select_query);
        $this->CI->db->from('klass');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id');
        $this->CI->db->where('klass.teacher_id', $teacher_id);
        $this->CI->db->order_by('klass.id', 'DESC');
        $this->CI->db->limit(1);
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

        $this->set_where_klass_by_teacher($teacher_id);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $this->set_where_klass_by_teacher($teacher_id);
        $query = $this->CI->db->get();

        return $query->row();
    }
    private function select_klass_id_list_by_teacher($teacher_id=-1) 
    {
        if($this->is_not_ready())
        {
            return;
        }

        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            return;
        }

        // Query Execution
        $this->CI->db->select('id');
        $this->CI->db->from('klass');
        $this->CI->db->where('teacher_id', $teacher_id);
        $this->CI->db->order_by('id', 'DESC');
        $query = $this->CI->db->get();

        // Query Logging
        $this->CI->db->select('id');
        $this->CI->db->from('klass');
        $this->CI->db->where('teacher_id', $teacher_id);
        $this->CI->db->order_by('id', 'DESC');
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        $klass_id_list = [];
        foreach ($query->result_array() as $row)
        {
            array_push($klass_id_list, intval($row['id']));
        }

        return $klass_id_list;
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
    } // end method

    // @ Desc : Unix 시간을 datetime 포맷으로 바꿉니다.(YYYY-MM-DD HH:mm:ss)
    // @ Referer : http://stackoverflow.com/questions/6267564/convert-unix-timestamp-into-human-readable-date-using-mysql
    // @ Referer : http://www.w3schools.com/sql/func_date_format.asp
    private function convert_unixtime_to_datetime($unix_time=-1)
    {
        if(!(0 < $unix_time)) {
            return "";
        }

        $sql = "SELECT from_unixtime($unix_time, '%Y-%m-%d %H:%i:%s') AS `my_datetime`";

        $query = $this->CI->db->query($sql);

        return $query->row()->my_datetime;
    }

    public function add_payment_import($login_user_id=-1, $payment_imp=null)
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);

        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if(is_null($payment_imp))
        {
            return;
        }

        // @ Required
        if($this->is_not_ok("klass_id", $payment_imp->klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "klass_id is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("user_id", $payment_imp->user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "user_id is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("user_id", $login_user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "login_user_id is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_uid", $payment_imp->imp_uid))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "imp_uid is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_merchant_uid", $payment_imp->merchant_uid))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "merchant_uid is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_pay_method", $payment_imp->pay_method))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "pay_method is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_pg_provider", $payment_imp->pg_provider))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "pg_provider is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_pg_tid", $payment_imp->pg_tid))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "pg_tid is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_escrow", $payment_imp->escrow))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "escrow is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_apply_num", $payment_imp->apply_num))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "apply_num is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_name", $payment_imp->name))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "name is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_buyer_name", $payment_imp->buyer_name))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "buyer_name is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_buyer_email", $payment_imp->buyer_email))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "buyer_email is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_buyer_tel", $payment_imp->buyer_tel))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "buyer_tel is not valid");
            return;
        }

        // @ Required
        if($this->is_not_ok("payment_imp_status", $payment_imp->status))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "status is not valid");
            return;
        }

        // 결제 / 취소 / 환불 등의 UNIX TIME을 DATE TIME으로 바꾸어야 한다.
        if(0 < $payment_imp->vbank_date) 
        {
            $payment_imp->my_date_vbank_date = 
            $this->convert_unixtime_to_datetime($payment_imp->vbank_date);
        } // end if
        if(0 < $payment_imp->paid_at) 
        {
            $payment_imp->my_date_paid_at = 
            $this->convert_unixtime_to_datetime($payment_imp->paid_at);
        } // end if
        if(0 < $payment_imp->failed_at) 
        {
            $payment_imp->my_date_failed_at = 
            $this->convert_unixtime_to_datetime($payment_imp->failed_at);
        } // end if
        if(0 < $payment_imp->cancelled_at) 
        {
            $payment_imp->my_date_cancelled_at = 
            $this->convert_unixtime_to_datetime($payment_imp->cancelled_at);
        } // end if

        $data = array(

            'klass_id' => $payment_imp->klass_id,
            'user_id' => $payment_imp->user_id,
            'imp_uid' => $payment_imp->imp_uid,
            'merchant_uid' => $payment_imp->merchant_uid,
            'pay_method' => $payment_imp->pay_method,
            // 5

            'pg_provider' => $payment_imp->pg_provider,
            'pg_tid' => $payment_imp->pg_tid,
            'escrow' => $payment_imp->escrow,
            'apply_num' => $payment_imp->apply_num,
            'card_name' => $payment_imp->card_name,
            // 10

            'card_quota' => $payment_imp->card_quota,
            'vbank_name' => $payment_imp->vbank_name,
            'vbank_num' => $payment_imp->vbank_num,
            'vbank_holder' => $payment_imp->vbank_holder,
            'vbank_date' => $payment_imp->vbank_date,
            // 15

            'my_date_vbank_date' => $payment_imp->my_date_vbank_date,
            'name' => $payment_imp->name,
            'amount' => $payment_imp->amount,
            'cancel_amount' => $payment_imp->cancel_amount,
            'currency' => $payment_imp->currency,
            // 20

            'buyer_name' => $payment_imp->buyer_name,
            'buyer_email' => $payment_imp->buyer_email,
            'buyer_tel' => $payment_imp->buyer_tel,
            'buyer_addr' => $payment_imp->buyer_addr,
            'buyer_postcode' => $payment_imp->buyer_postcode,
            // 25

            'status' => $payment_imp->status,
            'paid_at' => $payment_imp->paid_at,
            'my_date_paid_at' => $payment_imp->my_date_paid_at,
            'failed_at' => $payment_imp->failed_at,
            'my_date_failed_at' => $payment_imp->my_date_failed_at,
            // 30

            'cancelled_at' => $payment_imp->cancelled_at,
            'my_date_cancelled_at' => $payment_imp->my_date_cancelled_at,
            'fail_reason' => $payment_imp->fail_reason,
            'cancel_reason' => $payment_imp->cancel_reason,
            'receipt_url' => $payment_imp->receipt_url,
            // 35

            'cancel_receipt_url' => $payment_imp->cancel_receipt_url
            // 36
        );

        // Query Execution
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('payment_import', $data);

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('payment_import');
        $this->log_query(
            // $user_id=-1
            $login_user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

    } // end method 

    public function select_payment_import_cnt($klass_id=-1, $user_id=-1)
    {
        if($this->is_not_ready())
        {
            return;
        } // end if
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        } // end if
        if($this->is_not_ok("user_id", $user_id))
        {
            $user_id = -1;
        } // end if


        // Query Execution
        $this->CI->db->select("*");
        $this->CI->db->from("payment_import");
        if(0 < $klass_id) 
        {
            $this->CI->db->where('klass_id',$klass_id);
        }
        if(0 < $klass_id) 
        {
            $this->CI->db->where('user_id',$user_id);
        }
        $cnt = $this->CI->db->count_all_results();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$cnt : $cnt");

        // Logging
        $this->CI->db->select("*"); 
        $this->CI->db->from("payment_import");
        if(0 < $klass_id) 
        {
            $this->CI->db->where('klass_id',$klass_id);
        }
        if(0 < $user_id) 
        {
            $this->CI->db->where('user_id',$user_id);
        }
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $cnt;
    }
 

    // @ Desc : 마지막 결재 영수증 링크 가져오기.(결재 or 결재 취소)
    public function select_payment_import_receipt($klass_id=-1, $user_id=-1, $payment_imp_status="")
    {
        if($this->is_not_ready())
        {
            return;
        } // end if
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        } // end if
        if($this->is_not_ok("user_id", $user_id))
        {
            $user_id = -1;
        } // end if
        if($this->is_not_ok("payment_imp_status", $payment_imp_status))
        {
            return;
        } // end if

        // Query Execution
        $query_field = 
        'IF(payment_import.status=\'paid\',payment_import.receipt_url,payment_import.cancel_receipt_url) AS receipt_url';
        $this->CI->db->select($query_field);
        $this->CI->db->from("payment_import");
        if(0 < $klass_id) 
        {
            $this->CI->db->where('payment_import.klass_id',$klass_id);
        }
        if(0 < $klass_id) 
        {
            $this->CI->db->where('payment_import.user_id',$user_id);
        }
        if(!empty($payment_imp_status))
        {
            $this->CI->db->where('payment_import.status',$payment_imp_status);
        }
        $this->CI->db->order_by('payment_import.id', 'DESC');
        $this->CI->db->limit(1);
        $query = $this->CI->db->get();
        $result = $query->row();
        $receipt_url = $result->receipt_url;
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$receipt_url : $receipt_url");

        // Logging
        $this->CI->db->select($query_field); 
        $this->CI->db->from("payment_import");
        if(0 < $klass_id) 
        {
            $this->CI->db->where('payment_import.klass_id',$klass_id);
        }
        if(0 < $user_id) 
        {
            $this->CI->db->where('payment_import.user_id',$user_id);
        }
        if(!empty($payment_imp_status))
        {
            $this->CI->db->where('payment_import.status',$payment_imp_status);   
        }
        $this->CI->db->order_by('payment_import.id', 'DESC');
        $this->CI->db->limit(1);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $receipt_url;
    }        
    
    private function get_query_payment_import_field() 
    {
        $select_query = 
        'payment_import.id AS pi_id,' .
        'payment_import.klass_id AS pi_klass_id,' .
        'payment_import.user_id AS pi_user_id,' .
        'payment_import.imp_uid AS pi_imp_uid,' .
        'payment_import.merchant_uid AS pi_merchant_uid,' .

        'payment_import.pay_method AS pi_pay_method,' .
        'payment_import.pg_provider AS pi_pg_provider,' .
        'payment_import.pg_tid AS pi_pg_tid,' .
        'payment_import.escrow AS pi_escrow,' .
        'payment_import.apply_num AS pi_apply_num,' .

        'payment_import.card_name AS pi_card_name,' .
        'payment_import.card_quota AS pi_card_quota,' .
        'payment_import.vbank_name AS pi_vbank_name,' .
        'payment_import.vbank_num AS pi_vbank_num,' .
        'payment_import.vbank_holder AS pi_vbank_holder,' .

        'payment_import.vbank_date AS pi_vbank_date,' .
        'payment_import.my_date_vbank_date AS pi_my_date_vbank_date,' .
        'payment_import.name AS pi_name,' .
        'payment_import.amount AS pi_amount,' .
        'payment_import.cancel_amount AS pi_cancel_amount,' .

        'payment_import.currency AS pi_currency,' .
        'payment_import.buyer_name AS pi_buyer_name,' .
        'payment_import.buyer_email AS pi_buyer_email,' .
        'payment_import.buyer_tel AS pi_buyer_tel,' .
        'payment_import.buyer_addr AS pi_buyer_addr,' .

        'payment_import.buyer_postcode AS pi_buyer_postcode,' .
        'payment_import.status AS pi_status,' .
        'payment_import.paid_at AS pi_paid_at,' .
        'payment_import.my_date_paid_at AS pi_my_date_paid_at,' .
        'payment_import.failed_at AS pi_failed_at,' .

        'payment_import.my_date_failed_at AS pi_my_date_failed_at,' .
        'payment_import.cancelled_at AS pi_cancelled_at,' .
        'payment_import.my_date_cancelled_at AS pi_my_date_cancelled_at,' .
        'payment_import.fail_reason AS pi_fail_reason,' .
        'payment_import.cancel_reason AS pi_cancel_reason,' .

        'payment_import.receipt_url AS pi_receipt_url,' .
        'payment_import.cancel_receipt_url AS pi_cancel_receipt_url,' .
        'payment_import.date_created AS pi_date_created,' .

        'klass.id AS klass_id,' .
        'klass.title AS klass_title,'.
        'klass.type AS klass_type,'.
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

        'user.id AS user_id,' .
        'user.nickname AS user_nickname,' .
        'user.name AS user_name,' .
        'user.gender AS user_gender,' .
        'user.birthday AS user_birthday,' .
        'user.thumbnail AS user_thumbnail,' .
        'user.status AS user_status,' .
        'user.permission AS user_permission,' .
        'user.mobile AS user_mobile,' .
        'user.email AS user_email,' .

        'teacher.id AS teacher_id,' .
        'teacher.user_id AS teacher_user_id,' .
        'teacher.nickname AS teacher_nickname,' .
        'teacher.name AS teacher_name,' .
        'teacher.gender AS teacher_gender,' .
        'teacher.birthday AS teacher_birthday,' .
        'teacher.thumbnail AS teacher_thumbnail,' .
        'teacher.status AS teacher_status,' .
        'teacher.mobile AS teacher_mobile,' .
        'teacher.email AS teacher_email,' .
        'teacher.resume AS teacher_resume,' .
        'teacher.greeting AS teacher_greeting' .        

        ''

        ;

        return $select_query;
    }

    public function select_payment_import_list($limit=-1, $offset=-1, $klass_id=-1, $user_id=-1)
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        } // end if
        if($this->is_not_ok("user_id", $user_id))
        {
            $user_id = -1;
        } // end if

        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if

        // Query Execution
        $query_field = $this->get_query_payment_import_field();
        $this->CI->db->select($query_field); 
        $this->CI->db->from('payment_import');
        $this->CI->db->join('user', 'payment_import.user_id = user.id');
        $this->CI->db->join('klass', 'payment_import.klass_id = klass.id');
        $this->CI->db->join('teacher', 'teacher.id = klass.teacher_id');
        if(0 < $klass_id) 
        {
            $this->CI->db->where('payment_import.klass_id',$klass_id);
        }
        if(0 < $user_id) 
        {
            $this->CI->db->where('payment_import.user_id',$user_id);
        }
        $this->CI->db->order_by('payment_import.id', 'DESC');
        $this->CI->db->limit($limit, $offset);
        $query = $this->CI->db->get();

        // Logging
        $query_field = $this->get_query_payment_import_field();
        $this->CI->db->select($query_field); 
        $this->CI->db->from('payment_import');
        $this->CI->db->join('user', 'payment_import.user_id = user.id');
        $this->CI->db->join('klass', 'payment_import.klass_id = klass.id');
        $this->CI->db->join('teacher', 'teacher.id = klass.teacher_id');
        if(0 < $klass_id) 
        {
            $this->CI->db->where('payment_import.klass_id',$klass_id);
        }
        if(0 < $user_id) 
        {
            $this->CI->db->where('payment_import.user_id',$user_id);
        }
        $this->CI->db->order_by('payment_import.id', 'DESC');
        $this->CI->db->limit($limit, $offset);

        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
    }    

    private function set_where_select_payment_import($imp_uid="", $pi_status="")
    {
        $query_field = $this->get_query_payment_import_field();
        $this->CI->db->select($query_field); 
        $this->CI->db->from('payment_import');
        $this->CI->db->join('user', 'payment_import.user_id = user.id');
        $this->CI->db->join('klass', 'payment_import.klass_id = klass.id');
        $this->CI->db->join('teacher', 'teacher.id = klass.teacher_id');
        $this->CI->db->where('payment_import.imp_uid', $imp_uid);

        if(!empty($pi_status))
        {
            $this->CI->db->where('payment_import.status', $pi_status);
        }

        $this->CI->db->limit(1);
    }

    public function select_payment_import_paid($imp_uid="")
    {
        return $this->select_payment_import($imp_uid,"paid");
    }
    public function select_payment_import_canceled($imp_uid="")
    {
        return $this->select_payment_import($imp_uid,"cancelled");
    }
    public function select_payment_import($imp_uid="", $pi_status="")
    {
        if(empty($imp_uid))
        {
            return null;
        }

        $this->set_where_select_payment_import($imp_uid, $pi_status);
        $query = $this->CI->db->get();

        $this->set_where_select_payment_import($imp_uid, $pi_status);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->row();
    }

    private function set_where_select_payment_import_by_id($pi_id=-1)
    {
        $query_field = $this->get_query_payment_import_field();
        $this->CI->db->select($query_field); 
        $this->CI->db->from('payment_import');
        $this->CI->db->join('user', 'payment_import.user_id = user.id');
        $this->CI->db->join('klass', 'payment_import.klass_id = klass.id');
        $this->CI->db->join('teacher', 'teacher.id = klass.teacher_id');
        $this->CI->db->where('payment_import.id', $pi_id);
        $this->CI->db->limit(1);
    }
    public function select_payment_import_by_id($pi_id=-1)
    {
        if(!(0 < $pi_id))
        {
            return null;
        }

        $this->set_where_select_payment_import_by_id($pi_id);
        $query = $this->CI->db->get();

        $this->set_where_select_payment_import_by_id($pi_id);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->row();
    }    

    public function add_klass_student($login_user_id=-1, $klass_id=-1, $user_id=-1, $payment_imp_id=-1)
    {
        if($this->is_not_ready())
        {
            return;
        }
        if($this->is_not_ok("user_id", $login_user_id))
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
        if($this->is_not_ok("payment_imp_id", $payment_imp_id))
        {
            return;
        }

        // 수업을 가져와 선생님 아이디를 추가합니다.
        $klass = $this->select_klass($klass_id);
        if(is_null($klass))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if
        $teacher_id = intval($klass->teacher_id);
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$teacher_id is not valid!");
            return;
        }

        $data = array(
            'user_id' => $user_id,
            'klass_id' => $klass_id,
            'teacher_id' => $teacher_id,
            'payment_import_id'=>$payment_imp_id
        );

        // Query Execution
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('klass_n_student', $data);

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('klass_n_student');
        $this->log_query(
            // $user_id=-1
            $login_user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

    } // end method

    public function update_klass_student($login_user_id=-1, $klass_id=-1, $user_id=-1, $klass_n_student_status="")
    {
        $this->add_track_init(__CLASS__, __FUNCTION__, __LINE__);
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return false;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(klass_id:$klass_id)");
            return false;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id_admin:$user_id_admin)");
            return false;
        }
        if($this->is_not_ok("klass_n_student_status", $klass_n_student_status))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(klass_status:$klass_status)");
            return false;
        }
        
        $data = array(
            'status' => $klass_n_student_status
        );

        // QUERY EXECUTION
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->update('klass_n_student', $data);        

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $this->CI->db->where('id', $klass_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('klass_n_student');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");
        $this->log_query(
            // $user_id=-1
            $login_user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );
    }

    public function select_klass_student($klass_id=-1, $user_id=-1, $status="")
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id=-1;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $user_id=-1;
        }
        if($this->is_not_ok("klass_n_student_status", $status))
        {
            $status = "";
        }

        $this->CI->db->select("*");
        if(0 < $klass_id)
        {
            $this->CI->db->where('klass_id', $klass_id);
        }
        if(0 < $user_id)
        {
            $this->CI->db->where('user_id', $user_id);
        }
        if(!empty($status)) 
        {
            $this->CI->db->where('status', $status);
        }
        $this->CI->db->limit(1);
        $query = $this->CI->db->get('klass_n_student');

        return $query->row();
    } 

    private function get_query_field_klass_n_student_stat() 
    {
        $select_query = 
        'klass_n_student.id AS ks_id,' .
        'klass_n_student.klass_id AS ks_klass_id,' .
        'klass_n_student.teacher_id AS ks_teacher_id,' .
        'klass_n_student.user_id AS ks_user_id,' .
        'klass_n_student.payment_import_id AS ks_payment_import_id,' .
        'klass_n_student.status AS ks_status,' .
        'klass_n_student.date_created AS ks_date_created,' .

        'klass_n_student.date_updated AS ks_date_updated,' .     

        'COUNT(IF(attendance.status=\'R\',attendance.status,NULL)) AS at_status_ready_cnt,' .
        'COUNT(IF(attendance.status=\'P\',attendance.status,NULL)) AS at_status_presence_cnt,' .
        'COUNT(IF(attendance.status=\'A\',attendance.status,NULL)) AS at_status_absence_cnt,' .
        'COUNT(attendance.status) AS at_status_total_cnt,' .

        'COUNT(review.id) AS review_cnt,' .
        'COUNT(question.id) AS question_cnt,' .

        'user.id AS user_id,' .
        'user.nickname AS user_nickname,' .
        'user.name AS user_name,' .
        'user.gender AS user_gender,' .
        'user.birthday AS user_birthday,' .
        'user.thumbnail AS user_thumbnail,' .
        'user.status AS user_status,' .
        'user.permission AS user_permission,' .
        'user.mobile AS user_mobile,' .
        'user.email AS user_email,' .

        ''
        ;

        return $select_query;
    } // end method  

    private function set_klass_n_student_stat_condition($klass_id=-1, $klass_status="")
    {
        $query_field = 
        $this->get_query_field_klass_n_student_stat();

        $this->CI->db->select($query_field);
        $this->CI->db->from('klass_n_student');
        $this->CI->db->join('user', 'klass_n_student.user_id = user.id', 'left');
        $this->CI->db->join('attendance', 'attendance.user_id = klass_n_student.user_id AND attendance.klass_id = klass_n_student.klass_id', 'left');
        $this->CI->db->join('review', 'review.user_id = klass_n_student.user_id AND review.klass_id = klass_n_student.klass_id AND review.status=\'A\'', 'left');
        $this->CI->db->join('question', 'question.user_id = klass_n_student.user_id AND question.klass_id = klass_n_student.klass_id AND question.status=\'A\'', 'left');
        $this->CI->db->where('klass_n_student.klass_id', $klass_id);
        if(!empty($klass_status)) 
        {
            $this->CI->db->where('klass_n_student.status', $klass_status);
        }
        $this->CI->db->group_by("klass_n_student.user_id");        
    }  

    // @ Desc : 특정 수업에 참여한 모든 유저의 데이터를 가져옵니다. 유저에게 출석 통계 정보를 추가합니다.
    public function select_klass_n_student_stat_list($klass_id=-1, $klass_status="")
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(klass_id:$klass_id)");
            return null;
        } // end if
        if($this->is_not_ok("klass_status", $klass_status))
        {
            $klass_status = "";
        } // end if

        // Query Execution
        $this->set_klass_n_student_stat_condition($klass_id, $klass_status);
        $query = $this->CI->db->get();

        // Logging
        $this->set_klass_n_student_stat_condition($klass_id, $klass_status);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
    } // end method     

    private function get_query_klass_n_student_field() 
    {
        $select_query = 
        'klass_n_student.id AS ks_id,' .
        'klass_n_student.klass_id AS ks_klass_id,' .
        'klass_n_student.teacher_id AS ks_teacher_id,' .
        'klass_n_student.user_id AS ks_user_id,' .
        'klass_n_student.payment_import_id AS ks_payment_import_id,' .
        'klass_n_student.status AS ks_status,' .
        'klass_n_student.date_created AS ks_date_created,' .

        'klass_n_student.date_updated AS ks_date_updated,' .

        'klass.id AS klass_id,' .
        'klass.title AS klass_title,'.
        'klass.type AS klass_type,'.
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

        'user.id AS user_id,' .
        'user.nickname AS user_nickname,' .
        'user.name AS user_name,' .
        'user.gender AS user_gender,' .
        'user.birthday AS user_birthday,' .
        'user.thumbnail AS user_thumbnail,' .
        'user.status AS user_status,' .
        'user.permission AS user_permission,' .
        'user.mobile AS user_mobile,' .
        'user.email AS user_email,' .

        'teacher.id AS teacher_id,' .
        'teacher.user_id AS teacher_user_id,' .
        'teacher.nickname AS teacher_nickname,' .
        'teacher.name AS teacher_name,' .
        'teacher.gender AS teacher_gender,' .
        'teacher.birthday AS teacher_birthday,' .
        'teacher.thumbnail AS teacher_thumbnail,' .
        'teacher.status AS teacher_status,' .
        'teacher.mobile AS teacher_mobile,' .
        'teacher.email AS teacher_email,' .
        'teacher.resume AS teacher_resume,' .
        'teacher.greeting AS teacher_greeting' .

        ''
        ;

        return $select_query;
    } // end method   

    // @ Desc : 특정 유저가 참여한 모든 수업을 가져옵니다.
    public function select_klass_n_student_list($limit=-1, $offset=-1, $user_id=-1, $status="")
    {
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if 
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id_admin:$user_id_admin)");
            return null;
        } // end if
        if($this->is_not_ok("klass_n_student_status", $status))
        {
            $status = "";
        } // end if

        // Query Execution
        $query_klass_n_student_field = 
        $this->get_query_klass_n_student_field();

        $this->CI->db->select($query_klass_n_student_field);
        $this->CI->db->from('klass_n_student');
        $this->CI->db->join('user', 'klass_n_student.user_id = user.id', 'left');
        $this->CI->db->join('klass', 'klass_n_student.klass_id = klass.id', 'left');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id', 'left');

        $this->CI->db->where('klass_n_student.user_id', $user_id);
        if(!empty($status)) 
        {
            $this->CI->db->where('klass_n_student.status', $status);
        }

        $this->CI->db->limit($limit,$offset);
        $query = $this->CI->db->get();


        // Logging
        $this->CI->db->select($query_klass_n_student_field);
        $this->CI->db->from('klass_n_student');
        $this->CI->db->join('user', 'klass_n_student.user_id = user.id', 'left');
        $this->CI->db->join('klass', 'klass_n_student.klass_id = klass.id', 'left');
        $this->CI->db->join('teacher', 'klass.teacher_id = teacher.id', 'left');

        $this->CI->db->where('klass_n_student.user_id', $user_id);
        if(!empty($status)) 
        {
            $this->CI->db->where('klass_n_student.status', $status);
        }

        $this->CI->db->limit($limit,$offset);

        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
    } // end method

    // @ Desc : 특정 선생님이 참여한 모든 수업의 갯수를 가져옵니다.
    public function select_klass_n_student_cnt_by_teacher($teacher_id=-1, $status="")
    {
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(teacher_id:$teacher_id)");
            return null;
        } // end if
        if($this->is_not_ok("klass_n_student_status", $status))
        {
            $status = "";
        } // end if

        $this->CI->db->select('*');
        $this->CI->db->from('klass_n_student');
        $this->CI->db->where('klass_n_student.teacher_id', $teacher_id);
        if(!empty($status)) 
        {
            $this->CI->db->where('klass_n_student.status', $status);
        }
        $cnt = $this->CI->db->count_all_results();

        return $cnt;

    } // end method 

    // @ Desc : 특정 유저가 참여한 모든 수업을 가져옵니다.
    public function select_klass_n_student_list_by_teacher($limit=-1, $offset=-1, $teacher_id=-1, $status="")
    {
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if 
        if($this->is_not_ok("teacher_id", $teacher_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(teacher_id:$teacher_id)");
            return null;
        } // end if
        if($this->is_not_ok("klass_n_student_status", $status))
        {
            $status = "";
        } // end if

        // Query Execution
        $query_klass_n_student_field = 
        $this->get_query_klass_n_student_field();

        $this->CI->db->select($query_klass_n_student_field);
        $this->CI->db->from('klass_n_student');
        $this->CI->db->join('user', 'klass_n_student.user_id = user.id', 'left');
        $this->CI->db->join('klass', 'klass_n_student.klass_id = klass.id', 'left');
        $this->CI->db->join('teacher', 'klass_n_student.teacher_id = teacher.id', 'left');

        $this->CI->db->where('klass_n_student.teacher_id', $teacher_id);
        if(!empty($status)) 
        {
            $this->CI->db->where('klass_n_student.status', $status);
        }

        $this->CI->db->limit($limit,$offset);
        $query = $this->CI->db->get();


        // Logging
        $this->CI->db->select($query_klass_n_student_field);
        $this->CI->db->from('klass_n_student');
        $this->CI->db->join('user', 'klass_n_student.user_id = user.id', 'left');
        $this->CI->db->join('klass', 'klass_n_student.klass_id = klass.id', 'left');
        $this->CI->db->join('teacher', 'klass_n_student.teacher_id = teacher.id', 'left');

        $this->CI->db->where('klass_n_student.teacher_id', $teacher_id);
        if(!empty($status)) 
        {
            $this->CI->db->where('klass_n_student.status', $status);
        }

        $this->CI->db->limit($limit,$offset);

        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
    } // end method     



    // @ Desc : 특정 유저가 참여한 모든 수업의 갯수를 가져옵니다.
    public function select_klass_n_student_cnt($user_id=-1, $status="")
    {
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(user_id:$user_id)");
            return null;
        } // end if
        if($this->is_not_ok("klass_n_student_status", $status))
        {
            $status = "";
        } // end if

        $query_klass_n_student_field = 
        $this->get_query_klass_n_student_field();

        $this->CI->db->select('*');
        $this->CI->db->from('klass_n_student');
        $this->CI->db->where('klass_n_student.user_id', $user_id);
        if(!empty($status)) 
        {
            $this->CI->db->where('klass_n_student.status', $status);
        }
        $cnt = $this->CI->db->count_all_results();

        return $cnt;
    } // end method  



    // @ Desc : 특정 유저가 참여한 모든 수업의 갯수를 가져옵니다.
    public function select_klass_n_student_cnt_by_klass_id($klass_id=-1, $status="")
    {
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(klass_id:$klass_id)");
            return null;
        } // end if
        if($this->is_not_ok("klass_n_student_status", $status))
        {
            $status = "";
        } // end if

        $query_klass_n_student_field = 
        $this->get_query_klass_n_student_field();

        $this->CI->db->select('*');
        $this->CI->db->from('klass_n_student');
        $this->CI->db->where('klass_n_student.klass_id', $klass_id);
        if(!empty($status)) 
        {
            $this->CI->db->where('klass_n_student.status', $status);
        }
        $cnt = $this->CI->db->count_all_results();

        return $cnt;
    } // end method      





    public function insert_attendance($login_user_id=-1, $klass_id=-1, $user_id=-1, $date_attend="")
    {
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("user_id", $login_user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"login_user_id\", \$login_user_id)");
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"klass_id\", \$klass_id)");
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"user_id\", \$user_id)");
            return;
        }
        if($this->is_not_ok("date_yyyymmddhhmmss", $date_attend))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"date_attend\", \$date_attend)");
            return;
        }

        // Execute Query
        $data = array(
            'user_id' => $user_id,
            'klass_id' => $klass_id,
            'date_attend' => $date_attend
        );
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $this->CI->db->insert('attendance', $data);

        // Log Query
        $this->CI->db->set('date_created', 'NOW()', FALSE);
        $sql = $this->CI->db->set($data)->get_compiled_insert('attendance');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");
        $this->log_query(
            // $user_id=-1
            $login_user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_INSERT,
            // $query=""
            $sql
        );

    } // end method

    public function update_attendance($login_user_id=-1, $attendance_id=-1, $klass_id=-1, $user_id=-1, $klass_attendance_status="")
    {
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }        
        if($this->is_not_ok("user_id", $login_user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"login_user_id\", \$login_user_id)");
            return;
        }
        if($this->is_not_ok("klass_attendance_id", $attendance_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"attendance_id\", \$attendance_id)");
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"klass_id\", \$klass_id)");
            return;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"user_id\", \$user_id)");
            return;
        }
        if($this->is_not_ok("klass_attendance_status", $klass_attendance_status))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"klass_attendance_status\", \$klass_attendance_status)");
            return;
        }

        // Execute Query
        $data = array(
            'status' => $klass_attendance_status
        );
        $this->CI->db->where('id', $attendance_id);
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->update('attendance', $data);

        // Log Query
        $this->CI->db->where('id', $attendance_id);
        $this->CI->db->where('user_id', $user_id);
        $this->CI->db->where('klass_id', $klass_id);
        $sql = $this->CI->db->set($data)->get_compiled_update('attendance');
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");
        $this->log_query(
            // $user_id=-1
            $login_user_id,
            // $action_type=""
            $this->CI->my_logger->QUERY_TYPE_UPDATE,
            // $query=""
            $sql
        );

    } // end method    

    public function get_attendance_cnt($klass_id=-1, $user_id=-1, $date_attend="", $attendance_status="")
    {
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $user_id = -1;
        }
        if($this->is_not_ok("date_yyyymmddhhmmss", $date_attend))
        {
            $date_attend = "";
        }
        if($this->is_not_ok("klass_attendance_status", $attendance_status))
        {
            $attendance_status = "";
        }

        $this->CI->db->select('*');
        $this->CI->db->from('attendance');
        if(0 < $klass_id) 
        {
            $this->CI->db->where('klass_id', $klass_id);
        }
        if(0 < $user_id) 
        {
            $this->CI->db->where('user_id', $user_id);
        }
        if(!empty($date_attend))
        {
            // 년, 월, 일이 동일한 결과만 검색하도록 합니다. 시간 범위로 검색.
            $where = "DATE_FORMAT('$date_attend', '%Y-%m-%d 00:00:00') < attendance.date_attend";
            $this->CI->db->where($where);
            $where = "attendance.date_attend < DATE_FORMAT('$date_attend', '%Y-%m-%d 23:59:59')";
            $this->CI->db->where($where);            
        }
        if(!empty($attendance_status))
        {
            $this->CI->db->where('status', $attendance_status);
        }
        $cnt = $this->CI->db->count_all_results();

        return $cnt;
    } 

    private function set_where_attendance($attendance_id=-1, $klass_id=-1, $user_id=-1)
    {
        $query_fields = $this->get_query_field_attendance();

        $this->CI->db->select($query_fields);
        $this->CI->db->from('attendance');
        if(0 < $attendance_id) 
        {
            $this->CI->db->where('id', $attendance_id);
        }
        if(0 < $klass_id) 
        {
            $this->CI->db->where('klass_id', $klass_id);
        }
        if(0 < $user_id) 
        {
            $this->CI->db->where('user_id', $user_id);
        }
    }
    public function get_attendance($attendance_id=-1, $klass_id=-1, $user_id=-1)
    {
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if
        if($this->is_not_ok("klass_attendance_id", $attendance_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"attendance_id\", \$attendance_id)");
            return;
        } // end if
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"klass_id\", \$klass_id)");
            return;
        } // end if
        if($this->is_not_ok("user_id", $user_id))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"user_id\", \$user_id)");
            return;
        } // end if

        $this->set_where_attendance($attendance_id, $klass_id, $user_id);
        $query = $this->CI->db->get();

        $this->set_where_attendance($attendance_id, $klass_id, $user_id);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->row();
    }       



    private function set_where_attendance_table($klass_id=-1)
    {
        $query_fields = $this->get_query_field_attendance();

        $this->CI->db->select($query_fields);
        $this->CI->db->from('attendance');
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->order_by('date_attend', 'ASC');
        $this->CI->db->order_by('user_id', 'ASC');

    }
    public function get_attendance_table($klass_id=-1)
    {
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        }

        $this->set_where_attendance_table($klass_id);
        $query = $this->CI->db->get();

        $this->set_where_attendance_table($klass_id);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
    }


    private function set_where_attendance_list($limit=-1, $offset=-1, $klass_id=-1, $user_id=-1, $date_attend="", $attendance_status="")
    {
        $query_fields = $this->get_query_field_attendance();

        $this->CI->db->select($query_fields);
        $this->CI->db->from('attendance');
        if(0 < $klass_id) 
        {
            $this->CI->db->where('klass_id', $klass_id);
        }
        if(0 < $user_id) 
        {
            $this->CI->db->where('user_id', $user_id);
        }
        if(!empty($date_attend))
        {
            // 년, 월, 일이 동일한 결과만 검색하도록 합니다. 시간 범위로 검색.
            $where = "DATE_FORMAT('$date_attend', '%Y-%m-%d 00:00:00') < attendance.date_attend";
            $this->CI->db->where($where);
            $where = "attendance.date_attend < DATE_FORMAT('$date_attend', '%Y-%m-%d 23:59:59')";
            $this->CI->db->where($where);            
        }  
        if(!empty($attendance_status))
        {
            $this->CI->db->where('status', $attendance_status);
        }
        $this->CI->db->limit($limit,$offset);
    }
    public function get_attendance_list($limit=-1, $offset=-1, $klass_id=-1, $user_id=-1, $date_attend="", $attendance_status="")
    {
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("limit", $limit))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"limit\", \$limit)");
            return;
        } // end if        
        if($this->is_not_ok("offset", $offset))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(\"offset\", \$offset)");
            return;
        } // end if
        if($this->is_not_ok("klass_id", $klass_id))
        {
            $klass_id = -1;
        }
        if($this->is_not_ok("user_id", $user_id))
        {
            $user_id = -1;
        }
        if($this->is_not_ok("date_yyyymmddhhmmss", $date_attend))
        {
            $date_attend = "";
        }
        if($this->is_not_ok("klass_attendance_status", $attendance_status))
        {
            $attendance_status = "";
        }

        $this->set_where_attendance_list($limit, $offset, $klass_id, $user_id, $date_attend, $attendance_status);
        $query = $this->CI->db->get();

        $this->set_where_attendance_list($limit, $offset, $klass_id, $user_id, $date_attend, $attendance_status);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
    }

    private function get_query_field_attendance() 
    {
        // @ kat -> 'k'lass 'at'tendance

        $select_query = 
        'attendance.id AS kat_id,' .
        'attendance.klass_id AS kat_klass_id,' .
        'attendance.user_id AS kat_user_id,' .
        'attendance.status AS kat_status,' .
        'attendance.date_attend AS kat_date_attend,' .
        'attendance.date_created AS kat_date_created,' .
        'attendance.date_updated AS kat_date_updated,' .

        ''
        ;

        return $select_query;
    } // end method    

    // @ Desc : 요일 구하기 함수들 
    // @ Referer : http://stackoverflow.com/questions/16768702/how-to-get-friday-last-week-in-mysql
    /*
        # 2주전 월요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 7 DAY), '%Y-%m-%d'),INTERVAL -7 DAY);

        # 지난주 월요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 7 DAY), '%Y-%m-%d'),INTERVAL 0 DAY);

        # 이번주 일요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 8 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);
        # 이번주 월요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 7 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);
        # 이번주 화요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 6 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);
        # 이번주 수요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 5 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);
        # 이번주 목요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 4 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);
        # 이번주 금요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 3 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);
        # 이번주 토요일
        SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 2 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);

    */
    private function set_where_select_klass_date($klass_day="", $interval_week=-1)
    {
        $day_idx = -1;
        // wonder.jung
        $class_days_list = $this->get_const("class_days_list");
        if(empty($class_days_list))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$class_days_list is not valid!");
            return;
        }

        // 첫번째 기본값('All Days')을 제거한 배열
        array_shift($class_days_list);
        $klass_day_idx = -1;
        for ($i=0; $i < count($class_days_list); $i++) 
        { 
            $class_day = $class_days_list[$i];
            if($class_day === $klass_day) 
            {
                return $klass_day_idx = $i;
            } // end if
        } // end for

        // SELECT DATE_ADD(DATE_FORMAT((NOW() - INTERVAL WEEKDAY(NOW()) + 3 DAY), '%Y-%m-%d'),INTERVAL 7 DAY);




        $query_fields = $this->get_query_field_attendance();

        $this->CI->db->select($query_fields);
        $this->CI->db->from('attendance');
        $this->CI->db->where('klass_id', $klass_id);
        $this->CI->db->order_by('date_attend', 'ASC');
        $this->CI->db->order_by('user_id', 'ASC');

    }
    public function select_klass_date($klass_day="", $interval_week=-1)
    {
        if($this->is_not_ready())
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        }
        if($this->is_not_ok("klass_day", $klass_day))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$this->is_not_ok(klass_day : $klass_day)");
            return;
        }
        if(is_null($interval_week))
        {
            $this->add_track_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$interval_week is not valid");
            return;
        }

        $this->set_where_attendance_table($klass_id);
        $query = $this->CI->db->get();

        $this->set_where_attendance_table($klass_id);
        $sql = $this->CI->db->get_compiled_select();
        $this->add_track(__CLASS__, __FUNCTION__, __LINE__, "\$sql : $sql");

        return $query->result_array();
    }

}

