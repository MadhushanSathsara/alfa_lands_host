<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root"; // or your DB user
$pass = "";     // or your DB password
$db = "estate";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed."]));
}

$sql = "SELECT agent_name, agent_position, agent_address, agent_email, agent_telephone, agent_social, agent_image FROM agent";
$result = $conn->query($sql);

$agents = [];
while ($row = $result->fetch_assoc()) {
    $row['agent_social'] = json_decode($row['agent_social'], true);
    $agents[] = $row;
}

echo json_encode($agents);
$conn->close();

?>
