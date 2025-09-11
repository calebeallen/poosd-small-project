<?php
// Simple demo delete contact (mysqli)

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

    $userId    = (int)(trim($reqData["userId"] ?? ""));
    $contactId = (int)(trim($reqData["contactId"] ?? ""));

    if ($userId === 0 || $contactId === 0) 
        bad("Missing userId or contactId");

    // connect to mysql
    $conn = new mysqli("localhost", "appuser", 'M9ASwv#4$z94', "contact_manager");
    if ($conn->connect_error) 
        err($conn->connect_error);

    // delete contact (ensure userId matches for safety)
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE contactID = ? AND userID = ?");
    if (!$stmt) 
        err($conn->error);

    $stmt->bind_param("ii", $contactId, $userId);

    if (!$stmt->execute()) {
        $e = $conn->error;
        $stmt->close();
        $conn->close();
        err($e);
    }

    if ($stmt->affected_rows === 0) {
        $stmt->close();
        $conn->close();
        bad("No contact found or not authorized");
    }

    $stmt->close();
    $conn->close();
    ok("Contact deleted");

} catch (\Throwable $e) {
    err($e->getMessage());
}
