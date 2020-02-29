<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Form\Form;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrganizationRepository")
 */
class Organization implements DefinitionEntityInterface
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
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $contactPerson;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     */
    private $contactNumber;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $contactEmail;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Locality", mappedBy="organisation")
     */
    private $localities;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Simulator", mappedBy="organization")
     */
    private $simulators;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name_code;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Project", mappedBy="organisations")
     */
    private $projects;

    public function __toString() {
        return $this->getName();
    }

    public function __construct()
    {
        $this->localities = new ArrayCollection();
        $this->simulators = new ArrayCollection();
        $this->projects = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getContactPerson(): ?string
    {
        return $this->contactPerson;
    }

    public function setContactPerson(?string $contactPerson): self
    {
        $this->contactPerson = $contactPerson;

        return $this;
    }

    public function getContactNumber(): ?string
    {
        return $this->contactNumber;
    }

    public function setContactNumber(?string $contactNumber): self
    {
        $this->contactNumber = $contactNumber;

        return $this;
    }

    public function getContactEmail(): ?string
    {
        return $this->contactEmail;
    }

    public function setContactEmail(?string $contactEmail): self
    {
        $this->contactEmail = $contactEmail;

        return $this;
    }

    /**
     * @return Collection|Locality[]
     */
    public function getLocalities(): Collection
    {
        return $this->localities;
    }

    public function addLocality(Locality $locality): self
    {
        if (!$this->localities->contains($locality)) {
            $this->localities[] = $locality;
            $locality->setOrganization($this);
        }

        return $this;
    }

    public function removeLocality(Locality $locality): self
    {
        if ($this->localities->contains($locality)) {
            $this->localities->removeElement($locality);
            // set the owning side to null (unless already changed)
            if ($locality->getOrganization() === $this) {
                $locality->setOrganization(null);
            }
        }

        return $this;
    }

    public function getLabel(): string {
        return $this->name;
    }

    /**
     * @return Collection|Simulator[]
     */
    public function getSimulators(): Collection
    {
        return $this->simulators;
    }

    public function addSimulator(Simulator $simulator): self
    {
        if (!$this->simulators->contains($simulator)) {
            $this->simulators[] = $simulator;
            $simulator->setOrganization($this);
        }

        return $this;
    }

    public function removeSimulator(Simulator $simulator): self
    {
        if ($this->simulators->contains($simulator)) {
            $this->simulators->removeElement($simulator);
            // set the owning side to null (unless already changed)
            if ($simulator->getOrganization() === $this) {
                $simulator->setOrganization(null);
            }
        }

        return $this;
    }

    public function getNameCode(): ?string
    {
        return $this->name_code;
    }

    public function setNameCode(?string $name_code): self
    {
        $this->name_code = $name_code;

        return $this;
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
            $project->addOrganisation($this);
        }

        return $this;
    }

    public function removeProject(Project $project): self
    {
        if ($this->projects->contains($project)) {
            $this->projects->removeElement($project);
            $project->removeOrganisation($this);
        }

        return $this;
    }
}
