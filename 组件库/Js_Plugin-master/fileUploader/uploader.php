<?php
var_dump($_FILES,$_POST);
foreach ($_POST as $key => $value) {
    $img = $_POST[$key];
    $img = str_replace('data:image/jpeg;base64,', '', $value);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = uniqid() . '.jpeg';
    $success = file_put_contents($file, $data);
}
print $success ? $file : 'Unable to save the file.';
?>