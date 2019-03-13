<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlotRepository")
 */
class Plot
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=128)
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Locality", inversedBy="plots")
     */
    private $locality;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Crop")
     * @ORM\JoinColumn(nullable=false)
     */
    private $crop;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Agrotechnology")
     */
    private $agrotechnology;

    /**
     * @ORM\Column(type="date")
     */
    private $established;

    /**
     * @ORM\Column(type="float")
     */
    private $plotWidth;

    /**
     * @ORM\Column(type="float")
     */
    private $plotLength;

    /**
     * @ORM\Column(type="float")
     */
    private $plotSlope;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $note;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SoilSample", mappedBy="plot")
     */
    private $soilSamples;

    public function __construct()
    {
        $this->soilSamples = new ArrayCollection();
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

    public function getEstablished(): ?\DateTimeInterface
    {
        return $this->established;
    }

    public function setEstablished(\DateTimeInterface $established): self
    {
        $this->established = $established;

        return $this;
    }

    public function getPlotWidth(): ?float
    {
        return $this->plotWidth;
    }

    public function setPlotWidth(float $plotWidth): self
    {
        $this->plotWidth = $plotWidth;

        return $this;
    }

    public function getPlotLength(): ?float
    {
        return $this->plotLength;
    }

    public function setPlotLength(float $plotLength): self
    {
        $this->plotLength = $plotLength;

        return $this;
    }

    public function getPlotSlope(): ?float
    {
        return $this->plotSlope;
    }

    public function setPlotSlope(float $plotSlope): self
    {
        $this->plotSlope = $plotSlope;

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
}
