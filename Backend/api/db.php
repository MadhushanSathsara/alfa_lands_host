<?php
$host = "localhost";
$user = "root";        // default username for XAMPP
$password = "";        // default password is empty
$dbname = "estate";  // replace with your DB name

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else {
    echo "done";
}
?>
