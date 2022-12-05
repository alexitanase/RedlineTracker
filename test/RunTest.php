<?php

include "../vendor/autoload.php";

use Redline\Tracker\Factory as TrackerFactory;

$Factory = new TrackerFactory();
header('Content-Type: application/javascript');
$Adapter = $Factory->getInstance('Dev');
if($Adapter!==null){
    $Adapter->setPartner('redline-demo');
    $Adapter->setStructure('demo');
    $Adapter->setApiPath('http://localhost/');
    $Adapter->setWSServer('//localhost:8095/');
    echo $Adapter->getJavascript();
}else return '/* FILE NOT FOUND */';