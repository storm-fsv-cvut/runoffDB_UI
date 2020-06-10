<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\Types\Integer;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SoilSampleRepository")
 */
class SoilSample extends BaseEntity implements DefinitionEntityInterface
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
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $sampleLocation;

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

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $dateProcessed;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     */
    private $corg;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     * @ORM\JoinColumn(nullable=true)
     */
    private $bulkDensity;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     */
    private $moisture;

    public function __toString() {
        return "#".$this->getId()." - ".$this->getLocality();
    }

    public function getDescription():?string {
        return $this->getLocale() == 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function __construct()
    {

    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateSampled(): ?\DateTimeInterface
    {
        return $this->dateSampled;
    }

    public function setDateSampled(?\DateTimeInterface $dateSampled): self
    {
        $this->dateSampled = $dateSampled;

        return $this;
    }

    public function getProcessedAt(): ?Organization
    {
        return $this->processedAt;
    }

    public function setProcessedAt(?string $processedAt): self
    {
        $this->processedAt = $processedAt;

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

    public function getDateProcessed(): ?\DateTimeInterface
    {
        return $this->dateProcessed;
    }

    public function setDateProcessed(?\DateTimeInterface $dateProcessed): self
    {
        $this->dateProcessed = $dateProcessed;

        return $this;
    }

    public function getCorg(): ?Record
    {
        return $this->corg;
    }

    public function setCorg(?Record $corg): self
    {
        $this->corg = $corg;

        return $this;
    }

    public function getBulkDensity(): ?Record
    {
        return $this->bulkDensity;
    }

    public function setBulkDensity(?Record $bulkDensity): self
    {
        $this->bulkDensity = $bulkDensity;

        return $this;
    }

    public function getMoisture(): ?Record
    {
        return $this->moisture;
    }

    public function setMoisture(?Record $moisture): self
    {
        $this->moisture = $moisture;

        return $this;
    }
}
