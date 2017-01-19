<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 이메일 발송 관련 클래스 모음
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 * @referer   file:///Library/WebServer/Documents/CodeIgniter/user_guide/libraries/email.html
 * @How to create HTML Eamil Template
 https://webdesign.tutsplus.com/articles/creating-a-simple-responsive-html-email--webdesign-12978
 https://www.sitepoint.com/how-to-code-html-email-newsletters/
 */


class MY_CC_Email
{
	private $CI=null;
    private $isOK=true;

    private $admin_email="info@cafeclass.kr";
    private $admin_name="카페클래스";

    public function __construct()
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
        	$this->isOK = false;
            return;
        }
        if(!isset($this->CI->my_logger)) 
        {
            $this->CI->load->library('MY_Logger');
        } // end if
        if(!isset($this->CI->my_tracker)) 
        {
            $this->CI->load->library('MY_Tracker');
        } // end if
        $this->CI->load->library('email');
        
    } // end method

    public function get_admin_email()
    {
        return $this->admin_email;
    }

    // @ 유저에게 전달되는 공식적인 메일. 발송자, BCC로 info@cafeklass.kr이 들어갑니다.
    public function send_mail_to_user($user_id=-1, $receiver_email="", $subject="", $message="")
    {
        $this->send_mail(
            // $user_id=-1, 
            $user_id,
            // $your_email="", 
            $this->admin_email,
            // $your_name="", 
            $this->admin_name,
            // $receiver_email="", 
            $receiver_email,
            // $bcc_email_list=null, 
            [
                $this->admin_email
            ],
            // $subject="", 
            $subject,
            // $message=""
            $message
        );
    }

    public function send_mail($user_id=-1, $your_email="", $your_name="", $receiver_email="", $bcc_email_list=null, $subject="", $message="")
    {
    	if(!$this->isOK) 
    	{
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "!\$this->isOK");
    		return;
    	}
        if(!(0 < $user_id))
        {
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "!(0 < \$user_id)");
            return;
        }
    	if(empty($your_email)) 
    	{
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$your_email)");
    		return;
    	}
        if(empty($your_name)) 
        {
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$your_name)");
            return;
        }
        if(empty($receiver_email)) 
        {
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$receiver_email)");
            return;
        }
        if(empty($subject)) 
        {
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$subject)");
            return;
        }
        if(empty($message)) 
        {
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$message)");
            return;
        }
        if(is_null($this->CI->email))
        {
            $this->CI->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "is_null(\$this->CI->email)");
            return;
        }

        // 메일을 발송합니다.
        $this->CI->email->from($your_email, $your_name);
        $this->CI->email->to($receiver_email);
        if(!empty($bcc_email_list))
        {
            $this->CI->email->bcc($bcc_email_list);
        }
        $this->CI->email->subject($subject);
        $this->CI->email->message($message);

        $this->CI->email->send();

        // 메일 발송을 기록합니다. 로거에 기록합니다.
        $this->CI->my_logger->add_action(
            // $user_id=-1
            $user_id,
            // $action_type=""
            $this->CI->my_logger->ACTION_TYPE_SEND_MAIL,
            // $action_key=""
            $this->CI->my_logger->ACTION_KEY_SEND_MAIL
        );


    } // end method


}