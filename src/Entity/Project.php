<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProjectRepository")
 */
class Project implements DefinitionEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $projectName;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Sequence", inversedBy="projects")
     */
    private $sequences;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Organization", inversedBy="projects")
     */
    private $organisations;

    public function __toString() {
        return $this->getProjectName();
    }

    public function __construct()
    {
        $this->sequences = new ArrayCollection();
        $this->organisations = new ArrayCollection();
    }

    public function getId(): ?int
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
            $this->sequences[] = $sequence;
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
        // TODO: Implement getLabel() method.
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
}
