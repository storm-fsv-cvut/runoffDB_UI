<?php

namespace App\Entity;

use _HumbugBox01d8f9a04075\Nette\Utils\DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\Types\String_;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RunRepository")
 */
class Run extends BaseEntity {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

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
    private $soilSampleCorg;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     */
    private $corgAssignmentType;

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
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $noteCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $noteEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Plot")
     * @ORM\JoinColumn(nullable=true)
     */
    private $plot;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SoilSample", mappedBy="Run")
     */
    private $soilSamples;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Measurement", mappedBy="runs", cascade={"persist","remove"}, orphanRemoval=true)
     */
    private $measurements;

    /**
     * @ORM\Column(type="time", nullable=true)
     */
    private $pondingStart;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record", cascade={"persist","remove"})
     * @ORM\JoinColumn(name="init_moisture_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $initMoisture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record", cascade={"persist","remove"})
     * @ORM\JoinColumn(name="rain_intensity_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $rainIntensity;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RunGroup", inversedBy="runs")
     */
    private $runGroup;


    public function __toString() {
        return "#" . $this->getId();
    }

    public function getNote():?string {
        return $this->getLocale() == 'en' ? $this->getNoteEN() : $this->getNoteCZ();
    }

    public function __construct() {
        $this->soilSamples = new ArrayCollection();
        $this->measurements = new ArrayCollection();
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
            $measurement->addRun($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            $measurement->removeRun($this);
        }
        return $this;
    }

    public function getId(): ?int {
        return $this->id;
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

    public function getPlot(): ?Plot {
        return $this->plot;
    }

    public function setPlot(?Plot $plot): self {
        $this->plot = $plot;

        return $this;
    }

    public function getTextureAssignmentType(): ?AssignmentType {
        return $this->textureAssignmentType;
    }

    public function setTextureAssignmentType(?AssignmentType $textureAssignmentType): self {
        $this->textureAssignmentType = $textureAssignmentType;

        return $this;
    }

    public function getSoilSampleCorg(): ?SoilSample {
        return $this->soilSampleCorg;
    }

    public function setSoilSampleCorg(?SoilSample $soilSampleCorg): self {
        $this->soilSampleCorg = $soilSampleCorg;

        return $this;
    }

    public function getCorgAssignmentType(): ?AssignmentType {
        return $this->corgAssignmentType;
    }

    public function setCorgAssignmentType(?AssignmentType $corgAssignmentType): self {
        $this->corgAssignmentType = $corgAssignmentType;

        return $this;
    }

    public function getRunoffStart(): ?\DateTimeInterface {
        return $this->runoffStart;
    }

    public function getFormatedRunoffStart(): string {
        return $this->getRunoffStart() ? $this->getRunoffStart()->format("G:i:s") : ' - ';
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
        $dir = $this->getFilesPath();
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

    public function getFilesPath() {
        return  "data/sequence/". $this->getSequence()->getId(). "/" . $this->getId();
    }

    public function removeFile(string $filename) {
        $filesystem = new Filesystem();
        $dir = $this->getFilesPath();
        if ($filesystem->exists($dir.'/'.$filename)) {
            $filesystem->remove($dir.'/'.$filename);
        }
    }

    public function validateSoilSamples():bool {
        return $this->getSoilSampleCorg() && $this->getSoilSampleBulk() && $this->getSoilSampleTexture();
    }

    public function getInitMoisture(): ?Record
    {
        return $this->initMoisture;
    }

    public function setInitMoisture(?Record $initMoisture): self
    {
        $this->initMoisture = $initMoisture;

        return $this;
    }

    public function getRainIntensity(): ?Record
    {
        return $this->rainIntensity;
    }

    public function setRainIntensity(?Record $rainIntensity): self
    {
        $this->rainIntensity = $rainIntensity;

        return $this;
    }

    public function getRunGroup(): ?RunGroup
    {
        return $this->runGroup;
    }

    public function setRunGroup(?RunGroup $runGroup): self
    {
        $this->runGroup = $runGroup;

        return $this;
    }

    public function getSequence(): Sequence {
        return $this->getRunGroup()->getSequence();
    }

    public function getDatetime(): \DateTimeInterface {
        return $this->getRunGroup()->getDatetime();
    }

    public function getFormatedDatetime(): string {
        return $this->getRunGroup()->getDatetime()->format("d.m.Y H:i");
    }

    public function getRunType(): RunType {
        return $this->getRunGroup()->getRunType();
    }

}
