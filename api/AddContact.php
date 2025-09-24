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
    $firstName = trim($reqData["firstName"] ?? "");
    $lastName = trim($reqData["lastName"] ?? "");
    $email = trim($reqData["email"] ?? "");
    $phone = trim($reqData["phone"] ?? "");
    $address = trim($reqData["address"] ??"");

    if (
        $userId === 0 ||
        $firstName === "" || 
        $lastName === ""
    ) 
        bad("Missing required fields");


    // connect to mysql
    $conn = new mysqli("localhost", "appuser", 'M9ASwv#4$z94', "contact_manager");
    if ($conn->connect_error) 
        err($conn->connect_error);

    // insert contact - FIXED: removed quotes around 'address'
    $stmt = $conn->prepare("INSERT INTO Contacts (userID, firstName, lastName, email, phoneNumber, address) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) 
        err($conn->error);
    $stmt->bind_param("isssss", $userId, $firstName, $lastName, $email, $phone, $address);

    // handle error
    if (!$stmt->execute()) {
        $e = $conn->error;
        $stmt->close();
        $conn->close();
        err($e);
    }

    $contactId = $conn->insert_id;  

    $stmt->close();
    $conn->close();
    ok(["contactId" => $contactId]);

} catch (\Throwable $e) {
    err($e->getMessage());
}