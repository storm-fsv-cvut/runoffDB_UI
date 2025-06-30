<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProjectRepository")
 */
class Project extends BaseEntity implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $projectName;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Sequence")
     */
    private Collection $sequences;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Organization", inversedBy="projects")
     */
    private Collection $organisations;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Publication", inversedBy="projects")
     */
    private Collection $publications;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $descriptionCZ;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private ?string $descriptionEN;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $fundingAgency;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string  $projectCode;

    public function __construct() {
        $this->descriptionCZ = null;
        $this->descriptionEN = null;
        $this->fundingAgency = null;
        $this->projectCode = null;
        $this->sequences = new ArrayCollection();
        $this->organisations = new ArrayCollection();
    }

    public function __toString(): string {
        return $this->getProjectName()!==null ? $this->getProjectName() : "#".$this->getId();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getProjectName(): ?string
    {
        return $this->projectName;
    }

    public function setProjectName(string $projectName): self
    {
        $this->projectName = $projectName;

        return $this;
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
            $this->sequences->add($sequence);
        }

        return $this;
    }

    public function removeSequence(Sequence $sequence): self
    {
        if ($this->sequences->contains($sequence)) {
            $this->sequences->removeElement($sequence);
        }

        return $this;
    }

    public function getLabel(): string {
        return $this->getProjectName()!==null ? $this->getProjectName() : "";
    }

    /**
     * @return Collection|Organization[]
     */
    public function getOrganisations(): Collection
    {
        return $this->organisations;
    }

    public function addOrganisation(Organization $organisation): self
    {
        if (!$this->organisations->contains($organisation)) {
            $this->organisations[] = $organisation;
        }

        return $this;
    }

    public function removeOrganisation(Organization $organisation): self
    {
        if ($this->organisations->contains($organisation)) {
            $this->organisations->removeElement($organisation);
        }

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

    public function getDescriptionEN(): ?string
    {
        return $this->descriptionEN;
    }

    public function setDescriptionEN(?string $descriptionEN): self
    {
        $this->descriptionEN = $descriptionEN;

        return $this;
    }

    public function getFundingAgency(): ?string
    {
        return $this->fundingAgency;
    }

    public function setFundingAgency(?string $fundingAgency): self
    {
        $this->fundingAgency = $fundingAgency;

        return $this;
    }

    public function getProjectCode(): ?string
    {
        return $this->projectCode;
    }

    public function setProjectCode(?string $projectCode): self
    {
        $this->projectCode = $projectCode;

        return $this;
    }

    public function getPublications(): Collection
    {
        return $this->publications;
    }

    public function addPublication(Publication $publication): self
    {
        if (!$this->publications->contains($publication)) {
            $this->publications[] = $publication;
        }

        return $this;
    }

    public function removePublication(Publication $publication): self
    {
        if ($this->publications->contains($publication)) {
            $this->publications->removeElement($publication);
        }

        return $this;
    }
}
