<?php
// Simple demo register (mysqli + password_hash)

function ok($data) {
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(["status" => "Success", "data" => $data]);
    exit;
}
function bad($err) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(["status" => "Bad request", "err" => $err]);
    exit;
}
function err($err) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["status" => "Error", "err" => $err]);
    exit;
}

try {

    $reqData = json_decode(file_get_contents('php://input'), true);

    $username = trim($reqData["username"]);
    $password = (string)($reqData["password"] ?? "");

    $hash = password_hash($password, PASSWORD_DEFAULT);

    // connect to mysql
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
        err($conn->connect_error);

    // create new user entry
    $stmt = $conn->prepare("INSERT INTO Users (username, passwordHash) VALUES (?, ?)");
    if (!$stmt) 
        err($conn->error);
    $stmt->bind_param("ss", $username, $hash);

    // handle insert failure
    if (!$stmt->execute()) {
        // if row already exists...
        if ($conn->errno === 1062) {
            $stmt->close();
            $conn->close();
            bad("User already exists");
        }
        // other error
        $e = $conn->error;
        $stmt->close();
        $conn->close();
        err($e);
    }

    $stmt->close();
    $conn->close();
    ok("User created");


} catch (\Throwable $e) {
    err($e->getMessage());
}