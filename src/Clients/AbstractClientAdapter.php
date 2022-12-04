<?php

namespace Redline\Tracker\Clients;

abstract class AbstractClientAdapter implements ClientAdapterInterface {
    
    protected string $Partner = '';
    protected string $PartnerLogo = '';
    protected string $Structure = '';
    protected array  $Options = [];
    protected string $MediaPath = __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'Media'.DIRECTORY_SEPARATOR;
    protected $ApiPath = '';

    /**
     * @param string $name
     */
    public function setPartner(string $name) {
        $this->Partner = $name;
    }

    /**
     * @return string
     */
    public function getPartner(): string {
        return $this->Partner;
    }

    /**
     * @param string $name
     */
    public function setStructure(string $name) {
        $this->Structure = $name;
    }

    /**
     * @return string
     */
    public function getStructure(): string {
        return $this->Structure;
    }

    /**
     * @return string
     */
    public function getPartnerLogo(): string
    {
        return $this->PartnerLogo;
    }

    /**
     * @param string $PartnerLogo
     */
    public function setPartnerLogo(string $PartnerLogo): void
    {
        $this->PartnerLogo = $PartnerLogo;
    }

    /**
     * @return string
     */
    public function getApiPath(): string
    {
        return $this->ApiPath;
    }

    /**
     * @param string $ApiPath
     */
    public function setApiPath(string $ApiPath): void
    {
        $this->ApiPath = $ApiPath;
    }
    
    public function setOption(string $name, $value){
        $this->Options[$name] = $value;
    }
    
    protected function getOptions(): array {
        $base = [
            "%PARTNER_NAME%"    => $this->Partner,
            "%PARTNER_LOGO%"    => $this->PartnerLogo,
            "%STRUCTURE_NAME%"  => $this->Structure,
            "%API_PATH%"        => $this->ApiPath
        ];
        $allOptions = [$base, ...$this->Options];
        return $allOptions;
    }
    
}