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
function err($err) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["status" => "Error", "err" => $err]);
    exit;
}

try {

    $reqData = json_decode(file_get_contents('php://input'), true);

    $userId = $reqData["userId"] ?? 0;

    if ($userId === 0) 
        bad("Missing fields");

    $conn = new mysqli("localhost", "appuser", 'M9ASwv#4$z94', "contact_manager");
    if ($conn->connect_error) 
        err($conn->connect_error);

    $stmt = $conn->prepare("SELECT contactID, firstName, lastName, email, phoneNumber, address FROM Contacts WHERE userID = ?");
    if (!$stmt) {
        err($conn->error);
    }
    $stmt->bind_param("i", $userId);

    if (!$stmt->execute()) {
        $err = $conn->error;
        $stmt->close();
        $conn->close();
        err($err);
    }

    $res = $stmt->get_result();
    $rows = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

    $stmt->close();
    $conn->close();
    ok($rows);

} catch (\Throwable $e) {
    err($e->getMessage());
}