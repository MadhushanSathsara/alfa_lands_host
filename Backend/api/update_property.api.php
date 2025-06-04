<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Set content type to JSON
header("Content-Type: application/json");

// Include DB connection
include 'db.php'; // Adjust path if needed

// Get the raw POST/PUT data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (
    isset($data->property_id) &&
    isset($data->property_name) &&
    isset($data->property_address) &&
    isset($data->property_description) &&
    isset($data->property_price)
) {
    // Sanitize and prepare data
    $id = $data->property_id;
    $name = $data->property_name;
    $address = $data->property_address;
    $description = $data->property_description;
    $price = $data->property_price;

    // Update SQL query
    $query = "UPDATE property SET 
                property_name = ?, 
                property_address = ?, 
                property_description = ?, 
                property_price = ?
              WHERE property_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssdi", $name, $address, $description, $price, $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Property updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update property."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
}
