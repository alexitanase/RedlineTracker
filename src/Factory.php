<?php

namespace Redline\Tracker;

use Redline\Tracker\Enum\ListErrors;

class Factory
{
    public static function getInstance(string $client) {
        $namespace = sprintf('Redline\\Tracker\\Clients\\%s', ucfirst($client));
        
        $complete_class = sprintf("%s\\Adapter", $namespace);
        
        if(class_exists($complete_class)){
            return new $complete_class();
        }else{
            return ListErrors::INVALID_CLIENT;
        }
        
    }
}