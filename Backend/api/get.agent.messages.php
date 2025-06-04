<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "estate");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // ✅ POST: Fetch messages for an agent
    case 'POST':
        $data = json_decode(file_get_contents("php://input")); // Get JSON data from the body
        
        if (!isset($data->agent_id)) {
            echo json_encode(["success" => false, "message" => "Missing agent_id"]);
            exit;
        }

        $agent_id = intval($data->agent_id); // Use the agent_id from the request body
        $query = "SELECT * FROM agent_contacts WHERE agent_id = ? ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $agent_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $messages = [];
        while ($row = $result->fetch_assoc()) {
            $messages[] = $row;
        }

        echo json_encode(["success" => true, "messages" => $messages]);
        break;

    // ✅ PUT: Update message (this part is for future use if you want to implement update functionality)
    case 'PUT':
        parse_str(file_get_contents("php://input"), $_PUT);
        // Your logic for updating message can go here
        break;

    // ✅ DELETE: Delete message (this part is for future use if you want to implement delete functionality)
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        // Your logic for deleting message can go here
        break;
}

$conn->close();
?>
