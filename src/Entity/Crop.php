<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CropRepository")
 */
class Crop extends BaseEntity implements DefinitionEntityInterface
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
     * @ORM\ManyToOne(targetEntity="App\Entity\CropType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $cropType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\CropErType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $croperType;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $isCatchCrop;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $descriptionEN;

    public function __toString(): string {
        return $this->getName();
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

    public function getCropType(): ?CropType
    {
        return $this->cropType;
    }

    public function setCropType(?CropType $cropType): self
    {
        $this->cropType = $cropType;

        return $this;
    }

    public function getLabel(): string {
        $this->nameCZ;
    }

    public function getCroperType(): ?CropErType
    {
        return $this->croperType;
    }

    public function setCroperType(?CropErType $croperType): self
    {
        $this->croperType = $croperType;

        return $this;
    }

    public function getIsCatchCrop(): ?bool
    {
        return $this->isCatchCrop;
    }

    public function setIsCatchCrop(?bool $isCatchCrop): self
    {
        $this->isCatchCrop = $isCatchCrop;

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
}
