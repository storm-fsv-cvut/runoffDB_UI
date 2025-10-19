<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use DOMDocument;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RecordRepository")
 */
class Record extends BaseEntity
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Measurement", inversedBy="records")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Measurement $measurement = null;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RecordType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?RecordType $recordType = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $noteCZ = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $noteEN = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $descriptionCZ = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $descriptionEN = null;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(referencedColumnName="id")
     */
    private ?Unit $unit;

    /** @ORM\ManyToMany(targetEntity="App\Entity\Record") */
    private Collection $sourceRecords;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Data", mappedBy="record", cascade={"persist","remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"time" = "ASC"})
     */
    private Collection $datas;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Unit $relatedValueXUnit;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Unit $relatedValueYUnit;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Unit $relatedValueZUnit;

    /** @ORM\ManyToOne(targetEntity="App\Entity\QualityIndex") */
    private ?QualityIndex $qualityIndex;

    /** @ORM\Column(type="boolean", nullable=true) */
    private ?bool $isTimeline = null;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Methodics")
     * @ORM\JoinColumn(name="methodics_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $methodics;

    public function __construct()
    {
        $this->measurement = null;
        $this->recordType = null;
        $this->noteCZ = null;
        $this->noteEN = null;
        $this->unit = null;
        $this->relatedValueXUnit = null;
        $this->relatedValueYUnit = null;
        $this->relatedValueZUnit = null;
        $this->qualityIndex = null;
        $this->isTimeline = null;
        $this->sourceRecords = new ArrayCollection();
        $this->datas = new ArrayCollection();
    }

    public function __toString()
    {
        $decimals = ($this->getUnit() !== null ? $this->getUnit()->getDecimals() : 0);
        if ($this->getData()->get(0) !== null) {
            if ($this->getMeasurement() !== null && $this->getMeasurement()->getLocality() !== null) {
                return '#' . $this->getId() . ' (' . $this->getMeasurement()->getLocality() . ' ' . $this->getMeasurement()->getFormatedDate() . ') ' . number_format((float) $this->getData()->get(0)->getValue(), $decimals) . ' ' . ($this->getUnit() !== null ? $this->getUnit()->getUnit() : '');
            } else {
                return '#' . $this->getId() . ' ' . number_format((float) $this->getData()->get(0)->getValue(), $decimals) . ' ' . ($this->getUnit() !== null ? $this->getUnit()->getUnit() : '');
            }
        } else {
            return '#' . $this->getId();
        }
    }

    public function isPhenomenonByKey(string $phenomenonKey): bool
    {
        return $this->measurement?->getPhenomenon()?->getPhenomenonKey() === $phenomenonKey;
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

    public function getHtmlLabel()
    {
        $decimals = ($this->getUnit() !== null ? $this->getUnit()->getDecimals() : 0);
        return '<span data-toggle="tooltip" data-placement="top" title="#' . $this->getId() . '">' . number_format((float) $this->getData()->get(0)->getValue(), $decimals) . ' ' . ($this->getUnit() !== null ? $this->getUnit()->getUnit() : '') . '</span>';
    }

    public function getIdAndUnitString(): string
    {
        return '#' . $this->getId() . ($this->getUnit() !== null ? ' (' . $this->getUnit()->getName() . ')' : '');
    }

    public function getNote(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getNoteEN() : $this->getNoteCZ();
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getMeasurement(): ?Measurement
    {
        return $this->measurement;
    }

    public function setMeasurement(?Measurement $measurement): self
    {
        $this->measurement = $measurement;

        return $this;
    }

    public function getRecordType(): ?RecordType
    {
        return $this->recordType;
    }

    public function setRecordType(?RecordType $recordType): self
    {
        $this->recordType = $recordType;

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

    public function getUnit(): ?Unit
    {
        return $this->unit;
    }

    public function setUnit(?Unit $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function getData(): Collection
    {
        $criteria = Criteria::create();
        $criteria->orderBy(array('time' => Criteria::ASC));
        return $this->datas->matching($criteria);
    }

    public function getDatas(): Collection
    {
        return $this->getData();
    }

    public function addData(Data $data): self
    {
        if (!$this->datas->contains($data)) {
            $data->setRecord($this);
            $this->datas[] = $data;
        }
        return $this;
    }

    public function removeData(Data $data): self
    {
        if ($this->datas->contains($data)) {
            $this->datas->removeElement($data);
        }

        return $this;
    }

    public function getSourceRecords(): Collection
    {
        return $this->sourceRecords;
    }

    public function addSourceRecord(self $sourceRecord): self
    {
        if (!$this->sourceRecords->contains($sourceRecord)) {
            $this->sourceRecords[] = $sourceRecord;
        }

        return $this;
    }

    public function removeSourceRecord(self $sourceRecord): self
    {
        if ($this->sourceRecords->contains($sourceRecord)) {
            $this->sourceRecords->removeElement($sourceRecord);
        }

        return $this;
    }

    public function getRelatedValueXUnit(): ?Unit
    {
        return $this->relatedValueXUnit;
    }

    public function setRelatedValueXUnit(?Unit $relatedValueXUnit): self
    {
        $this->relatedValueXUnit = $relatedValueXUnit;

        return $this;
    }

    public function getRelatedValueYUnit(): ?Unit
    {
        return $this->relatedValueYUnit;
    }

    public function setRelatedValueYUnit(?Unit $relatedValueYUnit): self
    {
        $this->relatedValueYUnit = $relatedValueYUnit;

        return $this;
    }

    public function getRelatedValueZUnit(): ?Unit
    {
        return $this->relatedValueZUnit;
    }

    public function setRelatedValueZUnit(?Unit $relatedValueZUnit): self
    {
        $this->relatedValueZUnit = $relatedValueZUnit;

        return $this;
    }

    public function getQualityIndex(): ?QualityIndex
    {
        return $this->qualityIndex;
    }

    public function setQualityIndex(?QualityIndex $qualityIndex): self
    {
        $this->qualityIndex = $qualityIndex;

        return $this;
    }

    public function getIsTimeline(): ?bool
    {
        return $this->isTimeline;
    }

    public function setIsTimeline(?bool $isTimeline): self
    {
        $this->isTimeline = $isTimeline;

        return $this;
    }

    public function getDescriptionCZ(): ?string
    {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(?string $descriptionCZ): void
    {
        $this->descriptionCZ = $descriptionCZ;
    }

    public function getDescriptionEN(): ?string
    {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(?string $descriptionEN): void
    {
        $this->descriptionEN = $descriptionEN;
    }

    public function getXmlDomElement(DOMDocument $dom): \DOMElement
    {
        $record = $dom->createElement('record');
        $datas = $dom->createElement('datas');
        foreach ($this->getData() as $data) {
            $datas->append($data->getXmlDomElement($dom));
        }
        $record->append(
            $dom->createElement('id', (string) $this->getId()),
            $dom->createElement('recordType', $this->getRecordType()->getName()),
            $dom->createElement('note', $this->getNote()),
            $dom->createElement('description', $this->getDescription()),
            $dom->createElement('unit', $this->getUnit()->getUnit()),
            $dom->createElement('qualityIndex', (string) $this->getQualityIndex()),
            $datas,
        );

        if ($this->getRelatedValueXUnit() !== null) {
            $record->append($this->getRelatedValueXUnit()->getUnit());
        }
        if ($this->getRelatedValueYUnit() !== null) {
            $record->append($this->getRelatedValueYUnit()->getUnit());
        }
        if ($this->getRelatedValueZUnit() !== null) {
            $record->append($this->getRelatedValueZUnit()->getUnit());
        }

        return $record;
    }
}
