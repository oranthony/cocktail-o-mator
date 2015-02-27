<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

sleep(2);


$result = new StdClass();
$result->success = true;
$result->message = 'Bonjour et bienvenue sur ce site de qualité supérieure';

echo json_encode($result);
