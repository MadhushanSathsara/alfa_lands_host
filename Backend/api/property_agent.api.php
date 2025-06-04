<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Get all agents for a property
        if (!isset($_GET['property_id'])) {
            echo json_encode(["error" => "Missing property_id"]);
            break;
        }

        $property_id = intval($_GET['property_id']);
        $sql = "
            SELECT a.agent_id, a.agent_name
            FROM property_agent pa
            JOIN agent a ON pa.agent_id = a.agent_id
            WHERE pa.property_id = ?
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $property_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $agents = [];
        while ($row = $result->fetch_assoc()) {
            $agents[] = $row;
        }
        echo json_encode($agents);
        break;

    case 'POST': // Add agent to property
        $data = json_decode(file_get_contents("php://input"), true);
        $property_id = intval($data['property_id']);
        $agent_id = intval($data['agent_id']);

        $stmt = $conn->prepare("INSERT INTO property_agent (property_id, agent_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $property_id, $agent_id);
        $stmt->execute();

        echo json_encode(["success" => true]);
        break;

    case 'DELETE': // Remove agent from property
        $data = json_decode(file_get_contents("php://input"), true);
        $property_id = intval($data['property_id']);
        $agent_id = intval($data['agent_id']);

        $stmt = $conn->prepare("DELETE FROM property_agent WHERE property_id = ? AND agent_id = ?");
        $stmt->bind_param("ii", $property_id, $agent_id);
        $stmt->execute();

        echo json_encode(["success" => true]);
        break;
}
$conn->close();
?>
