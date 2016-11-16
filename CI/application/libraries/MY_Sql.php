<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * php curl을 편리하게 사용하기 위한 래핑 클래스
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
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


    public function insert_user_facebook()
    {
        // Do something...
    }

    public function get_user_facebook()
    {
        // Do something...
    }

    public function insert_user_naver($naver_id=-1, $birth_year=-1, $birthday="", $gender="",$email="", $nickname="", $first_name="", $thumbnail_url="")
    {

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
        if(empty($first_name)) 
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
            'birth_year'=> $birth_year,
            'birthday' => $birthday,
            'gender' => $gender,
            'email' => $email,
            'nickname' => $nickname,
            'first_name' => $first_name,
            'thumbnail' => $thumbnail_url
        );

        // Logging - 짧은 쿼리들은 모두 등록한다. / logger
        $sql = $this->CI->db->set($data)->get_compiled_insert('user');

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
                'first_name' => $nickname,
                'thumbnail' => $thumbnail_url
        );

        // Logging - 짧은 쿼리들은 모두 등록한다.
        $sql = $this->CI->db->set($data)->get_compiled_insert('user');

        $this->CI->db->insert('user', $data);
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

