<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RecordRepository")
 */
class Record extends BaseEntity {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Measurement", inversedBy="records")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $measurement;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RecordType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $recordType;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $noteCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $noteEN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $unit;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Record")
     */
    private $sourceRecords;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Data", mappedBy="record", cascade={"persist","remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"time" = "ASC"})
     */
    private $datas;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $relatedValueXUnit;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $relatedValueYUnit;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private $relatedValueZUnit;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\QualityIndex")
     */
    private $qualityIndex;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $isTimeline;

    public function __toString() {
        if ($this->getData()->get(0) != null) {
            if($this->getMeasurement()!=null && $this->getMeasurement()->getLocality()!=null) {
                return "#".$this->getId()." (".$this->getMeasurement()->getLocality()." ".$this->getMeasurement()->getFormatedDate().") ".number_format($this->getData()->get(0)->getValue(), 0) . " " . $this->getUnit()->getUnit();
            } else {
                return "#".$this->getId()." ".number_format($this->getData()->get(0)->getValue(), 0) . " " . $this->getUnit()->getUnit();
            }
        } else {
            return "#".$this->getId();
        }
    }

    public function getIdAndUnitString():string {
        return "#".$this->getId()." (".$this->getUnit()->getName().")";
    }

    public function getNote():?string {
        return $this->getLocale() == 'en' ? $this->getNoteEN() : $this->getNoteCZ();
    }

    public function __construct() {
        $this->sourceRecords = new ArrayCollection();
        $this->datas = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getMeasurement(): ?Measurement {
        return $this->measurement;
    }

    public function setMeasurement(?Measurement $measurement): self {
        $this->measurement = $measurement;

        return $this;
    }


    public function getRecordType(): ?RecordType {
        return $this->recordType;
    }

    public function setRecordType(?RecordType $recordType): self {
        $this->recordType = $recordType;

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

    public function getUnit(): ?Unit {
        return $this->unit;
    }

    public function setUnit(?Unit $unit): self {
        $this->unit = $unit;

        return $this;
    }

    /**
 * @return Collection|Data[]
 */
    public function getData(): Collection {
        return $this->datas;
    }

    /**
     * @return Collection|Data[]
     */
    public function getDatas(): Collection {
        return $this->getData();
    }

    public function addData(Data $data): self {
        if (!$this->datas->contains($data)) {
            $data->setRecord($this);
            $this->datas[] = $data;
        }
        return $this;
    }

    public function removeData(Data $data): self {
        if ($this->datas->contains($data)) {
            $this->datas->removeElement($data);
            if ($data->getRecord() === $this) {
                $data->setRecord(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|self[]
     */
    public function getSourceRecords(): Collection {
        return $this->sourceRecords;
    }

    public function addSourceRecord(self $sourceRecord): self {
        if (!$this->sourceRecords->contains($sourceRecord)) {
            $this->sourceRecords[] = $sourceRecord;
        }

        return $this;
    }

    public function removeSourceRecord(self $sourceRecord): self {
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
}
