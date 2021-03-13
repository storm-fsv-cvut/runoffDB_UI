<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RunGroupRepository")
 */
class RunGroup extends BaseEntity
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private \DateTimeInterface $datetime;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private ?float $precedingPrecipitation;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $noteCZ;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\RunType")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?RunType $runType;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Sequence", inversedBy="runGroups")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Sequence $sequence;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $noteEN;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Run", mappedBy="runGroup")
     */
    private Collection $runs;

    public function __construct() {
        $this->precedingPrecipitation = null;
        $this->noteCZ = null;
        $this->runType = null;
        $this->sequence = null;
        $this->noteEN = null;
        $this->runs = new ArrayCollection();
    }


    public function getId(): int
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

    public function setNoteCZ(?string $noteCZ): self
    {
        $this->noteCZ = $noteCZ;

        return $this;
    }

    public function getNote():?string {
        return $this->getLocale() == 'en' ? $this->getNoteEN() : $this->getNoteCZ();
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

    /**
     * @return Collection|Run[]
     */
    public function getRuns(): Collection
    {
        return $this->runs;
    }

    public function addRun(Run $run): self
    {
        if (!$this->runs->contains($run)) {
            $this->runs[] = $run;
            $run->setRunGroup($this);
        }

        return $this;
    }

    public function removeRun(Run $run): self
    {
        if ($this->runs->contains($run)) {
            $this->runs->removeElement($run);
            // set the owning side to null (unless already changed)
            if ($run->getRunGroup() === $this) {
                $run->setRunGroup(null);
            }
        }

        return $this;
    }

    public function getMeasurements():Collection {
        $measurements = [];
        foreach ($this->getRuns() as $run) {
            $measurements[$run->getId()] = $run;
        }

        return $measurements;
    }
}
