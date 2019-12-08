<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Dtc\GridBundle\Annotation as Grid;

/**
 * @Grid\Grid(actions={@Grid\ShowAction(), @Grid\DeleteAction()})
 * @ORM\Entity(repositoryClass="App\Repository\SoilSampleRepository")
 */
class SoilSample
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     */
    private $dateSampled;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Organization")
     */
    private $processedAt;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $corg;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $bulkDensity;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $sampleLocation;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $moistureVperc;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Texture")
     */
    private $texture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Plot", inversedBy="soilSamples")
     */
    private $plot;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\WRBsoilClass")
     */
    private $wRBsoilClass;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Locality", inversedBy="soilSamples")
     */
    private $locality;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\TextureData", mappedBy="soilSample")
     */
    private $textureData;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $descriptionEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Run", inversedBy="soilSamples")
     */
    private $Run;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $sampleDepthM;

    public function __construct()
    {
        $this->textureData = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateSampled(): ?\DateTimeInterface
    {
        return $this->dateSampled;
    }

    public function setDateSampled(\DateTimeInterface $dateSampled): self
    {
        $this->dateSampled = $dateSampled;

        return $this;
    }

    public function getProcessedAt(): ?string
    {
        return $this->processedAt;
    }

    public function setProcessedAt(string $processedAt): self
    {
        $this->processedAt = $processedAt;

        return $this;
    }

    public function getCorg(): ?float
    {
        return $this->corg;
    }

    public function setCorg(?float $corg): self
    {
        $this->corg = $corg;

        return $this;
    }

    public function getBulkDensity(): ?float
    {
        return $this->bulkDensity;
    }

    public function setBulkDensity(?float $bulkDensity): self
    {
        $this->bulkDensity = $bulkDensity;

        return $this;
    }

    public function getSampleLocation(): ?string
    {
        return $this->sampleLocation;
    }

    public function setSampleLocation(?string $sampleLocation): self
    {
        $this->sampleLocation = $sampleLocation;

        return $this;
    }

    public function getMoistureVperc(): ?float
    {
        return $this->moistureVperc;
    }

    public function setMoistureVperc(?float $moistureVperc): self
    {
        $this->moistureVperc = $moistureVperc;

        return $this;
    }

    public function getTexture(): ?Texture
    {
        return $this->texture;
    }

    public function setTexture(?Texture $texture): self
    {
        $this->texture = $texture;

        return $this;
    }

    public function getPlot(): ?Plot
    {
        return $this->plot;
    }

    public function setPlot(?Plot $plot): self
    {
        $this->plot = $plot;

        return $this;
    }

    public function getWRBsoilClass(): ?WRBsoilClass
    {
        return $this->wRBsoilClass;
    }

    public function setWRBsoilClass(?WRBsoilClass $wRBsoilClass): self
    {
        $this->wRBsoilClass = $wRBsoilClass;

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

    public function getLabel(): string {
       return $this->id;
    }

    /**
     * @return Collection|TextureData[]
     */
    public function getTextureData(): Collection
    {
        return $this->textureData;
    }

    public function addTextureData(TextureData $textureData): self
    {
        if (!$this->textureData->contains($textureData)) {
            $this->textureData[] = $textureData;
            $textureData->setSoilSample($this);
        }

        return $this;
    }

    public function removeTextureData(TextureData $textureData): self
    {
        if ($this->textureData->contains($textureData)) {
            $this->textureData->removeElement($textureData);
            // set the owning side to null (unless already changed)
            if ($textureData->getSoilSample() === $this) {
                $textureData->setSoilSample(null);
            }
        }

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

    public function getRun(): ?Run
    {
        return $this->Run;
    }

    public function setRun(?Run $Run): self
    {
        $this->Run = $Run;

        return $this;
    }

    public function getSampleDepthM(): ?float
    {
        return $this->sampleDepthM;
    }

    public function setSampleDepthM(?float $sampleDepthM): self
    {
        $this->sampleDepthM = $sampleDepthM;

        return $this;
    }
}
