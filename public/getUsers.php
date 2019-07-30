<?

	// FIXME for test only
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Content-type: application/json; charset=utf-8");

	if (!isset($_POST["userIds"]) || empty($_POST["userIds"])) {
		print "[]";
		exit;
	}
	$userIds = $_POST["userIds"];


	$obj = [
		"user_ids" => $userIds,
		"v" => "5.108",
		"fields" => "photo_50,screen_name",
		"access_token" => file_get_contents('./.token')
	];

	$ch = curl_init("https://api.vk.com/method/users.get");
	curl_setopt_array($ch, [
		CURLOPT_POST => 1,
		CURLOPT_POSTFIELDS => $obj,
		CURLOPT_TIMEOUT => 5,
		CURLOPT_SSL_VERIFYHOST => 0,
		CURLOPT_SSL_VERIFYPEER => 0
	]);

	curl_exec($ch);
	curl_close($ch);