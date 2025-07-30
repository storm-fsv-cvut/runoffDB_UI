<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class ProcessingStep extends BaseEntity implements DefinitionEntityInterface
{
    public function getMethodics(): Collection
    {
        return $this->methodics;
    }

    public function setMethodics(Collection $methodics): void
    {
        $this->methodics = $methodics;
    }

    public function getStepOrder(): int
    {
        return $this->stepOrder;
    }

    public function setStepOrder(int $stepOrder): void
    {
        $this->stepOrder = $stepOrder;
    }

    public function getNameCZ(): string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(string $nameCZ): void
    {
        $this->nameCZ = $nameCZ;
    }

    public function getNameEN(): string
    {
        return $this->nameEN;
    }

    public function setNameEN(string $nameEN): void
    {
        $this->nameEN = $nameEN;
    }

    public function getDescriptionCZ(): ?string
    {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(?string $descriptionCZ): void
    {
        $this->descriptionCZ = $descriptionCZ;
    }

    public function getDescriptionEN(): ?string
    {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(?string $descriptionEN): void
    {
        $this->descriptionEN = $descriptionEN;
    }

    public function getInstruments(): Collection
    {
        return $this->instruments;
    }

    public function setInstruments(Collection $instruments): void
    {
        $this->instruments = $instruments;
    }
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Methodics", mappedBy="processingSteps")
     */
    private Collection $methodics;

    /**
     * @ORM\Column(type="integer")
     */
    private int $stepOrder;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $nameCZ;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $nameEN;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $descriptionCZ = null;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $descriptionEN = null;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Instrument", inversedBy="processingSteps")
     */
    private Collection $instruments;

    public function __construct()
    {
    }

    public function getName(): string
    {
        return $this->getLocale() === 'en' ? $this->nameEN : $this->nameCZ;
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->descriptionEN : $this->descriptionCZ;
    }

    public function __toString(): string
    {
        return $this->getName() ?: '#' . $this->getId();
    }

    public function getId(): int
    {
        return $this->id;
    }
}
