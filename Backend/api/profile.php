<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['agent_id'])) {
            $agent_id = intval($_GET['agent_id']);
            $stmt = $conn->prepare("SELECT * FROM agent WHERE agent_id = ?");
            $stmt->bind_param("i", $agent_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $agent = $result->fetch_assoc();

            if ($agent) {
                $agent['agent_image'] = "http://localhost/estate/backend/api/Images/agent/" . $agent['agent_image'];
                echo json_encode(["success" => true, "agent" => $agent]);
            } else {
                echo json_encode(["success" => false, "message" => "Agent not found"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Missing agent_id"]);
        }
        break;

    case 'PUT':
        // Read JSON input
        $inputData = json_decode(file_get_contents("php://input"), true);

        if (!isset($inputData['agent_id'])) {
            echo json_encode(["success" => false, "message" => "Missing agent_id"]);
            break;
        }

        // Update the agent table
        $stmt = $conn->prepare("UPDATE agent SET 
            agent_name = ?, 
            agent_email = ?, 
            agent_telephone = ?, 
            agent_address = ?, 
            agent_position = ?, 
            agent_username = ?, 
            agent_team = ? 
            WHERE agent_id = ?");

        $stmt->bind_param(
            "sssssssi",
            $inputData['agent_name'],
            $inputData['agent_email'],
            $inputData['agent_telephone'],
            $inputData['agent_address'],
            $inputData['agent_position'],
            $inputData['agent_username'],
            $inputData['agent_team'],
            $inputData['agent_id']
        );

        // Execute the agent update
        if ($stmt->execute()) {
            // Update username in the users table based on agent_id
            $stmt2 = $conn->prepare("UPDATE users SET username = ? WHERE agent_id = ?");
            $stmt2->bind_param("si", $inputData['agent_username'], $inputData['agent_id']);
            $stmt2->execute();

            echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed", "error" => $stmt->error]);
        }

        break;
}

$conn->close();
?>
