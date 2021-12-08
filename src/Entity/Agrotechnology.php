<?php
declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AgrotechnologyRepository")
 */
class Agrotechnology extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $nameCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $nameEN;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $descriptionEN;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\TillageSequence", mappedBy="agrotechnology", cascade={"persist","remove"})
     */
    private Collection $tillageSequences;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $managTyp;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private ?string $noteCZ;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private ?string $noteEN;

    public function __construct()
    {
        $this->nameCZ = null;
        $this->nameEN = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
        $this->managTyp = null;
        $this->noteCZ = null;
        $this->noteEN = null;
        $this->tillageSequences = new ArrayCollection();
    }


    public function __toString(): string
    {
        return $this->getName() ?? (string)$this->getId();
    }

    public function getName(): ?string
    {
        return $this->getLocale() == 'en' ? $this->getNameEN() : $this->getNameCZ();
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() == 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection|TillageSequence[]
     */
    public function getTillageSequences(): Collection
    {
        $criteria = Criteria::create();
        $criteria->orderBy(array("date" => Criteria::ASC));
        return $this->tillageSequences->matching($criteria);
    }

    public function addTillageSequence(TillageSequence $tillageSequence): self
    {
        if (!$this->tillageSequences->contains($tillageSequence)) {
            $this->tillageSequences[] = $tillageSequence;
            $tillageSequence->setAgrotechnology($this);
        }

        return $this;
    }

    public function removeTillageSequence(TillageSequence $tillageSequence): self
    {
        if ($this->tillageSequences->contains($tillageSequence)) {
            $this->tillageSequences->removeElement($tillageSequence);
            // set the owning side to null (unless already changed)
            if ($tillageSequence->getAgrotechnology() === $this) {
                $tillageSequence->setAgrotechnology(null);
            }
        }

        return $this;
    }

    public function getNote(): ?string
    {
        return $this->getLocale() == 'en' ? $this->getNoteEN() : $this->getNoteCZ();
    }

    public function getNameCZ(): ?string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(?string $nameCZ): self
    {
        $this->nameCZ = $nameCZ;

        return $this;
    }

    public function getNameEN(): ?string
    {
        return $this->nameEN;
    }

    public function setNameEN(?string $nameEN): self
    {
        $this->nameEN = $nameEN;

        return $this;
    }

    public function getManagTyp(): ?string
    {
        return $this->managTyp;
    }

    public function setManagTyp(?string $managTyp): self
    {
        $this->managTyp = $managTyp;

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
