<?php
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $file = $_FILES['addImages'];
    $fileName = $file['name'];
    $fileType = $file['type'];
    $tmpName = $file['tmp_name'];
    $fileSize = $file['size'];

    $allowed_types = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    $fileLimit = 2 * 1024 * 1024; // 2MB

    $extension = pathinfo($fileName, PATHINFO_EXTENSION);
    $newFileName = uniqid() . "." . $extension;
    $uploadPath = "Images/" . $newFileName;

    if (!in_array($fileType, $allowed_types)) {
        echo json_encode(["status" => "error", "message" => "File type not allowed"]);
        exit();
    }

    if ($fileSize > $fileLimit) {
        echo json_encode(["status" => "error", "message" => "File size exceeded"]);
        exit();
    }

    if (move_uploaded_file($tmpName, $uploadPath)) {
        // Optional: Save image path into database here
        echo json_encode(["status" => "success", "file" => $newFileName]);
    } else {
        echo json_encode(["status" => "error", "message" => "Upload failed"]);
    }
}
?>
