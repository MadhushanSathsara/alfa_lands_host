<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Database connection failed"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        isset($data['user_name'], $data['message'], $data['agent_id'], $data['property_id'])
    ) {
        $user_name = htmlspecialchars($data['user_name']);
        $user_email = isset($data['user_email']) ? filter_var($data['user_email'], FILTER_VALIDATE_EMAIL) : null;
        $user_phone = htmlspecialchars($data['user_phone'] ?? '');
        $message = htmlspecialchars($data['message']);
        $contact_method = htmlspecialchars($data['contact_method'] ?? 'message');
        $agent_id = intval($data['agent_id']);
        $property_id = intval($data['property_id']);

        // Query to get agent's email and phone number from the 'agents' table based on agent_id
        $agent_stmt = $conn->prepare("SELECT agent_email, agent_telephone FROM agent WHERE agent_id = ?");
        $agent_stmt->bind_param("i", $agent_id);
        $agent_stmt->execute();
        $agent_result = $agent_stmt->get_result();
        
        // Check if agent is found
        if ($agent_result->num_rows > 0) {
            $agent_data = $agent_result->fetch_assoc();
            $agent_email = $agent_data['agent_email'];
            $agent_phone = $agent_data['agent_telephone'];

            // Insert the contact details into the 'agent_contacts' table
            $stmt = $conn->prepare("INSERT INTO agent_contacts (user_name, user_email, user_phone, message, contact_method, agent_id, property_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssii", $user_name, $user_email, $user_phone, $message, $contact_method, $agent_id, $property_id);

            if ($stmt->execute()) {
                echo json_encode([
                    "status" => true,
                    "message" => "Message sent successfully",
                    "agent_email" => $agent_email,
                    "agent_phone" => $agent_phone
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => false, "message" => "Failed to send message", "error" => $stmt->error]);
            }

            $stmt->close();
        } else {
            http_response_code(404);
            echo json_encode(["status" => false, "message" => "Agent not found"]);
        }

        $agent_stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(["status" => false, "message" => "Missing required fields"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
}

$conn->close();

?>
