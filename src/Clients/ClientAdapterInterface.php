<?php

namespace Redline\Tracker\Clients;

interface ClientAdapterInterface {
    
    public function setPartner(string $name);
    public function getPartner() : string;
    
    public function setStructure(string $name);
    public function getStructure() : string;
    
    public function getJavascript();
    
}