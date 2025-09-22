<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProtectionMeasureRepository")
 */
class ProtectionMeasure extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $nameCZ;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $nameEN;

    /** @ORM\Column(type="text", nullable=true) */
    private ?string $descriptionCZ;

    /** @ORM\Column(type="text", nullable=true) */
    private ?string $descriptionEN;

    /** @ORM\ManyToMany(targetEntity="App\Entity\Plot", mappedBy="protectionMeasures") */
    private Collection $plots;

    public function __construct()
    {
        $this->nameCZ = null;
        $this->nameEN = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
    }

    public function __toString(): string
    {
        return $this->getName() ?? '#' . $this->getId();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getNameEN() : $this->getNameCZ();
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
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

    public function getPlots(): Collection
    {
        return $this->plots;
    }

    public function addPlot(Plot $plot): self
    {
        if (!$this->plots->contains($plot)) {
            $this->plots[] = $plot;
            $plot->addProtectionMeasure($this);
        }

        return $this;
    }

    public function removePlot(Plot $plot): self
    {
        if ($this->plots->contains($plot)) {
            $this->plots->removeElement($plot);
            $plot->removeProtectionMeasure($this);
        }

        return $this;
    }
}
