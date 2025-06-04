<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$location = $_GET['location'] ?? '';

if (!$location) {
    echo json_encode([]);
    exit;
}

$location = "%" . $conn->real_escape_string($location) . "%";
$sql = "SELECT * FROM property WHERE property_address LIKE ? OR property_name LIKE ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $location, $location);
$stmt->execute();
$result = $stmt->get_result();

$properties = [];
while ($row = $result->fetch_assoc()) {
    $row['property_image'] = "http://localhost/estate/backend/api/Images/property/" . $row['property_image'];
    $properties[] = $row;
}

echo json_encode($properties);

$stmt->close();
$conn->close();
?>
