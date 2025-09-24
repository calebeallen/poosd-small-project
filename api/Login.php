<?php
// Simple demo login (mysqli + password_verify)

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
function unauth($err) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(["status" => "Unauthorized", "err" => $err]);
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

    $username = trim($reqData["username"] ?? $reqData["loginName"] ?? "");
    $password = (string)($reqData["password"] ?? "");

    if ($username === "" || $password === "") 
        bad("Missing fields");

    $conn = new mysqli("localhost", "appuser", 'M9ASwv#4$z94', "contact_manager");
    if ($conn->connect_error) 
        err($conn->connect_error);

    $stmt = $conn->prepare("SELECT userID, username, passwordHash FROM Users WHERE username = ?");
    if (!$stmt)
        err($conn->error);

    $stmt->bind_param("s", $username);
    if (!$stmt->execute()) {
        $err = $conn->error;
        $stmt->close();
        $conn->close();
        err($err);
    }

    $res = $stmt->get_result();
    $row = $res ? $res->fetch_assoc() : null;

    if (!$row || !password_verify($password, $row['passwordHash'])) {
        $stmt->close();
        $conn->close();
        unauth("Invalid credentials");
    }

    $stmt->close();
    $conn->close();
    ok([
        "id" => (int)$row['userID'], 
        "username" => $row['username']
    ]);

} catch (\Throwable $e) {
    err($e->getMessage());
}