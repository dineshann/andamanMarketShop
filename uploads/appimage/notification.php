<?php //Call Function where you want to send Push Notification.
// include('PushNotification.php');
// $serverObject = new SendNotification(); 
// $token="dLmBHiGL_6g:APA91bGp5L_mZ0NwPZiihxIDVmo-d-UV05fvmcIDzDiyJ82ztCelmFl4oFRD2hEOPT2lE--ze-yH6Nac6KxbHspYWSQw4mmw8AZ-3HRrwD_crCO1o3p9mRu9WvOOsaw_vvScMnIIv2np";
// $message="Hasta la vista";
// $order_id="007";
// //echo "".$token."".$order_id."".$order_id."";
// $jsonString = $serverObject->sendPushNotificationToFCMSever( $token, $message, $order_id );  
// $jsonObject = json_decode($jsonString);
// return $jsonObject;
// print_r ($jsonObject);

send_notification ();

function send_notification()
{
	echo 'Hello';
define( 'API_ACCESS_KEY', 'AAAADun-sTM:APA91bHNrOG5jfD5E9LBUTmvivx-eeMJ5wzmUX7XwqiO77wIXWEbZ5j91a_kVV0K8GUJ_lkgJvNhK5O-5tgYAFue-dcASd-IhCV9bXvp6trw2f8VYxjp0pvPetESGRO523SGUWbe8GTh');
 //   $registrationIds = ;
#prep the bundle
     $msg = array
          (
		'body' 	=> 'Firebase Push Notification',
		'title'	=> 'Vishal Thakkar',
             	
          );
	$fields = array
			(
				'to'		=> 'dLmBHiGL_6g:APA91bGp5L_mZ0NwPZiihxIDVmo-d-UV05fvmcIDzDiyJ82ztCelmFl4oFRD2hEOPT2lE--ze-yH6Nac6KxbHspYWSQw4mmw8AZ-3HRrwD_crCO1o3p9mRu9WvOOsaw_vvScMnIIv2np',
				'notification'	=> $msg,
                'priority' => 'high',
			);
	
	
	$headers = array
			(
				'Authorization: key=AAAADun-sTM:APA91bHNrOG5jfD5E9LBUTmvivx-eeMJ5wzmUX7XwqiO77wIXWEbZ5j91a_kVV0K8GUJ_lkgJvNhK5O-5tgYAFue-dcASd-IhCV9bXvp6trw2f8VYxjp0pvPetESGRO523SGUWbe8GTh',
				'Content-Type: application/json'
			);
#Send Reponse To FireBase Server	
		$ch = curl_init();
		curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
		curl_setopt( $ch,CURLOPT_POST, true );
		curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
		curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
		$result = curl_exec($ch );
		echo $result;
		curl_close( $ch );
}
?>