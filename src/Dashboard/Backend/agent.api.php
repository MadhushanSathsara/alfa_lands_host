<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

include_once 'db.php';

$response = ["status" => false, "message" => "Invalid request"];

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents("php://input"), true);

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $id = intval($_GET['id']);
                $stmt = $pdo->prepare("SELECT * FROM agent WHERE id = ?");
                $stmt->execute([$id]);
                $response = $stmt->fetch(PDO::FETCH_ASSOC);
        
                if ($response) {
                    $response['image'] = $response['image'] ? 'http://localhost/AdminDashboard/Dashboard/Backend/uploads/agents/' . $response['image'] : null; // Full path
                }
            } else {
                $stmt = $pdo->query("SELECT * FROM agent");
                $agents = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
                foreach ($agents as $agent) {
                    $agent['image'] = $agent['image'] ? 'http://localhost/AdminDashboard/Dashboard/Backend/uploads/agents/' . $agent['image'] : null; // Full path
                }
                $response = $agents;
            }
            break;
    

case 'POST':


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $phone_number = $_POST['phone_number'];
    $address = $_POST['address'];
    $location = $_POST['location'];
    $postal_code = $_POST['postal_code'];
    $date_joined = $_POST['date_joined'];
    $team = $_POST['team'];
    $position = $_POST['position'];
    $username = $_POST['username'];
    $password = $_POST['password'];

 
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $image = $_FILES['image'];
        $image_name = $image['name'];
        $image_tmp_name = $image['tmp_name'];
        $image_size = $image['size'];


        $upload_dir = 'uploads/';
        $image_path = $upload_dir . basename($image_name);
        
        if (move_uploaded_file($image_tmp_name, $image_path)) {
            echo "Image uploaded successfully!";
        } else {
            echo "Error uploading image.";
        }
    }

   
    $dsn = 'mysql:host=localhost;dbname=alfa';
    $username_db = 'root'; 
    $password_db = null; 

    try {
        $conn = new PDO($dsn, $username_db, $password_db);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        
        $sql = "INSERT INTO agent (first_name, last_name, email, phone_number, address, location, postal_code, date_joined, team, position, username, password, image) 
                VALUES (:first_name, :last_name, :email, :phone_number, :address, :location, :postal_code, :date_joined, :team, :position, :username, :password, :image)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone_number', $phone_number);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':postal_code', $postal_code);
        $stmt->bindParam(':date_joined', $date_joined);
        $stmt->bindParam(':team', $team);
        $stmt->bindParam(':position', $position);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':image', $image_path); 
        $stmt->execute();
        
        echo json_encode(["message" => "Agent added successfully!"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => "Error: " . $e->getMessage()]);
    }
}


    break;



    case 'PUT':
        if (isset($input['id'])) {
            $stmt = $pdo->prepare("UPDATE agent SET first_name = ?, last_name = ?, phone_number = ?, address = ?, location = ?, postal_code = ?, date_joined = ?, position = ?, team = ?, username = ?, password = ?, email = ? WHERE id = ?");

            $isUpdated = $stmt->execute([
                $input['first_name'], 
                $input['last_name'], 
                $input['phone_number'], 
                $input['address'], 
                $input['location'],
                $input['postal_code'], 
                $input['date_joined'], 
                $input['position'],
                $input['team'],
                $input['username'],
                $input['password'], PASSWORD_DEFAULT, 
                $input['email'],
                $input['id']
            ]);

            if ($isUpdated) {
                $response = ["status" => true, "message" => "Agent updated successfully"];
            } else {
                $response = ["status" => false, "message" => "Failed to update agent"];
                error_log("Database Update Error: " . implode(", ", $stmt->errorInfo()));
            }
        }
        break;  
        
        case 'DELETE':
            if (isset($input['id'])) {
                $stmt = $pdo->prepare("DELETE FROM agent WHERE id = ?");
                $isDeleted = $stmt->execute([$input['id']]);
                $response = $isDeleted ? ["status" => true, "message" => "Agent deleted successfully"] : ["status" => false, "message" => "Failed to delete agent"];
            }
            break;

        default:
            $response = ["status" => false, "message" => "Request method not supported"];
            break;
    }
} catch (Exception $e) {
    $response = ["status" => false, "message" => "Error: " . $e->getMessage()];
    error_log("API Error: " . $e->getMessage());
}

echo json_encode($response);
?>
