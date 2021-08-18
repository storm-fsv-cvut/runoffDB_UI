<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlotRepository")
 */
class Plot extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=128)
     */
    private string $name;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Locality", inversedBy="plots")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="CASCADE")
     */
    private ?Locality $locality;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Locality")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Locality $soilOriginLocality;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Crop")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Crop $crop;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Agrotechnology")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Agrotechnology $agrotechnology;

    /**
     * @ORM\Column(type="date")
     */
    private \DateTimeInterface $established;

    /**
     * @ORM\Column(type="float")
     */
    private float $plotWidth;

    /**
     * @ORM\Column(type="float")
     */
    private float $plotLength;

    /**
     * @ORM\Column(type="float")
     */
    private float $plotSlope;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SoilSample", mappedBy="plot")
     */
    private Collection $soilSamples;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $noteCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $noteEN;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Measurement", mappedBy="plot")
     */
    private Collection $measurements;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\ProtectionMeasure")
     */
    private ?ProtectionMeasure $protectionMeasure;

    public function __construct() {
        $this->noteCZ = null;
        $this->noteEN = null;
        $this->locality = null;
        $this->soilOriginLocality = null;
        $this->crop = null;
        $this->agrotechnology = null;
        $this->soilSamples = new ArrayCollection();
        $this->measurements = new ArrayCollection();
    }


    public function __toString() {
            if ($this->getLocale() == 'en' ) {
                return $this->getName() . ' - ' . $this->getCrop()->getName() . ", est. " . $this->getEstablished()->format('Y-m-d')." (#".$this->getId().")";
            } else {
                return $this->getName() . ' - ' . $this->getCrop()->getName() . ", zal. " . $this->getEstablished()->format('d.m.Y')." (#".$this->getId().")";
            }
    }

    public function getNote():?string {
        return $this->getLocale() == 'en' ? $this->getNoteEN() : $this->getNoteCZ();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLocality(): ?Locality
    {
        return $this->locality;
    }

    public function setLocality(?Locality $locality): self
    {
        $this->locality = $locality;

        return $this;
    }

    public function getCrop(): ?Crop
    {
        return $this->crop;
    }

    public function setCrop(?Crop $crop): self
    {
        $this->crop = $crop;

        return $this;
    }

    public function getAgrotechnology(): ?Agrotechnology
    {
        return $this->agrotechnology;
    }

    public function setAgrotechnology(?Agrotechnology $agrotechnology): self
    {
        $this->agrotechnology = $agrotechnology;

        return $this;
    }

    public function getEstablished(): \DateTimeInterface
    {
        return $this->established;
    }

    public function setEstablished(\DateTimeInterface $established): self
    {
        $this->established = $established;

        return $this;
    }

    public function getPlotWidth(): float
    {
        return $this->plotWidth;
    }

    public function setPlotWidth(float $plotWidth): self
    {
        $this->plotWidth = $plotWidth;

        return $this;
    }

    public function getPlotLength(): float
    {
        return $this->plotLength;
    }

    public function setPlotLength(float $plotLength): self
    {
        $this->plotLength = $plotLength;

        return $this;
    }

    public function getPlotSlope():?float
    {
        return $this->plotSlope;
    }

    public function setPlotSlope(float $plotSlope): self
    {
        $this->plotSlope = $plotSlope;

        return $this;
    }

    /**
     * @return Collection|SoilSample[]
     */
    public function getSoilSamples(): Collection
    {
        return $this->soilSamples;
    }

    public function addSoilSample(SoilSample $soilSample): self
    {
        if (!$this->soilSamples->contains($soilSample)) {
            $this->soilSamples[] = $soilSample;
            $soilSample->setPlot($this);
        }

        return $this;
    }

    public function removeSoilSample(SoilSample $soilSample): self
    {
        if ($this->soilSamples->contains($soilSample)) {
            $this->soilSamples->removeElement($soilSample);
            // set the owning side to null (unless already changed)
            if ($soilSample->getPlot() === $this) {
                $soilSample->setPlot(null);
            }
        }

        return $this;
    }

    public function getLabel(): string {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getSoilOriginLocality() {
        return $this->soilOriginLocality;
    }

    /**
     * @param mixed $soilOriginLocality
     */
    public function setSoilOriginLocality($soilOriginLocality): void {
        $this->soilOriginLocality = $soilOriginLocality;
    }

    public function getNoteCZ(): ?string
    {
        return $this->noteCZ;
    }

    public function setNoteCZ(?string $noteCZ): self
    {
        $this->noteCZ = $noteCZ;

        return $this;
    }

    public function getNoteEN(): ?string
    {
        return $this->noteEN;
    }

    public function setNoteEN(?string $noteEN): self
    {
        $this->noteEN = $noteEN;

        return $this;
    }

    /**
     * @return Collection|Measurement[]
     */
    public function getMeasurements(): Collection
    {
        return $this->measurements;
    }

    public function addMeasurement(Measurement $measurement): self
    {
        if (!$this->measurements->contains($measurement)) {
            $this->measurements[] = $measurement;
            $measurement->setPlot($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self
    {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            // set the owning side to null (unless already changed)
            if ($measurement->getPlot() === $this) {
                $measurement->setPlot(null);
            }
        }

        return $this;
    }

    public function getProtectionMeasure(): ?ProtectionMeasure
    {
        return $this->protectionMeasure;
    }

    public function setProtectionMeasure(?ProtectionMeasure $protectionMeasure): self
    {
        $this->protectionMeasure = $protectionMeasure;

        return $this;
    }

    public function getXmlDomElement(\DOMDocument $dom)
    {
        $plot = $dom->createElement('plot', (string) $this);
        return $plot;
    }
}
