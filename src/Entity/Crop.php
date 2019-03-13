<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CropRepository")
 */
class Crop
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $nameCZ;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $nameEN;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $variety;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $note;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\CropType")
     */
    private $cropType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNameCZ(): ?string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(string $nameCZ): self
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

    public function getVariety(): ?string
    {
        return $this->variety;
    }

    public function setVariety(?string $variety): self
    {
        $this->variety = $variety;

        return $this;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): self
    {
        $this->note = $note;

        return $this;
    }

    public function getCropType(): ?CropType
    {
        return $this->cropType;
    }

    public function setCropType(?CropType $cropType): self
    {
        $this->cropType = $cropType;

        return $this;
    }
}
