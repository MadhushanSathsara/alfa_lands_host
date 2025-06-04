<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, PUT");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
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
        parse_str(file_get_contents("php://input"), $_PUT);
        if (!isset($_PUT['agent_id'])) {
            echo json_encode(["status" => false, "message" => "Missing agent_id"]);
            break;
        }

        $stmt = $conn->prepare("UPDATE agent SET 
            agent_name=?, 
            agent_address=?, 
            agent_position=?, 
            agent_team=?, 
            agent_email=?, 
            agent_username=?, 
            agent_telephone=? 
            WHERE agent_id=?");

        $stmt->bind_param(
            "sssssssi",
            $_PUT['agent_name'],
            $_PUT['agent_address'],
            $_PUT['agent_position'],
            $_PUT['agent_team'],
            $_PUT['agent_email'],
            $_PUT['agent_username'],
            $_PUT['agent_telephone'],
            $_PUT['agent_id']
        );

        echo $stmt->execute()
            ? json_encode(["status" => true, "message" => "Profile updated successfully"])
            : json_encode(["status" => false, "message" => "Update failed", "error" => $stmt->error]);
        break;
}

$conn->close();
?>
