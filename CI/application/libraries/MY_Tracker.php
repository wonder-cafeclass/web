<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 코드의 흐름을 디버깅해 브라우저에서도 조회할 수 있도록 도와줌.
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Tracker
{
	private $history_list;

	public function init() 
	{
		$this->history_list = array();
	}

	public function add_init($class_name="", $method_name="", $line_num=-1) 
	{
		$this->add($class_name, $method_name, $line_num, "init");
	}

	public function add_stopped($class_name="", $method_name="", $line_num=-1, $msg="") 
	{
		$this->add($class_name, $method_name, $line_num, "stopped / $msg");
	}

	public function add($class_name="", $method_name="", $line_num=-1, $msg="") 
	{

		if(empty($class_name)) 
		{
			return;
		}
		if(empty($method_name)) 
		{
			return;
		}
		if(empty($line_num)) 
		{
			return;
		}

		if(empty($this->history_list)) 
		{
			$this->history_list = array();
		}

		$history =
        [
            "class_name"=>$class_name,
            "method_name"=>$method_name,
            "line_num"=>$line_num,
            "msg"=>$msg
        ];
        array_push($this->history_list, $history);

	}

	public function flush()
	{
		$history_list = $this->history_list;

		$this->history_list = array();

		return $history_list;
	}

}