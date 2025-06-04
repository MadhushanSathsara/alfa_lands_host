<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $location = $_POST['location'] ?? '';
    $postal_code = $_POST['postal_code'] ?? '';
    $size = $_POST['size'] ?? '';
    $bedrooms = $_POST['bedrooms'] ?? '';
    $bathrooms = $_POST['bathrooms'] ?? '';
    $description = $_POST['description'] ?? '';
    $state = $_POST['states'] ?? '';
    $category = $_POST['category'] ?? '';

    // Upload image
    $imagePath = null;
    if (!empty($_FILES['image']['name'])) {
        $targetDir = "Images/property/";
        $filename = basename($_FILES["image"]["name"]);
        $targetFilePath = $targetDir . $filename;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
            $imagePath = $filename;
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload image."]);
            exit;
        }
    }

    $stmt = $conn->prepare("INSERT INTO property (
        property_name,
        property_image,
        property_price,
        property_address,
        property_description,
        property_state,
        property_category,
        beds,
        baths
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "ssdsssiii",
        $name,
        $imagePath,
        $price,
        $location,
        $description,
        $state,
        $category,
        $bedrooms,
        $bathrooms
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Property added successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to insert property.", "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

$conn->close();

?>
