<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (!isset($_GET['agent_id'])) {
            echo json_encode(["error" => "Missing agent_id"]);
            break;
        }

        $agent_id = intval($_GET['agent_id']);

        $sql = "
            SELECT p.*
            FROM property_agent pa
            INNER JOIN property p ON pa.property_id = p.property_id
            WHERE pa.agent_id = ?
        ";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $agent_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $properties = [];
        while ($row = $result->fetch_assoc()) {
            $row['property_image'] = "http://localhost/estate/backend/api/Images/property/" . $row['property_image'];
            $properties[] = $row;
        }

        echo json_encode($properties);
        break;

    default:
        echo json_encode(["error" => "Unsupported request method"]);
}

$conn->close();
?>
