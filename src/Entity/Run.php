<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DOMDocument;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RunRepository")
 */
class Run extends BaseEntity implements FileStorageEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?SoilSample $soilSampleBulk;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?AssignmentType $bulkAssignmentType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?SoilSample $soilSampleTexture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?AssignmentType $textureAssignmentType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SoilSample")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?SoilSample $soilSampleCorg;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AssignmentType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?AssignmentType $corgAssignmentType;

    /** @ORM\Column(type="time", nullable=true) */
    private ?\DateTimeInterface $runoffStart;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $cropPictures;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $plotPictures;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $rawDataPath;

    /** @ORM\Column(type="string", length=512, nullable=true) */
    private ?string $noteCZ;

    /** @ORM\Column(type="string", length=512, nullable=true) */
    private ?string $noteEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Plot")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Plot $plot;

    /** @ORM\OneToMany(targetEntity="App\Entity\SoilSample", mappedBy="Run") * */
    private Collection $soilSamples;

    /** @ORM\ManyToMany(targetEntity="App\Entity\Measurement", mappedBy="runs") */
    private Collection $measurements;

    /** @ORM\Column(type="time", nullable=true) */
    private ?\DateTimeInterface $pondingStart;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record", cascade={"persist","remove"})
     * @ORM\JoinColumn(nullable=true,name="init_moisture_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Record $initMoisture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record", cascade={"persist","remove"})
     * @ORM\JoinColumn(nullable=true,name="rain_intensity_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Record $rainIntensity;

    /** @ORM\ManyToOne(targetEntity="App\Entity\RunGroup", inversedBy="runs") */
    private ?RunGroup $runGroup;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     * @ORM\JoinColumn(name="surface_cover_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Record $surfaceCover;

    /** @ORM\Column(type="integer", nullable=true) */
    private ?int $cropBBCH;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $cropConditionCZ;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $cropConditionEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Methodics")
     * @ORM\JoinColumn(name="methodics_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private ?Methodics $methodics;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Run")
     * @ORM\JoinColumn(name="reference_run_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private ?Run $referenceRun;

    public function __construct()
    {
        $this->soilSampleBulk = null;
        $this->bulkAssignmentType = null;
        $this->soilSampleTexture = null;
        $this->textureAssignmentType = null;
        $this->soilSampleCorg = null;
        $this->corgAssignmentType = null;
        $this->runoffStart = null;
        $this->cropPictures = null;
        $this->plotPictures = null;
        $this->rawDataPath = null;
        $this->noteCZ = null;
        $this->noteEN = null;
        $this->plot = null;
        $this->pondingStart = null;
        $this->soilSamples = new ArrayCollection();
        $this->measurements = new ArrayCollection();
        $this->cropBBCH = null;
        $this->cropConditionCZ = null;
        $this->cropConditionEN = null;
        $this->surfaceCover = null;
        $this->methodics = null;
        $this->referenceRun = null;
    }

    public function __toString()
    {
        return '#' . $this->getId();
    }

    public function getMethodics(): ?Methodics
    {
        return $this->methodics;
    }

    public function setMethodics(?Methodics $methodics): self
    {
        $this->methodics = $methodics;
        return $this;
    }

    public function getSurfaceCover(): ?Record
    {
        return $this->surfaceCover;
    }

    public function setSurfaceCover(?Record $surfaceCover): self
    {
        $this->surfaceCover = $surfaceCover;

        return $this;
    }

    public function getCropCondition(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getCropConditionEN() : $this->getCropConditionCZ();
    }

    public function getCropConditionEN(): ?string
    {
        return $this->cropConditionEN;
    }

    public function setCropConditionEN(?string $cropConditionEN): self
    {
        $this->cropConditionEN = $cropConditionEN;

        return $this;
    }

    public function getCropConditionCZ(): ?string
    {
        return $this->cropConditionCZ;
    }

    public function setCropConditionCZ(?string $cropConditionCZ): self
    {
        $this->cropConditionCZ = $cropConditionCZ;

        return $this;
    }

    public function getCropBBCH(): ?int
    {
        return $this->cropBBCH;
    }

    public function setCropBBCH(?int $cropBBCH): self
    {
        $this->cropBBCH = $cropBBCH;

        return $this;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function addMeasurement(Measurement $measurement): self
    {
        if (!$this->measurements->contains($measurement)) {
            $this->measurements[] = $measurement;
            $measurement->addRun($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self
    {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            $measurement->removeRun($this);
        }
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

    public function getSoilSamples(): Collection
    {
        return $this->soilSamples;
    }

    public function addSoilSample(SoilSample $soilSample): self
    {
        if (!$this->soilSamples->contains($soilSample)) {
            $this->soilSamples[] = $soilSample;
            $soilSample->setRun($this);
        }

        return $this;
    }

    public function removeSoilSample(SoilSample $soilSample): self
    {
        if ($this->soilSamples->contains($soilSample)) {
            $this->soilSamples->removeElement($soilSample);
            // set the owning side to null (unless already changed)
            if ($soilSample->getRun() === $this) {
                $soilSample->setRun(null);
            }
        }

        return $this;
    }

    public function getFiles(): array
    {
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

    public function getFilesPath(): string
    {
        return 'data/run/' . $this->getId();
    }

    public function removeFile(string $filename): void
    {
        $filesystem = new Filesystem();
        $dir = $this->getFilesPath();
        if ($filesystem->exists($dir . '/' . $filename)) {
            $filesystem->remove($dir . '/' . $filename);
        }
    }

    public function validateSoilSamples(): bool
    {
        return $this->getSoilSampleCorg() !== null && $this->getSoilSampleBulk(
        ) !== null && $this->getSoilSampleTexture() !== null;
    }

    public function getSoilSampleCorg(): ?SoilSample
    {
        return $this->soilSampleCorg;
    }

    public function setSoilSampleCorg(?SoilSample $soilSampleCorg): self
    {
        $this->soilSampleCorg = $soilSampleCorg;

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

    public function getSoilSampleTexture(): ?SoilSample
    {
        return $this->soilSampleTexture;
    }

    public function setSoilSampleTexture(?SoilSample $soilSampleTexture): self
    {
        $this->soilSampleTexture = $soilSampleTexture;

        return $this;
    }

    public function getSequence(): ?Sequence
    {
        return $this->getRunGroup() !== null ? $this->getRunGroup()->getSequence() : null;
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

    public function getDatetime(): ?\DateTimeInterface
    {
        if ($this->getRunGroup() !== null) {
            return $this->getRunGroup()->getDatetime();
        }
        return null;
    }

    public function getFormatedDatetime(): string
    {
        return $this->getRunGroup() !== null ? $this->getRunGroup()->getDatetime() !== null ? $this->getRunGroup()
                                                                                                   ->getDatetime()
                                                                                                   ->format(
                                                                                                       'd.m.Y H:i',
                                                                                                   ) : ' - ' : ' - ';
    }

    public function getRunType(): ?RunType
    {
        return $this->getRunGroup() !== null ? $this->getRunGroup()->getRunType() : null;
    }

    public function getXmlDomElement(DOMDocument $dom): \DOMElement
    {
        $run = $dom->createElement('run');

        $measurements = $dom->createElement('measurements');
        foreach ($this->getMeasurements() as $measurement) {
            $measurements->append($measurement->getXmlDomElement($dom));
        }

        $run->append(
            $dom->createElement('id', (string) $this->getId()),
            $dom->createElement('note', $this->getNote()),
            $measurements,
        );

        if ($this->getSoilSampleBulk() !== null) {
            $soilSampleBulk = $dom->createElement('soilSampleBulk');
            $soilSampleBulk->append($this->getSoilSampleBulk()->getXmlDomElement($dom));
            if ($this->getBulkAssignmentType() !== null) {
                $soilSampleBulk->append($this->getBulkAssignmentType()->getXmlDomElement($dom));
            }

            $run->append($soilSampleBulk);
        }

        if ($this->getSoilSampleCorg() !== null) {
            $soilSampleCorg = $dom->createElement('soilSampleCorg');
            $soilSampleCorg->append($this->getSoilSampleCorg()->getXmlDomElement($dom));
            if ($this->getCorgAssignmentType() !== null) {
                $soilSampleCorg->append($this->getCorgAssignmentType()->getXmlDomElement($dom));
            }

            $run->append($soilSampleCorg);
        }

        if ($this->getSoilSampleTexture() !== null) {
            $soilSampleTexture = $dom->createElement('soilSampleTexture');
            $soilSampleTexture->append($this->getSoilSampleTexture()->getXmlDomElement($dom));
            if ($this->getTextureAssignmentType() !== null) {
                $soilSampleTexture->append($this->getTextureAssignmentType()->getXmlDomElement($dom));
            }

            $run->append($soilSampleTexture);
        }

        if ($this->getRunoffStart() !== null) {
            $run->append(
                $dom->createElement('runoffStart', $this->getFormatedRunoffStart()),
            );
        }

        if ($this->getPondingStart() !== null) {
            $run->append(
                $dom->createElement('pondingStart', $this->getFormatedPondingStart()),
            );
        }

        if ($this->getInitMoisture() !== null) {
            $initMoisture = $dom->createElement('initMoisture');
            $initMoisture->append(
                $this->getInitMoisture()->getXmlDomElement($dom),
            );
            $run->append($initMoisture);
        }

        if ($this->getRainIntensity() !== null) {
            $rainIntensity = $dom->createElement('rainIntensity');
            $rainIntensity->append(
                $this->getRainIntensity()->getXmlDomElement($dom),
            );
            $run->append($rainIntensity);
        }

        if ($this->getPlot() !== null) {
            $run->append($this->getPlot()->getXmlDomElement($dom));
        }

        return $run;
    }

    public function getMeasurements(): Collection
    {
        return $this->measurements;
    }

    public function getNote(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getNoteEN() : $this->getNoteCZ();
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

    public function getNoteCZ(): ?string
    {
        return $this->noteCZ;
    }

    public function setNoteCZ(?string $noteCZ): self
    {
        $this->noteCZ = $noteCZ;

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

    public function getCorgAssignmentType(): ?AssignmentType
    {
        return $this->corgAssignmentType;
    }

    public function setCorgAssignmentType(?AssignmentType $corgAssignmentType): self
    {
        $this->corgAssignmentType = $corgAssignmentType;

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

    public function getRunoffStart(): ?\DateTimeInterface
    {
        return $this->runoffStart;
    }

    public function setRunoffStart(?\DateTimeInterface $runoffStart): self
    {
        $this->runoffStart = $runoffStart;

        return $this;
    }

    public function getFormatedRunoffStart(): string
    {
        return $this->getRunoffStart() !== null ? $this->getRunoffStart()->format('G:i:s') : ' - ';
    }

    public function getPondingStart(): ?\DateTimeInterface
    {
        return $this->pondingStart;
    }

    public function setPondingStart(?\DateTimeInterface $pondingStart): self
    {
        $this->pondingStart = $pondingStart;

        return $this;
    }

    public function getFormatedPondingStart(): string
    {
        return $this->getPondingStart() !== null ? $this->getPondingStart()->format('G:i:s') : ' - ';
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

    public function getPlot(): ?Plot
    {
        return $this->plot;
    }

    public function setPlot(?Plot $plot): self
    {
        $this->plot = $plot;

        return $this;
    }

    public function getReferenceRun(): ?Run
    {
        return $this->referenceRun;
    }

    public function setReferenceRun(?Run $referenceRun): void
    {
        $this->referenceRun = $referenceRun;
    }
}
