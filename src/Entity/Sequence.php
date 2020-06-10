<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SequenceRepository")
 */
class Sequence extends BaseEntity {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Simulator", inversedBy="sequences")
     * @ORM\JoinColumn(nullable=false)
     */
    private $simulator;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Plot")
     * @ORM\JoinColumn(nullable=false)
     */
    private $plot;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $cropBBCH;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Project", mappedBy="sequences")
     */
    private $projects;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Run", mappedBy="sequence")
     */
    private $runs;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Record")
     */
    private $canopyCover;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cropConditionCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cropConditionEN;

    public function __toString(): string {
        return $this->getDate()->format("d.m.Y") . " - " . $this->getPlot()->getLocality() . " - " . $this->getPlot()->getCrop();
    }

    public function __construct() {
        $this->projects = new ArrayCollection();
        $this->runs = new ArrayCollection();
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
            $run->setSequence($this);
        }

        return $this;
    }

    public function removeRun(Run $run): self
    {
        if ($this->runs->contains($run)) {
            $this->runs->removeElement($run);
            // set the owning side to null (unless already changed)
            if ($run->getSequence() === $this) {
                $run->setSequence(null);
            }
        }

        return $this;
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self {
        $this->date = $date;

        return $this;
    }

    public function getSimulator(): ?Simulator {
        return $this->simulator;
    }

    public function setSimulator(?Simulator $simulator): self {
        $this->simulator = $simulator;

        return $this;
    }

    public function getPlot(): ?Plot {
        return $this->plot;
    }

    public function setPlot(?Plot $plot): self {
        $this->plot = $plot;

        return $this;
    }

    public function getCropBBCH(): ?int {
        return $this->cropBBCH;
    }

    public function setCropBBCH(?int $cropBBCH): self {
        $this->cropBBCH = $cropBBCH;

        return $this;
    }

    /**
     * @return Collection|Project[]
     */
    public function getProjects(): Collection {
        return $this->projects;
    }

    public function addProject(Project $project): self {
        if (!$this->projects->contains($project)) {
            $this->projects[] = $project;
            $project->addSequence($this);
        }

        return $this;
    }

    public function removeProject(Project $project): self {
        if ($this->projects->contains($project)) {
            $this->projects->removeElement($project);
            $project->removeSequence($this);
        }

        return $this;
    }

    public function validateSoilSamples():array {
        $res = [];
        foreach ($this->getRuns() as $run) {
            $res[]=$run->validateSoilSamples();
        }
        return $res;
    }

    public function getCanopyCover(): ?Record
    {
        return $this->canopyCover;
    }

    public function setCanopyCover(?Record $canopyCover): self
    {
        $this->canopyCover = $canopyCover;

        return $this;
    }

    public function getCropCondition():?string {
        return $this->getLocale() == 'en' ? $this->getCropConditionEN() : $this->getCropConditionCZ();
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

    public function getCropConditionEN(): ?string
    {
        return $this->cropConditionEN;
    }

    public function setCropConditionEN(?string $cropConditionEN): self
    {
        $this->cropConditionEN = $cropConditionEN;

        return $this;
    }
}
