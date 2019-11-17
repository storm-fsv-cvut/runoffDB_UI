<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RunRepository")
 */
class Run
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Sequence")
     * @ORM\JoinColumn(nullable=false)
     */
    private $sequence;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RunType")
     * @ORM\JoinColumn(nullable=false)
     */
    private $runType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample")
     */
    private $soilSampleBulk;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     */
    private $bulkAssignmentType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample")
     */
    private $soilSampleTexture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     */
    private $textureAssignmentType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample")
     */
    private $soilSampleCorq;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     */
    private $corqAssignmentType;

    /**
     * @ORM\Column(type="datetime")
     */
    private $datetime;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Measurement")
     */
    private $rainIntensityMeasurement;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $initMoisture;

    /**
     * @ORM\Column(type="float")
     */
    private $precedingPrecipitation;

    /**
     * @ORM\Column(type="time")
     */
    private $runoffStart;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cropPictures;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $plotPictures;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $rawDataPath;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $noteCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $noteEN;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSequence(): ?Sequence
    {
        return $this->sequence;
    }

    public function setSequence(?Sequence $sequence): self
    {
        $this->sequence = $sequence;

        return $this;
    }

    public function getRunType(): ?RunType
    {
        return $this->runType;
    }

    public function setRunType(?RunType $runType): self
    {
        $this->runType = $runType;

        return $this;
    }

    public function getSoilSampleBulk(): ?SoilSample
    {
        return $this->soilSampleBulk;
    }

    public function setSoilSampleBulk(?SoilSample $soilSampleBulk): self
    {
        $this->soilSampleBulk = $soilSampleBulk;

        return $this;
    }

    public function getBulkAssignmentType(): ?AssignmentType
    {
        return $this->bulkAssignmentType;
    }

    public function setBulkAssignmentType(?AssignmentType $bulkAssignmentType): self
    {
        $this->bulkAssignmentType = $bulkAssignmentType;

        return $this;
    }

    public function getSoilSampleTexture(): ?SoilSample
    {
        return $this->soilSampleTexture;
    }

    public function setSoilSampleTexture(?SoilSample $soilSampleTexture): self
    {
        $this->soilSampleTexture = $soilSampleTexture;

        return $this;
    }

    public function getTextureAssignmentType(): ?AssignmentType
    {
        return $this->textureAssignmentType;
    }

    public function setTextureAssignmentType(?AssignmentType $textureAssignmentType): self
    {
        $this->textureAssignmentType = $textureAssignmentType;

        return $this;
    }

    public function getSoilSampleCorq(): ?SoilSample
    {
        return $this->soilSampleCorq;
    }

    public function setSoilSampleCorq(?SoilSample $soilSampleCorq): self
    {
        $this->soilSampleCorq = $soilSampleCorq;

        return $this;
    }

    public function getCorqAssignmentType(): ?AssignmentType
    {
        return $this->corqAssignmentType;
    }

    public function setCorqAssignmentType(?AssignmentType $corqAssignmentType): self
    {
        $this->corqAssignmentType = $corqAssignmentType;

        return $this;
    }

    public function getDatetime(): ?\DateTimeInterface
    {
        return $this->datetime;
    }

    public function setDatetime(\DateTimeInterface $datetime): self
    {
        $this->datetime = $datetime;

        return $this;
    }

    public function getRainIntensityMeasurement(): ?Measurement
    {
        return $this->rainIntensityMeasurement;
    }

    public function setRainIntensityMeasurement(?Measurement $rainIntensityMeasurement): self
    {
        $this->rainIntensityMeasurement = $rainIntensityMeasurement;

        return $this;
    }

    public function getInitMoisture(): ?int
    {
        return $this->initMoisture;
    }

    public function setInitMoisture(?int $initMoisture): self
    {
        $this->initMoisture = $initMoisture;

        return $this;
    }

    public function getPrecedingPrecipitation(): ?float
    {
        return $this->precedingPrecipitation;
    }

    public function setPrecedingPrecipitation(float $precedingPrecipitation): self
    {
        $this->precedingPrecipitation = $precedingPrecipitation;

        return $this;
    }

    public function getRunoffStart(): ?\DateTimeInterface
    {
        return $this->runoffStart;
    }

    public function setRunoffStart(\DateTimeInterface $runoffStart): self
    {
        $this->runoffStart = $runoffStart;

        return $this;
    }

    public function getCropPictures(): ?string
    {
        return $this->cropPictures;
    }

    public function setCropPictures(?string $cropPictures): self
    {
        $this->cropPictures = $cropPictures;

        return $this;
    }

    public function getPlotPictures(): ?string
    {
        return $this->plotPictures;
    }

    public function setPlotPictures(?string $plotPictures): self
    {
        $this->plotPictures = $plotPictures;

        return $this;
    }

    public function getRawDataPath(): ?string
    {
        return $this->rawDataPath;
    }

    public function setRawDataPath(?string $rawDataPath): self
    {
        $this->rawDataPath = $rawDataPath;

        return $this;
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
}
