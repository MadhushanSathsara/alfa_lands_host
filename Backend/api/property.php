<?php

header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "estate";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (isset($_GET['property_id'])) {
    $property_id = $conn->real_escape_string($_GET['property_id']);


    $propertyQuery = "
        SELECT *
        FROM property
        WHERE property_id = $property_id
    ";
    $result = $conn->query($propertyQuery);

    if ($result->num_rows > 0) {
        $property = $result->fetch_assoc();

   
        $imagesQuery = "SELECT image_name FROM property_images WHERE property_id = $property_id";
        $imagesResult = $conn->query($imagesQuery);

        $additional_images = [];
        if ($imagesResult->num_rows > 0) {
            while ($row = $imagesResult->fetch_assoc()) {
                $additional_images[] = $row['image_name'];
            }
        }

     
        $agentsQuery = "
            SELECT a.agent_id, a.agent_name, a.agent_position, a.agent_telephone, a.agent_email, a.agent_address, agent_image
            FROM agent a
            JOIN property_agent pa ON a.agent_id = pa.agent_id
            WHERE pa.property_id = $property_id
        ";
        $agentsResult = $conn->query($agentsQuery);
        $agents = [];
        if ($agentsResult->num_rows > 0) {
            while ($agent = $agentsResult->fetch_assoc()) {
                $agents[] = $agent;
            }
        }

       
        $property['additional_images'] = $additional_images;
        $property['agents'] = $agents;

        echo json_encode($property);
    } else {
        echo json_encode(["message" => "Property not found"]);
    }
} else {
    echo json_encode(["message" => "No property ID provided"]);
}

$conn->close();
?>
