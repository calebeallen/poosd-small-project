<?php

    $reqData = json_decode(file_get_contents('php://input'), true);

    $username = $reqData["username"];
	$password = password_hash($reqData["password"]);

    // connect to db
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error){
        err(err: $conn->connect_error);
        return;
    }

    // create user
    try {
        $makeUserQuery = $conn->prepare(query: "INSERT INTO Users (username, passwordHash) VALUES (?, ?)");
        $makeUserQuery->bind_param("ss", $username, $password);
        $makeUserQuery->execute();
    } catch (PDOException $e) {
        bad("User already exists");
        $conn->close();
        return;
    }

    ok("User created");

    function ok($data) {
        $body = [
            "status" => "Success",
            "data" => $data,
        ];
        http_response_code(200);
        header('Content-type: application/json');
        echo json_encode($body);
    }

    function bad($err) {
		$body = [
            "status" => "Bad request",
            "err" => $err,
        ];
        http_response_code(400);
        header('Content-type: application/json');
        echo json_encode($body);
	}
	
	function err($err) {
		$body = [
            "status" => "Error",
            "err" => $err,
        ];
        http_response_code(500);
        header('Content-type: application/json');
        echo json_encode($body);
	}

?>