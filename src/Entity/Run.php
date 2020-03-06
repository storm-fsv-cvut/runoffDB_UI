<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RunRepository")
 */
class Run {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Sequence", inversedBy="sequence")
     * @ORM\JoinColumn(nullable=false)
     */
    private $sequence;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RunType")
     * @ORM\JoinColumn(nullable=false)
     */
    private $runType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample", nullable=true)
     */
    private $soilSampleBulk;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     */
    private $bulkAssignmentType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample", nullable=true)
     */
    private $soilSampleTexture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     */
    private $textureAssignmentType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample", nullable=true)
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
     * @ORM\ManyToOne(targetEntity="App\Entity\Measurement", cascade={"persist"})
     */
    private $rainIntensityMeasurement;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $precedingPrecipitation;

    /**
     * @ORM\Column(type="time", nullable=true)
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

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SoilSample", mappedBy="Run")
     */
    private $soilSamples;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Measurement", cascade={"persist","remove"})
     */
    private $initMoistureMeasurement;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Measurement", mappedBy="run", cascade={"persist","remove"})
     */
    private $measurements;

    /**
     * @ORM\Column(type="time", nullable=true)
     */
    private $pondingStart;


    public function __toString() {
        return $this->sequence . " - #" . $this->getId();
    }

    public function __construct() {
        $this->soilSamples = new ArrayCollection();
        $this->measurements = new ArrayCollection();
        return $this;
    }

    /**
     * @return Collection|Measurement[]
     */
    public function getMeasurements(): Collection {
        return $this->measurements;
    }

