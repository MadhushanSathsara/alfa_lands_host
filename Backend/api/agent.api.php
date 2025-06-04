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
        $sql = "SELECT * FROM agent";
        $result = $conn->query($sql);
        $agents = [];
        while ($row = $result->fetch_assoc()) {
            $row['agent_image'] = "http://localhost/estate/Backend/api/Images/agent/" . $row['agent_image'];
            $agents[] = $row;
        }
        echo json_encode($agents);
        break;

    case 'POST':
        $id = $_POST['agent_id'] ?? null;
        $agent_name = $_POST['agent_name'] ?? '';
        $agent_email = $_POST['agent_email'] ?? '';
        $agent_username = $_POST['agent_username'] ?? '';
        $agent_password = $_POST['agent_password'] ?? '';
        $agent_position = $_POST['agent_position'] ?? '';
        $agent_team = $_POST['agent_team'] ?? '';
        $agent_image = $_POST['existing_image'] ?? 'default.jpg';

        // Handle image upload
        if (!empty($_FILES['agent_image']['name'])) {
            $image_name = basename($_FILES['agent_image']['name']);
            $target = "Images/agent/" . $image_name;
            $imageFileType = strtolower(pathinfo($image_name, PATHINFO_EXTENSION));
            $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
            if (in_array($imageFileType, $allowed_types)) {
                move_uploaded_file($_FILES['agent_image']['tmp_name'], $target);
                $agent_image = $image_name;
            } else {
                echo json_encode(["status" => false, "message" => "Invalid image type"]);
                exit;
            }
        }

        if ($id) {
            // UPDATE query
            // Use existing password if no new one provided
            if (empty($agent_password)) {
                $pwdRes = $conn->query("SELECT agent_password FROM agent WHERE agent_id = $id");
                $pwdRow = $pwdRes->fetch_assoc();
                $agent_password = $pwdRow['agent_password'];
            }
        
            $stmt = $conn->prepare("UPDATE agent SET agent_name=?, agent_email=?, agent_username=?, agent_password=?, agent_position=?, agent_team=?, agent_image=? WHERE agent_id=?");
            $stmt->bind_param("sssssssi", $agent_name, $agent_email, $agent_username, $agent_password, $agent_position, $agent_team, $agent_image, $id);
        
            echo $stmt->execute()
                ? json_encode(["status" => true, "message" => "Agent updated successfully"])
                : json_encode(["status" => false, "message" => "Update failed", "error" => $conn->error]);
        
        } else {
            // INSERT new agent WITHOUT hashing
            $stmt = $conn->prepare("INSERT INTO agent (agent_name, agent_email, agent_username, agent_password, agent_position, agent_team, agent_image) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssss", $agent_name, $agent_email, $agent_username, $agent_password, $agent_position, $agent_team, $agent_image);
        
            echo $stmt->execute()
                ? json_encode(["status" => true, "message" => "Agent added successfully"])
                : json_encode(["status" => false, "message" => "Insert failed", "error" => $conn->error]);
        }
        
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id ?? 0;
        $stmt = $conn->prepare("DELETE FROM agent WHERE agent_id=?");
        $stmt->bind_param("i", $id);
        echo $stmt->execute()
            ? json_encode(["status" => true, "message" => "Agent deleted successfully"])
            : json_encode(["status" => false, "message" => "Delete failed"]);
        break;
}

$conn->close();
?>
