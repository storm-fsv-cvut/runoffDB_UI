<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OperationRepository")
 */
class Operation
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
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $note;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\OperationType")
     * @ORM\JoinColumn(nullable=false)
     */
    private $operationType;

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

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): self
    {
        $this->note = $note;

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
}
