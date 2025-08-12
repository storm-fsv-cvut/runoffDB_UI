<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DOMDocument;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SoilSampleRepository")
 */
class SoilSample extends BaseEntity implements FileStorageEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="date")
     */
    private ?\DateTimeInterface $dateSampled;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Organization")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Organization $processedAt;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private ?string $sampleLocation;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Plot", inversedBy="soilSamples")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Plot $plot;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\WrbSoilClass")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?WrbSoilClass $wrbSoilClass;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Locality", inversedBy="soilSamples")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Locality $locality;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $descriptionEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Run", inversedBy="soilSamples")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Run $Run;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private ?float $sampleDepthM;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private ?\DateTimeInterface $dateProcessed;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     * @ORM\JoinColumn(name="corg_id", referencedColumnName="id", onDelete="SET NULL", nullable=true)
     */
    private ?Record $corg;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     * @ORM\JoinColumn(name="bulk_density_id", referencedColumnName="id", onDelete="SET NULL", nullable=true)
     */
    private ?Record $bulkDensity;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     * @ORM\JoinColumn(name="moisture_id", referencedColumnName="id", onDelete="SET NULL", nullable=true)
     */
    private ?Record $moisture;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     * @ORM\JoinColumn(name="texture_record_id", referencedColumnName="id", onDelete="SET NULL", nullable=true)
     */
    private ?Record $textureRecord;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Measurement", mappedBy="soilSamples")
     */
    private Collection $measurements;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $rawDataPath;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private ?bool $deleted;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="soilSamples")
     */
    private ?User $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Methodics")
     * @ORM\JoinColumn(name="methodics_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $methodics;

    public function getMethodics(): ?Methodics
    {
        return $this->methodics;
    }

    public function setMethodics(?Methodics $methodics): self
    {
        $this->methodics = $methodics;
        return $this;
    }

    public function __construct()
    {
        $this->processedAt = null;
        $this->sampleLocation = null;
        $this->plot = null;
        $this->wrbSoilClass = null;
        $this->locality = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
        $this->Run = null;
        $this->sampleDepthM = null;
        $this->dateProcessed = null;
        $this->corg = null;
        $this->bulkDensity = null;
        $this->moisture = null;
        $this->textureRecord = null;
        $this->rawDataPath = null;
        $this->dateSampled = null;
        $this->deleted = null;
        $this->user = null;
        $this->measurements = new ArrayCollection();
    }

    public function __toString()
    {
        return "#" . $this->getId() . " - " . $this->getLocality();
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() == 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getDateSampled(): ?\DateTimeInterface
    {
        return $this->dateSampled;
    }

    public function getFormatedDateSampled(): string
    {
        return $this->dateSampled !== null ? $this->dateSampled->format('d.m.Y') : " - ";
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

    public function setProcessedAt(?Organization $processedAt): self
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

    public function getPlot(): ?Plot
    {
        return $this->plot;
    }

    public function setPlot(?Plot $plot): self
    {
        $this->plot = $plot;

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

    public function getLocality(): ?Locality
    {
        return $this->locality;
    }

    public function setLocality(?Locality $locality): self
    {
        $this->locality = $locality;

        return $this;
    }

    public function getLabel(): string
    {
        return "#" . $this->getId();
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

    public function getRoundedSampleDepthM(): ?float
    {
        return round($this->sampleDepthM,2);
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

    public function getFormatedDateProcessed(): string
    {
        return $this->dateProcessed !== null ? $this->dateProcessed->format('d.m.Y') : "";
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

    public function getTextureRecord(): ?Record
    {
        return $this->textureRecord;
    }

    public function setTextureRecord(?Record $textureRecord): self
    {
        $this->textureRecord = $textureRecord;

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
            $measurement->addSoilSample($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self
    {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            // set the owning side to null (unless already changed)
            $measurement->removeSoilSample($this);
        }

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

    public function getDeleted(): ?bool
    {
        return $this->deleted;
    }

    public function setDeleted(?bool $deleted): self
    {
        $this->deleted = $deleted;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

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
        return "data/soilsample/" . $this->getId();
    }

    public function removeFile(string $filename): void
    {
        $filesystem = new Filesystem();
        $dir = $this->getFilesPath();
        if ($filesystem->exists($dir . '/' . $filename)) {
            $filesystem->remove($dir . '/' . $filename);
        }
    }

    public function getXmlDomElement(DOMDocument $dom): \DOMElement
    {
        $soilSample = $dom->createElement('soilSample');
        $soilSample->append(
            $dom->createElement('id', $this->getId()),
            $dom->createElement('sampleLocation', $this->getSampleLocation()),
            $dom->createElement('description', $this->getDescription()),
            $dom->createElement('sampleDepthM', $this->getSampleDepthM())
        );
        if ($this->getDateSampled()!==null) {
            $soilSample->append(
                $dom->createElement('dateSampled', $this->getDateSampled()->format('Y-m-d')),
            );
        }
        if ($this->getDateProcessed()!==null) {
            $soilSample->append(
                $dom->createElement('dateProcessed', $this->getDateProcessed()->format('Y-m-d')),
            );
        }
        if ($this->getProcessedAt()!==null) {
            $soilSample->append(
                $dom->createElement('processedAt', $this->getProcessedAt()->getName()),
            );
        }
        if ($this->getBulkDensity()!==null) {
            $soilSample->append(
                $this->getBulkDensity()->getXmlDomElement($dom)
            );
        }
        if ($this->getCorg()!==null) {
            $soilSample->append(
                $this->getCorg()->getXmlDomElement($dom)
            );
        }
        if ($this->getMoisture()!==null) {
            $soilSample->append(
                $this->getMoisture()->getXmlDomElement($dom)
            );
        }
        if ($this->getTextureRecord()!==null) {
            $soilSample->append(
                $this->getTextureRecord()->getXmlDomElement($dom)
            );
        }
        if ($this->getLocality()!==null) {
            $soilSample->append(
                $dom->createElement('locality', (string) $this->getLocality())
            );
        }
        if ($this->getPlot()!==null) {
            $soilSample->append(
                $dom->createElement('plot', (string) $this->getPlot())
            );
        }
        if ($this->getWrbSoilClass()!==null) {
            $soilSample->append(
                $dom->createElement('wrbSoilClass', (string) $this->WrbSoilClass())
            );
        }
        return $soilSample;
    }
}
