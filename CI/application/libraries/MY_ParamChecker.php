<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Format class
 * Check parameter validation with json which contains parameters' specification
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_ParamChecker {

	private $json_obj;
	private $json_path="/static/param.json";
	private $CI=null;

	public static $mysql_int_max = 2147483647;

    public function __construct($CI=null)
    {

    	$abs_path = $_SERVER['DOCUMENT_ROOT'];

        $path_info = $_SERVER['PATH_INFO'];

        $http_host = $_SERVER['HTTP_HOST'];
        $req_uri = $_SERVER['REQUEST_URI'];

    	// Fetch ParamChecker.json
    	$param_check_json_str = "";
    	$target_path = FCPATH . $this->json_path;

    	if(file_exists($target_path)) 
    	{
			$param_check_json_str = file_get_contents($target_path);
    	} // end if

    	if(!empty($param_check_json_str)) 
    	{
    		$this->json_obj = json_decode($param_check_json_str);
    	} 
    	else 
    	{
    		// error report!

    	} // end if

    	$this->CI =& get_instance();

        // init database
        $this->CI->load->database();

    }

    private $check_list;
    private $check_list_prop_success="succss";
    private $check_list_prop_fail="fail";
    private $check_list_prop_all="all";
    public function get_check_list() 
    {
        if(is_null($this->check_list)) {
            $this->check_list = 
            [
                $this->check_list_prop_success => array()
                , $this->check_list_prop_fail => array()
                , $this->check_list_prop_all => array()
            ];
        }

        return $this->check_list;
    }
    private function set_check_list($check_list=null) {
        $this->check_list = $check_list;
    }
    private function add_check_success($check_result) {

        if(is_null($check_result)) {
            return;
        }

        $check_list = $this->get_check_list();

        array_push($check_list[$this->check_list_prop_success], $check_result);
        array_push($check_list[$this->check_list_prop_all], $check_result);

        $this->set_check_list($check_list);
    }
    private function add_check_fail($check_result) {

        if(is_null($check_result)) {
            return;
        }

        $check_list = $this->get_check_list();

        array_push($check_list[$this->check_list_prop_fail], $check_result);
        array_push($check_list[$this->check_list_prop_all], $check_result);

        $this->set_check_list($check_list);
    }

    public function get($key="", $key_filter="")
    {
        if(empty($key)) {
            return null;
        }
        if(empty($key_filter)) {
            return null;
        }

        $value = $this->CI->get($key);
        return $this->check($key_filter, $value);
    }
    public function post($key="", $key_filter="")
    {
        if(empty($key)) {
            return null;
        }
        if(empty($key_filter)) {
            return null;
        }

        $value = $this->CI->post($key);
        return $this->check($key_filter, $value);
    }
    private function check($key="", $value="") {

        if(empty($key)) {
            return null;
        }

        $check_result = $this->is_ok($key, $value);

        if(isset($check_result["success"])) 
        {
            if($check_result["success"] === true) 
            {
                $this->add_check_success($check_result);
                return $value;
            } 
            else 
            {
                $this->add_check_fail($check_result);
                return null;
            }
        }

        return null;
    }

    // REMOVE ME
    public function get_json_obj() 
    {
    	return $this->json_obj;
    }

    public function get_const_map()
    {
    	if(isset($this->json_obj) && isset($this->json_obj->const)) {
    		return $this->json_obj->const;	
    	}

    	return null;
    }

    public function extract_value_in_brackets($target_filter="", $result=null){

    	$output = array();
    	$output["extracted_value"] = "";

    	if(empty($target_filter)) {
    		$output["result"] = $result;
    		return $output;
    	}
    	if(is_null($result)) {
    		$output["result"] = $result;
    		return $output;
    	}

		preg_match("/\[([^\]]*)\]/", $target_filter, $match);
		if(empty($match)) 
		{
			$result["scope"]="extract_value_in_brackets";
			$result["target_filter"]=$target_filter;
    		$result["message"]="empty(\$match)";
    		$output["result"] = $result;
    		return $output;
		}
		else if(count($match) != 2)
		{
			// 반드시 검색해 포획한 2번째 인자, value가 있어야함.
			$result["scope"]="extract_value_in_brackets";
			$result["target_filter"]=$target_filter;
    		$result["message"]="count(\$match) != 2";
    		$output["result"] = $result;
    		return $output;
		}
		$extracted_value = $match[1];
		if(is_null($extracted_value)) 
		{
			$result["scope"]="extract_value_in_brackets";
			$result["target_filter"]=$target_filter;
    		$result["message"]="is_null(\$extracted_value)";
    		$output["result"] = $result;
    		return $output;
		}
		else if(empty($extracted_value)) 
		{
			$result["scope"]="extract_value_in_brackets";
			$result["target_filter"]=$target_filter;
    		$result["message"]="empty(\$extracted_value)";
    		$output["result"] = $result;
    		return $output;
		}

		$output["result"] = $result;
		$output["extracted_value"] = $extracted_value;
		return $output;
    }

    public function is_ok($key="", $value="")
    {

    	// 결과 / 실패했다면, 실패 원인을 알려줘야 합니다.
    	$result = 
    	[
    		"key"=>$key,
    		"value"=>$value,
    		"filter"=>"",
    		"success"=>false,
    		"scope"=>"ParamChecker",
    		"message"=>""
    	];

    	// mb_strlen
    	if (!function_exists('mb_strlen')) 
    	{
    		$result["message"]="!function_exists('mb_strlen')";
    		return $result;
    	}

    	if(empty($key)) 
    	{
    		$result["message"]="empty(\$key)";
    		return $result;
    	} 
    	else if(!isset($this->json_obj)) 
    	{
    		$result["message"]="!isset(\$this->json_obj)";
    		return $result;
    	} 
    	else if(!isset($this->json_obj->checker)) 
    	{
    		$result["message"]="!isset(\$this->json_obj->checker)";
    		return $result;
    	}

    	$checker_map = $this->json_obj->checker;
    	if(!isset($checker_map->{$key})) 
    	{
    		// 해당 키는 검사 대상에 없습니다.
    		$result["message"]="!isset(\$checker_map->{\$key})";
    		return $result;
    	}

    	$const_map = $this->json_obj->const;

    	$filters = $checker_map->{$key};
    	$filter_list = explode("|||",$filters);

    	for ($i=0; $i < count($filter_list); $i++) 
    	{ 
    		$filter = $filter_list[$i];
    		$result["filter"]=$filter;

    		if(strcmp("is_natural_no_zero", $filter) == 0) 
    		{
    			if(empty($value)) 
    			{
		    		$result["message"]="empty(\$value)";
		    		return $result;
    			}

    			$value_int = intval($value);
    			if(!(0 < $value_int)) 
    			{
		    		$result["message"]="!(0 < \$value_int)";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $value_int)
    			{
		    		$result["message"]="self::\$mysql_int_max < \$value_int";
		    		return $result;
    			}

    		}
    		else if(strcmp("valid_mobile", $filter) == 0) 
    		{
    			if(empty($value)) 
    			{
		    		$result["message"]="empty(\$value)";
		    		return $result;
    			}

    			$pattern = '/\+?[0-9][0-9()-\s+]{4,20}[0-9]/';
    			preg_match($pattern, $value, $matches);

    			if(empty($matches)) 
    			{
		    		$result["message"]="empty(\$matches)";
		    		return $result;
    			}
    		}
    		else if(strcmp("valid_mobile_kor", $filter) == 0) 
    		{
    			if(empty($value)) 
    			{
		    		$result["message"]="empty(\$value)";
		    		return $result;
    			}

    			$pattern = '/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/';
    			preg_match($pattern, $value, $matches);

    			if(empty($matches)) 
    			{
		    		$result["message"]="empty(\$matches)";
		    		return $result;
    			}
    		}
    		else if(strcmp("valid_emails", $filter) == 0) 
    		{
				if (filter_var($value, FILTER_VALIDATE_EMAIL) === false) 
				{
		    		$result["message"]="filter_var(\$value, FILTER_VALIDATE_EMAIL) === false";
		    		return $result;
				}
			}
    		else if(strpos($filter, 'min_length') !== false) 
    		{
    			$output = 
    			$this->extract_value_in_brackets(
					// $target_filter=""
    				$filter
					// $result=null
    				, $result
				);
				$result = $output["result"];
				$extracted_value = $output["extracted_value"];
				if(empty($extracted_value)) {
		    		return $result;
				}

    			$min_length = intval($extracted_value);
    			if($min_length < 0) 
    			{

		    		$result["message"]="\$min_length < 0";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $min_length) 
    			{
		    		$result["message"]="self::\$mysql_int_max < \$min_length";
		    		return $result;
    			}

    			$value_length = mb_strlen($value);
    			if(!($min_length <= $value_length)) 
    			{
		    		$result["message"]="!(\$min_length <= strlen(\$value))";
		    		$result["value_length"]=$value_length;
		    		return $result;
    			}
			}
    		else if(strpos($filter, 'max_length') !== false) 
    		{
                $output = 
                $this->extract_value_in_brackets(
                    // $target_filter=""
                    $filter
                    // $result=null
                    , $result
                );
                $result = $output["result"];
                $extracted_value = $output["extracted_value"];
                if(empty($extracted_value)) {
                    return $result;
                }			

    			$max_length = intval($extracted_value);
    			if($max_length < 0) 
    			{
		    		$result["message"]="\$max_length < 0";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $max_length)
    			{
		    		$result["message"]="self::\$mysql_int_max < \$max_length";
		    		return $result;
    			}

    			$value_length = mb_strlen($value);
    			if(!($value_length <= $max_length)) 
    			{
		    		$result["message"]="!(\$value_length <= \$max_length)";
		    		$result["value_length"]=$value_length;
		    		return $result;
    			}
			}
    		else if(strpos($filter, 'exact_length') !== false) 
    		{
                $output = 
                $this->extract_value_in_brackets(
                    // $target_filter=""
                    $filter
                    // $result=null
                    , $result
                );
                $result = $output["result"];
                $extracted_value = $output["extracted_value"];
                if(empty($extracted_value)) {
                    return $result;
                }

    			$exact_length = intval($extracted_value);
    			if($exact_length < 0) 
    			{
		    		$result["message"]="\$exact_length < 0";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $exact_length) 
    			{
		    		$result["message"]="self::\$mysql_int_max < \$exact_length";
		    		return $result;
    			}

    			if(!(strlen($value) == $exact_length)) 
    			{
		    		$result["message"]="!(strlen(\$value) == \$exact_length)";
		    		return $result;
    			}

			}
    		else if(strpos($filter, 'greater_than_equal_to') !== false) 
    		{
                $output = 
                $this->extract_value_in_brackets(
                    // $target_filter=""
                    $filter
                    // $result=null
                    , $result
                );
                $result = $output["result"];
                $extracted_value = $output["extracted_value"];
                if(empty($extracted_value)) {
                    return $result;
                }

                $value_int = intval($value);

    			$greater_than_equal_to = intval($extracted_value);
    			if($greater_than_equal_to < 0) 
    			{
		    		$result["message"]="\$greater_than_equal_to < 0";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $greater_than_equal_to) 
    			{
		    		$result["message"]="self::\$mysql_int_max < \$greater_than_equal_to";
		    		return $result;
    			}

    			if($value_int < $greater_than_equal_to) 
    			{
		    		$result["message"]="strlen(\$value) < \$greater_than_equal_to";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $value_int) 
    			{
		    		$result["message"]="self::\$mysql_int_max < \$value_int";
		    		return $result;
    			}

			}
    		else if(strpos($filter, 'less_than_equal_to') !== false) 
    		{
                $output = 
                $this->extract_value_in_brackets(
                    // $target_filter=""
                    $filter
                    // $result=null
                    , $result
                );
                $result = $output["result"];
                $extracted_value = $output["extracted_value"];
                if(empty($extracted_value)) {
                    return $result;
                }

                $value_int = intval($value);

    			$less_than_equal_to = intval($extracted_value);
    			if($less_than_equal_to < 0) 
    			{
		    		$result["message"]="\$less_than_equal_to < 0";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $less_than_equal_to) 
    			{
		    		$result["message"]="self::\$mysql_int_max < \$less_than_equal_to";
		    		return $result;
    			}

    			if($less_than_equal_to < $value_int) 
    			{
		    		$result["message"]="$less_than_equal_to < $value_int";
		    		return $result;
    			}
    			else if(self::$mysql_int_max < $value_int) 
    			{
		    		$result["message"]="self::\$mysql_int_max < \$value_int";
		    		return $result;
    			}

			}			
    		else if(strpos($filter, 'matches') !== false) 
    		{
 
                $output = 
                $this->extract_value_in_brackets(
                    // $target_filter=""
                    $filter
                    // $result=null
                    , $result
                );
                $result = $output["result"];
                $extracted_value = $output["extracted_value"];
                if(empty($extracted_value)) {
                    return $result;
                }

    			$key_const = $extracted_value;
    			if(empty($key_const)) 
    			{
		    		$result["message"]="empty(\$key_const)";
		    		return $result;
    			}

    			$const_list = $const_map->{$key_const};
    			if(empty($const_list)) 
    			{
		    		$result["message"]="empty(\$const_list)";
		    		return $result;
    			}
    			else if(is_null($const_list)) 
    			{
		    		$result["message"]="is_null(\$const_list)";
		    		return $result;
    			}

    			$has_it = false;
    			for ($j=0; $j < count($const_list); $j++) 
    			{ 
    				$cur_const = $const_list[$j];
    				if($cur_const === $value) 
    				{
    					$has_it = true;
    					break;
    				}
    			}

    			if(!$has_it) 
    			{
		    		$result["message"]="!\$has_it";
		    		return $result;
    			}
			}
    		else if(strpos($filter, 'is_unique') !== false) 
    		{
                $output = 
                $this->extract_value_in_brackets(
                    // $target_filter=""
                    $filter
                    // $result=null
                    , $result
                );
                $result = $output["result"];
                $extracted_value = $output["extracted_value"];
                if(empty($extracted_value)) {
                    return $result;
                }

    			// ex) user.name -> table: user / column: name
    			$table_n_column = $extracted_value;
    			$table_n_column_list = explode(".",$table_n_column);
    			if(empty($table_n_column_list)) 
    			{
		    		$result["message"]="empty(\$table_n_column_list)";
		    		return $result;
    			}
    			else if(2 != count($table_n_column_list)) 
    			{
		    		$result["message"]="2 != count(\$table_n_column_list)";
		    		return $result;
    			}

    			$table_name = $table_n_column_list[0];
    			$column_name = $table_n_column_list[1];

    			// DB - unique check
    			$query_for_unique = 
    			"SELECT COUNT(*) AS count FROM " . $table_name . " WHERE " . $column_name . "=\"" . $value . "\"";
		        $query = $this->CI->db->query($query_for_unique);
		        $row = $query->row();
		        $count = intval($row->count);

		        // wonder.jung - error check?

		        $result["count"] = $count;
		        if(0 < $count) {
		    		$result["message"]="0 < \$count";
		    		return $result;
		        }
			}
    		else if(strpos($filter, 'regex_match') !== false) 
    		{
    			$pattern = "/regex_match\[(.+)\]$/";
    			preg_match($pattern, $filter, $match_in_filter);
    			if(empty($match_in_filter)) 
    			{
		    		$result["message"]="empty(\$match_in_filter)";
		    		$result["pattern"]=$pattern;
		    		return $result;
    			}

    			$pattern = $match_in_filter[1];
    			preg_match($pattern, $value, $match_in_value);
    			if(empty($match_in_value)) 
    			{
		    		$result["message"]="empty(\$match_in_value)";
		    		$result["pattern"]=$pattern;
		    		return $result;
    			}

    			// CHECK!
			} // valid_url
    		else if(strpos($filter, 'valid_url') !== false) 
    		{
    			if(!is_string($value))
    			{
		    		$result["message"]="!is_string(\$value)";
		    		return $result;
    			}
    			else if(empty($value))
    			{
		    		$result["message"]="empty(\$value)";
		    		return $result;
    			}
    			
    			$pattern = "/^(http|https|ftp):\/\/[^\/]+\/[^\/]+/";
		    	$result["pattern"]=$pattern;
    			preg_match($pattern, $value, $match);
    			if(empty($match)) 
    			{
		    		$result["message"]="empty(\$match)";
		    		return $result;
    			}
    			$result["match"]=$match;

    			$url_sanitized = filter_var($value, FILTER_SANITIZE_URL);

				if (filter_var($url_sanitized, FILTER_SANITIZE_URL) === false) {
		    		$result["message"]="filter_var(\$url_sanitized, FILTER_SANITIZE_URL) === false";
		    		return $result;
				}
    		}
    		else if(strpos($filter, 'is_str') !== false) 
    		{
    			if(!is_string($value))
    			{
		    		$result["message"]="!is_string(\$value)";
		    		return $result;
    			}
    		}
    		else
    		{
	    		$result["message"]="no match filter!";
	    		return $result;
    		}
    	}

    	$result["success"]=TRUE;
		$result["message"]="Done.";
		return $result;
    }

    // @referer : file:///Library/WebServer/Documents/CodeIgniter/user_guide/libraries/form_validation.html#rule-reference


}