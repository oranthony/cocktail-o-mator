<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');


$result = new StdClass();
$result->success = false;
$result->message = 'Erreur de connexion';

if (isset($_GET['login']) && isset($_GET['password'])) {
    if($_GET['login'] == 'lol' && $_GET['password'] == 'mdr'){
        $result->success = true;
        $result->message = 'Deconnexion';
    }
}else if (isset($_GET['logout'])){
    $result->success = true;
    $result->logout = true;
}

echo json_encode($result);
