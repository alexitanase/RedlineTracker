<?php

namespace Redline\Tracker\Clients\Dev;

use Redline\Tracker\Clients\AbstractClientAdapter;

class Adapter extends AbstractClientAdapter {
    
    protected $ClientFile = 'Tracker.js';
    
    public function getJavascript() {
        $javascript = '';
        
        if(file_exists($this->MediaPath.$this->ClientFile)){
            $javascript .= file_get_contents($this->MediaPath.$this->ClientFile);
        }else{
            $javascript .= '// File not found';
        }
        
        $to_replace = $this->getOptions();
        $to_replace = $to_replace[0];
    
        $javascript = str_replace(array_keys($to_replace), array_values($to_replace), $javascript);
        return $javascript;
    }
    
}