<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
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
     * @ORM\Column(type="string", length=50)
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
    private $moistureGkg;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $note;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Texture")
     */
    private $texture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Plot", inversedBy="soilSamples")
     */
    private $plot;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilType")
     */
    private $soilType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Locality", inversedBy="soilSamples")
     */
    private $locality;

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

    public function getMoistureGkg(): ?float
    {
        return $this->moistureGkg;
    }

    public function setMoistureGkg(?float $moistureGkg): self
    {
        $this->moistureGkg = $moistureGkg;

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

    public function getSoilType(): ?SoilType
    {
        return $this->soilType;
    }

    public function setSoilType(?SoilType $soilType): self
    {
        $this->soilType = $soilType;

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
}
