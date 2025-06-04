<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM property";
        $result = $conn->query($sql);
        $properties = [];

        while ($row = $result->fetch_assoc()) {
            $row['property_image'] = "http://localhost/estate/backend/api/Images/property/" . $row['property_image'];
            $properties[] = $row;
        }

        echo json_encode($properties);
        break;

        

    case 'PUT':

    $data = json_decode(file_get_contents("php://input"), true);
    

    if (empty($data['property_id'])) {
        echo json_encode(["status" => false, "message" => "Property ID is required"]);
        exit;
    }


    $stmt = $conn->prepare("UPDATE property SET 
        property_name=?, 
        property_address=?, 
        property_description=?, 
        property_price=?, 
        property_state=?, 
        property_category=?
        WHERE property_id=?");
   
    $stmt->bind_param(
        "sssdssi",
        $data['property_name'],
        $data['property_address'],
        $data['property_description'],
        $data['property_price'],
        $data['property_state'],
        $data['property_category'],
        $data['property_id']
    );

    if ($stmt->execute()) {
        echo json_encode([
            "status" => true, 
            "message" => "Property updated successfully",
            "affected_rows" => $stmt->affected_rows
        ]);
    } else {
        echo json_encode([
            "status" => false, 
            "message" => "Failed to update property",
            "error" => $stmt->error
        ]);
    }
    break;

    case 'DELETE':
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->property_id)) {
        echo json_encode(["status" => false, "message" => "Missing property_id"]);
        exit;
    }

    $property_id = $data->property_id;

    
    $delete_reviews = $conn->prepare("DELETE FROM review WHERE property_id = ?");
    $delete_reviews->bind_param("i", $property_id);
    $delete_reviews->execute();
    $delete_reviews->close();

    $stmt = $conn->prepare("DELETE FROM property WHERE property_id = ?");
    $stmt->bind_param("i", $property_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => true, "message" => "Deleted successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "Delete failed: " . $stmt->error]);
    }

    $stmt->close();
    break;




}

$conn->close();
?>
