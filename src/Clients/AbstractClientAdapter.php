<?php

namespace Redline\Tracker\Clients;

abstract class AbstractClientAdapter implements ClientAdapterInterface {
    
    protected $Partner = '';
    protected $Structure = '';
    protected $Options = [];
    protected $MediaPath = __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'Media'.DIRECTORY_SEPARATOR;

    public function setPartner(string $name) {
        $this->Partner = $name;
    }
    
    public function getPartner(): string {
        return $this->Partner;
    }
    
    public function setStructure(string $name) {
        $this->Structure = $name;
    }
    
    public function getStructure(): string {
        return $this->Structure;
    }
    
    public function setOption(string $name, $value){
        $this->Options[$name] = $value;
    }
    
    protected function getOptions(): array {
        $base = [
            "%PARTNER_NAME%"    => $this->Partner,
            "%STRUCTURE_NAME%"  => $this->Structure
        ];
        $allOptions = [$base, ...$this->Options];
        return $allOptions;
    }
    
}