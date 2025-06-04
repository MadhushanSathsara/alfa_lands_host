<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "estate"); // change this

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT * FROM property";
$result = $conn->query($sql);

$properties = [];

while ($row = $result->fetch_assoc()) {
    // Append image path
    $row['property_image'] = "http://localhost/estate/Backend/api/Images/property/" . $row['property_image'];
    $properties[] = $row;
}

echo json_encode($properties);

$conn->close();
?>
