<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SimulatorRepository")
 */
class Simulator extends BaseEntity implements DefinitionEntityInterface
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
     * @ORM\ManyToOne(targetEntity="App\Entity\Organization", inversedBy="simulators")
     * @ORM\JoinColumn(nullable=true, referencedColumnName="id", onDelete="SET NULL")
     */
    private ?Organization $organization;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $descriptionEN;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Sequence", mappedBy="simulator")
     *
     */
    private Collection $sequences;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $reference;

    public function __construct()
    {
        $this->nameCZ = null;
        $this->nameEN = null;
        $this->organization = null;
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
        $this->reference = null;
        $this->sequences = new ArrayCollection();
    }

    public function __toString()
    {
        if ($this->getName() !== null) {
            return $this->getName() . ' (' . ($this->getOrganization() !== null ? $this->getOrganization()->getName(
                ) : "") . ')';
        } else {
            return "#" . $this->getId() . ' (' . ($this->getOrganization() !== null ? $this->getOrganization()->getName(
                ) : "") . ')';
        }
    }

    public function getName(): ?string
    {
        return $this->getLocale() == 'en' ? $this->getNameEN() : $this->getNameCZ();
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

    public function getNameCZ(): ?string
    {
        return $this->nameCZ;
    }

    public function setNameCZ(?string $nameCZ): self
    {
        $this->nameCZ = $nameCZ;

        return $this;
    }

    public function getOrganization(): ?Organization
    {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): self
    {
        $this->organization = $organization;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection|Sequence[]
     */
    public function getSequences(): Collection
    {
        return $this->sequences;
    }

    public function addSequence(Sequence $sequence): self
    {
        if (!$this->sequences->contains($sequence)) {
            $this->sequences[] = $sequence;
            $sequence->setSimulator($this);
        }

        return $this;
    }

    public function removeSequence(Sequence $sequence): self
    {
        if ($this->sequences->contains($sequence)) {
            $this->sequences->removeElement($sequence);
            // set the owning side to null (unless already changed)
            if ($sequence->getSimulator() === $this) {
                $sequence->setSimulator(null);
            }
        }

        return $this;
    }

    public function getLabel(): string
    {
        if ($this->getName() !== null) {
            return $this->getName() . ' (' . ($this->getOrganization() !== null ? $this->getOrganization()->getName(
                ) : "") . ')';
        } else {
            return "#" . $this->getId() . ' (' . ($this->getOrganization() !== null ? $this->getOrganization()->getName(
                ) : "") . ')';
        }
    }

    public function getXmlDomElement(\DOMDocument $dom)
    {
        $simulator = $dom->createElement('simulator');
        $simulator->append(
            $dom->createElement('name', $this->getName()),
            $dom->createElement('description', $this->getDescription()),
            $dom->createElement('reference', $this->getReference())
        );

        if ($this->getOrganization() !== null) {
            $simulator->append($this->getOrganization()->getXmlDomElement($dom));
        }

        return $simulator;
    }

    public function getDescription(): ?string
    {
        return $this->getLocale() == 'en' ? $this->getDescriptionEN() : $this->getDescriptionCZ();
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

    public function getDescriptionCZ(): ?string
    {
        return $this->descriptionCZ;
    }

    public function setDescriptionCZ(?string $descriptionCZ): self
    {
        $this->descriptionCZ = $descriptionCZ;

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(?string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }
}
