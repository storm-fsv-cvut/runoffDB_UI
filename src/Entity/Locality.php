<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\LocalityRepository")
 */
class Locality extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /** @ORM\Column(type="string", length=255) */
    private string $name;

    /** @ORM\Column(type="float") */
    private float $lat;

    /** @ORM\Column(type="float") */
    private float $lng;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Organization", inversedBy="localities")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Organization $organization;

    /** @ORM\ManyToOne(targetEntity="App\Entity\WrbSoilClass") */
    private ?WrbSoilClass $wrbSoilClass;

    /** @ORM\OneToMany(targetEntity="App\Entity\Plot", mappedBy="locality") */
    private Collection $plots;

    /** @ORM\OneToMany(targetEntity="App\Entity\SoilSample", mappedBy="locality") */
    private Collection $soilSamples;

    /** @ORM\Column(type="string", length=512, nullable=true) */
    private ?string $descriptionCZ;

    /** @ORM\Column(type="string", length=512, nullable=true) */
    private ?string $descriptionEN;

    /** @ORM\OneToMany(targetEntity="App\Entity\Measurement", mappedBy="locality") */
    private Collection $measurements;

    public function __construct()
    {
        $this->organization = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
        $this->wrbSoilClass = null;
        $this->plots = new ArrayCollection();
        $this->soilSamples = new ArrayCollection();
        $this->measurements = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->getName();
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLat(): float
    {
        return $this->lat;
    }

    public function setLat(float $lat): self
    {
        $this->lat = $lat;

        return $this;
    }

    public function getLng(): float
    {
        return $this->lng;
    }

    public function setLng(float $lng): self
    {
        $this->lng = $lng;

        return $this;
    }

    public function getOrganization(): ?Organization
    {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): self
    {
        $this->organization = $organization;

        return $this;
    }

    public function getWrbSoilClass(): ?WrbSoilClass
    {
        return $this->wrbSoilClass;
    }

    public function setWrbSoilClass(?WrbSoilClass $wrbSoilClass): self
    {
        $this->wrbSoilClass = $wrbSoilClass;

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
            $plot->setLocality($this);
        }

        return $this;
    }

    public function removePlot(Plot $plot): self
    {
        if ($this->plots->contains($plot)) {
            $this->plots->removeElement($plot);
            // set the owning side to null (unless already changed)
            if ($plot->getLocality() === $this) {
                $plot->setLocality(null);
            }
        }

        return $this;
    }

    public function getSoilSamples(): Collection
    {
        return $this->soilSamples;
    }

    public function addSoilSample(SoilSample $soilSample): self
    {
        if (!$this->soilSamples->contains($soilSample)) {
            $this->soilSamples[] = $soilSample;
            $soilSample->setLocality($this);
        }

        return $this;
    }

    public function removeSoilSample(SoilSample $soilSample): self
    {
        if ($this->soilSamples->contains($soilSample)) {
            $this->soilSamples->removeElement($soilSample);
            // set the owning side to null (unless already changed)
            if ($soilSample->getLocality() === $this) {
                $soilSample->setLocality(null);
            }
        }

        return $this;
    }

    public function getLabel(): string
    {
        return $this->__toString();
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

    public function getMeasurements(): Collection
    {
        return $this->measurements;
    }

    public function addMeasurement(Measurement $measurement): self
    {
        if (!$this->measurements->contains($measurement)) {
            $this->measurements[] = $measurement;
            $measurement->setLocality($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self
    {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            // set the owning side to null (unless already changed)
            if ($measurement->getLocality() === $this) {
                $measurement->setLocality(null);
            }
        }

        return $this;
    }
}
