<?php

namespace Redline\Tracker\Clients;

interface ClientAdapterInterface {
    
    public function setPartner(string $name);
    public function getPartner() : string;
    
    public function setStructure(string $name);
    public function getStructure() : string;

    public function setPartnerLogo(string $name);
    public function getPartnerLogo() : string;

    public function setApiPath(string $name);
    public function getApiPath() : string;

    public function setOption(string $name, $value);
    //public function getOptions() : array;

    public function getJavascript();
    
}