    public function addMeasurement(Measurement $measurement): self {
        if (!$this->measurements->contains($measurement)) {
            $this->measurements[] = $measurement;
            $measurement->setRun($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            // set the owning side to null (unless already changed)
            if ($measurement->getRun() === $this) {
                $measurement->setRun(null);
            }
        }

        return $this;
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getSequence(): ?Sequence {
        return $this->sequence;
    }

    public function setSequence(?Sequence $sequence): self {
        $this->sequence = $sequence;

        return $this;
    }

    public function getRunType(): ?RunType {
        return $this->runType;
    }

    public function setRunType(?RunType $runType): self {
        $this->runType = $runType;

        return $this;
    }

    public function getSoilSampleBulk(): ?SoilSample {
        return $this->soilSampleBulk;
    }

    public function setSoilSampleBulk(?SoilSample $soilSampleBulk): self {
        $this->soilSampleBulk = $soilSampleBulk;

        return $this;
    }

    public function getBulkAssignmentType(): ?AssignmentType {
        return $this->bulkAssignmentType;
    }

    public function setBulkAssignmentType(?AssignmentType $bulkAssignmentType): self {
        $this->bulkAssignmentType = $bulkAssignmentType;

        return $this;
    }

    public function getSoilSampleTexture(): ?SoilSample {
        return $this->soilSampleTexture;
    }

    public function setSoilSampleTexture(?SoilSample $soilSampleTexture): self {
        $this->soilSampleTexture = $soilSampleTexture;

        return $this;
    }

    public function getTextureAssignmentType(): ?AssignmentType {
        return $this->textureAssignmentType;
    }

    public function setTextureAssignmentType(?AssignmentType $textureAssignmentType): self {
        $this->textureAssignmentType = $textureAssignmentType;

        return $this;
    }

    public function getSoilSampleCorq(): ?SoilSample {
        return $this->soilSampleCorq;
    }

    public function setSoilSampleCorq(?SoilSample $soilSampleCorq): self {
        $this->soilSampleCorq = $soilSampleCorq;

        return $this;
    }

    public function getCorqAssignmentType(): ?AssignmentType {
        return $this->corqAssignmentType;
    }

    public function setCorqAssignmentType(?AssignmentType $corqAssignmentType): self {
        $this->corqAssignmentType = $corqAssignmentType;

        return $this;
    }

    public function getDatetime(): ?\DateTimeInterface {
        return $this->datetime;
    }

    public function setDatetime(?\DateTimeInterface $datetime): self {
        $this->datetime = $datetime;

        return $this;
    }

    public function getRainIntensityMeasurement(): ?Measurement {
        return $this->rainIntensityMeasurement;
    }

    public function setRainIntensityMeasurement(?Measurement $rainIntensityMeasurement): self {
        $this->rainIntensityMeasurement = $rainIntensityMeasurement;

        return $this;
    }

    public function getPrecedingPrecipitation(): ?float {
        return $this->precedingPrecipitation;
    }

    public function setPrecedingPrecipitation(float $precedingPrecipitation): self {
        $this->precedingPrecipitation = $precedingPrecipitation;

        return $this;
    }

    public function getRunoffStart(): ?\DateTimeInterface {
        return $this->runoffStart;
    }

    public function setRunoffStart(?\DateTimeInterface $runoffStart): self {
        $this->runoffStart = $runoffStart;

        return $this;
    }

    public function getCropPictures(): ?string {
        return $this->cropPictures;
    }

    public function setCropPictures(?string $cropPictures): self {
        $this->cropPictures = $cropPictures;

        return $this;
    }

    public function getPlotPictures(): ?string {
        return $this->plotPictures;
    }

    public function setPlotPictures(?string $plotPictures): self {
        $this->plotPictures = $plotPictures;

        return $this;
    }

    public function getRawDataPath(): ?string {
        return $this->rawDataPath;
    }

    public function setRawDataPath(?string $rawDataPath): self {
        $this->rawDataPath = $rawDataPath;

        return $this;
    }

    public function getNoteCZ(): ?string {
        return $this->noteCZ;
    }

    public function setNoteCZ(?string $noteCZ): self {
        $this->noteCZ = $noteCZ;

        return $this;
    }

    public function getNoteEN(): ?string {
        return $this->noteEN;
    }

    public function setNoteEN(?string $noteEN): self {
        $this->noteEN = $noteEN;

        return $this;
    }

    /**
     * @return Collection|SoilSample[]
     */
    public function getSoilSamples(): Collection {
        return $this->soilSamples;
    }

    public function addSoilSample(SoilSample $soilSample): self {
        if (!$this->soilSamples->contains($soilSample)) {
            $this->soilSamples[] = $soilSample;
            $soilSample->setRun($this);
        }

        return $this;
    }

    public function removeSoilSample(SoilSample $soilSample): self {
        if ($this->soilSamples->contains($soilSample)) {
            $this->soilSamples->removeElement($soilSample);
            // set the owning side to null (unless already changed)
            if ($soilSample->getRun() === $this) {
                $soilSample->setRun(null);
            }
        }

        return $this;
    }

    public function getInitMoistureMeasurement(): ?Measurement {
        return $this->initMoistureMeasurement;
    }

    public function setInitMoistureMeasurement(?Measurement $initMoistureMeasurement): self {
        $this->initMoistureMeasurement = $initMoistureMeasurement;

        return $this;
    }

    public function getPondingStart(): ?\DateTimeInterface {
        return $this->pondingStart;
    }

    public function setPondingStart(?\DateTimeInterface $pondingStart): self {
        $this->pondingStart = $pondingStart;

        return $this;
    }

    public function getFiles(): array {
        $files = [];
        $filesystem = new Filesystem();
        $dir = "data/" . $this->getSequence()->getId() . "/" . $this->getId();
        if ($filesystem->exists($dir)) {
            $finder = new Finder();
            $finder->files()->in($dir);
            if ($finder->hasResults()) {
                foreach ($finder as $file) {
                    $files[] = $file->getRelativePathname();
                }
            }
        }
        return $files;
    }

    public function removeFile(string $filename) {
        $filesystem = new Filesystem();
        $dir = "data/" . $this->getSequence()->getId() . "/" . $this->getId();
        if ($filesystem->exists($dir.'/'.$filename)) {
            $filesystem->remove($dir.'/'.$filename);
        }
    }
}
