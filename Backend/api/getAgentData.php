<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

if (!isset($_GET['agent_id'])) {
    echo json_encode(["error" => "Missing agent_id"]);
    exit;
}

$agent_id = intval($_GET['agent_id']);

$conn = new mysqli("localhost", "root", "", "estate");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare("SELECT agent_id, username FROM users WHERE agent_id = ?");
$stmt->bind_param("i", $agent_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $agent = $result->fetch_assoc();
    echo json_encode([
        "agent_id" => $agent["agent_id"],
        "username" => $agent["username"]
    ]);
} else {
    echo json_encode(["error" => "Agent not found"]);
}

$conn->close();
?>
