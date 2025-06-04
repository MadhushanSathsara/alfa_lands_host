<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "estate");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['property_id']) || !is_numeric($_GET['property_id'])) {
        http_response_code(400);
        echo json_encode(["message" => "property_id required"]);
        exit();
    }

    $id = (int)$_GET['property_id'];
    $stmt = $conn->prepare("SELECT image_name FROM property_images WHERE property_id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();

    $images = [];
    while ($row = $res->fetch_assoc()) {
        $images[] = $row['image_name']; // only filename
    }

    echo json_encode(["success" => true, "additional_images" => $images]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['property_id']) || !is_numeric($_POST['property_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'property_id required']);
        exit();
    }

    if (!isset($_FILES['images'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No images uploaded']);
        exit();
    }

    $property_id = (int)$_POST['property_id'];
    $uploadDir = __DIR__ . "/Images/property/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $uploaded = [];
    $files = $_FILES['images'];

    for ($i = 0; $i < count($files['name']); $i++) {
        $tmp = $files['tmp_name'][$i];
        $original = basename($files['name'][$i]);
        $ext = pathinfo($original, PATHINFO_EXTENSION);
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array(strtolower($ext), $allowed)) continue;

        $newName = uniqid() . '.' . $ext;
        $target = $uploadDir . $newName;

        if (move_uploaded_file($tmp, $target)) {
            $stmt = $conn->prepare("INSERT INTO property_images (property_id, image_name) VALUES (?, ?)");
            $stmt->bind_param("is", $property_id, $newName);
            $stmt->execute();
            $uploaded[] = $newName;
        }
    }

    echo json_encode([
        "success" => count($uploaded) > 0,
        "uploadedImages" => $uploaded
    ]);
    exit();
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['filename']) || !isset($data['property_id'])) {
        echo json_encode(["success" => false, "message" => "Missing filename or property_id"]);
        exit;
    }

    $filename = basename($data['filename']);
    $property_id = (int)$data['property_id'];
    $filePath = __DIR__ . "/Images/property/" . $filename;

    // Remove from database
    $stmt = $conn->prepare("DELETE FROM property_images WHERE property_id = ? AND image_name = ?");
    $stmt->bind_param("is", $property_id, $filename);
    $stmt->execute();
    $stmt->close();

    // Remove from filesystem
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    echo json_encode(["success" => true, "message" => "Image deleted"]);
    exit;
}

?>
