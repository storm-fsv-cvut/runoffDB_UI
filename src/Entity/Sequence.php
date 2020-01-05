<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Dtc\GridBundle\Annotation as Grid;

/**
 * @Grid\Grid(actions={@Grid\EditAction()})
 * @ORM\Entity(repositoryClass="App\Repository\SequenceRepository")
 */
class Sequence {
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
     * @ORM\ManyToOne(targetEntity="App\Entity\Plot", inversedBy="sequences")
     * @ORM\JoinColumn(nullable=false)
     */
    private $plot;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $cropBBCH;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $canopyCover;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cropCondition;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Project", mappedBy="sequences")
     */
    private $projects;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Run", mappedBy="sequence")
     */
    private $runs;


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

    public function setDate(\DateTimeInterface $date): self {
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

    public function getCanopyCover(): ?int {
        return $this->canopyCover;
    }

    public function setCanopyCover(?int $canopyCover): self {
        $this->canopyCover = $canopyCover;

        return $this;
    }

    public function getCropCondition(): ?string {
        return $this->cropCondition;
    }

    public function setCropCondition(?string $cropCondition): self {
        $this->cropCondition = $cropCondition;

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

    public function getLabel() {
        return $this->getDate() . " - " . $this->getPlot()->getLocality()->getName() . " - " . $this->getPlot()->getCrop();
    }
}
