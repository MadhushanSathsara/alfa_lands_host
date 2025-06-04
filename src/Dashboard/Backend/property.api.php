<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'db.php';

$response = ["status" => false, "message" => "Invalid request"];

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents("php://input"), true);

    switch ($method) {
        case 'GET': 
            if (isset($_GET['id'])) {

                $id = intval($_GET['id']);
                $stmt = $pdo->prepare("SELECT * FROM properties WHERE id = ?");
                $stmt->execute([$id]);
                $response = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($response) {
                    $response['image'] = $response['image'] ? 'http://localhost/estate/Backend/api/property/' . $response['image'] : null;
                }
            } else {
                // Fetch all properties
                $stmt = $pdo->query("SELECT * FROM properties");
                $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($properties as &$property) {
                    $property['image'] = $property['image'] ? 'http://localhost/estate/Backend/api/property' . $property['image'] : null;
                }
                $response = $properties;
            }
            break;

        // case 'POST':
        //     // Adding a new property with image upload
        //     if (isset($_FILES['image'])) {
        //         $name = $_POST['name'];
        //         $price = $_POST['price'];
        //         $location = $_POST['location'];
        //         $postal_code = $_POST['postal_code'];
        //         $size = $_POST['size'];
        //         $bedrooms = $_POST['bedrooms'];
        //         $bathrooms = $_POST['bathrooms'];
        //         $description = $_POST['description'];
        //         $category = $_POST['category'];
        //         $states = $_POST['states'];

        //         $image = $_FILES['image'];
        //         $uploadDir = 'uploads/';
        //         $imageExtension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
        //         $imageName = uniqid('', true) . "." . $imageExtension;
        //         $imagePath = $uploadDir . $imageName;

        //         if (move_uploaded_file($image['tmp_name'], $imagePath)) {
        //             $stmt = $pdo->prepare(
        //                 "INSERT INTO properties (name, price, location, postal_code, size, bedrooms, bathrooms, description, category, states, image) 
        //                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        //             );
                    
        //             $stmt->execute([$name, $price, $location, $postal_code, $size, $bedrooms, $bathrooms, $description, $category, $states, $imagePath]);
        //             $response = ["status" => true, "message" => "Property added successfully"];
        //         } else {
        //             $response = ["status" => false, "message" => "Image upload failed"];
        //         }
        //     } else {
        //         $response = ["status" => false, "message" => "No image provided"];
        //     }
        //     break;


        case 'POST':
        
            if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
                
                $name = $_POST['name'] ?? '';
                $price = $_POST['price'] ?? 0;
                $location = $_POST['location'] ?? '';
                $postal_code = $_POST['postal_code'] ?? '';
                $size = $_POST['size'] ?? 0;
                $bedrooms = $_POST['bedrooms'] ?? 0;
                $bathrooms = $_POST['bathrooms'] ?? 0;
                $description = $_POST['description'] ?? '';
                $category = $_POST['category'] ?? '';
                $states = $_POST['states'] ?? '';
        
        
                $image = $_FILES['image'];
                $uploadDir = 'uploads/';
                $imageExtension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
        
            
                $allowedExtensions = ['jpg', 'jpeg', 'png'];
                if (!in_array($imageExtension, $allowedExtensions)) {
                    $response = ["status" => false, "message" => "Invalid image format. Only JPG, JPEG, PNG are allowed."];
                    break;
                }
        
        
                $imageName = uniqid('', true) . '.' . $imageExtension;
                $imagePath = $uploadDir . $imageName;
        
                if (move_uploaded_file($image['tmp_name'], $imagePath)) {

                    try {
                        $pdo = new PDO('mysql:host=localhost;dbname=alfa', 'root', null );
                        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
                    
                        $sql = "INSERT INTO properties 
                                (name, price, location, postal_code, size, bedrooms, bathrooms, description, category, states, image) 
                                VALUES 
                                (:name, :price, :location, :postal_code, :size, :bedrooms, :bathrooms, :description, :category, :states, :image)";
                        
                        $stmt = $pdo->prepare($sql);
                        $stmt->bindParam(':name', $name);
                        $stmt->bindParam(':price', $price);
                        $stmt->bindParam(':location', $location);
                        $stmt->bindParam(':postal_code', $postal_code);
                        $stmt->bindParam(':size', $size);
                        $stmt->bindParam(':bedrooms', $bedrooms);
                        $stmt->bindParam(':bathrooms', $bathrooms);
                        $stmt->bindParam(':description', $description);
                        $stmt->bindParam(':category', $category);
                        $stmt->bindParam(':states', $states);
                        $stmt->bindParam(':image', $imagePath);
        
        
                        $stmt->execute();
        
                    
                        $response = ["status" => true, "message" => "Property added successfully"];
        
                    } catch (PDOException $e) {
                        
                        $response = ["status" => false, "message" => "Error: " . $e->getMessage()];
                    }
                } else {
                    
                    $response = ["status" => false, "message" => "Image upload failed"];
                }
            } else {
    
                $response = ["status" => false, "message" => "No image provided or image upload error"];
            }
            break;
        

        case 'PUT': 

            if (isset($input['id'])) {
                $stmt = $pdo->prepare(
                    "UPDATE properties SET name = ?, price = ?, location = ?, postal_code = ?, size = ?, bedrooms = ?, bathrooms = ?, description = ?, category = ?, states = ? 
                    WHERE id = ?"
                );
                $isUpdated = $stmt->execute([
                    $input['name'], $input['price'], $input['location'], $input['postal_code'], 
                    $input['size'], $input['bedrooms'], $input['bathrooms'], $input['description'], 
                    $input['category'], $input['states'], $input['id']
                ]);

                $response = $isUpdated ? ["status" => true, "message" => "Property updated successfully"] : ["status" => false, "message" => "Failed to update property"];
            }
            break;

        case 'DELETE':

            if (isset($_GET['id'])) {
                $id = intval($_GET['id']);
                $stmt = $pdo->prepare("DELETE FROM properties WHERE id = ?");
                $isDeleted = $stmt->execute([$id]);

                $response = $isDeleted 
                ? ["status" => true, "message" => "Property deleted successfully"] 
                : ["status" => false, "message" => "Failed to delete property"]; }
            break;

        default:
            $response = ["status" => false, "message" => "Invalid request method"];
            break;
    }
} catch (Exception $e) {
    $response = ["status" => false, "message" => "Error: " . $e->getMessage()];
}

echo json_encode($response);
?>
