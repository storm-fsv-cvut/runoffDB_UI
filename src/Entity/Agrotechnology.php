<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Dtc\GridBundle\Annotation as Grid;

/**
 * @Grid\Grid(actions={@Grid\EditAction(), @Grid\DeleteAction()})
 * @ORM\Entity(repositoryClass="App\Repository\AgrotechnologyRepository")
 */
class Agrotechnology implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $nameCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $nameEN;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $descriptionEN;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $note;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $managTyp;

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

    public function getLabel(): string {
        return $this->descriptionCZ;
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

    public function getManagTyp(): ?string
    {
        return $this->managTyp;
    }

    public function setManagTyp(?string $managTyp): self
    {
        $this->managTyp = $managTyp;

        return $this;
    }
}
