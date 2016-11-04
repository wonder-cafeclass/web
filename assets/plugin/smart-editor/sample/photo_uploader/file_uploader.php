<?php
// Cafeclass custom
include_once("thumb_maker.php");

// default redirection
$url = $_REQUEST["callback"].'?callback_func='.$_REQUEST["callback_func"];
$bSuccessUpload = is_uploaded_file($_FILES['Filedata']['tmp_name']);

// SUCCESSFUL
if(bSuccessUpload) 
{
	$tmp_name = $_FILES['Filedata']['tmp_name'];
	$name = $_FILES['Filedata']['name'];
	
	$filename_ext = strtolower(array_pop(explode('.',$name)));
	$allow_file = array("jpg", "png", "bmp", "gif");
	
	if(!in_array($filename_ext, $allow_file)) 
	{
		$url .= '&errstr='.$name;
	} 
	else
	{
		$uploadDir = '../../upload/';

		if(!is_dir($uploadDir)){
			mkdir($uploadDir, 0777);
		}
		
		$newPath = $uploadDir.urlencode($_FILES['Filedata']['name']);
		
		@move_uploaded_file($tmp_name, $newPath);



		// CAFECLASS CUSTOM THUMBNAIL - INIT
		// make thumbnail (short side should be set 400px)
		$result = ThumbMaker::make_thumbnail($newPath);
		$thumbnail_name = "";
		if(!is_null($result) && $result->success) 
		{
			$thumbnail_url = $result->thumbnail_url;
		}

		// remove source image
		unlink($newPath);
		// CAFECLASS CUSTOM THUMBNAIL - DONE


		
		$url .= "&bNewLine=true";
		$url .= "&sFileName=".urlencode(urlencode($name));
		// $url .= "&sFileURL=upload/".urlencode(urlencode($name));
		$url .= "&sFileURL=$thumbnail_url";
	}
}
// FAILED
else {
	$url .= '&errstr=error';
}
	
header('Location: '. $url);
?>