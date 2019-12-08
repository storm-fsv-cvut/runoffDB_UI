<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DataRepository")
 */
class Data
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="time", nullable=true)
     */
    private $time;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     */
    private $dimensionUnit;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $dimensionValue;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $value;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(?\DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getDimensionUnit(): ?Unit
    {
        return $this->dimensionUnit;
    }

    public function setDimensionUnit(?Unit $dimensionUnit): self
    {
        $this->dimensionUnit = $dimensionUnit;

        return $this;
    }

    public function getDimensionValue(): ?string
    {
        return $this->dimensionValue;
    }

    public function setDimensionValue(?string $dimensionValue): self
    {
        $this->dimensionValue = $dimensionValue;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }
}
