<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ProcessingStepRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProcessingStepRepository::class)
 */
class ProcessingStep extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * Dříve: ManyToMany na Methodics (neumožňovalo extra sloupce).
     * Nově: OneToMany na join entitu s polem `sort`.
     *
     * @ORM\OneToMany(
     *     targetEntity=MethodicsProcessingStep::class,
     *     mappedBy="processingStep",
     *     cascade={"persist","remove"},
     *     orphanRemoval=true
     * )
     */
    private Collection $methodicsProcessingSteps;

    /**
     * Pořadí kroku v rámci “globální” definice kroku (ne v rámci konkrétní Methodics).
     * To ponechávám dle tvé entity.
     *
     * @ORM\Column(type="integer")
     */
    private int $stepOrder;

    /** @ORM\Column(type="string", length=255) */
    private string $nameCZ;

    /** @ORM\Column(type="string", length=255) */
    private string $nameEN;

    /** @ORM\Column(type="text", nullable=true) */
    private ?string $descriptionCZ = null;

    /** @ORM\Column(type="text", nullable=true) */
    private ?string $descriptionEN = null;

    /** @ORM\ManyToMany(targetEntity="App\Entity\Instrument", inversedBy="processingSteps") */
    private Collection $instruments;

    public function __construct()
    {
        $this->methodicsProcessingSteps = new ArrayCollection();
        $this->instruments = new ArrayCollection();
    }

    // --- vztah k Methodics přes join entitu ---

    public function __toString(): string
    {
        return $this->getName() . '#' . $this->getId();
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
            $link->setProcessingStep($this);
        }
        return $this;
    }

    public function removeMethodicsProcessingStep(MethodicsProcessingStep $link): self
    {
        if ($this->methodicsProcessingSteps->removeElement($link)) {
            if ($link->getProcessingStep() === $this) {
                // u kompozitního PK nelze nastavovat null; odstranění řeší ORM
            }
        }
        return $this;
    }

    // --- původní API doplň: volitelné helpery ---

    /**
     * Pokud chceš rychle získat jen seznam Methodics (bez sort),
     * můžeš mít helper (nepersistovaný):
     *
     * @return Collection<int, Methodics>
     */
    public function getMethodics(): Collection
    {
        $methodics = new ArrayCollection();
        foreach ($this->methodicsProcessingSteps as $link) {
            $m = $link->getMethodics();
            if (!$methodics->contains($m)) {
                $methodics->add($m);
            }
        }
        return $methodics;
    }

    // --- getters/setters podle tvé entity ---

    public function getStepOrder(): int
    {
        return $this->stepOrder;
    }

    public function setStepOrder(int $stepOrder): void
    {
        $this->stepOrder = $stepOrder;
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

    public function getInstruments(): Collection
    {
        return $this->instruments;
    }

    public function setInstruments(Collection $instruments): void
    {
        $this->instruments = $instruments;
    }

    public function getName(): string
    {
        return $this->getLocale() === 'en' ? $this->nameEN : $this->nameCZ;
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() === 'en' ? $this->descriptionEN : $this->descriptionCZ;
    }

    public function getId(): int
    {
        return $this->id;
    }
}
