<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';

class Tests extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

        // init unit test
        $this->load->library('unit_test');

        // init param checker
        $this->load->library('paramChecker');
    }

    // Condition tags which Code Igniter 3 supports officially 
    private $is_object="is_object";
    private $is_string="is_string";
    private $is_bool="is_bool";
    private $is_true="is_true";
    private $is_false="is_false";
    private $is_int="is_int";
    private $is_numeric="is_numeric";
    private $is_float="is_float";
    private $is_double="is_double";
    private $is_array="is_array";
    private $is_null="is_null";
    private $is_resource="is_resource";

    private function run_unit_test($test=null, $expected_result="", $test_name="", $result_list=null, $test_raw=null) {

        if(is_null($this->unit)) {
            return;
        }

        $this->unit->run($test, $expected_result, $test_name);
        // $result = $this->unit->result()["0"];
        $result = $this->unit->result();
        $last_idx = (count($result) - 1);
        $last_result = $result[$last_idx];

        // custom data
        $last_result["Expected Result"] = $expected_result;
        $last_result["Received Result"] = $test;
        $last_result["Test - Received test name"] = $test_name;

        if(!is_null($test_raw)) {
            $last_result["Test Raw"] = $test_raw;            
        }

        if(is_null($result_list)) {
            $result_list = array();
        }

        if(strcmp($last_result["Result"], "Failed") == 0) {
            // 테스트가 실패한 경우에만 배열에 추가.
            if(is_array($result_list) && !is_null($result_list)) {
                array_push($result_list, $last_result);
            }
        }

        return $result_list;
    }

    // @Example : http://dev.cafeclass.kr/index.php/api/tests/paramcheck
    private function paramcheck_table_user($result_list=null)
    {
        if(is_null($result_list)) {
            $result_list = array();
        }

        // table user - column id
        // TABLE:user - COLUMN:id
        $result_list = $this->paramcheck_table_user_column_id($result_list);
        // TABLE:user - COLUMN:nickname
        $result_list = $this->paramcheck_table_user_column_nickname($result_list);
        // TABLE:user - COLUMN:first_name
        $result_list = $this->paramcheck_table_user_column_first_name($result_list);
        // TABLE:user - COLUMN:last_name
        $result_list = $this->paramcheck_table_user_column_last_name($result_list);
        // TABLE:user - COLUMN:gender
        $result_list = $this->paramcheck_table_user_column_gender($result_list);
        // TABLE:user - COLUMN:locale
        $result_list = $this->paramcheck_table_user_column_locale($result_list);
        // TABLE:user - COLUMN:birth_range
        $result_list = $this->paramcheck_table_user_column_birth_range($result_list);
        // TABLE:user - COLUMN:thumbnail
        $result_list = $this->paramcheck_table_user_column_thumbnail($result_list);
        // TABLE:user - COLUMN:status
        $result_list = $this->paramcheck_table_user_column_status($result_list);
        // TABLE:user - COLUMN:permission
        $result_list = $this->paramcheck_table_user_column_permission($result_list);
        // TABLE:user - COLUMN:mobile
        $result_list = $this->paramcheck_table_user_column_mobile($result_list);
        // TABLE:user - COLUMN:email
        $result_list = $this->paramcheck_table_user_column_email($result_list);
        // TABLE:user - COLUMN:password
        $result_list = $this->paramcheck_table_user_column_password($result_list); 
        
        return $result_list;
    }
    private function paramcheck_table_user_column_id($result_list=null) 
    {
        if(is_null($result_list)) {
            $result_list = array();
        }

        $checker_key = "user_id";

        // "user_id":"is_natural_no_zero",

        for ($i=-3; $i <= 0; $i++) {
            $test_name = $checker_key . ' : ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $i);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }
        
        for ($i=1; $i <= 4; $i++) {
            $test_name = $checker_key . ' : ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $i);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }
        
        for ($i=-4; $i<=0; $i++) {

            $cur_value = ParamChecker::$mysql_int_max + $i;

            $test_name = $checker_key . ' : mysql_int_max ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $cur_value);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        for ($i=1; $i <= 4; $i++) {

            $cur_value = ParamChecker::$mysql_int_max + $i;

            $test_name = $checker_key . ' : mysql_int_max + ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $cur_value);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        return $result_list;
    }
    private function paramcheck_table_user_column_nickname($result_list=null) 
    {
        if(is_null($result_list)) {
            $result_list = array();
        }

        // "user_nickname":"is_str|||min_length[4]|||max_length[32]|||is_unique[user.nickname]|||regex_match[/a-zA-Z가-힣0-9/]",

        $checker_key = "user_nickname";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - a';
        $test_output = $this->paramchecker->is_ok($checker_key, "a");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        // min_length[4]
        $test_name = $checker_key . ' - min_length - abcde';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcde");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd!';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - a1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "a1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - ab1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름?!';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름?!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글이';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + a';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcda");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;
    }
    private function paramcheck_table_user_column_first_name($result_list=null) 
    {
        $checker_key = "user_first_name";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - a';
        $test_output = $this->paramchecker->is_ok($checker_key, "a");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        // min_length[4]
        $test_name = $checker_key . ' - min_length - abcde';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcde");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd!';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - a1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "a1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - ab1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름?!';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름?!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글이';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + a';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcda");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;
    }
    private function paramcheck_table_user_column_last_name($result_list=null) 
    {
        $checker_key = "user_last_name";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - a';
        $test_output = $this->paramchecker->is_ok($checker_key, "a");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        // min_length[4]
        $test_name = $checker_key . ' - min_length - abcde';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcde");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd!';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - a1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "a1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - ab1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름?!';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름?!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글이';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - 한글이름 x 8 + 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + a';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcda");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - min_length - abcd x 8 + abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;
    }
    private function paramcheck_table_user_column_gender($result_list=null) 
    {
        $checker_key = "user_gender";

        // "user_gender":"is_str|||exact_length[1]|||matches[user_gender_list]",
        // "user_gender_list":["M","F","U"],

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $const_map = $this->paramchecker->get_const_map();
        $user_gender_list = array();
        if(isset($const_map->{"user_gender_list"})) {
            $user_gender_list = $const_map->{"user_gender_list"};
        }
        for ($i=0; $i < count($user_gender_list); $i++) { 
            $user_gender = $user_gender_list[$i];

            $test_name = $checker_key . ' - ' . $user_gender;
            $test_output = $this->paramchecker->is_ok($checker_key, $user_gender);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $test_name = $checker_key . ' - K';
        $test_output = $this->paramchecker->is_ok($checker_key, "K");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MF';
        $test_output = $this->paramchecker->is_ok($checker_key, "MF");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MFU';
        $test_output = $this->paramchecker->is_ok($checker_key, "MFU");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;
    }
    private function paramcheck_table_user_column_locale($result_list=null) 
    {
        $checker_key = "user_locale";

        // "user_locale":"is_str|||min_length[2]|||max_length[16]|||matches[user_locale_list]",
        // "user_locale_list":["잠실역","성수역","개롱역","그외"],

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $const_map = $this->paramchecker->get_const_map();
        $user_locale_list = array();
        if(isset($const_map->{"user_locale_list"})) {
            $user_locale_list = $const_map->{"user_locale_list"};
        }
        for ($i=0; $i < count($user_locale_list); $i++) { 
            $user_locale = $user_locale_list[$i];

            $test_name = $checker_key . ' - ' . $user_locale;
            $test_output = $this->paramchecker->is_ok($checker_key, $user_locale);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $test_name = $checker_key . ' - K';
        $test_output = $this->paramchecker->is_ok($checker_key, "K");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MF';
        $test_output = $this->paramchecker->is_ok($checker_key, "MF");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MFU';
        $test_output = $this->paramchecker->is_ok($checker_key, "MFU");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - 둔전역';
        $test_output = $this->paramchecker->is_ok($checker_key, "둔전역");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;
    }
    private function paramcheck_table_user_column_birth_range($result_list=null) 
    {

        $checker_key = "user_birth_range";

        // "user_birth_range":"is_natural_no_zero|||greater_than_equal_to[1900]|||less_than_equal_to[2020]",

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        for ($i=-3; $i < 3; $i++) {
            $test_name = $checker_key . ' ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $i);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        for ($i=1890; $i < 1900; $i++) {
            $test_name = $checker_key . ' ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $i);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        for ($i=1900; $i < 1910; $i++) {
            $test_name = $checker_key . ' ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $i);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        for ($i=2010; $i <= 2020; $i++) {
            $test_name = $checker_key . ' ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $i);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        for ($i=2021; $i < 2030; $i++) {
            $test_name = $checker_key . ' ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $i);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        for ($i=-4; $i<=4; $i++) {
            $cur_value = ParamChecker::$mysql_int_max + $i;

            $test_name = $checker_key . ' : mysql_int_max ' . $i;
            $test_output = $this->paramchecker->is_ok($checker_key, $cur_value);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        return $result_list;

    }
    private function paramcheck_table_user_column_thumbnail($result_list=null) 
    {
        // "user_thumbnail":"valid_url",

        $checker_key = "user_thumbnail";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $thumbnail_valid_array = array(
            'https://c1.staticflickr.com/9/8392/8568555117_d6d4c1a20d_b.jpg',
            'https://pixabay.com/static/uploads/photo/2015/11/21/20/33/papaya-1055551_960_720.png',
            'https://c1.staticflickr.com/3/2151/2144882415_7a8d4999e7_z.jpg?zz=1',
            'https://pixabay.com/static/uploads/photo/2015/04/02/11/22/grape-703676_960_720.jpg',
            'http://orig12.deviantart.net/7843/f/2011/306/f/5/superman_colored_by_dragonofbrainstorms-d4ew4b2.jpg',
            'https://pixabay.com/static/uploads/photo/2015/06/28/20/56/lion-824900_960_720.jpg'
        );

        for ($i=0; $i < count($thumbnail_valid_array); $i++) { 
            $thumbnail_valid = $thumbnail_valid_array[$i];

            $test_name = $checker_key . ' : ' . $thumbnail_valid;
            $test_output = $this->paramchecker->is_ok($checker_key, $thumbnail_valid);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $thumbnail_no_valid_array = array(
            'htp://c1.staticflickr.com/9/8392/8568555117_d6d4c1a20d_b.jpg',
            'https://',
            'https:c1.staticflickr.com/3/2151/2144882415_7a8d4999e7_z.jpg?zz=1',
            'https:/pixabay.com/static/uploads/photo/2015/04/02/11/22/grape-703676_960_720.jpg',
            'http//orig12.deviantart.net/7843/f/2011/306/f/5/superman_colored_by_dragonofbrainstorms-d4ew4b2.jpg',
            'ftp://pixabay'
        );

        for ($i=0; $i < count($thumbnail_no_valid_array); $i++) { 
            $thumbnail_no_valid = $thumbnail_no_valid_array[$i];

            $test_name = $checker_key . ' : ' . $thumbnail_no_valid;
            $test_output = $this->paramchecker->is_ok($checker_key, $thumbnail_no_valid);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        return $result_list;
    }
    private function paramcheck_table_user_column_status($result_list=null)
    {
        $checker_key = "user_status";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $const_map = $this->paramchecker->get_const_map();
        $user_status_list = array();
        if(isset($const_map->{"user_status_list"})) {
            $user_status_list = $const_map->{"user_status_list"};
        }
        for ($i=0; $i < count($user_status_list); $i++) { 
            $user_status = $user_status_list[$i];

            $test_name = $checker_key . ' - ' . $user_status;
            $test_output = $this->paramchecker->is_ok($checker_key, $user_status);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $test_name = $checker_key . ' - K';
        $test_output = $this->paramchecker->is_ok($checker_key, "K");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MF';
        $test_output = $this->paramchecker->is_ok($checker_key, "MF");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MFU';
        $test_output = $this->paramchecker->is_ok($checker_key, "MFU");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;
    }
    private function paramcheck_table_user_column_permission($result_list=null)
    {
        // "user_permission":"is_str|||exact_length[1]|||matches[user_status_list]",

        $checker_key = "user_permission";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $const_map = $this->paramchecker->get_const_map();
        $user_permission_list = array();
        if(isset($const_map->{"user_permission_list"})) {
            $user_permission_list = $const_map->{"user_permission_list"};
        }
        for ($i=0; $i < count($user_permission_list); $i++) { 
            $user_permission = $user_permission_list[$i];

            $test_name = $checker_key . ' - ' . $user_permission;
            $test_output = $this->paramchecker->is_ok($checker_key, $user_permission);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $test_name = $checker_key . ' - K';
        $test_output = $this->paramchecker->is_ok($checker_key, "K");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MF';
        $test_output = $this->paramchecker->is_ok($checker_key, "MF");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = $checker_key . ' - MFU';
        $test_output = $this->paramchecker->is_ok($checker_key, "MFU");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;
        
    }
    private function paramcheck_table_user_column_mobile($result_list=null)
    {
        // "user_mobile":"valid_mobile_kor",
        $checker_key = "user_mobile";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $mobile_number_array = array(
            "010-4611-5149",
            "011-4611-5149",
            "010-4611-5149",
            "010-3611-5149",
            "010-4611-0149"
        );

        for ($i=0; $i < count($mobile_number_array); $i++) { 
            $mobile_number = $mobile_number_array[$i];

            $test_name = $checker_key . ' - ' . $mobile_number;
            $test_output = $this->paramchecker->is_ok($checker_key, $mobile_number);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $mobile_number_no_valid_array = array(
            "010",
            "011-4611",
            "11011-5149",
            "010-365149",
            "4611-0149",
            "3-646-1911",
            "1-5941"
        );

        for ($i=0; $i < count($mobile_number_no_valid_array); $i++) {
            $mobile_number = $mobile_number_no_valid_array[$i];

            $test_name = $checker_key . ' - ' . $mobile_number;
            $test_output = $this->paramchecker->is_ok($checker_key, $mobile_number);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        return $result_list;        
    }
    private function paramcheck_table_user_column_email($result_list=null)
    {
        // "user_email":"valid_emails",

        $checker_key = "user_email";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $email_array = array(
            "wonder1662@gmail.com",
            "wonder@xogames.com",
            "wonder@cafeclass.kr"
        );

        for ($i=0; $i < count($email_array); $i++) { 
            $email = $email_array[$i];

            $test_name = $checker_key . ' - ' . $email;
            $test_output = $this->paramchecker->is_ok($checker_key, $email);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $email_no_valid_array = array(
            "wonder1662gmail.com",
            "wonder1662@gmail",
            "@xogames.com",
            "wonder",
            "wonder@"
        );

        for ($i=0; $i < count($email_no_valid_array); $i++) {
            $email = $email_no_valid_array[$i];

            $test_name = $checker_key . ' - ' . $email;
            $test_output = $this->paramchecker->is_ok($checker_key, $email);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        return $result_list;

    }
    private function paramcheck_table_user_column_password($result_list=null)
    {
        // "user_password":"is_str|||exact_length[8]",

        $checker_key = "user_password";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $password_array = array(
            "1168d7e4",
            "f0d644c3",
            "c95e35bf",
            "033bd94b"
        );

        for ($i=0; $i < count($password_array); $i++) { 
            $email = $password_array[$i];

            $test_name = $checker_key . ' - ' . $email;
            $test_output = $this->paramchecker->is_ok($checker_key, $email);
            $test = $test_output["success"];
            $expected_result = true; // CORRECT
            // $expected_result = false; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        $password_no_valid_array = array(
            "won",
            "wonder1662f0d644c3",
            "@xogames.f0d644c3",
            "wonder",
            "@"
        );

        for ($i=0; $i < count($password_no_valid_array); $i++) {
            $email = $password_no_valid_array[$i];

            $test_name = $checker_key . ' - ' . $email;
            $test_output = $this->paramchecker->is_ok($checker_key, $email);
            $test = $test_output["success"];
            $expected_result = false; // CORRECT
            // $expected_result = true; // WRONG
            $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);
        }

        return $result_list;
    }







    private function paramcheck_table_z_test_user($result_list=null) 
    {
        if(is_null($result_list)) {
            $result_list = array();
        }
        // TABLE:z_test_user - COLUMN:id
        $result_list = $this->paramcheck_table_z_test_user_column_name($result_list);
        
        return $result_list;
    }
    private function paramcheck_table_z_test_user_column_name($result_list=null) 
    {
        if(is_null($result_list)) {
            $result_list = array();
        }

        // "z_test_user_name":"is_str|||min_length[4]|||max_length[32]|||is_unique[z_test_user.name]|||regex_match[/^[a-zA-Z가-힣0-9]+$/]",

        $checker_key = "z_test_user_name";

        $test_name = 'TABLE:z_test_user COLUMN:name test - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = 'TABLE:z_test_user COLUMN:name test - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - a';
        $test_output = $this->paramchecker->is_ok($checker_key, "a");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        // min_length[4]
        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcde';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcde");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcd!';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcd!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - a1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "a1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - ab1A!';
        $test_output = $this->paramchecker->is_ok($checker_key, "ab1A!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글이름?!';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름?!");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글이름 x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글이름 x 8 + 한';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글이름 x 8 + 한글';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글이름 x 8 + 한글이';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - 한글이름 x 8 + 한글이름';
        $test_output = $this->paramchecker->is_ok($checker_key, "한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름한글이름");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcd x 8';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcd x 8 + a';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcda");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcd x 8 + ab';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdab");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcd x 8 + abc';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabc");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - min_length - abcd x 8 + abcd';
        $test_output = $this->paramchecker->is_ok($checker_key, "abcdabcdabcdabcdabcdabcdabcdabcdabcd");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'TABLE:z_test_user COLUMN:name test - is_unique - Johnson';
        $test_output = $this->paramchecker->is_ok($checker_key, "Johnson");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        return $result_list;        

    }

    private function paramcheck_table_column_default($result_list=null) {

        $checker_key = "default";

        $test_name = $checker_key . ' - \"\"';
        $test_output = $this->paramchecker->is_ok($checker_key, "");
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = $checker_key . ' - NULL';
        $test_output = $this->paramchecker->is_ok($checker_key, null);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        // ...

        return $result_list;

    }

    public function paramcheck_get()
    {
        $result_list = array();

        $result_list = $this->paramcheck_table_user($result_list);
        
        $result_list = $this->paramcheck_table_z_test_user($result_list);

        // $this->set_response($result_list, REST_Controller::HTTP_OK);
        $this->set_response($result_list, REST_Controller::HTTP_OK);
    }

}
