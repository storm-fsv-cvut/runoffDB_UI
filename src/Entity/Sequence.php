<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DOMDocument;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

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

    /** @ORM\Column(type="date") */
    private ?\DateTimeInterface $date;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Simulator", inversedBy="sequences")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Simulator $simulator;

    /** @ORM\ManyToMany(targetEntity="App\Entity\Project") */
    private Collection $projects;

    /** @ORM\OneToMany(targetEntity="App\Entity\RunGroup", mappedBy="sequence", orphanRemoval=true) */
    private Collection $runGroups;

    /** @ORM\Column(type="boolean", nullable=false, options={"default": 0}) */
    private ?bool $deleted;

    /** @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="sequences") */
    private ?User $user;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $noteCZ = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $noteEN = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $descriptionCZ = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    private ?string $descriptionEN = null;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Methodics")
     * @ORM\JoinColumn(name="methodics_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $methodics;

    public function __construct()
    {
        $this->id = null;
        $this->simulator = null;
        $this->deleted = null;
        $this->date = null;
        $this->projects = new ArrayCollection();
        $this->runGroups = new ArrayCollection();
        $this->noteCZ = null;
        $this->noteEN = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
    }

    public function __toString(): string
    {
        return $this->getDate() !== null ? ($this->getDate()->format('d.m.Y') . ' - ' . $this->getLocality(
        )) : ('#' . $this->getId() . ' - ' . $this->getLocality());
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

    public function getRunGroups(): Collection
    {
        return $this->runGroups;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getFormatedDate(): string
    {
        return $this->getDate() !== null ? $this->getDate()->format('d. m. Y') : ' - ';
    }

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
                        if ($measurement->getRecords() !== null) {
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
        return implode(', ', $names);
    }

    /**
     * @return array<Plot>
     */
    public function getPlots(): array
    {
        $plots = [];
        if ($this->getRuns() !== null) {
            foreach ($this->getRuns()->toArray() as $run) {
                if ($run->getPlot() !== null) {
                    $plots[] = $run->getPlot();
                }
            }
        }
        return $plots;
    }

    public function listCrops(): string
    {
        $names = [];
        foreach ($this->getPlots() as $plot) {
            if ($plot !== null && $plot->getCrop() !== null) {
                if (!in_array($plot->getCrop()->getName(), $names, true)) {
                    $names[] = $plot->getCrop()->getName();
                }
            }
        }
        return implode(', ', $names);
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
            $dom->createElement('id', (string) $this->getId()),
            $dom->createElement('date', $this->getDate() !== null ? $this->getDate()->format('Y-m-d') : ''),
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

    public function getOrganizationCode(): string
    {
        if ($this->getSimulator() !== null) {
            if ($this->getSimulator()->getOrganization() !== null) {
                return $this->getSimulator()
                            ->getOrganization()
                            ->getNameCode();
            }
        }

        return '';
    }

    public function getNote(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getNoteEN() : $this->getNoteCZ();
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

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
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

    public function getFilesPath(): string
    {
        return 'data/sequence/' . $this->getId();
    }

    public function getFiles(): array
    {
        $files = [];
        $filesystem = new Filesystem();
        $dir = $this->getFilesPath();
        if ($filesystem->exists($dir)) {
            $finder = new Finder();
            $finder->files()->in($dir);
            foreach ($finder as $file) {
                $files[] = $file->getRelativePathname();
            }
        }
        return $files;
    }

    public function removeFile(string $filename): void
    {
        $filesystem = new Filesystem();
        $path = $this->getFilesPath() . '/' . $filename;
        if ($filesystem->exists($path)) {
            $filesystem->remove($path);
        }
    }
}
