<?php

namespace Redline\Tracker\Clients;

abstract class AbstractClientAdapter implements ClientAdapterInterface {
    
    protected $Partner = '';
    protected $Structure = '';

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
    
    protected function getOptions(): array {
        $base = [
            "%PARTNER_NAME%" =>     $this->Partner,
            "%STRUCTURE_NAME%" =>   $this->Structure
        ];
        return $base;
    }
    
}