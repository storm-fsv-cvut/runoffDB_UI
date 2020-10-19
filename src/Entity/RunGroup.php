<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RunGroupRepository")
 */
class RunGroup
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
    private $datetime;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $precedingPrecipitation;

    /**
     * @ORM\Column(type="text")
     */
    private $noteCZ;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RunType")
     * @ORM\JoinColumn(nullable=false)
     */
    private $runType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Sequence", inversedBy="runGroups")
     * @ORM\JoinColumn(nullable=false)
     */
    private $sequence;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $noteEN;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getPrecedingPrecipitation(): ?float
    {
        return $this->precedingPrecipitation;
    }

    public function setPrecedingPrecipitation(?float $precedingPrecipitation): self
    {
        $this->precedingPrecipitation = $precedingPrecipitation;

        return $this;
    }

    public function getNoteCZ(): ?string
    {
        return $this->noteCZ;
    }

    public function setNoteCZ(string $noteCZ): self
    {
        $this->noteCZ = $noteCZ;

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

    public function getSequence(): ?Sequence
    {
        return $this->sequence;
    }

    public function setSequence(?Sequence $sequence): self
    {
        $this->sequence = $sequence;

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
