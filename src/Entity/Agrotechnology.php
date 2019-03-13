<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AgrotechnologyRepository")
 */
class Agrotechnology
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $descriptionEN;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $operationSequence;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $note;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescriptionCZ(): ?string
    {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(string $descriptionCZ): self
    {
        $this->descriptionCZ = $descriptionCZ;

        return $this;
    }

    public function getDescriptionEN(): ?string
    {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(string $descriptionEN): self
    {
        $this->descriptionEN = $descriptionEN;

        return $this;
    }

    public function getOperationSequence(): ?string
    {
        return $this->operationSequence;
    }

    public function setOperationSequence(?string $operationSequence): self
    {
        $this->operationSequence = $operationSequence;

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
}
