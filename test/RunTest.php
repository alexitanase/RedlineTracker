<?php

include "../vendor/autoload.php";

use Redline\Tracker\Factory as TrackerFactory;

$Factory = new TrackerFactory();
header('Content-Type: application/javascript');
$Adapter = $Factory->getInstance('Dev');
if($Adapter!==null){
    $Adapter->setPartner('redline-demo');
    $Adapter->setStructure('demo');
    echo $Adapter->getJavascript();
}else return '/* FILE NOT FOUND */';