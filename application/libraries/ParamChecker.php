<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Format class
 * Check parameter validation with json which contains parameters' specification
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class ParamChecker {

	private $json_obj;
	private $json_path="/static/param.json";

    public function __construct()
    {

    	$abs_path = $_SERVER['DOCUMENT_ROOT'];

    	// Fetch ParamChecker.json
    	$param_check_json_str = "";
    	$target_path = $abs_path . $this->json_path;
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

    }

    // REMOVE ME
    public function get_json_obj() 
    {
    	return $this->json_obj;
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
    		"message"=>""
    	];

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

    		if(strcmp("is_natural_no_zero", $filter) == 0) 
    		{
    			if(empty($value)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$value)";
		    		return $result;
    			}

    			$value_int = intval($value);
    			if(!(0 < $value_int)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="!(0 < \$value_int)";
		    		return $result;
    			}
    		}
    		else if(strcmp("valid_mobile", $filter) == 0) 
    		{
    			if(empty($value)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$value)";
		    		return $result;
    			}

    			$pattern = '/\+?[0-9][0-9()-\s+]{4,20}[0-9]/';
    			preg_match($pattern, $value, $matches);

    			if(empty($matches)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$matches)";
		    		return $result;
    			}
    		}
    		else if(strcmp("valid_emails", $filter) == 0) 
    		{
				if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) 
				{
		    		$result["filter"]=$filter;
		    		$result["message"]="filter_var(\$email, FILTER_VALIDATE_EMAIL) === false";
		    		return $result;
				}
			}
    		else if(strpos($filter, 'min_length') !== false) 
    		{
    			preg_match("/\[[^\]]*\]/", $value, $match);
    			if(empty($match)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match)";
		    		return $result;
    			}

    			$min_length = intval($match[0]);
    			if($min_length < 0) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="\$min_length < 0";
		    		return $result;
    			}
    			else if(PHP_INT_MAX < $min_length) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="PHP_INT_MAX < \$min_length";
		    		return $result;
    			}

    			if(!($min_length <= strlen($value))) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="!(\$min_length <= strlen(\$value))";
		    		return $result;
    			}
			}
    		else if(strpos($filter, 'max_length') !== false) 
    		{
    			preg_match("/\[[^\]]*\]/", $value, $match);
    			if(empty($match)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match)";
		    		return $result;
    			}

    			$max_length = intval($match[0]);
    			if($max_length < 0) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="\$max_length < 0";
		    		return $result;
    			}
    			else if(PHP_INT_MAX < $max_length) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="PHP_INT_MAX < \$max_length";
		    		return $result;
    			}

    			if(!(strlen($value) <= $max_length)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="!(strlen(\$value) <= \$max_length)";
		    		return $result;
    			}
			}
    		else if(strpos($filter, 'exact_length') !== false) 
    		{
    			preg_match("/\[[^\]]*\]/", $value, $match);
    			if(empty($match)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match)";
		    		return $result;
    			}

    			$exact_length = intval($match[0]);
    			if($exact_length < 0) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="\$exact_length < 0";
		    		return $result;
    			}
    			else if(PHP_INT_MAX < $exact_length) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="PHP_INT_MAX < \$exact_length";
		    		return $result;
    			}

    			if(!(strlen($value) == $exact_length)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="!(strlen(\$value) == \$exact_length)";
		    		return $result;
    			}

			}
    		else if(strpos($filter, 'greater_than_equal_to') !== false) 
    		{
    			preg_match("/\[[^\]]*\]/", $value, $match);
    			if(empty($match)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match)";
		    		return $result;
    			}

    			$greater_than_equal_to = intval($match[0]);
    			if($greater_than_equal_to < 0) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="\$greater_than_equal_to < 0";
		    		return $result;
    			}
    			else if(PHP_INT_MAX < $greater_than_equal_to) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="PHP_INT_MAX < \$greater_than_equal_to";
		    		return $result;
    			}

    			if(strlen($value) < $greater_than_equal_to) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="strlen(\$value) < \$greater_than_equal_to";
		    		return $result;
    			}

			}
    		else if(strpos($filter, 'matches') !== false) 
    		{
    			preg_match("/\[[^\]]*\]/", $value, $match);
    			if(empty($match)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match)";
		    		return $result;
    			}

    			$key_const = $match[0];
    			if(empty($key_const)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$key_const)";
		    		return $result;
    			}

    			$const_list = $const_map->{$key_const};
    			if(empty($const_list)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$const_list)";
		    		return $result;
    			}

    			$has_it = false;
    			for ($i=0; $i < count($const_list); $i++) 
    			{ 
    				$cur_const = $const_list[$i];
    				if($cur_const === $value) 
    				{
    					$has_it = true;
    					break;
    				}
    			}

    			if(!$has_it) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="!\$has_it";
		    		return $result;
    			}
			}
    		else if(strpos($filter, 'is_unique') !== false) 
    		{

    			preg_match("/\[[^\]]*\]/", $value, $match);
    			if(empty($match)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match)";
		    		return $result;
    			}

    			$table_n_column = $match[0];
    			if(empty($table_n_column)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$table_n_column)";
		    		return $result;
    			}

    			// ex) user.name -> table: user / column: name
    			$table_n_column_list = explode(".",$table_n_column);
    			if(empty($table_n_column_list)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$table_n_column_list)";
		    		return $result;
    			}
    			else if(2 != count($table_n_column_list)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="2 != count(\$table_n_column_list)";
		    		return $result;
    			}

    			$table_name = $table_n_column_list[0];
    			$column_name = $table_n_column_list[1];

    			// DB 커넥션이 필요.



			}
    		else if(strpos($filter, 'regex_match') !== false) 
    		{

    			preg_match("/regex_match\[[^\]]*\]/", $filter, $match_in_filter);
    			if(empty($match_in_filter)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match_in_filter)";
		    		return $result;
    			}

    			$regex = $match_in_filter[0];
    			preg_match($regex, $value, $match_in_value);
    			if(empty($match_in_value)) 
    			{
		    		$result["filter"]=$filter;
		    		$result["message"]="empty(\$match_in_value)";
		    		return $result;
    			}

    			// CHECK!
    		}
    		else
    		{
	    		$result["filter"]=$filter;
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