

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

    $contactId = $reqData["contactId"] ?? 0;
    $firstName = trim($reqData["firstName"] ?? "");
    $lastName = trim($reqData["lastName"] ?? "");
    $email = trim($reqData["email"] ?? "");
    $phone = trim($reqData["phone"] ?? "");

    if (
        $userId === 0 ||
        $firstName === "" || 
        $lastName === "" ||
        $email === "" ||
        $phone === ""
    ) 
        bad("Missing fields");


    // connect to mysql
    $conn = new mysqli("localhost", "appuser", 'M9ASwv#4$z94', "contact_manager");
    if ($conn->connect_error) 
        err($conn->connect_error);

    // insert contact
    $stmt = $conn->prepare("UPDATE Contacts SET firstName = ?, lastName = ?, email = ?, phoneNumber = ? WHERE contactID = ?");
    if (!$stmt) 
        err($conn->error);

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
    ok("");

} catch (\Throwable $e) {
    err($e->getMessage());
}