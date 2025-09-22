<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PhenomenonRepository")
 */
class Phenomenon extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /** @ORM\Column(type="string", length=255) */
    private string $nameCZ;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $nameEN;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $descriptionCZ;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $descriptionEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Model")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Model $modelParameterSet;

    /** @ORM\Column(type="string", length=255) */
    private string $phenomenonKey;

    /** @ORM\OneToMany(targetEntity="App\Entity\Measurement", mappedBy="phenomenon") */
    private Collection $measurements;

    public function __construct()
    {
        $this->nameEN = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
        $this->modelParameterSet = null;
        $this->measurements = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->getName() ?? '#' . $this->getId();
    }

    public function getName(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getNameEN() : $this->getNameCZ();
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getId(): int
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

    public function getModelParameterSet(): ?Model
    {
        return $this->modelParameterSet;
    }

    public function setModelParameterSet(Model $modelParameterSet): self
    {
        $this->modelParameterSet = $modelParameterSet;

        return $this;
    }

    public function getPhenomenonKey(): ?string
    {
        return $this->phenomenonKey;
    }

    public function setPhenomenonKey(string $phenomenonKey): self
    {
        $this->phenomenonKey = $phenomenonKey;

        return $this;
    }

    public function getMeasurements(): Collection
    {
        return $this->measurements;
    }

    public function addMeasurement(Measurement $measurement): self
    {
        if (!$this->measurements->contains($measurement)) {
            $this->measurements[] = $measurement;
            $measurement->setPhenomenon($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self
    {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            // set the owning side to null (unless already changed)
            if ($measurement->getPhenomenon() === $this) {
                $measurement->setPhenomenon(null);
            }
        }

        return $this;
    }
}
