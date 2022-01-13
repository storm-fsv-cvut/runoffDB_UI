<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DOMDocument;


/**
 * @ORM\Entity(repositoryClass="App\Repository\SequenceRepository")
 */
class Sequence extends BaseEntity
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @ORM\Column(type="date")
     */
    private ?\DateTimeInterface $date;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Simulator", inversedBy="sequences")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Simulator $simulator;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Project")
     */
    private Collection $projects;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\RunGroup", mappedBy="sequence", orphanRemoval=true)
     */
    private Collection $runGroups;

    /**
     * @ORM\Column(type="boolean", nullable=false, options={"default": 0})
     */
    private ?bool $deleted;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="sequences")
     */
    private ?User $user;

    public function __construct()
    {
        $this->id = null;
        $this->simulator = null;
        $this->deleted = null;
        $this->date = null;
        $this->projects = new ArrayCollection();
        $this->runGroups = new ArrayCollection();
    }

    public function __toString(): string
    {

        return $this->getDate() !== null ? ($this->getDate()->format("d.m.Y") . " - " . $this->getLocality(
            )) : ("#" . $this->getId() . " - " . $this->getLocality());
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getLocality(): ?Locality
    {
        if ($this->getRuns() !== null && $this->getRuns()->count() > 0 && $this->getRuns()->get(0)->getPlot(
            ) !== null) {
            return $this->getRuns()->get(0)->getPlot()->getLocality();
        }
        return null;
    }

    /**
     * @return Collection|Run[]
     */
    public function getRuns(): ?Collection
    {
        $runs = new ArrayCollection();
        $groups = $this->getRunGroups();
        foreach ($groups as $group) {
            foreach ($group->getRuns() as $run) {
                $runs->add($run);
            }
        }
        return $runs;
    }

    /**
     * @return Collection|RunGroup[]
     */
    public function getRunGroups(): Collection
    {
        return $this->runGroups;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFormatedDate(): string
    {
        return $this->getDate() !== null ? $this->getDate()->format("d. m. Y") : ' - ';
    }

    /**
     * @return Collection|Project[]
     */
    public function getProjects(): Collection
    {
        return $this->projects;
    }

    public function addProject(Project $project): self
    {
        if (!$this->projects->contains($project)) {
            $this->projects[] = $project;
            $project->addSequence($this);
        }

        return $this;
    }

    public function removeProject(Project $project): self
    {
        if ($this->projects->contains($project)) {
            $this->projects->removeElement($project);
            $project->removeSequence($this);
        }

        return $this;
    }

    public function getRecords(): array
    {
        $records = [];
        if ($this->getRuns() !== null) {
            foreach ($this->getRuns()->toArray() as $run) {
                if ($run->getMeasurements() !== null) {
                    foreach ($run->getMeasurements() as $measurement) {
                        if ($measurement->getRecords() != null) {
                            foreach ($measurement->getRecords() as $record) {
                                $records[] = $record;
                            }
                        }
                    }
                }
            }
        }
        return $records;
    }

    public function listPlots(): string
    {
        $names = [];
        foreach ($this->getPlots() as $plot) {
            if (!in_array($plot->getName(), $names, true)) {
                $names[] = $plot->getName();
            }
        }
        return implode(", ", $names);
    }

    /**
     * @return array<Plot>
     */
    public function getPlots(): array
    {
        $plots = [];
        if ($this->getRuns() !== null) {
            foreach ($this->getRuns()->toArray() as $run) {
                $plots[] = $run->getPlot();
            }
        }
        return $plots;
    }

    public function listCrops(): string
    {
        $names = [];
        foreach ($this->getPlots() as $plot) {
            if ($plot->getCrop() !== null) {
                if (!in_array($plot->getCrop()->getName(), $names, true)) {
                    $names[] = $plot->getCrop()->getName();
                }
            }
        }
        return implode(", ", $names);
    }

    public function addRunGroup(RunGroup $runGroup): self
    {
        if (!$this->runGroups->contains($runGroup)) {
            $this->runGroups[] = $runGroup;
            $runGroup->setSequence($this);
        }

        return $this;
    }

    public function removeRunGroup(RunGroup $runGroup): self
    {
        if ($this->runGroups->contains($runGroup)) {
            $this->runGroups->removeElement($runGroup);
            // set the owning side to null (unless already changed)
            if ($runGroup->getSequence() === $this) {
                $runGroup->setSequence(null);
            }
        }

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

    public function getXmlDomElement(DOMDocument $dom): \DOMElement
    {
        $sequence = $dom->createElement('sequence');

        $runGroups = $dom->createElement('runGroups');
        foreach ($this->getRunGroups() as $runGroup) {
            $runGroups->append($runGroup->getXmlDomElement($dom));
        }

        $sequence->append(
            $dom->createElement('id', $this->getId()),
            $dom->createElement('date', $this->getDate() != null ? $this->getDate()->format("Y-m-d") : ""),
            $runGroups,

        );

        if ($this->getSimulator() !== null) {
            $sequence->append($this->getSimulator()->getXmlDomElement($dom));
        }

        return $sequence;
    }

    public function getSimulator(): ?Simulator
    {
        return $this->simulator;
    }

    public function setSimulator(?Simulator $simulator): self
    {
        $this->simulator = $simulator;

        return $this;
    }

    public function getOrganizationCode(): string {
        if($this->getSimulator() !== null) {
            if($this->getSimulator()->getOrganization()!==null) {
                return $this->getSimulator()
                            ->getOrganization()
                            ->getNameCode();
            }
        }

        return '';
    }
}
