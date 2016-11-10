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

	public function post_json($url="", $header_arr=null, $attr_arr=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, false, true, $header_arr, $attr_arr);
	}
	public function post_xml($url="", $header_arr=null, $attr_arr=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, true, true, $header_arr, $attr_arr);
	}
	public function post($url="", $is_xml=false, $header_arr=null, $attr_arr=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

		return $this->call($url, $is_xml, true, $header_arr, $attr_arr);
	}

	private function extract($json=null, $attr_arr=null) {

		if(is_null($json)) 
		{
			return null;
		}
		if(empty($attr_arr)) 
		{
			return $json;
		}

		$cnt = count($attr_arr);
		// echo "extract - 000 / \$cnt : $cnt<br/>\n";
		$attr = array_shift($attr_arr);
		if(empty($attr)) 
		{
			return $json;
		}

		$result=null;
		if(is_array($json))
		{
			$box_list = [];
			// echo "extract - 001<br/>\n";
			if(is_string($attr))	
			{
				// echo "extract - 001-1<br/>\n";
				// echo "\$attr : $attr<br/>";
				
				foreach($json as $key => $value)
				{
					// echo "extract - 001-1-1<br/>\n";
					if(is_array($value))
					{
						if(isset($value[$attr]))
						{
							array_push($box_list, $value[$attr]);
						}
					}
					else if(is_object($value))
					{
						if(isset($value->{$attr}))
						{
							array_push($box_list, $value->{$attr});
						}
						
					} // end if
				} // end foreach
			}
			else if(is_array($attr))	
			{
				// echo "extract - 001-2<br/>\n";
				// print_r($json);

				foreach($json as $key => $value)
				{
					// echo "extract - 001-2-1<br/>\n";
					$box = [];
					foreach($attr as $attr_name)
					{
						// echo "extract - 001-2-1-1<br/>\n";
						// echo "extract - 001-2 / \$key : $key<br/>\n";
						if(isset($value[$attr_name]))
						{
							// echo "extract - 001-2-1-1-*<br/>\n";
							$box[$attr_name] = $value[$attr_name];
						}
					}
					array_push($box_list, $box);

				}
			}
			return $this->extract($box_list, $attr_arr);
		}
		else
		{
			// echo "extract - 002<br/>\n";
			if(is_string($attr))	
			{
				// echo "extract - 002-1<br/>\n";
				if(isset($json->{$attr})) {
					// echo "extract - 002-1-2<br/>\n";
					return $this->extract($json->{$attr}, $attr_arr);
				}
			}
			else if(is_array($attr))	
			{
				// Need to implement!
				// echo "extract - 002-2 / <br/>\n";
			}
		}

		return $result;
	}

	private function call($url="", $is_xml=false, $is_post=false, $header_arr=null, $attr_arr=null) 
	{
		if(empty($url)) 
		{
			return null;
		}

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, $is_post);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // param - header_arr - key/value array
        $headers = array();
        foreach ($header_arr as $key => $value) 
        {
        	$headers[] = "$key: $value";
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec ($ch);
        curl_close ($ch);

        if(is_null($response) || empty($response)) 
        {
        	// error report!
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

        return $result;
	}

    private function xml2array ( $xmlObject, $out = array () )
    {
        foreach ( (array) $xmlObject as $index => $node )
            $out[$index] = ( is_object ( $node ) ) ? $this->xml2array ( $node ) : $node;

        return $out;
    }    

}

