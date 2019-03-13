<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OperationTypeRepository")
 */
class OperationType
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
}
