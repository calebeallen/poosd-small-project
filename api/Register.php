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

$reqData = json_decode(file_get_contents('php://input'), true);

if (!is_array($reqData)) 
    bad("Invalid JSON");

$username = trim($reqData["username"]);
$password = (string)($reqData["password"] ?? "");

if ($username === "" || $password === "") 
    bad("username and password required");

$hash = password_hash($password);

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) err($conn->connect_error);
    $conn->set_charset('utf8mb4');

$stmt = $conn->prepare("INSERT INTO Users (username, passwordHash) VALUES (?, ?)");
if (!$stmt) err($conn->error);
$stmt->bind_param("ss", $username, $hash);

if (!$stmt->execute()) {
    // 1062 = duplicate entry (unique constraint on username)
    if ($conn->errno === 1062) {
        $stmt->close();
        $conn->close();
        bad("User already exists");
    }
    $e = $conn->error;
    $stmt->close();
    $conn->close();
    err($e);
}

$stmt->close();
$conn->close();
ok("User created");


