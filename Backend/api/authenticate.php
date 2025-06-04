<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['username'], $input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$username = $input['username'];
$password = $input['password'];

$conn = new mysqli("localhost", "root", "", "estate");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && $user['password'] === $password) {
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'role' => $user['role'],
        'agent_id' => $user['agent_id'] ?? null, // Ensure agent_id is returned
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password.'
    ]);
}

$conn->close();
?>
