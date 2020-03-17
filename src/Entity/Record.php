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
     * @ORM\ManyToMany(targetEntity="App\Entity\Record", inversedBy="sourceRecords")
     */
    private $sourceRecords;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Unit")
     */
    private $relatedValueUnit;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $isTimeline;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Data", mappedBy="record", cascade={"persist","remove"}, orphanRemoval=true)
     */
    private $datas;

    public function __toString() {
        return $this->getId()."";
    }

    public function getNote():string {
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
