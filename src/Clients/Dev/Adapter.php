<?php

namespace Redline\Tracker\Clients\Dev;

use Redline\Tracker\Clients\AbstractClientAdapter;

class Adapter extends AbstractClientAdapter {
    
    protected $ClientFile = '';
    
    public function getJavascript() {
        $javascript = '/*Development Widget Redline Tracker*/'."\n\n";
        $to_replace = $this->getOptions();
    
        $javascript = str_replace(array_keys($to_replace), array_values($to_replace), $javascript);
        return $javascript;
    }
    
}