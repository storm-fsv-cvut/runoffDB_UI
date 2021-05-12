<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UnitRepository")
 */
class Unit extends BaseEntity implements DefinitionEntityInterface
{
    public const DEFAULT_DECIMALS = 2;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="integer")
     */
    private int $decimals;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $nameCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $nameEN;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $unit;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $descriptionEN;

    public function __construct() {
        $this->nameCZ = null;
        $this->nameEN = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
    }

    public function __toString() {
        return $this->getName()." [".$this->getUnit()."]";
    }

    public function getName():?string {
        return $this->getLocale() == 'en' ? $this->getNameEN() : $this->getNameCZ();
    }

    public function getDescription():?string {
        return $this->getLocale() == 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNameCZ(): ?string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(?string $nameCZ): self
    {
        $this->nameCZ = $nameCZ;

        return $this;
    }

    public function getNameEN(): ?string
    {
        return $this->nameEN;
    }

    public function setNameEN(?string $nameEN): self
    {
        $this->nameEN = $nameEN;

        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(string $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function getDescriptionCZ(): ?string
    {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(?string $descriptionCZ): self
    {
        $this->descriptionCZ = $descriptionCZ;

        return $this;
    }

    public function getDescriptionEN(): ?string
    {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(?string $descriptionEN): self
    {
        $this->descriptionEN = $descriptionEN;

        return $this;
    }

    /**
     * @return int
     */
    public function getDecimals():int {
        return $this->decimals;
    }

    /**
     * @param int $decimals
     */
    public function setDecimals(int $decimals): void {
        $this->decimals = $decimals;
    }
}
