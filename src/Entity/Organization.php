<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Form\Form;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrganizationRepository")
 */
class Organization extends BaseEntity implements DefinitionEntityInterface
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
    private ?string $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $contactPerson;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     */
    private ?string $contactNumber;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private ?string $contactEmail;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Locality", mappedBy="organization")
     */
    private Collection $localities;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Simulator", mappedBy="organization")
     */
    private Collection $simulators;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $name_code;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Project", mappedBy="organisations")
     */
    private Collection $projects;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="organization")
     */
    private Collection  $users;

    public function __construct() {
        $this->name = null;
        $this->contactPerson = null;
        $this->contactNumber = null;
        $this->contactEmail = null;
        $this->name_code = null;
        $this->localities = new ArrayCollection();
        $this->simulators = new ArrayCollection();
        $this->projects = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    public function __toString(): string {
        return $this->getName();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
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

    public function getName_code(): ?string
    {
        return $this->getNameCode();
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
            $sequence->setOrganization($this);
        }

        return $this;
    }

    public function removeSequence(Sequence $sequence): self
    {
        if ($this->sequences->contains($sequence)) {
            $this->sequences->removeElement($sequence);
            // set the owning side to null (unless already changed)
            if ($sequence->getOrganization() === $this) {
                $sequence->setOrganization(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Measurement[]
     */
    public function getMeasurements(): Collection
    {
        return $this->measurements;
    }

    public function addMeasurement(Measurement $measurement): self
    {
        if (!$this->measurements->contains($measurement)) {
            $this->measurements[] = $measurement;
            $measurement->setOrganization($this);
        }

        return $this;
    }

    public function removeMeasurement(Measurement $measurement): self
    {
        if ($this->measurements->contains($measurement)) {
            $this->measurements->removeElement($measurement);
            // set the owning side to null (unless already changed)
            if ($measurement->getOrganization() === $this) {
                $measurement->setOrganization(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|SoilSample[]
     */
    public function getSoilSamples(): Collection
    {
        return $this->soilSamples;
    }

    public function addSoilSample(SoilSample $soilSample): self
    {
        if (!$this->soilSamples->contains($soilSample)) {
            $this->soilSamples[] = $soilSample;
            $soilSample->setOrganization($this);
        }

        return $this;
    }

    public function removeSoilSample(SoilSample $soilSample): self
    {
        if ($this->soilSamples->contains($soilSample)) {
            $this->soilSamples->removeElement($soilSample);
            // set the owning side to null (unless already changed)
            if ($soilSample->getOrganization() === $this) {
                $soilSample->setOrganization(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setOrganization($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getOrganization() === $this) {
                $user->setOrganization(null);
            }
        }

        return $this;
    }
}
