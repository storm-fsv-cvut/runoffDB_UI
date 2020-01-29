<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RecordRepository")
 */
class Record {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Measurement", inversedBy="value")
     * @ORM\JoinColumn(nullable=false)
     */
    private $measurement;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RecordType")
     * @ORM\JoinColumn(nullable=false)
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
     * @ORM\JoinColumn(nullable=false)
     */
    private $unit;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Record", inversedBy="relatedRecords")
     */
    private $sourceRecords;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Record", mappedBy="sourceRecords")
     */
    private $relatedRecords;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     */
    private $relatedValueUnit;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $isTimeline;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Data", mappedBy="record", cascade={"persist"})
     */
    private $data;

    public function __toString() {
        return $this->getId()."";
    }

    public function __construct() {
        $this->sourceRecords = new ArrayCollection();
        $this->relatedRecords = new ArrayCollection();
        $this->data = new ArrayCollection();
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
        return $this->data;
    }

    public function addData(Data $data): self {
        if (!$this->data->contains($data)) {
            $this->data[] = $data;
            $data->setRecord($this);
        }
        return $this;
    }

    public function removeData(Data $data): self {
        if ($this->data->contains($data)) {
            $this->data->removeElement($data);
            // set the owning side to null (unless already changed)
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

    /**
     * @return Collection|self[]
     */
    public function getRelatedRecords(): Collection {
        return $this->relatedRecords;
    }

    public function addRelatedRecord(self $relatedRecord): self {
        if (!$this->relatedRecords->contains($relatedRecord)) {
            $this->relatedRecords[] = $relatedRecord;
            $relatedRecord->addSourceRecord($this);
        }

        return $this;
    }

    public function removeRelatedRecord(self $relatedRecord): self {
        if ($this->relatedRecords->contains($relatedRecord)) {
            $this->relatedRecords->removeElement($relatedRecord);
            $relatedRecord->removeSourceRecord($this);
        }

        return $this;
    }

    public function getRelatedValueUnit(): ?Unit {
        return $this->relatedValueUnit;
    }

    public function setRelatedValueUnit(?Unit $relatedValueUnit): self {
        $this->relatedValueUnit = $relatedValueUnit;

        return $this;
    }

    public function getIsTimeline(): ?bool {
        return $this->isTimeline;
    }

    public function setIsTimeline(bool $isTimeline): self {
        $this->isTimeline = $isTimeline;

        return $this;
    }
}
