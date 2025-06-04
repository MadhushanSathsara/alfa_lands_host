<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$result = $conn->query("SELECT agent_id, agent_name FROM agent");

$agents = [];
while ($row = $result->fetch_assoc()) {
    $agents[] = $row;
}

echo json_encode($agents);
$conn->close();
?>
