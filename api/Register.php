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

function conflict($err) {
    http_response_code(409);
    header('Content-Type: application/json');
    echo json_encode(["status" => "Conflict", "err" => $err]);
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

    if ($username === "" || $password === "") 
        bad("Missing fields");

    $hash = password_hash($password, PASSWORD_DEFAULT);

    // connect to mysql
    $conn = new mysqli("localhost", "appuser", 'M9ASwv#4$z94', "contact_manager");
    if ($conn->connect_error) 
        err($conn->connect_error);

    // create new user entry
    $stmt = $conn->prepare("INSERT INTO Users (username, passwordHash) VALUES (?, ?)");
    if (!$stmt) 
        err($conn->error);
    $stmt->bind_param("ss", $username, $hash);

    // handle insert failure
    if (!$stmt->execute()) {
        $err = $conn->error;
        $stmt->close();
        $conn->close();
        err($err);
    }

    $stmt->close();
    $conn->close();
    ok("User created");

} catch (\Throwable $e) {
    if ($e->getCode() === 1062) 
        conflict("User already exists");
    err($e->getMessage());
}