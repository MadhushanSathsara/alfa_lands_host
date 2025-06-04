<?php
$server="localhost";
$username="root";
$password="";

$connection = mysqli_connect($server,$username,$password);

if (!$connection){
    die("Connection failed:" .mysqli_connect_error());
}
echo "Database created successfully";

$connection->close();




?>



