<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Dtc\GridBundle\Annotation as Grid;

/**
 * @Grid\Grid(actions={@Grid\ShowAction(), @Grid\DeleteAction()})
 * @ORM\Entity(repositoryClass="App\Repository\OperationTypeRepository")
 */
class OperationType implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Grid\Column(label="CZ", sortable=true, searchable=true)
     * @ORM\Column(type="string", length=50)
     */
    private $nameCZ;

    /**
     * @Grid\Column(label="EN", sortable=true, searchable=true)
     * @ORM\Column(type="string", length=50)
     */
    private $nameEN;

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

    public function getLabel(): string {
        return $this->nameCZ;
    }
}
