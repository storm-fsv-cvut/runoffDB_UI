<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

/**
 * @ORM\Entity
 */
class Methodics extends BaseEntity implements DefinitionEntityInterface, FileStorageEntityInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * Join entita s pořadím (sort) – nahrazuje původní ManyToMany na ProcessingStep
     *
     * @ORM\OneToMany(
     *   targetEntity=MethodicsProcessingStep::class,
     *   mappedBy="methodics",
     *   cascade={"persist","remove"},
     *   orphanRemoval=true
     * )
     * @ORM\OrderBy({"sort"="ASC"})
     */
    private Collection $methodicsProcessingSteps;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $nameCZ;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $nameEN;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $descriptionCZ = null;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $descriptionEN = null;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $noteCZ = null;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $noteEN = null;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $links = null;

    public function __construct()
    {
        $this->methodicsProcessingSteps = new ArrayCollection();
    }

    /** @return Collection<int, MethodicsProcessingStep> */
    public function getMethodicsProcessingSteps(): Collection
    {
        return $this->methodicsProcessingSteps;
    }

    public function addMethodicsProcessingStep(MethodicsProcessingStep $link): self
    {
        if (!$this->methodicsProcessingSteps->contains($link)) {
            $this->methodicsProcessingSteps->add($link);
            $link->setMethodics($this);
        }
        return $this;
    }

    public function removeMethodicsProcessingStep(MethodicsProcessingStep $link): self
    {
        if ($this->methodicsProcessingSteps->removeElement($link)) {
        }
        return $this;
    }

    /**
     * @return Collection<int, ProcessingStep>
     */
    public function getProcessingSteps(): Collection
    {
        $steps = new ArrayCollection();
        foreach ($this->methodicsProcessingSteps as $link) {
            $ps = $link->getProcessingStep();
            if (!$steps->contains($ps)) {
                $steps->add($ps);
            }
        }
        return $steps;
    }

    public function setProcessingSteps(Collection $processingSteps): void
    {
        // vyprázdnit existující
        foreach (new ArrayCollection($this->methodicsProcessingSteps->toArray()) as $link) {
            $this->removeMethodicsProcessingStep($link);
        }

        $i = 0;
        foreach ($processingSteps as $ps) {
            $link = new MethodicsProcessingStep($this, $ps, $i++);
            $this->addMethodicsProcessingStep($link);
        }
    }

    public function addProcessingStep(ProcessingStep $processingStep, ?int $sort = null): self
    {
        if ($sort === null) {
            $sort = $this->methodicsProcessingSteps->count();
        }
        $link = new MethodicsProcessingStep();
        $link->setMethodics($this);
        $link->setProcessingStep($processingStep);
        $link->setSort($sort);
        return $this->addMethodicsProcessingStep($link);
    }


    public function getName(): string
    {
        return $this->getLocale() === 'en' ? $this->nameEN : $this->nameCZ;
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->descriptionEN : $this->descriptionCZ;
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

    public function getFilesPath(): string
    {
        return 'data/methodics/' . $this->getId();
    }

    public function removeFile(string $filename): void
    {
        $filesystem = new Filesystem();
        $path = $this->getFilesPath() . '/' . $filename;
        if ($filesystem->exists($path)) {
            $filesystem->remove($path);
        }
    }

    public function getNameCZ(): string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(string $nameCZ): void
    {
        $this->nameCZ = $nameCZ;
    }

    public function getNameEN(): string
    {
        return $this->nameEN;
    }

    public function setNameEN(string $nameEN): void
    {
        $this->nameEN = $nameEN;
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

    public function getNoteCZ(): ?string
    {
        return $this->noteCZ;
    }

    public function setNoteCZ(?string $noteCZ): void
    {
        $this->noteCZ = $noteCZ;
    }

    public function getNoteEN(): ?string
    {
        return $this->noteEN;
    }

    public function setNoteEN(?string $noteEN): void
    {
        $this->noteEN = $noteEN;
    }

    public function getLinks(): ?string
    {
        return $this->links;
    }

    public function setLinks(?string $links): void
    {
        $this->links = $links;
    }

    public function __toString(): string
    {
        return $this->getName();
    }

    public function getId(): int
    {
        return $this->id;
    }
}
