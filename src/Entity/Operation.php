<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OperationRepository")
 */
class Operation extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private string $nameCZ;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private string $nameEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\OperationIntensity")
     * @ORM\JoinColumn(nullable=false)
     */
    private OperationIntensity $operationIntensity;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private ?float $operationDepthM;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\OperationType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?OperationType $operationType;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $descriptionEN;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $machineryTypeCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $machineryTypeEN;

    public function __construct() {
        $this->operationType = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
        $this->machineryTypeCZ = null;
        $this->machineryTypeEN = null;
    }

    public function __toString(): string {
        return $this->getName()!==null ? $this->getName() : "#".$this->getId();
    }

    public function getName():?string {
        return $this->getLocale() == 'en' ? $this->getNameEN() : $this->getNameCZ();
    }

    public function getDescription():?string {
        return $this->getLocale() == 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getMachineryType(): ?string {
        return $this->getLocale() == 'en' ? $this->getMachineryTypeCZ() : $this->getMachineryTypeEN();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getNameCZ(): string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(string $nameCZ): self
    {
        $this->nameCZ = $nameCZ;

        return $this;
    }

    public function getNameEN(): string
    {
        return $this->nameEN;
    }

    public function setNameEN(string $nameEN): self
    {
        $this->nameEN = $nameEN;

        return $this;
    }

    public function getOperationIntensity(): OperationIntensity
    {
        return $this->operationIntensity;
    }

    public function setOperationIntensity(OperationIntensity $operationIntensity): self
    {
        $this->operationIntensity = $operationIntensity;

        return $this;
    }

    public function getOperationDepthM(): ?float
    {
        return $this->operationDepthM;
    }

    public function setOperationDepthM(?float $operationDepthM): self
    {
        $this->operationDepthM = $operationDepthM;

        return $this;
    }

    public function getOperationType(): ?OperationType
    {
        return $this->operationType;
    }

    public function setOperationType(?OperationType $operationType): self
    {
        $this->operationType = $operationType;

        return $this;
    }

    public function getLabel(): string {
        return $this->getName()!==null ? $this->getName() : "#".$this->getId();
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

    public function getMachineryTypeCZ(): ?string
    {
        return $this->machineryTypeCZ;
    }

    public function setMachineryTypeCZ(?string $machineryTypeCZ): self
    {
        $this->machineryTypeCZ = $machineryTypeCZ;

        return $this;
    }

    public function getMachineryTypeEN(): ?string
    {
        return $this->machineryTypeEN;
    }

    public function setMachineryTypeEN(?string $machineryTypeEN): self
    {
        $this->machineryTypeEN = $machineryTypeEN;

        return $this;
    }
}
