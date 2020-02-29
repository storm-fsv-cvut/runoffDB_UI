<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OperationRepository")
 */
class Operation implements DefinitionEntityInterface
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
     * @ORM\Column(type="string", length=50)
     */
    private $nameEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\OperationIntensity")
     * @ORM\JoinColumn(nullable=false)
     */
    private $operationIntensity;

    /**
     * @ORM\Column(type="float")
     */
    private $operationDepthM;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\OperationType")
     * @ORM\JoinColumn(nullable=false)
     */
    private $operationType;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionEN;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $machineryTypeCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $machineryTypeEN;

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

    public function setNameEN(string $nameEN): self
    {
        $this->nameEN = $nameEN;

        return $this;
    }

    public function getOperationIntensity(): ?OperationIntensity
    {
        return $this->operationIntensity;
    }

    public function setOperationIntensity(?OperationIntensity $operationIntensity): self
    {
        $this->operationIntensity = $operationIntensity;

        return $this;
    }

    public function getOperationDepthM(): ?float
    {
        return $this->operationDepthM;
    }

    public function setOperationDepthM(float $operationDepthM): self
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
       return $this->getNameCZ();
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

    public function setMachineryTypeCZ(string $machineryTypeCZ): self
    {
        $this->machineryTypeCZ = $machineryTypeCZ;

        return $this;
    }

    public function getMachineryTypeEN(): ?string
    {
        return $this->machineryTypeEN;
    }

    public function setMachineryTypeEN(string $machineryTypeEN): self
    {
        $this->machineryTypeEN = $machineryTypeEN;

        return $this;
    }
}
