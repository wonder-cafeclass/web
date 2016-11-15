<?php

/**
 * php curl을 편리하게 사용하기 위한 래핑 클래스
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Curl
{
	private $CI=null;

    function __construct()
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) {
            return;
        }

        if(!isset($this->CI->my_error)) {
            return;
        }

        // curl이 준비되었는지 확인!
        if(!function_exists('curl_init')) {
            $this->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                "curl is not valid!", 
                // $message=""
                "", 
                // $extra=null
                null
            );            
        } // end if
    }

	public function get_json($url="", $header_arr=null, $attr_arr=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, false, false, $header_arr, $attr_arr);
	}
	public function get_xml($url="", $header_arr=null, $attr_arr=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, true, false, $header_arr, $attr_arr);
	}
	private function get($url="", $is_xml=false, $header_arr=null, $attr_arr=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, $is_xml, false, $header_arr, $attr_arr);
	}

	public function post_json($url="", $header_arr=null, $attr_arr=null, $post_params=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, false, true, $header_arr, $attr_arr, $post_params);
	}
	public function post_xml($url="", $header_arr=null, $attr_arr=null, $post_params=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, true, true, $header_arr, $attr_arr, $post_params);
	}
	public function post($url="", $is_xml=false, $header_arr=null, $attr_arr=null, $post_params=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, $is_xml, true, $header_arr, $attr_arr, $post_params);
	}

	private function isNumericKeyArr($target_arr=null) 
	{
		if(is_null($target_arr)) 
		{
			return null;
		}

		$is_numeric_key = true;
		foreach($target_arr as $key => $value)
		{
			if(!is_numeric($key)) 
			{
				$is_numeric_key = false;
				break;
			}
		}

		return $is_numeric_key;
	}
	private function extractSingleAttr($json=null, $attr="") 
	{
		if(is_null($json)) 
		{
			return;			
		}
		if(empty($attr)) 
		{
			return $json;
		}
		$is_debug=false;
		if($is_debug) echo "<br/>\n<br/>\n";
		if($is_debug) echo "extractSingleAttr<br/>\n";
		if($is_debug) print_r($json);
		if($is_debug) echo "<br/>\nextractSingleAttr / \$attr : $attr<br/>\n";

		if(is_array($json))
		{
			// 1. array
			$isNumericKeyArr = $this->isNumericKeyArr($json);

			if($is_debug) echo "extractSingleAttr / 0<br/>\n";

			if($isNumericKeyArr)
			{
				if($is_debug) echo "extractSingleAttr / 0-1<br/>\n";

				// 1-1. numeric idx arr ["APPLE","BANANA",..]
				// 내부 엘리먼트에서 해당되는 attr 값이 있는지 확인해야 합니다.
				$box_list = [];
				foreach ($json as $value) {
					$box = $this->extractSingleAttr($value, $attr);
					array_push($box_list, $box);
				}

				if($is_debug) print_r($box_list);
				if($is_debug) echo "<br/>\n<br/>\n";

				return $box_list;
			}
			else
			{
				if($is_debug) echo "extractSingleAttr / 0-2<br/>\n";

				// 1-2. key-value arr ["A"=>"APPLE","B"=>"BANANA",..]
				// json obj 타입으로 인식, stdClass로 전환합니다.
				$box = new stdClass();
				if(isset($json[$attr]))
				{
					$box = $json[$attr];
				} // end if

				if($is_debug) print_r($box);
				if($is_debug) echo "<br/>\n<br/>\n";

				return $box;
			}
		}
		else
		{
			if($is_debug) echo "extractSingleAttr / 1<br/>\n";

			// 2. stdObj {"A":"APPLE","B":"BANANA"}
			// 해당 객체의 1개의 값만 포함한 객체로 돌려줍니다.
			$box = new stdClass();
			if(isset($json->{$attr}))
			{
				$box = $json->{$attr};
			} // end if

			if($is_debug) print_r($box);
			if($is_debug) echo "<br/>\n<br/>\n";

			return $box;
		}
		return null;
	}
	private function extractMultipleAttr($json=null, $attr_arr="") 
	{
		if(is_null($json)) 
		{
			return;			
		}
		if(empty($attr_arr))
		{
			return $json;
		}

		$is_debug=false;
		if($is_debug) echo "<br/>\n<br/>\n";
		if($is_debug) echo "extractMultipleAttr<br/>\n";
		// if($is_debug) print_r($json);
		// if($is_debug) print_r($attr_arr);

		if(is_array($json))
		{
			// 1. array
			$isNumericKeyArr = $this->isNumericKeyArr($json);

			if($isNumericKeyArr)
			{
				// 1-1. numeric idx arr ["APPLE","BANANA",..]
				// 내부 엘리먼트에서 해당되는 attr 값이 있는지 확인해야 합니다.

				/*
				$json =
				[
					[
						"A"=>"APPLE"
						,"B"=>"BANANA"
						,...
					],
					[
						"A"=>"APPLE"
						,"B"=>"BANANA"
						,...
					],
					...
				]

				$attr_arr = ["A"]

				$box_list =
				[
					[
						"A"=>"APPLE"
					],
					[
						"A"=>"APPLE"
					],
					...
				]
				*/

				$box_list = [];
				foreach ($json as $value) 
				{
					$box = new stdClass();
					foreach ($attr_arr as $attr) 
					{

						// if($is_debug) print_r($value);
						if($is_debug) echo "<br/>\extractMultipleAttr / 1-1-1 / \$attr : $attr<br/>\n";

						// attr에 해당하는 값을 돌려줍니다.
						$result = $this->extractSingleAttr($value, $attr);

						if($is_debug) print_r($result);
						if($is_debug) echo "<br/>\n";

						if(!empty($result))
						{
							$box->{$attr} = $result;
						}
					}

					if($is_debug) echo "<br/>\extractMultipleAttr / 1-1-2<br/>\n";
					if($is_debug) print_r($box);
					if($is_debug) echo "<br/>\n";

					array_push($box_list, $box);
				}

				if($is_debug) echo "<br/>\extractMultipleAttr / 1-1-3<br/>\n";
				if($is_debug) print_r($box_list);
				if($is_debug) echo "<br/>\n";

				return $box_list;
			}
			else
			{
				// 1-2. key-value arr ["A"=>"APPLE","B"=>"BANANA",..]
				// json obj 타입으로 인식, stdClass로 전환합니다.
				$box = new stdClass();
				foreach ($attr_arr as $attr) 
				{
					if(isset($json[$attr]))
					{
						$box->{$attr} = $json[$attr];
					} // end if
				}
				return $box;
			}
		}
		else
		{
			// 2. stdObj {"A":"APPLE","B":"BANANA"}
			// 해당 객체의 1개의 값만 포함한 객체로 돌려줍니다.
			$box = new stdClass();
			foreach ($attr_arr as $attr) 
			{
				if(isset($json->{$attr}))
				{
					$box->{$attr} = $json->{$attr};
				} // end if
			}
			return $box;
		}

		return null;
	}	
	private function extract($json=null, $attr_arr=null) 
	{

		if(is_null($json)) 
		{
			return null;
		}
		if(empty($attr_arr)) 
		{
			return $json;
		}
		$attr = array_shift($attr_arr);
		if(empty($attr)) 
		{
			return $json;
		}

		$is_debug=false;
		if($is_debug) echo "<br/>\n<br/>\n";
		if($is_debug) print_r($json);
		if($is_debug) print_r($attr_arr);

		if(is_array($attr) && !empty($attr))
		{
			// ["user_id","status",...]
			if($is_debug) echo "extract - 01 <br/>\n";
			$result = $this->extractMultipleAttr($json, $attr);

			if($is_debug) print_r($result);
			if($is_debug) echo "extract - 01 <br/>\n";

			if($is_debug) echo "<br/>\n<br/>\n";
			return $this->extract($result, $attr_arr);
		}
		else if(is_string($attr) && !empty($attr))
		{
			// "user_id"
			if($is_debug) echo "extract - 02 / \$attr : $attr <br/>\n";
			$result = $this->extractSingleAttr($json, $attr);

			if($is_debug) print_r($result);
			if($is_debug) echo "extract - 02<br/>\n";

			if($is_debug) echo "<br/>\n<br/>\n";
			return $this->extract($result, $attr_arr);
		}
		return $json;
	}

	private function call($url="", $is_xml=false, $is_post=false, $header_arr=null, $attr_arr=null, $post_params=null) 
	{
		$is_debug = false;

		if(empty($url)) 
		{
			// if($is_debug) echo "MY_Curl.php / call - 001<br/>";
			return null;
		}

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, $is_post);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // parameters
        if($is_post && !empty($post_params)) {
			//create name value pairs seperated by &
			$postData = "";
			foreach($post_params as $k => $v) 
			{ 
				$postData .= $k . '='.$v.'&'; 
			}
			$postData = rtrim($postData, '&');

			curl_setopt($ch, CURLOPT_POSTFIELDS,$postData);        
        }

        // param - header_arr - key/value array
        $headers = array();
        foreach ($header_arr as $key => $value) 
        {
        	$headers[] = "$key: $value";
        }
        if($is_debug) echo "MY_Curl.php / call / \$headers<br/>\n";
        if($is_debug) print_r($headers);

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($ch);
        curl_close ($ch);

        if($is_debug) print_r($response);
        if($is_debug) echo "\$response : $response<br/>\n";

        if(is_null($response) || empty($response)) 
        {
        	// error report!
        	if($is_debug) echo "!Error! / MY_Curl.php / call / - 002<br/>\n";
        	return null;
        }

        

        if($is_xml) {
        	// parse xml to json
			$xml = simplexml_load_string($response);
			$json = json_encode($xml);
			$result = json_decode($json,TRUE);

			$result = $this->extract($result, $attr_arr);
        } 
        else 
        {
        	// parse json
        	$json = json_decode($response);
			$result = $this->extract($json, $attr_arr);
        }

        if($is_debug) echo "MY_Curl.php / call - 003<br/>";

        return $result;
	}

    private function xml2array ( $xmlObject, $out = array () )
    {
        foreach ( (array) $xmlObject as $index => $node )
            $out[$index] = ( is_object ( $node ) ) ? $this->xml2array ( $node ) : $node;

        return $out;
    } 

    public function download($url="",$save_to_dir="",$file_name="")
    {
    	if(empty($url)) 
    	{
    		return false;
    	}
    	if(empty($save_to_dir)) 
    	{
    		return false;
    	}
    	if(!file_exists($save_to_dir))
    	{
    		return false;
    	}
    	if(!is_writable($save_to_dir))
    	{
    		return false;
    	}
    	if(empty($file_name)) 
    	{
    		return false;
    	}

    	$saveto = $save_to_dir . "/" . $file_name;

	    $ch = curl_init ($url);
	    curl_setopt($ch, CURLOPT_HEADER, 0);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
	    $raw=curl_exec($ch);
	    curl_close ($ch);

	    if(file_exists($saveto)){
	        unlink($saveto);
	    }

	    $fp = fopen($saveto,'x');
	    fwrite($fp, $raw);
	    fclose($fp);

	    return true;
	}

}

