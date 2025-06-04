<?php

$host = 'localhost';
$dbname = 'alfa';
$username = 'root'; 
$password = null; 

try {
   
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database: " . $e->getMessage());
}


$hashedPasswordAdmin = password_hash('2002', PASSWORD_DEFAULT);



$sql = "INSERT INTO `users` (username, password, role) VALUES (:username, :password, :role)";
$stmt = $pdo->prepare($sql);


$stmt->bindParam(':username', 'admin');
$stmt->bindParam(':password', $hashedPassword);
$stmt->bindParam(':role', 'admin');

if ($stmt->execute()) {
    echo "Admin user added successfully!";
} else {
    echo "Error: Unable to add admin user.";
}
?>
